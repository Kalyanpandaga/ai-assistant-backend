import mongoose from "mongoose";

const PromptConfigSchema = new mongoose.Schema(
  {
    name: { type: String, default: "default" },
    systemPrompt: { type: String, required: true, trim: true, maxlegth: 12000 },
    userPrompt: { type: String, required: true, trim: true, maxlegth: 2000 },
    correctionPrompt: {
      type: String,
      required: true,
      trim: true,
      maxlegth: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const PromptConfig = mongoose.model("PromptConfig", PromptConfigSchema);
export default PromptConfig;
