import express from "express";
import { answerQuestion } from "../controllers/aiController.js";
import validateApiKey from "../middleware/validateApiKey.js";

const router = express.Router();

router.post("/answer", validateApiKey, answerQuestion);

export default router;
