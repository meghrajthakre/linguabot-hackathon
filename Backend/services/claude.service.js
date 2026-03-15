import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}
// Groq API key is optional – if missing, fallback will be skipped
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to truncate context (simple word count approximation)
function truncateToTokens(text, maxWords = 1500) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

// Build context from content chunks
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
 */
export async function generateResponse(
  userMessage,
  websiteContext = "",
  systemPrompt = "",
  contentChunks = []
) {
  const fullContext = buildContext(contentChunks, websiteContext);
  const trimmedContext = truncateToTokens(fullContext, 1500);

  // --- First attempt: Gemini ---
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // corrected model name
      systemInstruction: systemPrompt ||
        `You are a helpful AI assistant for a website. Answer questions based on the provided website content and information. 
        Be concise, friendly, and informative. If you don't know the answer from the provided context, politely say so.`,
      generationConfig: { temperature: 0.3, maxOutputTokens: 200 },
    });

    const result = await model.generateContent([
      { text: trimmedContext },
      { text: `User Question: ${userMessage}` },
    ]);
    return result.response.text();
  } catch (geminiError) {
    console.warn("Gemini failed, attempting fallback to Groq:", geminiError.message);

    // --- Fallback: Groq (Llama) ---
    if (!groq) {
      throw new Error("Both Gemini and Groq failed (Groq not configured)");
    }

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // updated model name (check Groq docs for latest)
        messages: [
          {
            role: "system",
            content: systemPrompt ||
              "You are a helpful AI assistant for a website. Answer questions based on the provided context. Be concise, friendly, and informative. If you don't know, politely say so.",
          },
          { role: "user", content: `Context:\n${trimmedContext}\n\nQuestion: ${userMessage}` },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });
      return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (groqError) {
      console.error("Groq also failed:", groqError);
      throw new Error("AI response failed after both attempts.");
    }
  }
}

/**
 * Quick response generator (simpler, uses Gemini only – but you can extend similar fallback)
 */
export async function generateQuickResponse(userMessage, botContext = "") {
  return generateResponse(
    userMessage,
    botContext,
    "You are a concise and helpful AI assistant. Answer briefly and directly."
  );
}