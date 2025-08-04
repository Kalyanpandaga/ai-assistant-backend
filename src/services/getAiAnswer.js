export async function getAiAnswer(prompt) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not defined in environment variables");
    throw new Error("AI service is not configured properly");
  }

  console.log("Fetching AI answer for prompt:", prompt);

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    }
  );

  const data = await response.json();

  const answer = data.choices?.[0]?.message?.content || "";
  console.log(answer);

  try {
    return JSON.parse(answer);
  } catch (e) {
    return {
      answer:
        "Sorry, something wrong in ai config. Please contact Kalyan directly.",
    };
  }
}
