import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Bot from "../models/Bot.model.js";
import Conversation from "../models/Conversation.model.js";
import { generateResponse } from "../services/claude.service.js";

const router = express.Router();

router.post("/:botId", authMiddleware, async (req, res) => {
    const startTime = Date.now();

    try {
        const { botId } = req.params;
        let { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        if (message.length > 2000) {
            return res.status(400).json({ message: "Message too long" });
        }

        const bot = await Bot.findById(botId);
        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        message = message.trim();

        // ============================
        // 🧠 INTENT DETECTION
        // ============================

        const lowerMsg = message.toLowerCase();

        const isPricing = /price|plan|cost|subscription|billing|rates/.test(lowerMsg);
        const isFAQ = /how|what|why|when|where|who|which|can you|do you/.test(lowerMsg);
        const isDocs = /documentation|api|integration|setup|install|guide|tutorial/.test(lowerMsg);

        // ============================
        // 📦 ENHANCED CONTEXT BUILDER
        // ============================

        let context = `
            === WEBSITE INFORMATION ===
            Website Name: ${bot.name}
            Website URL: ${bot.websiteURL}
            Description: ${bot.description || "Not provided"}
            Language: ${bot.language}

            === INSTRUCTIONS ===
            - Use the website URL (${bot.websiteURL}) as the primary source of truth
            - Reference the website when providing answers
            - If detailed information is needed, suggest visiting the website
            - Include relevant website sections in your response
            `;

        // Add FAQ context if relevant
        if (isFAQ && bot.faqs?.length > 0) {
            context += `
            === FREQUENTLY ASKED QUESTIONS ===
            ${bot.faqs
                    .map((f, idx) => `Q${idx + 1}: ${f.question}\nA: ${f.answer}`)
                    .join("\n\n")}
            `;
        }

        // Add Pricing context if relevant
        if (isPricing && bot.pricing?.length > 0) {
            context += `
                === PRICING INFORMATION ===
                For detailed pricing, visit: ${bot.websiteURL}

                Plans Available:
                ${bot.pricing
                    .map((p) => `• ${p.plan}: ${p.price}`)
                    .join("\n")}
`;
        }

        // Add Documentation context if relevant
        if (isDocs && bot.docs) {
            context += `
                === DOCUMENTATION ===
                ${bot.docs}

                For complete documentation, visit: ${bot.websiteURL}
                `;
        }

        // Add content chunks if available
        if (bot.contentChunks?.length > 0) {
            context += `
                === WEBSITE CONTENT ===
                ${bot.contentChunks
                    .slice(0, 3) // Limit to 3 most relevant chunks
                    .map((chunk) => chunk.content || chunk)
                    .join("\n\n")}
`;
        }

        // ============================
        // 🎯 ENHANCED SYSTEM PROMPT
        // ============================

        const systemPrompt = `
                You are the official AI customer support assistant for "${bot.name}" (${bot.websiteURL}).

                CRITICAL RULES:

                1. **LANGUAGE**: Respond ONLY in ${bot.language}. Never use any other language.

                2. **CONTEXT USAGE**: 
                - Use ONLY the provided knowledge base (FAQs, pricing, docs, content chunks)
                - Reference the website URL when providing information
                - When answering, mention relevant sections from the website
                
                3. **RESPONSE FORMAT**:
                - Keep responses to 2-3 clear sentences maximum
                - Be helpful, professional, and direct
                - Use simple language
                
                4. **WEBSITE REFERENCE**:
                - Always mention: "For more details, visit: ${bot.websiteURL}"
                - For specific topics, suggest: "You can find this on our ${bot.name} website at ${bot.websiteURL}"
                
                5. **OUT OF SCOPE**:
                - If the answer is NOT found in the provided context, respond EXACTLY with:
                "I don't have information about that. Please visit our website at ${bot.websiteURL} or contact our support team."
                - Do NOT make up information
                - Do NOT provide information beyond the context
                - Do NOT translate the company/website name
                
                6. **TONE**: Professional, helpful, and friendly.

                Remember: Your role is to direct customers to the website (${bot.websiteURL}) when needed.
                `;

        // ============================
        // 🤖 GENERATE RESPONSE
        // ============================

        const aiResponse = await generateResponse(
            message,
            context,
            systemPrompt,
            {
                temperature: 0.2,
                maxOutputTokens: 200,
            }
        );

        const responseTimeMs = Date.now() - startTime;

        // ============================
        // 💾 SAVE CONVERSATION
        // ============================

        await Conversation.create({
            botId: bot._id,
            userMessage: message,
            aiMessage: aiResponse,
            responseTimeMs,
            intent: isPricing ? "pricing" : isFAQ ? "faq" : isDocs ? "docs" : "general",
        });

        res.json({
            botId: bot._id,
            botName: bot.name,
            websiteURL: bot.websiteURL,
            aiResponse,
            responseTimeMs,
        });

    } catch (err) {
        console.error("❌ AI ERROR:", err);
        res.status(500).json({ message: "AI response failed" });
    }
});

export default router;