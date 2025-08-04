import { getAiAnswer } from "../services/getAiAnswer.js";
import QAAssistant from "../models/QAAssistant.js";
import { buildPrompt } from "../config/prompt.js";

export const answerQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      answer: "Sorry i did not find any Question, please ask any question",
    });
  }

  try {
    const prompt = buildPrompt(question);
    const response = await getAiAnswer(prompt);

    await QAAssistant.create({
      question,
      ai_answer: response.answer,
    });

    res.json({ answer: response.answer });
  } catch (error) {
    console.error("Error fetching AI answer:", error);
    res
      .status(500)
      .json({ answer: "Server error. Please contact Kalyan directly." });
  }
};
