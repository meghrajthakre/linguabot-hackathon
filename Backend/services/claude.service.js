import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate response using Gemini with website/bot context
 * @param {string} userMessage - User's question
 * @param {string} websiteContext - Content from website or bot data
 * @param {string} systemPrompt - Custom system prompt for the bot
 * @param {Array} contentChunks - Array of content chunks (FAQs, pricing, docs, website)
 * @returns {Promise<string>} - AI-generated response
 */
export async function generateResponse(
  userMessage,
  websiteContext = "",
  systemPrompt = "",
  contentChunks = []
) {
  try {
    // Build comprehensive context from all sources
    let fullContext = "";

    // Add content chunks in priority order
    if (contentChunks && contentChunks.length > 0) {
      const faqContent = contentChunks
        .filter((c) => c.type === "faq")
        .map((c) => c.text)
        .join("\n");

      const pricingContent = contentChunks
        .filter((c) => c.type === "pricing")
        .map((c) => c.text)
        .join("\n");

      const docContent = contentChunks
        .filter((c) => c.type === "doc")
        .map((c) => c.text)
        .join("\n");

      const websiteContent = contentChunks
        .filter((c) => c.type === "website")
        .map((c) => c.text)
        .join("\n");

      fullContext = `
          === FREQUENTLY ASKED QUESTIONS ===
          ${faqContent || "No FAQs provided"}

          === PRICING INFORMATION ===
          ${pricingContent || "No pricing information provided"}

          === DOCUMENTATION ===
          ${docContent || "No documentation provided"}

          === WEBSITE INFORMATION ===
          ${websiteContent || "No website information provided"}

          === ADDITIONAL CONTEXT ===
          ${websiteContext || "No additional context"}
          `;
    } else {
      fullContext = websiteContext;
    }

    // Trim context to avoid token limits
    const trimmedContext = fullContext.slice(0, 4000);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        systemPrompt ||
        `You are a helpful AI assistant for a website. Answer questions based on the provided website content and information. 
        Be concise, friendly, and informative. If you don't know the answer from the provided context, politely say so.`,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    const requestPayload = [
      { text: trimmedContext },
      { text: `User Question: ${userMessage}` },
    ];

    let retries = 2;

    while (retries >= 0) {
      try {
        const result = await model.generateContent(requestPayload);
        return result.response.text();
      } catch (err) {
        // Handle rate limit (429)
        if (err.status === 429 && retries > 0) {
          console.warn("⚠ Rate limit hit. Retrying in 5s...");
          await sleep(5000);
          retries--;
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error("Gemini Error:", error?.message || error);
    throw new Error("AI response failed");
  }
}

/**
 * Quick response generator for simple queries
 * @param {string} userMessage - User's question
 * @param {string} botContext - Bot information/context
 * @returns {Promise<string>} - AI-generated response
 */
export async function generateQuickResponse(
  userMessage,
  botContext = ""
) {
  return generateResponse(
    userMessage,
    botContext,
    "You are a concise and helpful AI assistant. Answer briefly and directly."
  );
}