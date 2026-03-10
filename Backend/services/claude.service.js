import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple sleep for retry
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateResponse(
  userMessage,
  websiteContext = "",
  systemPrompt = ""
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 150,
      },
    });

    const trimmedContext = websiteContext.slice(0, 3000);

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