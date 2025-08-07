import getAiAnswer from "../services/getAiAnswer.js";
import QAAssistant from "../models/QAAssistant.js";

export const answerQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      answer: "Sorry i did not find any Question, please ask any question",
    });
  }

  try {
    const response = await getAiAnswer(question);

    await QAAssistant.create({
      question,
      ai_answer: response.answer,
    });

    res.json({ answer: response.answer });
  } catch (error) {
    console.error("Error fetching AI answer:", error);
    res.status(500).json({
      answer:
        "Sorry, something went wrong. Please contact Kalyan directly at kalyanlee3@gmail.com or phone: +91-6302473072.",
    });
  }
};
