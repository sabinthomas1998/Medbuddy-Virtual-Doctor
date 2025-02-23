import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the latest message
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", { message: input });
      setMessages([...newMessages, { text: response.data.response, sender: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Error: Unable to get response", sender: "bot" }]);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Box sx={{ padding: "15px", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">🏥 MedBuddy - Virtual Doctor</Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: msg.sender === "user" ? "#4caf50" : "#e0e0e0",
                color: msg.sender === "user" ? "white" : "black",
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        {loading && <CircularProgress sx={{ margin: "auto" }} />}
      </Box>

      {/* Input Box */}
      <Box sx={{ display: "flex", padding: "10px", backgroundColor: "white", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a medical question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          autoFocus
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={loading} sx={{ ml: 1 }}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
