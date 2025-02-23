const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // If using .env for API keys

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chatbot", async (req, res) => { 
  try {
    const { message, chatHistory } = req.body;

    const chat = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).startChat({
      history: chatHistory || [],
    });

    const result = await chat.sendMessage(message);
    res.json({ reply: result.response.text(), history: chat.history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
