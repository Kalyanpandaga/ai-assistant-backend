# AI Assistant Backend

This repository provides a backend API for the **Q & A AI Assistant** feature in the portfolio. The API answers recruiter/HR questions using personal career data and project information, powered by Groq API.

---

## Features

- **/api/answer** endpoint: Accepts a question and returns AI-generated answer.
- Secured with **private key authentication** (passed via request headers).
- CORS restricted to portfolio frontend domain.
- Prompt uses detailed career, skills, and project data.
- JSON-only responses for easy frontend integration.
- Modular structure for scalability.

---

## Tech Stack

- **Node.js** with **Express.js**
- **Groq API** (for LLM responses)
- **CORS** for domain restriction
- **dotenv** for environment configuration
- **Mongoose** (optional, if storing Q/A logs)

---

## Folder Structure

```
backend/
│── app.js
│── routes/
│    └── aiRoutes.js
│── controllers/
│    └── aiController.js
│── middleware/
│    └── validateApiKey.js
│── config/
│    ├── corsOptions.js
│    ├── constants.js
│    └── prompt.js
│── services/
│    └── getAiAnswer.js
│── models/
│    └── QAAssistant.js (optional for storing)
│── package.json
│── .env
```

---

## API Endpoint

### POST `/api/answer`

**Description:** Returns AI-generated answer for recruiter/HR questions.

#### Request Body

```json
{
  "question": "Why do you have a career gap?"
}
```

#### Headers

```
x-api-key: <YOUR_PRIVATE_KEY>
Content-Type: application/json
```

#### Response

```json
{
  "answer": "I took the career gap to upskill in MERN stack and AI integrations, completing several full-stack projects."
}
```

---

## Setup & Installation

### 1. Clone Repo

```bash
git clone https://github.com/Kalyanpandaga/ai-assistant-backend.git
cd ai-assistant-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env`

```env
PORT=5000
PRIVATE_KEY=your_private_key
FRONTEND_URL=https://your-portfolio.vercel.app
GROQ_API_KEY=your_groq_api_key
```

### 4. Start Server

```bash
npm start
```

Server runs at: `http://localhost:5000`

---

## Deployment

### Render Deployment Steps:

1. Push code to GitHub.
2. Create new **Web Service** in Render.
3. Connect repo and configure environment variables.
4. Deploy and use public URL in portfolio frontend.

---

## Keep Backend Alive (Optional)

Use **GitHub Actions** workflow to ping Render every 10–15 minutes:

- Create `.github/workflows/ping.yml`
- Schedule cron job to call API endpoints and prevent idle sleep.

---

## Security

- Only requests with correct `x-api-key` are processed.
- CORS restricted to your portfolio frontend domain.
- Groq API key stored securely in `.env` (never exposed to frontend).

---

## Future Enhancements

- Add conversation memory for multi-turn Q/A.
- Extend prompt dynamically with more career data.
- Add rate limiting to prevent abuse.
- Log all interactions in database (analytics).

---

## Author

**Kalyan Pandaga**  
[Portfolio](https://kalyan-portfolio.vercel.app) | [GitHub](https://github.com/Kalyanpandaga) | [LinkedIn](https://www.linkedin.com/in/kalyan-pandaga)
