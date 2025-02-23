const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const cohere = require("cohere-ai");

// 🔐 Securely retrieve Cohere API Key from Firebase Config
cohere.init(functions.config().cohere.apikey);

const app = express();
app.use(cors());
app.use(express.json());

// 🚀 Chatbot API Route
app.post("/chatbot", async (req, res) => {
  try {
    const {message} = req.body;

    if (!message) {
      return res.status(400).json({error: "Message is required"});
    }

    const response = await cohere.generate({
      model: "command",
      prompt: message,
      max_tokens: 100, // Ensures response isn't too long
    });

    res.json({reply: response.body.generations[0].text});
  } catch (error) {
    console.error("Cohere API Error:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

// 🌐 Deploy as Firebase Function
exports.api = functions.https.onRequest(app);
