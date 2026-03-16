# 🤖 LinguaBot — Multilingual AI Customer Support Bot assistance

> Auto-localized customer support powered by  Lingo.dev + gemini. One line of code, instant multilingual support in 50+ languages.

product Link -  https://linguabot.digital/

## 📋 Table of Contents

* [The Problem](#the-problem)
* [The Solution](#the-solution)
* [Key Features](#-key-features)
* [Architecture](#-architecture)
* [Project Structure](#-project-structure)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
* [How to Use](#-how-to-use-linguabot)
* [Lingo.dev Integration Flow](#-lingodev-integration-flow)
* [Analytics & Insights](#-analytics--insights)
* [Customization](#-customization)
* [Security](#-security)
* [Scaling Considerations](#-scaling-considerations)
* [Deployment](#-deployment)
* [Contributing](#-contributing)
* [License](#-license)
* [Links](#-links)

---

## The Problem

* **High costs** – Hiring multilingual support agents is expensive and hard to scale.
* **Language barriers** – Traditional chatbots fail with non-English queries, forcing users to switch languages manually.
* **Fragmented experience** – Even when translation tools are used, responses are often clunky and lack business-specific context.

## The Solution

**LinguaBot** is a drop-in AI widget that eliminates language barriers:

* **One embed code** → Instant multilingual support on any website.
* **Auto language detection** – Uses Lingo.dev to detect the visitor’s language and respond in kind, with zero configuration.
* **AI-powered** – Claude Sonnet 4.5 generates context-aware answers based on your business knowledge base.
* **Train once in English** – Upload FAQs, docs, or pricing info; the bot works in 50+ languages automatically.

---

## ✨ Key Features

* 🌐 **Auto Language Detection** – Detects user language via Lingo.dev
* 🤖 **AI Customer Support** – Powered by Claude Sonnet 4.5
* 🔄 **Real-time Translation** – Responses translated instantly to user’s language
* 📚 **Trainable Knowledge Base** – Upload FAQs, docs, pricing info
* 📊 **Analytics Dashboard** – Track conversations, languages, sentiment
* ⚡ **One-line Installation** – `<script>` tag embed
* 🔐 **Secure** – API keys stored server-side, no client-side exposure

---

                 
## 📁 Project Structure

The repository is organised as a **monorepo** containing three main applications: the React dashboard, the Node.js backend, and the vanilla JavaScript widget.

```
linguabot/
├── frontend/ # React Dashboard (Vite + Tailwind)
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx # Main bot list & management
│ │ │ ├── BotEditor.jsx # Bot training & configuration
│ │ │ ├── Analytics.jsx # Conversation analytics & charts
│ │ │ ├── Login.jsx # Authentication page
│ │ │ └── Signup.jsx # New user registration
│ │ ├── components/
│ │ │ ├── BotCard.jsx # Preview card for each bot
│ │ │ ├── TrainingPanel.jsx # FAQ/document upload UI
│ │ │ ├── EmbedCodeModal.jsx # Displays the install snippet
│ │ │ └── ChatPreview.jsx # Live preview of the widget
│ │ ├── services/
│ │ │ └── api.js # Axios client for backend calls
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── README.md
│
├── backend/ # Node.js + Express API
│ ├── routes/
│ │ ├── auth.routes.js # POST /api/auth/signup, /login
│ │ ├── bots.routes.js # CRUD for bot configurations
│ │ ├── chat.routes.js # POST /api/chat (main endpoint)
│ │ └── analytics.routes.js # GET /api/analytics/:botId
│ ├── models/
│ │ ├── User.model.js # MongoDB user schema (email, hash)
│ │ ├── Bot.model.js # Bot config + embedded knowledge base
│ │ └── Conversation.model.js # Chat history & metadata
│ ├── services/
│ │ ├── gemini.service.js # gemini SDK wrapper
│ │ ├── lingo.service.js # Lingo.dev SDK wrapper (detect + translate)
│ │ └── auth.service.js # JWT generation & verification
│ ├── middleware/
│ │ ├── auth.middleware.js # Protect routes with JWT
│ │ └── rateLimiter.middleware.js # Prevent API abuse
│ ├── server.js
│ ├── package.json
│ └── README.md
│
├── widget/ # Embeddable Chat Widget (Vanilla JS)
│ ├── src/
│ │ ├── widget.js # Entry point – initialises chat
│ │ ├── ui.js # Renders the chat UI dynamically
│ │ └── api.js # Calls backend /api/chat endpoint
│ ├── dist/
│ │ └── widget.min.js # Bundled & minified for CDN
│ ├── package.json
│ └── README.md
│
│
├── .env.example
├── .gitignore
└── README.md # This file
```

---



## 🏗️ Architecture

                            ┌─────────────────────────────────────────────────────────────────┐
                            │                        LinguaBot System                         │
                            └─────────────────────────────────────────────────────────────────┘
                            
                                ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                                │   Dashboard  │      │    Widget    │      │   Backend    │
                                │   (React)    │◄────►│  (Vanilla)   │◄────►│  (Node.js)   │
                                │              │      │              │      │              │
                                │ • Create bots│      │ • Chat UI    │      │ • Claude API │
                                │ • Train AI   │      │ • Embed code │      │ • Lingo.dev  │
                                │ • Analytics  │      │ • Real-time  │      │ • Auth       │
                                └──────────────┘      └──────────────┘      └──────────────┘
                                       │                                            │
                                       └────────────────┬───────────────────────────┘
                                                        │
                                                 ┌──────▼──────┐
                                                 │   MongoDB   │
                                                 │             │
                                                 │ • Bots      │
                                                 │ • Messages  │
                                                 │ • Analytics │
                                                 └─────────────┘




## 🛠️ Tech Stack

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| **Frontend**     | React 18, Vite, Tailwind CSS, React Router, Recharts (analytics) |
| **Backend**      | Node.js, Express, MongoDB (Mongoose), JWT, bcrypt                |
| **Widget**       | Vanilla JavaScript, bundled with Webpack                         |
| **AI**           | Gemini and Grok 
| **Localization** | **Lingo.dev SDK** – language detection + real-time translation   |
| **Hosting**      | Vercel (frontend), Render/Railway (backend), MongoDB Atlas       |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* MongoDB (local or Atlas)
* gemini API Key
* grok API Key
* Lingo.dev API Key

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/linguabot
cd linguabot

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install widget dependencies
cd ../widget
npm install
```

### 2. Configure Environment

```bash
# In backend/.env
cp .env.example .env
```

Backend .env:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/linguabot
JWT_SECRET=your_jwt_secret_here
ANTHROPIC_API_KEY=sk-ant-xxx
LINGODOTDEV_API_KEY=your_lingo_key_here
FRONTEND_URL=http://localhost:5173
WIDGET_ALLOWED_ORIGINS=*
```

Frontend .env:

```
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Widget (if making changes)
cd widget
npm run dev
```

### 4. Access the App

Dashboard: https://linguabot.digital/dashboard

---

## 🎯 How to Use LinguaBot

### For Business Owners

**Step 1: Sign Up**
Go to dashboard → Create account

**Step 2: Create a Bot**
Click "Create New Bot" and give it a name

**Step 3: Train Your Bot**
Paste your FAQs, product info, pricing.

**Step 4: 
Copy the code and paste into your VS-code
Install on Website**

```html
<script>
  window.LinguaBotConfig = {
    publicKey: "lb_5d798ab2c56b35f337abaf8c3a043ec127135e0904b7804b"
  };
</script>
<script src="https://linguabot-hackathon.onrender.com/widget.js"></script>
```

**Step 5: It Just Works!**

Visitors can now chat in any language.

### For Developers Embedding the Widget

```html
<!DOCTYPE html>
<html>
<head>
<title>My Website</title>
</head>

<body>

<h1>Welcome to my site</h1>

<script>
  window.LinguaBotConfig = {
    publicKey: "lb_5d798ab2c56b35f337abaf8c3a043ec127135e0904b7804b"
  };
</script>
<script src="https://linguabot-hackathon.onrender.com/widget.js"></script>

</body>
</html>
```

---

## 🌐 Lingo.dev Integration Flow

```javascript
// Inside chat.routes.js or a controller
import { translateText } from '../services/lingo.service.js';
import { generateClaudeResponse } from '../services/claude.service.js';

async function handleChatMessage(userMessage, botId) {
  // 1. Detect language (using Lingo.dev SDK)
  const userLocale = await lingo.detectLanguage(userMessage); // e.g., "hi"
  
  // 2. Translate user message to English (if needed)
  const englishQuery = userLocale === 'en' 
    ? userMessage 
    : await translateText(userMessage, userLocale, 'en');
  
  // 3. Get AI response from Claude (in English)
  const englishResponse = await generateClaudeResponse(englishQuery, botId);
  
  // 4. Translate response back to user's language
  const finalResponse = userLocale === 'en'
    ? englishResponse
    : await translateText(englishResponse, 'en', userLocale);
  
  // 5. Return with locale info for UI badge
  return {
    text: finalResponse,
    locale: userLocale
  };
}
```

---


---

## 🎨 Customization

* Bot name & greeting
* Auto-open
* Operating hours

---

## 🔐 Security

* API keys server-side only
* JWT authentication
* Rate limiting
* CORS protection
* XSS protection
* MongoDB injection protection



---

## 🚢 Deployment

Backend:

```bash
npm run build
npm start
```

Frontend:

```bash
npm run build
```

Widget:

```bash
npm run build
```

---

## 🤝 Contributing

Built for Lingo.dev Hackathon #9 (February 2026). Contributions welcome.

---

## 📄 License

MIT License — Built with ❤️ using  + Lingo.dev

---

## 🔗 Links

Live Demo: https://linguabot.app

Documentation: [docs/API_REFERENCE.md](https://linguabot.digital/how-to-make-bot)

Lingo.dev: https://lingo.dev


Built for Lingo.dev Hackathon #9 — February 2026
