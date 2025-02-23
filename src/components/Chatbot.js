import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  

  // Medical keyword filter
  const medicalKeywords = ["hi", "hello", "symptoms", "diagnosis", "treatment", "disease", "doctor", "fever", "pain",
    "flu", "infection", "cancer", "medicine", "virus", "bacteria", "vaccine", "injury", "surgery", "COVID", "diabetes",
    "hypertension", "heart", "lungs", "liver", "kidney", "therapy", "migraine", "asthma", "stroke", "allergy", "fracture",
    "cough", "cold", "mental health", "anxiety", "depression", "exercise", "PT", "food diet", "nutrition", "cholesterol",
    "blood pressure", "cardiology", "neurology", "orthopedics", "pediatrics", "dermatology", "gastroenterology",
    "endocrinology", "rheumatology", "immune system", "antibiotics", "chronic disease", "acute illness", "respiratory infection",
    "arthritis", "osteoporosis", "thyroid", "metabolism", "genetics", "hematology", "oncology", "radiology", "CT scan", "MRI",
    "X-ray", "ultrasound", "blood test", "immune deficiency", "autoimmune disease", "vaccination", "preventive medicine",
    "first aid", "wound care", "burn treatment", "cardiovascular health", "neurological disorder", "psychiatry", "antidepressants",
    "sedatives", "pain management", "rehabilitation", "clinical trial", "pharmacology", "drug interactions", "side effects",
    "gastrointestinal issues", "urinary tract infection", "hepatitis", "pancreatitis", "fibromyalgia", "neuropathy",
    "epilepsy", "seizures", "dementia", "Alzheimer’s disease", "Parkinson’s disease", "multiple sclerosis", "sleep disorder",
    "insomnia", "obesity", "metabolic syndrome", "anemia", "blood transfusion", "organ transplant", "palliative care",
    "hospice", "skin disorder", "eczema", "psoriasis", "dermatitis", "sinus infection", "bronchitis", "pneumonia",
    "tuberculosis", "sexual health", "reproductive health", "pregnancy", "childbirth", "prenatal care", "postpartum",
    "gynecology", "menstrual cycle", "menopause", "hormonal therapy", "testosterone", "estrogen", "fertility",
    "infertility treatment", "contraception", "birth control", "sexually transmitted disease", "HIV", "AIDS", "HPV",
    "hepatitis B", "hepatitis C", "prostate health", "urology", "kidney stones", "dialysis", "dehydration",
    "electrolyte imbalance", "digestive health", "colon health", "appendicitis", "gallbladder", "hernia", "spinal cord injury",
    "paralysis", "brain injury", "concussion", "stroke rehabilitation", "oxygen therapy", "breathing disorder",
    "asbestosis", "lung cancer", "smoking cessation", "alcoholism", "substance abuse", "drug addiction", "overdose",
    "emergency care", "ambulance", "ICU", "trauma", "burn injury", "wound healing", "postoperative care", "pain relief",
    "sedation", "anesthesia", "radiation therapy", "chemotherapy", "immunotherapy", "gene therapy", "biotechnology",
    "stem cells", "regenerative medicine", "treated"];

  const isMedicalQuery = (message) => {
    return medicalKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
  };

  // Scroll to latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Format chatbot response
  const formatBotReply = (text) => {
    return text.replace(/\n/g, "<br/>")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isMedicalQuery(input)) {
      setMessages([...messages,
        { text: input, sender: "user" },
        { text: "⚠️ Please ask only medical-related questions.", sender: "bot" }
      ]);
      setInput("");
      return;
    }

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        message: input,
        history: newMessages.map(msg => ({ role: msg.sender, content: msg.text })) // Corrected history handling
      });

      const botReply = formatBotReply(response.data.reply);
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "❌ Error: Unable to get response", sender: "bot" }]);
    }
    console.log("Current conversation history:", newMessages);
    setLoading(false);
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
      <Box sx={{ padding: "15px", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">🏥 MedBuddy - Virtual Doctor</Typography>
      </Box>
      <Box ref={chatContainerRef} sx={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column" }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", mb: 1 }}>
            <Typography sx={{ maxWidth: "70%", padding: "10px", borderRadius: "10px", backgroundColor: msg.sender === "user" ? "#4caf50" : "#e0e0e0", color: msg.sender === "user" ? "white" : "black" }}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </Box>
        ))}
        {loading && <CircularProgress sx={{ margin: "auto" }} />}
      </Box>
      <Box sx={{ display: "flex", padding: "10px", backgroundColor: "white", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
        <TextField fullWidth variant="outlined" placeholder="Ask a medical question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} autoFocus />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={loading} sx={{ ml: 1 }}><SendIcon /></Button>
      </Box>
    </Box>
  );
};

export default Chatbot;

