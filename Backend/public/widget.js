(function () {
  const config = window.LinguaBotConfig;
  if (!config || !config.publicKey) {
    console.error("LinguaBot: publicKey missing");
    return;
  }

  const DEFAULTS = {
    autoPopupDelay: 5000,
    typingSpeed: 30,
    storageKey: "linguabot_history",
    storageTheme: "linguabot_theme",
    storageLanguage: "linguabot_language",
    enableTypingSound: true,
    enableTimestamps: true,
    maxMessages: 100
  };

  // ============================================
  // EXPANDED: 35+ SUPPORTED LANGUAGES
  // ============================================
  const LANGUAGES = {
    // TIER 1: Most Common Languages
    en: { name: "English", flag: "🇺🇸", region: "Americas" },
    es: { name: "Español", flag: "🇪🇸", region: "Europe & Americas" },
    fr: { name: "Français", flag: "🇫🇷", region: "Europe & Africa" },
    de: { name: "Deutsch", flag: "🇩🇪", region: "Europe" },
    it: { name: "Italiano", flag: "🇮🇹", region: "Europe" },
    pt: { name: "Português", flag: "🇵🇹", region: "Europe & Americas" },

    // TIER 2: Asian Languages
    ja: { name: "日本語", flag: "🇯🇵", region: "Asia" },
    zh: { name: "中文", flag: "🇨🇳", region: "Asia" },
    ko: { name: "한국어", flag: "🇰🇷", region: "Asia" },
    th: { name: "ไทย", flag: "🇹🇭", region: "Asia" },
    vi: { name: "Tiếng Việt", flag: "🇻🇳", region: "Asia" },
    id: { name: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia" },

    // TIER 3: South & Southeast Asian Languages
    ar: { name: "العربية", flag: "🇸🇦", region: "Middle East & Africa" },
    hi: { name: "हिन्दी", flag: "🇮🇳", region: "Asia" },
    bn: { name: "বাংলা", flag: "🇧🇩", region: "Asia" },
    ur: { name: "اردو", flag: "🇵🇰", region: "Asia" },

    // TIER 4: Eastern European Languages
    ru: { name: "Русский", flag: "🇷🇺", region: "Europe & Asia" },
    uk: { name: "Українська", flag: "🇺🇦", region: "Europe" },
    pl: { name: "Polski", flag: "🇵🇱", region: "Europe" },
    cs: { name: "Čeština", flag: "🇨🇿", region: "Europe" },
    hu: { name: "Magyar", flag: "🇭🇺", region: "Europe" },
    ro: { name: "Română", flag: "🇷🇴", region: "Europe" },
    sr: { name: "Српски", flag: "🇷🇸", region: "Europe" },
    hr: { name: "Hrvatski", flag: "🇭🇷", region: "Europe" },
    sl: { name: "Slovenščina", flag: "🇸🇮", region: "Europe" },
    sk: { name: "Slovenčina", flag: "🇸🇰", region: "Europe" },

    // TIER 5: Northern European Languages
    sv: { name: "Svenska", flag: "🇸🇪", region: "Europe" },
    no: { name: "Norsk", flag: "🇳🇴", region: "Europe" },
    da: { name: "Dansk", flag: "🇩🇰", region: "Europe" },
    fi: { name: "Suomi", flag: "🇫🇮", region: "Europe" },
    nl: { name: "Nederlands", flag: "🇳🇱", region: "Europe" },

    // TIER 6: Other European Languages
    el: { name: "Ελληνικά", flag: "🇬🇷", region: "Europe" },
    tr: { name: "Türkçe", flag: "🇹🇷", region: "Europe & Asia" },

    // TIER 7: Southeast Asian & Pacific
    ms: { name: "Bahasa Melayu", flag: "🇲🇾", region: "Asia" },
    fil: { name: "Filipino", flag: "🇵🇭", region: "Asia" },
    my: { name: "မြန်မာ", flag: "🇲🇲", region: "Asia" },

    // TIER 8: African Languages
    sw: { name: "Kiswahili", flag: "🇹🇿", region: "Africa" },
    af: { name: "Afrikaans", flag: "🇿🇦", region: "Africa" },

    // TIER 9: Middle East
    he: { name: "עברית", flag: "🇮🇱", region: "Middle East" },
    fa: { name: "فارسی", flag: "🇮🇷", region: "Middle East" },
  };

  /* ================= AUDIO SETUP ================= */
  const AudioManager = {
    context: null,
    enabled: DEFAULTS.enableTypingSound,

    init() {
      try {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API not supported");
        this.enabled = false;
      }
    },

    playTypingSound() {
      if (!this.enabled || !this.context) return;
      try {
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.frequency.value = 800 + Math.random() * 200;
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {
        // Silent fail
      }
    }
  };

  /* ================= SVG ICON ================= */
  const SVG_ICON = `
   <svg 
  viewBox="0 0 24 24" 
  width="28" 
  height="28" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="1.8"
  stroke-linecap="round" 
  stroke-linejoin="round"
  class="chat-icon"
>
  <path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V5z"/>
  
  <circle cx="9" cy="10" r="1.2">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite"/>
  </circle>
  
  <circle cx="12" cy="10" r="1.2">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" begin="0.2s" repeatCount="indefinite"/>
  </circle>
  
  <circle cx="15" cy="10" r="1.2">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" begin="0.4s" repeatCount="indefinite"/>
  </circle>
</svg>
  `;

  /* ================= LOAD REMIX ICON ================= */
  if (!document.querySelector('link[href*="remixicon"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/remixicon.css";
    document.head.appendChild(link);
  }

  /* ================= STYLES ================= */
  const style = document.createElement("style");
  style.innerHTML = `
    * {
      box-sizing: border-box;
    }

    .chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(99,102,241,0.4);
      cursor: pointer;
      transition: 0.3s ease;
    }

    .chat-toggle:hover {
      transform: scale(1.1);
    }

    .lb-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #f5f1e8;
      border: 2px solid #e8dcc8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
      transition: all 0.3s ease;
      font-size: 20px;
      color: #2d2d2d;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .lb-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .lb-button:active {
      transform: scale(0.95);
    }

    .lb-button.unread::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #f4d97d;
      animation: lb-pulse 2s infinite;
    }

    @keyframes lb-pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    .lb-chatbox {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 360px;
      height: 500px;
      background: #fefdfb;
      border-radius: 16px;
      border: 1px solid #e8dcc8;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      animation: lb-slideUp 0.3s ease;
    }

    @keyframes lb-slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .lb-chatbox.show {
      display: flex;
    }

    .lb-chatbox.hide {
      animation: lb-slideDown 0.3s ease;
    }

    @keyframes lb-slideDown {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }

    .lb-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8dcc8;
      background: #f5f1e8;
    }

    .lb-header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
      color: #1f1f1f;
    }

    .lb-status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      animation: lb-blink 2s infinite;
    }

    @keyframes lb-blink {
      0%, 49%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .lb-header-controls {
      display: flex;
      gap: 8px;
    }

    .lb-header-controls button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #666;
      transition: color 0.2s;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lb-header-controls button:hover {
      color: #1f1f1f;
    }

    .lb-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: #e8dcc8 transparent;
    }

    .lb-messages::-webkit-scrollbar {
      width: 6px;
    }

    .lb-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .lb-messages::-webkit-scrollbar-thumb {
      background: #e8dcc8;
      border-radius: 3px;
    }

    .lb-message-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      animation: lb-fadeIn 0.3s ease;
    }

    @keyframes lb-fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .lb-message-wrapper.user {
      justify-content: flex-end;
    }

    .lb-message {
      padding: 10px 14px;
      border-radius: 12px;
      max-width: 75%;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      transition: background 0.2s;
    }

    .lb-message.user {
      background: #f5f1e8;
      color: #1f1f1f;
      border-bottom-right-radius: 4px;
    }

    .lb-message.bot {
      background: #faf8f4;
      color: #1f1f1f;
      border-bottom-left-radius: 4px;
    }

    .lb-message-time {
      font-size: 11px;
      color: #999;
      white-space: nowrap;
      align-self: center;
    }

    .lb-typing-cursor {
      display: inline-block;
      width: 2px;
      height: 14px;
      background: #1f1f1f;
      margin-left: 2px;
      animation: lb-cursor-blink 1s infinite;
    }

    @keyframes lb-cursor-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }

    /* ========== LANGUAGE SELECTION ========== */
    .lb-language-selector {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      height: 100%;
      justify-content: flex-start;
      overflow-y: auto;
    }

    .lb-language-title {
      text-align: center;
      font-weight: 600;
      font-size: 16px;
      color: #1f1f1f;
      margin-bottom: 8px;
      position: sticky;
      top: 0;
      background: #fefdfb;
      z-index: 10;
      padding: 8px 0;
    }

    .lb-language-search {
      padding: 8px 12px;
      border: 1px solid #e8dcc8;
      border-radius: 20px;
      font-size: 13px;
      width: 100%;
      font-family: inherit;
      margin-bottom: 8px;
    }

    .lb-language-search:focus {
      outline: none;
      border-color: #f4d97d;
    }

    .lb-language-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      flex: 1;
    }

    .lb-language-btn {
      padding: 10px 8px;
      border: 1px solid #e8dcc8;
      background: #fefdfb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      font-size: 12px;
      font-family: inherit;
      color: #1f1f1f;
    }

    .lb-language-btn:hover {
      background: #f5f1e8;
      border-color: #d9cdc0;
    }

    .lb-language-btn.selected {
      background: #f4d97d;
      border-color: #f4d97d;
      font-weight: 600;
    }

    .lb-language-flag {
      font-size: 20px;
      display: block;
      margin-bottom: 2px;
    }

    .lb-language-name {
      font-size: 11px;
      display: block;
    }

    .lb-input-wrapper {
      display: flex;
      padding: 12px;
      border-top: 1px solid #e8dcc8;
      gap: 8px;
      background: #fefdfb;
    }

    .lb-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 20px;
      border: 1px solid #e8dcc8;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
      resize: none;
      max-height: 100px;
    }

    .lb-input:focus {
      border-color: #f4d97d;
      background: #fffbf0;
    }

    .lb-input::placeholder {
      color: #999;
    }

    .lb-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #f4d97d;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 14px;
      color: #2d2d2d;
    }

    .lb-send-btn:hover:not(:disabled) {
      background: #f0ce60;
      transform: scale(1.05);
    }

    .lb-send-btn:active:not(:disabled) {
      transform: scale(0.95);
    }

    .lb-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .lb-loading {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .lb-loading-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #1f1f1f;
      animation: lb-bounce 1.4s infinite;
    }

    .lb-loading-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .lb-loading-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes lb-bounce {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* ========== DARK MODE ========== */
    body.lb-dark-mode .lb-chatbox {
      background: #111827;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-header {
      background: #1f2937;
      border-color: #374151;
      color: white;
    }

    body.lb-dark-mode .lb-header-title {
      color: white;
    }

    body.lb-dark-mode .lb-header-controls button {
      color: #9ca3af;
    }

    body.lb-dark-mode .lb-header-controls button:hover {
      color: white;
    }

    body.lb-dark-mode .lb-message.user {
      background: #374151;
      color: white;
    }

    body.lb-dark-mode .lb-message.bot {
      background: #1f2937;
      color: #e5e7eb;
    }

    body.lb-dark-mode .lb-input {
      background: #1f2937;
      color: white;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-input:focus {
      background: #111827;
      border-color: #f4d97d;
    }

    body.lb-dark-mode .lb-input-wrapper {
      background: #111827;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-typing-cursor {
      background: #e5e7eb;
    }

    body.lb-dark-mode .lb-button {
      background: #1f2937;
      border-color: #374151;
      color: #f5f1e8;
    }

    body.lb-dark-mode .lb-button:hover {
      background: #374151;
    }

    body.lb-dark-mode .lb-language-btn {
      background: #1f2937;
      border-color: #374151;
      color: #e5e7eb;
    }

    body.lb-dark-mode .lb-language-btn:hover {
      background: #374151;
    }

    body.lb-dark-mode .lb-language-btn.selected {
      background: #f4d97d;
      color: #1f1f1f;
    }

    body.lb-dark-mode .lb-language-title {
      background: #111827;
      color: #e5e7eb;
    }

    body.lb-dark-mode .lb-language-search {
      background: #1f2937;
      color: #e5e7eb;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-language-search:focus {
      border-color: #f4d97d;
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .lb-chatbox {
        width: calc(100vw - 32px);
        height: 450px;
        bottom: 90px;
      }

      .lb-message {
        max-width: 85%;
      }

      .lb-language-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  /* ================= STORAGE ================= */
  const Storage = {
    getHistory: () => {
      const data = JSON.parse(localStorage.getItem(DEFAULTS.storageKey) || "[]");
      return data.slice(-DEFAULTS.maxMessages);
    },
    saveHistory: (data) =>
      localStorage.setItem(DEFAULTS.storageKey, JSON.stringify(data)),
    getTheme: () => localStorage.getItem(DEFAULTS.storageTheme),
    saveTheme: (t) => localStorage.setItem(DEFAULTS.storageTheme, t),
    getLanguage: () => localStorage.getItem(DEFAULTS.storageLanguage),
    saveLanguage: (lang) => {
      if (lang === null) {
        localStorage.removeItem(DEFAULTS.storageLanguage);
      } else {
        localStorage.setItem(DEFAULTS.storageLanguage, lang);
      }
    }
  };

  /* ================= UTILITY FUNCTIONS ================= */
  const Utils = {
    sanitizeHTML(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    },

    formatTime(date = new Date()) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    },

    debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }
  };

  /* ================= CREATE UI ================= */
  const button = document.createElement("button");
  button.className = "lb-button";
  button.innerHTML = SVG_ICON;
  button.title = "Open chat";  // Native tooltip
  button.setAttribute("aria-label", "Open chat");

  const chatbox = document.createElement("div");
  chatbox.className = "lb-chatbox";
  chatbox.setAttribute("role", "dialog");
  chatbox.setAttribute("aria-label", "Chat");
  chatbox.innerHTML = `
    <div class="lb-header">
      <div class="lb-header-title">
        <span class="lb-status-indicator"></span>
        AI Assistant
      </div>
      <div class="lb-header-controls">
        <button id="lb-clear" title="Clear history" aria-label="Clear chat history" style="display: none;">
          <i class="ri-delete-bin-line"></i>
        </button>
        <button id="lb-theme" title="Toggle dark mode" aria-label="Toggle dark mode">
          <i class="ri-moon-line"></i>
        </button>
        <button id="lb-close" title="Close" aria-label="Close chat">
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>

    <div id="lb-messages" class="lb-messages"></div>

    <div id="lb-language-selector" class="lb-language-selector" style="display: none;">
      <div class="lb-language-title">🌐 Choose your language</div>
      <input type="text" id="lb-language-search" class="lb-language-search" placeholder="Search languages..." />
      <div class="lb-language-grid" id="lb-language-grid"></div>
    </div>

    <div class="lb-input-wrapper" id="lb-input-wrapper" style="display: none;">
      <input
        id="lb-input"
        type="text"
        class="lb-input"
        placeholder="Type a message..."
        aria-label="Message input"
        autocomplete="off"
      />
      <button id="lb-send" class="lb-send-btn" aria-label="Send message">
        <i class="ri-send-plane-fill"></i>
      </button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(chatbox);

  const messagesDiv = chatbox.querySelector("#lb-messages");
  const input = chatbox.querySelector("#lb-input");
  const sendBtn = chatbox.querySelector("#lb-send");
  const languageSelector = chatbox.querySelector("#lb-language-selector");
  const languageGrid = chatbox.querySelector("#lb-language-grid");
  const languageSearch = chatbox.querySelector("#lb-language-search");
  const inputWrapper = chatbox.querySelector("#lb-input-wrapper");
  const clearBtn = chatbox.querySelector("#lb-clear");

  let messages = Storage.getHistory();
  let streaming = false;
  let selectedLanguage = Storage.getLanguage() || null;
  let filteredLanguages = { ...LANGUAGES };

  /* ================= LANGUAGE SELECTION ================= */
  function initializeLanguageSelector() {
    languageGrid.innerHTML = "";
    Object.entries(filteredLanguages).forEach(([code, { name, flag }]) => {
      const btn = document.createElement("button");
      btn.className = "lb-language-btn";
      if (selectedLanguage === code) {
        btn.classList.add("selected");
      }
      btn.innerHTML = `<span class="lb-language-flag">${flag}</span><span class="lb-language-name">${name}</span>`;
      btn.onclick = () => selectLanguage(code);
      languageGrid.appendChild(btn);
    });
  }

  // Search functionality for languages
  languageSearch.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    if (query === "") {
      filteredLanguages = { ...LANGUAGES };
    } else {
      filteredLanguages = {};
      Object.entries(LANGUAGES).forEach(([code, data]) => {
        if (data.name.toLowerCase().includes(query) || code.includes(query)) {
          filteredLanguages[code] = data;
        }
      });
    }

    initializeLanguageSelector();
  });

  function selectLanguage(code) {
    selectedLanguage = code;
    Storage.saveLanguage(code);

    // Hide language selector, show chat
    languageSelector.style.display = "none";
    messagesDiv.style.display = "flex";
    inputWrapper.style.display = "flex";
    clearBtn.style.display = "flex";

    // Clear messages and load chat
    messagesDiv.innerHTML = "";
    messages = [];
    loadGreeting();
  }

  function loadGreeting() {
    const greetings = {
      en: "👋 Hi! How can I help you today?",
      es: "👋 ¡Hola! ¿Cómo puedo ayudarte hoy?",
      fr: "👋 Bonjour! Comment puis-je vous aider?",
      de: "👋 Hallo! Wie kann ich dir heute helfen?",
      it: "👋 Ciao! Come posso aiutarti?",
      pt: "👋 Olá! Como posso ajudá-lo?",
      ja: "👋 こんにちは！本日はどのようにお手伝いしましょうか？",
      zh: "👋 你好！我能如何帮助你？",
      ar: "👋 مرحبا! كيف يمكنني مساعدتك؟",
      hi: "👋 नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
      ru: "👋 Привет! Как я могу вам помочь?",
      ko: "👋 안녕하세요! 무엇을 도와드릴까요?",
      th: "👋 สวัสดี! ฉันช่วยคุณได้อย่างไร?",
      vi: "👋 Xin chào! Tôi có thể giúp bạn như thế nào?",
      id: "👋 Halo! Bagaimana saya bisa membantu Anda?",
      bn: "👋 হ্যালো! আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
      ur: "👋 السلام علیکم! میں آپ کی کیسے مدد کر سکتا ہوں?",
      pl: "👋 Cześć! Jak mogę Ci dzisiaj pomóc?",
      cs: "👋 Ahoj! Jak ti mohu dnes pomoci?",
      hu: "👋 Halló! Hogyan tudok ma segíteni?",
      ro: "👋 Bună! Cum pot să vă ajut astazi?",
      sr: "👋 Здраво! Како вам могу помоћи?",
      hr: "👋 Bok! Kako vam mogu pomoći?",
      sl: "👋 Zdravo! Kako ti lahko pomagam?",
      sk: "👋 Ahoj! Ako ti dnes môžem pomôcť?",
      sv: "👋 Hej! Hur kan jag hjälpa dig idag?",
      no: "👋 Hallo! Hvordan kan jeg hjelpe deg i dag?",
      da: "👋 Hej! Hvordan kan jeg hjælpe dig i dag?",
      fi: "👋 Hei! Kuinka voin auttaa sinua tänään?",
      nl: "👋 Hallo! Hoe kan ik je vandaag helpen?",
      el: "👋 Γεια σας! Πώς μπορώ να σας βοηθήσω;",
      tr: "👋 Merhaba! Bugün size nasıl yardımcı olabilirim?",
      ms: "👋 Halo! Bagaimana saya dapat membantu Anda hari ini?",
      fil: "👋 Kamusta! Paano ko matutulong kayo ngayong araw?",
      my: "👋 မင်္ဂလာပါ! ယနေ့ အဘယ်နည်းအရာ ကူညီပေးနိုင်သည်လည်း။",
      sw: "👋 Habari! Jinsi gani ninaweza kukusaidia leo?",
      af: "👋 Hallo! Hoe kan ek jou vandag help?",
      he: "👋 שלום! איך אני יכול לעזור לך היום?",
      fa: "👋 سلام! چطور می‌تونم امروز کمکتون کنم؟",
      uk: "👋 Привіт! Як я можу вам допомогти?",
    };

    const greeting = greetings[selectedLanguage] || greetings.en;
    addMessage(greeting, "bot");
  }

  function showLanguageSelector() {
    messagesDiv.style.display = "none";
    inputWrapper.style.display = "none";
    clearBtn.style.display = "none";
    languageSelector.style.display = "flex";
    filteredLanguages = { ...LANGUAGES };
    initializeLanguageSelector();
    languageSearch.value = "";
  }

  /* ================= MESSAGE FUNCTIONS ================= */
  function addMessage(text, role, timestamp = new Date()) {
    const wrapper = document.createElement("div");
    wrapper.className = "lb-message-wrapper " + role;

    const msg = document.createElement("div");
    msg.className = "lb-message " + role;
    msg.innerHTML = Utils.sanitizeHTML(text);
    wrapper.appendChild(msg);

    if (DEFAULTS.enableTimestamps) {
      const time = document.createElement("div");
      time.className = "lb-message-time";
      time.textContent = Utils.formatTime(timestamp);
      wrapper.appendChild(time);
    }

    messagesDiv.appendChild(wrapper);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return msg;
  }

  function streamMessage(text) {
    streaming = true;
    sendBtn.disabled = true;

    const wrapper = document.createElement("div");
    wrapper.className = "lb-message-wrapper bot";
    const msg = document.createElement("div");
    msg.className = "lb-message bot";
    msg.innerHTML = "";
    wrapper.appendChild(msg);
    messagesDiv.appendChild(wrapper);

    let i = 0;
    const interval = setInterval(() => {
      msg.innerHTML = Utils.sanitizeHTML(text.substring(0, i + 1)) +
        '<span class="lb-typing-cursor"></span>';
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      AudioManager.playTypingSound();
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        msg.innerHTML = Utils.sanitizeHTML(text);
        streaming = false;
        sendBtn.disabled = false;
        messages.push({ role: "bot", content: text, timestamp: new Date(), language: selectedLanguage });
        Storage.saveHistory(messages);
      }
    }, DEFAULTS.typingSpeed);
  }

  function showLoadingState() {
    const wrapper = document.createElement("div");
    wrapper.className = "lb-message-wrapper bot";
    wrapper.id = "lb-loading";
    const loading = document.createElement("div");
    loading.className = "lb-message bot lb-loading";
    loading.innerHTML =
      '<div class="lb-loading-dot"></div><div class="lb-loading-dot"></div><div class="lb-loading-dot"></div>';
    wrapper.appendChild(loading);
    messagesDiv.appendChild(wrapper);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function removeLoadingState() {
    const loading = document.getElementById("lb-loading");
    if (loading) loading.remove();
  }

  function loadHistory() {
    if (!selectedLanguage) {
      showLanguageSelector();
    } else {
      if (messages.length === 0) {
        loadGreeting();
      } else {
        messages.forEach((m) => {
          const ts = m.timestamp ? new Date(m.timestamp) : new Date();
          addMessage(m.content, m.role === "user" ? "user" : "bot", ts);
        });
      }
      messagesDiv.style.display = "flex";
      inputWrapper.style.display = "flex";
      clearBtn.style.display = "flex";
      languageSelector.style.display = "none";
    }
  }

  function clearHistory() {
    if (confirm("Clear all messages? This cannot be undone.")) {
      messages = [];
      messagesDiv.innerHTML = "";
      Storage.saveHistory(messages); // clear chat history
      Storage.saveLanguage(null);    // clear saved language
      selectedLanguage = null;       // reset current language
      showLanguageSelector();        // show language picker again
    }
    localStorage.removeItem();
  }

  /* ================= SEND MESSAGE ================= */
  async function sendMessage() {
    if (streaming || !selectedLanguage) return;

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    messages.push({ role: "user", content: text, timestamp: new Date(), language: selectedLanguage });
    Storage.saveHistory(messages);
    input.value = "";
    sendBtn.disabled = true;

    showLoadingState();

    try {
      const res = await fetch(
        `${config.apiUrl || "http://localhost:4000"}/api/public/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-public-key": config.publicKey
          },
          body: JSON.stringify({
            message: text,
            language: selectedLanguage
          })
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      removeLoadingState();
      streamMessage(data.aiResponse || "Sorry, I didn't get a response.");
    } catch (e) {
      removeLoadingState();
      streamMessage("❌ Error connecting to server. Please try again.");
      console.error("Chat error:", e);
    } finally {
      sendBtn.disabled = false;
    }
  }

  const debouncedSend = Utils.debounce(sendMessage, 300);

  /* ================= EVENT LISTENERS ================= */
  button.onclick = () => {
    chatbox.classList.toggle("show");
    button.classList.remove("unread");
  };

  chatbox.querySelector("#lb-close").onclick = () => {
    chatbox.classList.add("hide");
    // Clear stored language so it asks again next time
    Storage.saveLanguage(null);
    selectedLanguage = null;
    localStorage.removeItem(languageSelector.value);
    setTimeout(() => {
      chatbox.classList.remove("show", "hide");
    }, 300);
  };

  clearBtn.onclick = clearHistory;

  sendBtn.onclick = sendMessage;

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      chatbox.classList.add("hide");
      // Clear stored language so it asks again next time
      Storage.saveLanguage(null);
      selectedLanguage = null;
      setTimeout(() => {
        chatbox.classList.remove("show", "hide");
      }, 300);
    }
  });

  chatbox.querySelector("#lb-theme").onclick = () => {
    const isDark = document.body.classList.toggle("lb-dark-mode");
    Storage.saveTheme(isDark ? "dark" : "light");
    const icon = chatbox.querySelector("#lb-theme i");
    icon.className = isDark ? "ri-sun-line" : "ri-moon-line";
  };

  /* ================= AUTO POPUP ================= */
  setTimeout(() => {
    if (!sessionStorage.getItem("lb_popup")) {
      chatbox.classList.add("show");
      sessionStorage.setItem("lb_popup", "1");
    }
  }, DEFAULTS.autoPopupDelay);

  /* ================= INIT ================= */
  // AudioManager.init();

  const isDark = Storage.getTheme() === "dark";
  if (isDark) {
    document.body.classList.add("lb-dark-mode");
    chatbox.querySelector("#lb-theme i").className = "ri-sun-line";
  }

  loadHistory();

  // Update input height as user types
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
  });
})();