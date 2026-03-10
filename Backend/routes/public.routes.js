import express from "express";
import publicAuth from "../middleware/publicAuth.js";
import Conversation from "../models/Conversation.model.js";
import { generateResponse } from "../services/claude.service.js"; // Changed from claude to gemini

const router = express.Router();

/**
 * Build optimized system prompt for Gemini AI
 */
function buildSystemPrompt(bot) {
    const { name, description, language, tone = "professional", customInstructions = "" } = bot;

    return `You are a helpful AI assistant for "${name}".

CORE INSTRUCTIONS:
- Respond ONLY in ${language} language
- Keep responses concise: maximum 3 short sentences
- Maintain a ${tone} and friendly tone
- Answer based ONLY on the context provided below
- Do NOT make up information or speculate
- Do NOT provide information outside your knowledge base

CONTEXT ABOUT THE BUSINESS:
Business Name: ${name}
Description: ${description || "No description provided"}
${customInstructions ? `\nAdditional Guidelines: ${customInstructions}` : ""}

RESPONSE GUIDELINES:
1. If you can answer from the context: Provide a direct, helpful answer
2. If the question is unclear: Ask for clarification politely
3. If information is NOT in your context: Respond with: "I don't have that information. I'll connect you with our support team."
4. Never discuss competitor information or unrelated topics
5. Always be respectful and professional

IMPORTANT EDGE CASES:
- Empty/whitespace messages: Acknowledge and ask what you can help with
- Spam or inappropriate content: Politely decline and redirect
- Off-topic requests: Acknowledge, then redirect to support team
- Personal data requests: Never share or request sensitive information`;
}

/**
 * Sanitize and validate user input
 */
function sanitizeInput(message) {
    if (!message || typeof message !== "string") {
        return null;
    }

    const trimmed = message.trim();

    // Check minimum length
    if (trimmed.length < 1) return null;

    // Check maximum length (prevent abuse)
    if (trimmed.length > 2000) {
        return trimmed.substring(0, 2000);
    }

    return trimmed;
}

/**
 * Build context from bot knowledge base
 */
function buildContext(bot) {
    const contextParts = [];

    // Add FAQ if available
    if (bot.faq && Array.isArray(bot.faq) && bot.faq.length > 0) {
        contextParts.push("FREQUENTLY ASKED QUESTIONS:");
        bot.faq.forEach((item, idx) => {
            contextParts.push(`Q${idx + 1}: ${item.question}`);
            contextParts.push(`A${idx + 1}: ${item.answer}`);
        });
    }

    // Add services/products
    if (bot.services && Array.isArray(bot.services) && bot.services.length > 0) {
        contextParts.push("\nSERVICES/PRODUCTS:");
        bot.services.forEach((service) => {
            contextParts.push(`- ${service.name}: ${service.description}`);
        });
    }

    // Add operating hours
    if (bot.operatingHours) {
        contextParts.push(`\nOPERATING HOURS: ${bot.operatingHours}`);
    }

    // Add contact info
    if (bot.contactEmail || bot.contactPhone) {
        contextParts.push("\nCONTACT INFORMATION:");
        if (bot.contactEmail) contextParts.push(`Email: ${bot.contactEmail}`);
        if (bot.contactPhone) contextParts.push(`Phone: ${bot.contactPhone}`);
    }

    return contextParts.length > 0 ? contextParts.join("\n") : "No additional context available.";
}

/**
 * Main conversation endpoint
 */
router.post("/", publicAuth, async (req, res) => {
    try {
        const { message } = req.body;
        const bot = req.bot;

        // Validate bot exists
        if (!bot || !bot._id) {
            return res.status(400).json({ 
                success: false,
                message: "Bot configuration missing" 
            });
        }

        // Sanitize and validate input
        const sanitizedMessage = sanitizeInput(message);
        if (!sanitizedMessage) {
            return res.status(400).json({ 
                success: false,
                message: "Message cannot be empty" 
            });
        }

        // Build enhanced prompt and context
        const systemPrompt = buildSystemPrompt(bot);
        const contextData = buildContext(bot);
        const fullContext = `${systemPrompt}\n\n${contextData}`;

        // Generate AI response with timeout
        let aiResponse;
        try {
            aiResponse = await Promise.race([
                generateResponse(sanitizedMessage, fullContext),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Response timeout")), 10000)
                ),
            ]);
        } catch (timeoutErr) {
            console.error("AI generation timeout:", timeoutErr);
            return res.status(503).json({
                success: false,
                message: "AI service is taking too long. Please try again.",
            });
        }

        // Validate AI response
        if (!aiResponse || typeof aiResponse !== "string") {
            console.error("Invalid AI response format:", aiResponse);
            return res.status(500).json({
                success: false,
                message: "Failed to generate response",
            });
        }

        // Ensure response respects language setting
        const finalResponse = aiResponse.trim();

        // Save conversation (non-blocking)
        try {
            await Conversation.create({
                botId: bot._id,
                userMessage: sanitizedMessage,
                aiMessage: finalResponse,
                language: bot.language,
                timestamp: new Date(),
            });
        } catch (dbErr) {
            console.error("Failed to save conversation:", dbErr);
            // Don't fail the response if logging fails
        }

        res.json({
            success: true,
            aiResponse: finalResponse,
        });

    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
        });
    }
});

export default router;