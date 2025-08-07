import PromptConfig from "../models/PromptConfig.js";

const getPromptConfig = async () => {
  const config = await PromptConfig.findOne({ name: "default" });
  if (!config) throw new Error("Prompt config not found");
  return config;
};

const getAiAnswer = async (question) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not defined in environment variables");
    throw new Error("AI service is not configured properly");
  }

  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const promptConfig = await getPromptConfig();
  const systemPrompt = promptConfig.systemPrompt;
  const userPrompt = promptConfig.userPrompt;
  const userPromptWithQUestion = userPrompt.replace("{{question}}", question);

  const requestBody = {
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPromptWithQUestion },
    ],
    temperature: 0.3,
  };

  const fetchAI = async (body) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.json();
  };

  const handleAIRequest = async (body) => {
    try {
      let data = await fetchAI(body);

      if (data.error?.code === "rate_limit_exceeded") {
        console.warn("Rate limit hit. Retrying after 6 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 6000));

        data = await fetchAI(body);

        if (data.error?.code === "rate_limit_exceeded") {
          console.error("2nd time Rate limit exceeded.");
          return {
            answer:
              "I was using a free-tier AI model which has some usage limitations. Please wait 10–15 seconds and retry. If the issue persists, contact Kalyan at kalyanlee3@gmail.com or Phone: +91-6302473072.",
          };
        }
      }

      return data.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.error("Unexpected fetch error:", error);
      return {
        answer:
          "Sorry, something went wrong while contacting my AI Assistant. Please try again or contact Kalyan at kalyanlee3@gmail.com or phone: +91-6302473072. ",
      };
    }
  };

  const answerText = await handleAIRequest(requestBody);

  if (typeof answerText === "object" && answerText.answer) {
    return answerText;
  }

  let jsonString = (answerText || "").trim();

  // Try extracting JSON from AI response
  const jsonMatch = jsonString.match(/{[\\s\\S]*}/);
  if (jsonMatch) {
    jsonString = jsonMatch[0];
  }

  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error("JSON parse failed:", jsonString);

    const correctionPrompt = promptConfig.correctionPrompt;
    const correctionPromptWithError = correctionPrompt
      .replace("{{error}}", parseError.message)
      .replace("{{response}}", jsonString);

    const correctionBody = {
      ...requestBody,
      messages: [
        ...requestBody.messages,
        {
          role: "user",
          content: correctionPromptWithError,
        },
      ],
    };

    const retryAnswerText = await handleAIRequest(correctionBody);
    if (typeof retryAnswerText === "object" && retryAnswerText.answer) {
      return retryAnswerText;
    }

    let jsonStringOfretryAnswerTex = (retryAnswerText || "").trim();

    // Try extracting JSON from AI response
    const jsonMatchOfretryAnswerText = jsonString.match(/{[\\s\\S]*}/);
    if (jsonMatchOfretryAnswerText) {
      jsonStringOfretryAnswerTex = jsonMatchOfretryAnswerText[0];
    }

    try {
      return JSON.parse(jsonStringOfretryAnswerTex);
    } catch {
      console.error("Second JSON parse failed:", retryAnswerText);
      return {
        answer:
          "Sorry, something went wrong. Please contact Kalyan at kalyanlee3@gmail.com or phone: +91-6302473072.",
      };
    }
  }
};

export default getAiAnswer;
