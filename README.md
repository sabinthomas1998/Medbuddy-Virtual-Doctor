# MedBuddy - Virtual Doctor (PWA)

MedBuddy is a **Progressive Web App (PWA)** that acts as a **virtual doctor chatbot** to analyze medical conditions and provide insights. Users can install it on their devices for a native-like experience.

---


## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone [https://github.com/your-username/MedBuddy.git](https://github.com/sabinthomas1998/Medbuddy-Virtual-Doctor.git)
cd MedBuddy
```

### **2️⃣ Install Dependencies**
#### **Backend (Express.js)**
```sh
cd backend
npm install
```
#### **Frontend (React + Material UI + PWA)**
```sh
cd ../virtual-doctor-frontend
npm install
```

---

## 🌐 Running the App

### **Start Backend**
```sh
cd backend
node server.js
```

### **Start Frontend**
```sh
cd ../virtual-doctor-frontend
npm start
```

---


### **3️⃣ Build for Production**
```sh
npm run build
npx serve -s build
```


### ** Make sure to update the .env file with gemini key**
```sh
go to backend/.env
and update the api key by generating a key from https://deepmind.google/technologies/gemini/ (choose build with Gemini)
```



