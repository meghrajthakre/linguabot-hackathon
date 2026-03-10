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

        const isPricing = /price|plan|cost|subscription/.test(lowerMsg);
        const isFAQ = /how|what|why|when|where/.test(lowerMsg);
        const isDocs = /documentation|api|integration|setup/.test(lowerMsg);

        // ============================
        // 📦 CONTEXT BUILDER
        // ============================

        let context = `
                Website Name: ${bot.name}
                Description: ${bot.description || "Not provided"}
                `;

                        if (isFAQ && bot.faqs?.length) {
                            context += `
                FAQs:
                ${bot.faqs
                                    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                                    .join("\n\n")}
                `;
                        }

                        if (isPricing && bot.pricing?.length) {
                            context += `
                Pricing:
                ${bot.pricing.map((p) => `${p.plan} - ${p.price}`).join("\n")}
                `;
                        }

                        if (isDocs && bot.docs) {
                            context += `
                Documentation:
                ${bot.docs}
                `;
        }

        // ============================
        // 🎯 SYSTEM PROMPT (Clean)
        // ============================

        const systemPrompt = `
            You are the official AI assistant for "${bot.name}".

            STRICT RULES:

            1. You MUST respond ONLY in this language: ${bot.language}.
            2. Use ONLY the provided website context.
            3. Maximum 3 short sentences.
            4. Be clear, helpful, and professional.
            5. If the answer is NOT found in context, respond EXACTLY with:
            "I will connect you with our support team."
            6. Do NOT hallucinate.
            7. Do NOT add extra information.
            8. Do NOT translate the website name.

            Respond naturally in ${bot.language}.
`;

        // ============================
        // 🤖 GEMINI CALL
        // ============================

        const aiResponse = await generateResponse(
            message,
            context,
            systemPrompt,
            {
                temperature: 0.2,
                maxOutputTokens: 150,
            }
        );

        const responseTimeMs = Date.now() - startTime;

        await Conversation.create({
            botId: bot._id,
            userMessage: message,
            aiMessage: aiResponse,
            responseTimeMs,
        });

        res.json({
            botId: bot._id,
            aiResponse,
            responseTimeMs,
        });

    } catch (err) {
        console.error("❌ AI ERROR:", err);
        res.status(500).json({ message: "AI response failed" });
    }
});

export default router;