import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import connectDB from "./config/database.js";
import { PORT } from "./config/constants.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import rateLimiter from "./middleware/rateLimiter.js";
import aiRoutes from "./routes/aiRoutes.js";

app.use(rateLimiter);

app.use("/api", aiRoutes);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(`Server successfully listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
