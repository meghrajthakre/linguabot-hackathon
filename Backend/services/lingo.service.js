import dotenv from "dotenv";
dotenv.config();

import { LingoDotDevEngine } from "lingo.dev/sdk";

// ===============================
// 🔑 INIT
// ===============================

const API_KEY = process.env.LINGODOTDEV_API_KEY;
const isEnabled = !!API_KEY;

if (!isEnabled) {
  console.warn("⚠ Lingo disabled (API key missing)");
}

const lingo = isEnabled
  ? new LingoDotDevEngine({
    apiKey: API_KEY,
    telemetry: false,
  })
  : null;

// ===============================
// 🌍 LOCALE MAP
// ===============================

const localeMap = {
  en: "en-US",
  hi: "hi-IN",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-BR",
  ja: "ja-JP",
  zh: "zh-CN",
};

function normalizeLocale(locale) {
  if (!locale) return "en-US";
  if (locale.includes("-")) return locale;
  return localeMap[locale] || locale;
}

// ===============================
// 🌍 AUTO DETECT + TRANSLATE
// ===============================

export async function autoTranslate(text, targetLocale = "en-US") {
  try {
    if (!lingo || !text || typeof text !== "string") {
      return {
        text: text || "",
        detectedLocale: "en-US",
        translated: false,
      };
    }

    const cleaned = text.trim();
    if (!cleaned) {
      return {
        text: "",
        detectedLocale: "en-US",
        translated: false,
      };
    }

    const result = await lingo.localizeText({
      text: cleaned,
      sourceLocale: "auto",
      targetLocale,
    });

    // 🔒 HARD SAFETY CHECK
    if (!result || typeof result !== "object") {
      console.warn("⚠ Lingo returned invalid result:", result);
      return {
        text: cleaned,
        detectedLocale: "en-US",
        translated: false,
      };
    }

    const detectedLocale =
      typeof result.sourceLocale === "string"
        ? result.sourceLocale
        : "en-US";

    const translatedText =
      typeof result.text === "string"
        ? result.text
        : cleaned;

    return {
      text: translatedText,
      detectedLocale,
      translated: detectedLocale !== targetLocale,
    };

  } catch (err) {
    console.error("❌ Lingo error:", err.message);

    return {
      text,
      detectedLocale: "en-US",
      translated: false,
    };
  }
}

// ===============================
// 🔁 TRANSLATE EXPLICIT
// ===============================

export async function translateSafe(text, source, target) {
  try {
    if (!lingo || !text) return text;

    const result = await lingo.localizeText({
      text,
      sourceLocale: normalizeLocale(source),
      targetLocale: normalizeLocale(target),
    });

    return result?.text || text;
  } catch (err) {
    console.error("❌ translateSafe error:", err.message);
    return text;
  }
}