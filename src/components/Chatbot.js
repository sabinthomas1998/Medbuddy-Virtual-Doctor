import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt"; // Import Reset Icon
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false); // State to track chatbot loading status
  const chatContainerRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/chatbot"; // Default to localhost for development


  // Medical keyword filter
  const medicalKeywords = ["hi", "hello", "symptoms", "diagnosis", "treatment", "disease", "doctor", "fever", "pain","eye brows","eye","lip","lips","above","below",
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
    "stem cells", "regenerative medicine", "treated","bleeding","bleed","eyelid", "orbital", "periorbital", "edema", 
                           "conjunctivitis", "cellulitis", "sinusitis", "blepharitis", "autoimmune disorders", "folliculitis", 
                           "allergic reaction", "inflammation", "infection", "trauma", "injury", "irritation", "antihistamines", 
                           "antibiotics", "dehydration", "fluid retention", "acute infection", "chronic inflammation", "anaphylactic shock", 
                           "sinus disease", "thyroid disease", "seborrhea", "rosacea","head", "cranium", "skull", "braincase", "neck", "cervical region", 
                           "nape", "collar", "eyes", "orbs", "peepers", "sight", "ears", "auricles", "hearing organs", "lobes", "nose", "sniffer", 
                           "olfactory organ", "nostrils", "mouth", "oral cavity", "maw", "oral fissure", "throat", "gullet", "pharynx", "windpipe", 
                           "thyroid", "thyroid gland", "endocrine gland", "larynx", "voice box", "Adam's apple", "forehead", "brow", "front", "frontal bone",
                           "cheeks", "jowls", "sides of the face", "malar", "shoulders", "deltoids", "scapulae", "pectoral girdle", "arms", "upper limbs",
                           "appendages", "forelimbs", "elbows", "joints", "articulations", "bend", "wrists", "carpus", "wrist joint", "radiocarpal joint",
                           "hands", "palms", "mitts", "graspers", "fingers", "digits", "phalanges", "extremities", "chest", "thorax", "pectoral region", 
                           "ribcage", "heart", "cardiac muscle", "ticker", "pump", "lungs", "respiratory organs", "air sacs", "breathers", "ribs", 
                           "rib bones", "costae", "stomach", "belly", "abdomen", "tummy", "liver", "hepatic organ", "bile producer", "kidneys", 
                           "renal organs", "nephritic organs", "pancreas", "pancreatic gland", "intestines", "bowels", "guts", "digestive tract", 
                           "bladder", "urinary bladder", "vesica", "spleen", "lien", "blood filter", "diaphragm", "midriff", "thoracic diaphragm", "hips",
                           "pelvis", "pelvic girdle", "flanks", "thighs", "femoral region", "upper legs", "knees", "patellas", "kneecaps", "joints", "legs",
                           "lower limbs", "appendages", "extremities", "ankles", "ankle joints", "tarsal bones", "feet", "pedals", "soles", "toes", "digits", 
                           "phalanges", "vertebrae", "spinal bones", "backbones", "spinal cord", "medulla spinalis", "back muscles", "dorsal muscles", "ovaries",
                           "female gonads", "uterus", "womb", "testes", "male gonads", "testicles", "prostate", "prostate gland"];

  // Urgent symptom keywords
  const urgentSymptoms = ["chest pain", "difficulty breathing", "shortness of breath", "severe headache", "severe dizziness", "fainting", "loss of consciousness"];

  const isMedicalQuery = (message) => {
    return medicalKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
  };

  const isUrgentSymptom = (message) => {
    return urgentSymptoms.some(symptom => message.toLowerCase().includes(symptom.toLowerCase()));
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

  // Handle reset
  const handleReset = () => {
    setMessages([]);
    setInput("");
    setLoading(false);
  };

  const fetchMedicalIllustration = async (query) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: process.env.REACT_APP_GOOGLE_API_KEY,
        cx: process.env.REACT_APP_SEARCH_ENGINE_ID,
        searchType: "image",
        q: `${query} medical illustration`,
      },
    });
      return response.data.items?.[0]?.link || "";
    } catch (error) {
      console.error("Error fetching medical illustration:", error);
      return "";
    }
  };

  const fetchYouTubeVideo = async (query) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          q: `${query} treatment exercise`,
          part: "snippet",
          maxResults: 1,
          type: "video",
        },
      });
      return response.data.items?.[0]?.id?.videoId || "";
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
      return "";
    }
  };

  const shouldFetchVideo = (query) => {
    const videoKeywords = ["video", "exercise", "treatment video", "YouTube"];
    return videoKeywords.some(keyword => query.toLowerCase().includes(keyword));
  };

  const shouldFetchIllustration = (query) => {
    const illustrationKeywords = ["anatomy", "diagram", "x-ray", "CT scan", "MRI", "ultrasound","image", "picture", "graph", "pic","diagram", "chart","illustration"];
    return illustrationKeywords.some(keyword => query.toLowerCase().includes(keyword));
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

    // Emergency contact numbers (add more based on location or preferences)
    const emergencyContacts = [
      { label: "Emergency Services", number: "100" },
      { label: "Local Hospital", number: "12345" },
      { label: "Ambulance", number: "108" }
    ];

    const getEmergencyMessage = () => {
      return emergencyContacts
        .map(contact => `🚨 <b>Urgent Symptom Detected</b>: It seems you might be experiencing a medical emergency. Please call <a href="tel:${contact.number}">${contact.label}</a> or seek immediate medical help.`)
        .join("<br/><br/>");
    };

    // Trigger this when urgent symptoms are detected:
    if (isUrgentSymptom(input)) {
      setMessages([...messages, 
        { text: input, sender: "user" },
        { text: getEmergencyMessage(), sender: "bot" }
      ]);
      setInput("");
      return;
    }

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL,{
        message: input,
        history: newMessages.map(msg => ({ role: msg.sender, content: msg.text }))
      });

      

      let botReply = formatBotReply(response.data.reply);
      const imageUrl = await fetchMedicalIllustration(input);

      if (shouldFetchIllustration(input)) {
        const imageUrl = await fetchMedicalIllustration(input);
        if (imageUrl) {
          botReply += `<br/><br/><img src='${imageUrl}' alt='Medical Illustration' style='max-width:100%; border-radius:10px;' />`;
        }
      }
  
      if (shouldFetchVideo(input)) {
        const videoId = await fetchYouTubeVideo(input);
        if (videoId) {
          botReply += `<br/><br/><a href='https://www.youtube.com/watch?v=${videoId}' target='_blank'>📺 Watch Related Video</a>`;
        }
      }

      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "❌ Error: Unable to get response", sender: "bot" }]);
    }
    setLoading(false);
  };

  const handleStartChat = () => {
    // Introduce 5-second delay
    setTimeout(() => {
      setChatLoaded(true);
    }, 500); // 5 seconds delay
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
      {!chatLoaded ? (
        // Welcome Page
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>Welcome to MedBuddy</Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>Your virtual doctor is ready to assist you with medical inquiries.</Typography>
          <Button variant="contained" color="primary" onClick={handleStartChat}>Start Chat</Button>
        </Box>
      ) : (
        // Chatbot
        <>
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
            {/* Reset Button */}
            <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ ml: 1 }}><RestartAltIcon /> Reset</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chatbot;
