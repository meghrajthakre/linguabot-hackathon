module.exports = {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "ja", "zh"],

  // AI model selection per language pair (optional)
  models: {
    "en:es": "gpt-4",
    "en:fr": "claude-3",
    "*:*": "groq:mistral-saba-24b",   // fallback for other pairs
  },

  // Caching to avoid re‑translating unchanged strings
  caching: {
    enabled: true,
    directory: ".lingo-cache",
  },

  // Quality checks
  validation: {
    checkPlurals: true,
    validateVariables: true,
    ensureCompleteness: true,
  },
};