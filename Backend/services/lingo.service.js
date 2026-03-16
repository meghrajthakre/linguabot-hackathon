// services/lingo.service.js
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.LINGODOTDEV_API_KEY;
const ENGINE_ID = process.env.LINGODOTDEV_ENGINE_ID; // or from env
const API_URL = "https://api.lingo.dev/process/localize";

export const translateText = async (text, source = "en", target) => {
  // If no translation needed, return original
  if (!text || source === target) return text;

  try {
    // Wrap the text in an object (API expects key-value pairs)
    const payload = {
      engineId: ENGINE_ID,
      sourceLocale: source,
      targetLocale: target,
      data: { content: text } // Use a meaningful key
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lingo.dev API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    // Extract the translated text using the same key
    const translated = result?.data?.content;
    
    if (!translated) {
      console.warn("Translation response missing expected data:", result);
      return text; // fallback
    }

    return translated;
  } catch (error) {
    console.error("❌ Translation error:", error.message);
    return text; // fallback to original
  }
};