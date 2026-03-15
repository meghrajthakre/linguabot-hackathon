import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function truncateToTokens(text, maxWords = 1500) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

function buildContext(contentChunks = [], websiteContext = "") {
  const sections = [];
  if (contentChunks.length > 0) {
    const faq = contentChunks.filter(c => c.type === "faq").map(c => c.text).join("\n");
    const pricing = contentChunks.filter(c => c.type === "pricing").map(c => c.text).join("\n");
    const docs = contentChunks.filter(c => c.type === "doc").map(c => c.text).join("\n");
    const website = contentChunks.filter(c => c.type === "website").map(c => c.text).join("\n");
    if (faq) sections.push(`=== FAQs ===\n${faq}`);
    if (pricing) sections.push(`=== PRICING ===\n${pricing}`);
    if (docs) sections.push(`=== DOCUMENTATION ===\n${docs}`);
    if (website) sections.push(`=== WEBSITE INFO ===\n${website}`);
  }
  if (websiteContext) sections.push(`=== ADDITIONAL CONTEXT ===\n${websiteContext}`);
  return sections.join("\n\n");
}

/**
 * Generate response using Gemini with fallback to Groq (Llama)
 * @param {string} userMessage
 * @param {string} websiteContext
 * @param {string} systemPrompt
 * @param {Array} contentChunks
 * @param {Object} options - { temperature, maxOutputTokens, model, retries, retryDelay }
 */
export async function generateResponse(
  userMessage,
  websiteContext = "",
  systemPrompt = "",
  contentChunks = [],
  options = {}
) {
  const {
    temperature = 0.3,
    maxOutputTokens = 200,
    model = "gemini-1.5-flash", // fixed model name
    retries = 2,
    retryDelay = 5000,
  } = options;

  const fullContext = buildContext(contentChunks, websiteContext);
  const trimmedContext = truncateToTokens(fullContext, 1500);

  // --- Attempt Gemini ---
  try {
    const geminiModel = genAI.getGenerativeModel({
      model: model, // use passed model (default gemini-1.5-flash)
      systemInstruction: systemPrompt ||
        `You are a helpful AI assistant for a website. Answer questions based on the provided website content and information. 
        Be concise, friendly, and informative. If you don't know the answer from the provided context, politely say so.`,
      generationConfig: { temperature, maxOutputTokens },
    });

    const result = await geminiModel.generateContent([
      { text: trimmedContext },
      { text: `User Question: ${userMessage}` },
    ]);
    return result.response.text();
  } catch (geminiError) {
    console.warn("Gemini failed, attempting fallback to Groq:", geminiError.message);

    if (!groq) {
      throw new Error("Both Gemini and Groq failed (Groq not configured)");
    }

    // --- Fallback: Groq (Llama) ---
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // active model
        messages: [
          {
            role: "system",
            content: systemPrompt ||
              "You are a helpful AI assistant for a website. Answer questions based on the provided context. Be concise, friendly, and informative. If you don't know, politely say so.",
          },
          { role: "user", content: `Context:\n${trimmedContext}\n\nQuestion: ${userMessage}` },
        ],
        temperature,
        max_tokens: maxOutputTokens,
      });
      return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (groqError) {
      console.error("Groq also failed:", groqError);
      throw new Error("AI response failed after both attempts.");
    }
  }
}

export async function generateQuickResponse(userMessage, botContext = "") {
  return generateResponse(
    userMessage,
    botContext,
    "You are a concise and helpful AI assistant. Answer briefly and directly."
  );
}