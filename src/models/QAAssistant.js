import mongoose from "mongoose";

const QAAssistantSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    ai_answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QAAssistant = mongoose.model("QAAssistant", QAAssistantSchema);
export default QAAssistant;
