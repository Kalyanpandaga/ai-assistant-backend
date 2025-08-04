import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP
  message: {
    errorCode: "TOO_MANY_REQUESTS",
    errorMessage: "Too many requests, please try again later.",
  },
});

export default rateLimiter;
