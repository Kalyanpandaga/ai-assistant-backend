import PromptConfig from "../models/PromptConfig.js";

let promptConfigCache = null;

const getPromptConfig = async () => {
  if (promptConfigCache) return promptConfigCache;
  const config = await PromptConfig.findOne({ name: "default" }).lean();
  if (!config) throw new Error("Prompt config not found");
  promptConfigCache = config;
  return config;
};

const fetchAI = async (body) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return response.json();
};

const fetchWithRetry = async (body, retries = 1, delay = 6000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const data = await fetchAI(body);
    if (data?.error?.code !== "rate_limit_exceeded") return data;
    if (attempt < retries) {
      console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return { error: { code: "rate_limit_exceeded" } };
};

const parseJsonFromText = (text) => {
  if (!text) return null;
  let jsonString = text.trim();
  const match = jsonString.match(/\{[\s\S]*\}/);
  if (match) jsonString = match[0];
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

const tryCorrection = async (
  errorMessage,
  rawText,
  requestBody,
  promptConfig
) => {
  const correctionPrompt = promptConfig.correctionPrompt
    .replace("{{error}}", errorMessage)
    .replace("{{response}}", rawText);

  const correctionBody = {
    ...requestBody,
    messages: [
      ...requestBody.messages,
      { role: "user", content: correctionPrompt },
    ],
  };

  const retryData = await fetchWithRetry(correctionBody);
  return parseJsonFromText(retryData.choices?.[0]?.message?.content || "");
};

const getAiAnswer = async (question) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const promptConfig = await getPromptConfig();
  const userPromptWithQuestion = promptConfig.userPrompt.replace(
    "{{question}}",
    question
  );

  const requestBody = {
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: promptConfig.systemPrompt },
      { role: "user", content: userPromptWithQuestion },
    ],
    temperature: 1.0,
  };

  let data = await fetchWithRetry(requestBody);
  if (data.error?.code === "rate_limit_exceeded") {
    return {
      answer:
        "I was using a free-tier AI model which has some usage limitations. Please wait 10–15 seconds and retry. If the issue persists, contact Kalyan at kalyanlee3@gmail.com or Phone: +91-6302473072.",
    };
  }

  const rawText = data.choices?.[0]?.message?.content || "";
  let parsed = parseJsonFromText(rawText);

  if (!parsed) {
    parsed = await tryCorrection(
      "JSON parse failed",
      rawText,
      requestBody,
      promptConfig
    );
    if (!parsed) return { answer: rawText };
  }

  return parsed;
};

export default getAiAnswer;
