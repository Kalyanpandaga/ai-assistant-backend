const validateApiKey = (req, res, next) => {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    console.error("PRIVATE_KEY is not defined in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== PRIVATE_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

export default validateApiKey;
