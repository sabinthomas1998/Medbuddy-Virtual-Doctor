# MedBuddy - Virtual Doctor (PWA)

MedBuddy is a **Progressive Web App (PWA)** that acts as a **virtual doctor chatbot** to analyze medical conditions and provide insights. Users can install it on their devices for a native-like experience.

---

## 🚀 Features

✅ **AI-Powered Chatbot** - Provides medical analysis using Cohere AI
✅ **PWA Enabled** - Can be installed on mobile & desktop
✅ **Offline Support** - Works with cached data when offline
✅ **Mobile Responsive** - Optimized UI for all screen sizes
✅ **Fast & Secure** - Service workers ensure efficient performance

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/MedBuddy.git
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

## 📲 PWA Setup

### **1️⃣ Register Service Worker**
Ensure `src/serviceWorkerRegistration.js` contains:
```javascript
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}
```

### **2️⃣ Create `manifest.json` in `public/`**
```json
{
  "short_name": "MedBuddy",
  "name": "MedBuddy - Virtual Doctor",
  "icons": [
    { "src": "/logo192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/logo512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#1976d2",
  "background_color": "#ffffff"
}
```

### **3️⃣ Build for Production**
```sh
npm run build
npx serve -s build
```

---

## 🚀 Deployment

To deploy MedBuddy as a PWA, use platforms like:
- **Vercel** (`vercel deploy`)
- **Netlify** (`netlify deploy`)
- **Firebase Hosting** (`firebase deploy`)

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 💡 Future Enhancements
- ✅ **Voice Input for Chatbot**
- ✅ **Push Notifications for Updates**
- ✅ **More AI-Powered Health Insights**

---

Made with ❤️ by MedBuddy Team

