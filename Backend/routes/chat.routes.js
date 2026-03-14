import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Bot from "../models/Bot.model.js";
import Conversation from "../models/Conversation.model.js";
import { generateResponse } from "../services/claude.service.js";

const router = express.Router();

// ============================
// COMMON QUESTIONS BY INTENT
// ============================

const INTENT_PATTERNS = {
    // Shipping/Delivery - MOST COMMON (WISMO - Where Is My Order)
    shipping: {
        pattern: /ship|deliver|delivery|tracking|track|arrive|arrival|postage|expedited|overnight|express|how long|send|dispatch|sent|package/i,
        weight: 1.0,
        keywords: ["shipping", "delivery", "tracking", "order status", "postage", "arrive", "expect"]
    },
    // Returns/Refunds - VERY COMMON
    returns: {
        pattern: /return|refund|exchange|send back|money back|replace|damaged|broken|defective|warranty|not satisfied|quality|issue/i,
        weight: 1.0,
        keywords: ["return policy", "refund", "exchange", "damaged", "broken", "defect", "warranty"]
    },
    // Pricing/Payment - COMMON
    pricing: {
        pattern: /price|cost|plan|subscription|rate|payment|how much|expensive|discount|coupon|deal|billing|charge|cost|value/i,
        weight: 0.95,
        keywords: ["pricing", "cost", "plan", "payment", "discount", "subscription", "billing"]
    },
    // Account/Login - COMMON
    account: {
        pattern: /account|login|password|sign up|register|reset|profile|email|username|forgot|verify|two factor|2fa|security|logout/i,
        weight: 0.9,
        keywords: ["account", "login", "password", "reset", "sign up", "profile", "security"]
    },
    // Product Info/Features - COMMON
    product: {
        pattern: /product|feature|specification|spec|what is|include|compatible|size|color|available|model|version|capacity|material/i,
        weight: 0.85,
        keywords: ["product", "features", "specifications", "available", "size", "color", "compatibility"]
    },
    // Business Hours - MODERATELY COMMON
    hours: {
        pattern: /hours?|open|close|when|available|time|business|holiday|weekend|weekday|am|pm|24\/7|operating/i,
        weight: 0.8,
        keywords: ["hours", "open", "closed", "available", "time", "operating", "business hours"]
    },
    // Technical Issues - COMMON
    technical: {
        pattern: /error|bug|crash|slow|not working|broken|issue|problem|fail|glitch|loading|timeout|connection|sync|not responding/i,
        weight: 0.9,
        keywords: ["error", "bug", "technical", "not working", "problem", "crash", "issue"]
    },
    // Contact/Support - COMMON
    contact: {
        pattern: /contact|support|call|email|help|agent|speak|phone|reach|customer service|assistance|representative|live chat/i,
        weight: 0.75,
        keywords: ["contact", "support", "help", "email", "phone", "chat", "agent"]
    },
    // Appointment/Booking - SERVICE SPECIFIC
    appointment: {
        pattern: /appointment|book|booking|reschedule|cancel|time|slot|availability|schedule|reserve|date|when can|how to book/i,
        weight: 0.95,
        keywords: ["appointment", "booking", "schedule", "time", "date", "available", "reserve"]
    },
    // Order Status - VERY COMMON
    order_status: {
        pattern: /order|status|where is|track|when will|received|arrived|dispatched|processing|pending|confirmed/i,
        weight: 1.0,
        keywords: ["order", "status", "track", "when", "received", "where", "arrive"]
    },
};

// ============================
// DETECT INTENT WITH SCORING
// ============================

const detectIntent = (message) => {
    const lowerMsg = message.toLowerCase();
    let detectedIntent = "general";
    let maxScore = 0;

    Object.entries(INTENT_PATTERNS).forEach(([intent, { pattern, weight }]) => {
        const match = pattern.test(lowerMsg);
        if (match) {
            const score = weight;
            if (score > maxScore) {
                detectedIntent = intent;
                maxScore = score;
            }
        }
    });

    return detectedIntent;
};

// ============================
// BUILD CONTEXT BY INTENT
// ============================

const buildContextByIntent = (bot, intent, message) => {
    let context = `
=== BUSINESS INFORMATION ===
Name: ${bot.name}
Type: ${bot.businessType}
Industry: ${bot.industry}
Website: ${bot.websiteURL}
Language: ${bot.language}
Description: ${bot.description || "N/A"}

=== SUPPORT DETAILS ===
Email: ${bot.supportEmail || "N/A"}
Phone: ${bot.supportPhone || "N/A"}
Hours: ${bot.supportHours || "24/7 available"}

`;

    // Add context based on detected intent
    switch (intent) {
        case "shipping":
        case "order_status":
            context += `
=== SHIPPING & ORDER TRACKING ===
${bot.shippingStandard ? `Standard: ${bot.shippingStandard}` : ""}
${bot.shippingExpress ? `Express: ${bot.shippingExpress}` : ""}
${bot.shippingInternational ? `International: ${bot.shippingInternational}` : ""}

${bot.faqs
                    ?.filter((f) => f.category === "shipping")
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || "Customers can track orders on our website."
                }
`;
            break;

        case "returns":
            context += `
=== RETURNS & REFUNDS ===
Return Window: ${bot.returnDays} days
Refund Time: ${bot.refundDays} days

${bot.returnPolicy || ""}

${bot.faqs
                    ?.filter((f) => f.category === "returns")
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || "For return information, visit our website."
                }
`;
            break;

        case "pricing":
            context += `
=== PRICING & PLANS ===
${bot.pricing?.length > 0
                    ? bot.pricing.map((p) => `${p.plan}: ${p.price} (${p.features?.join(", ")})`).join("\n")
                    : "Pricing available on our website"
                }

${bot.freeTrial?.enabled
                    ? `Free Trial: ${bot.freeTrial.days} days`
                    : ""
                }

${bot.faqs
                    ?.filter((f) => f.category === "pricing")
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || ""
                }
`;
            break;

        case "account":
            context += `
=== ACCOUNT MANAGEMENT ===
${bot.faqs
                    ?.filter((f) => f.category === "account")
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || "Account help available on our website."
                }
`;
            break;

        case "product":
            context += `
=== PRODUCT INFORMATION ===
${bot.faqs
                    ?.filter((f) => f.category === "product")
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || "Product details available on our website."
                }
`;
            break;

        case "hours":
            context += `
=== BUSINESS HOURS ===
Business Hours: ${bot.businessHours || "24/7 online"}
Support Hours: ${bot.supportHours || "24/7"}
${bot.holidays ? `Holidays: ${bot.holidays}` : ""}
`;
            break;

        case "appointment":
            context += `
=== APPOINTMENT & SCHEDULING ===
Duration: ${bot.appointmentDuration ? `${bot.appointmentDuration} minutes` : "Variable"}
Hours: ${bot.businessHours || "Check website"}
${bot.cancellationPolicy ? `Cancellation: ${bot.cancellationPolicy}` : ""}

${bot.faqs
                    ?.filter((f) => f.category === "general")
                    ?.slice(0, 3)
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || ""
                }
`;
            break;

        case "technical":
            context += `
=== TECHNICAL SUPPORT ===
${bot.docs || "Technical documentation available on our website."}

${bot.faqs
                    ?.filter((f) => f.category === "technical")
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || ""
                }
`;
            break;

        case "contact":
            context += `
=== HOW TO CONTACT US ===
Email: ${bot.supportEmail || "Available on website"}
Phone: ${bot.supportPhone || "Available on website"}
Hours: ${bot.supportHours || "24/7"}
Website: ${bot.websiteURL}
`;
            break;

        default:
            // General - include top FAQs
            context += `
=== GENERAL INFORMATION ===
${bot.faqs
                    ?.slice(0, 5)
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || "More information available on our website."
                }
`;
    }

    // Add top content chunks
    if (bot.contentChunks?.length > 0) {
        const topChunks = bot.contentChunks
            .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
            .slice(0, 2);

        if (topChunks.length > 0) {
            context += `\n=== ADDITIONAL INFORMATION ===\n`;
            topChunks.forEach((chunk) => {
                context += `${chunk.content}\n`;
            });
        }
    }

    return context;
};

// ============================
// BUILD SYSTEM PROMPT
// ============================

const buildSystemPrompt = (bot, intent) => {
    return `You are the official AI customer support assistant for "${bot.name}" (${bot.websiteURL}).

=== CRITICAL RULES ===

1. **LANGUAGE**: Respond ONLY in ${bot.language}. Never switch languages.

2. **KNOWLEDGE BOUNDARIES**:
   - Use ONLY the provided information
   - Never invent facts, prices, or policies
   - Be honest if you don't have the answer
   - Direct to website or support team when needed

3. **RESPONSE QUALITY**:
   - Maximum 3 sentences per response
   - Lead with the direct answer
   - Add 1 supporting detail
   - Include actionable next step

4. **TONE**: ${bot.responseConfig?.tone || "professional"} yet helpful.

5. **SPECIFIC HANDLING BY QUESTION TYPE**:

   **Shipping/Order Tracking:**
   - Always provide specific timeframes
   - Offer tracking method
   - Mention alternative shipping if available
   - Example: "Standard shipping takes 3-5 business days. You can track your order using the link in your confirmation email."

   **Returns/Refunds:**
   - State policy clearly upfront
   - Mention time limits
   - Give clear next steps
   - Example: "We accept returns within 30 days. To start a return, log into your account > Orders > Select item > Request Return."

   **Pricing:**
   - Quote exact price upfront
   - Break down what's included
   - Mention any conditions
   - Example: "Professional plan is $99/month and includes 5 users, API access, and priority support."

   **Account Issues:**
   - Offer specific troubleshooting steps
   - Provide reset/recovery options
   - Escalate if basic steps don't work
   - Example: "Click 'Forgot Password' at login. Check your email for reset link (valid 24 hours)."

   **Technical Problems:**
   - Suggest clearing cache/cookies first
   - Try incognito/private mode
   - Check browser/app version
   - Escalate if issue persists

   **Appointments (Services):**
   - Provide availability options
   - Mention duration and cancellation policy
   - Confirm time clearly
   - Example: "We have openings Tuesday at 2 PM or Thursday at 10 AM. Sessions are 60 minutes. Cancellations require 24 hours notice."

   **Business Hours:**
   - State hours clearly
   - Mention any holidays/exceptions
   - Offer alternative contact method if closed
   - Example: "We're open Mon-Fri 9AM-6PM EST. For after-hours support, email us at ${bot.supportEmail}"

6. **WHEN YOU DON'T KNOW**:
   - Acknowledge the question
   - Say you don't have that information
   - Provide contact method
   - Offer to help with other topics

   Template: "I don't have specific details on that. Please contact our team at ${bot.supportEmail} or call ${bot.supportPhone || "the number on our website"} for personalized help."

7. **ESCALATION TRIGGERS**:
   Suggest contacting support for:
   - Complaints or frustrated customers
   - Account-specific issues
   - Financial disputes
   - Complex technical problems
   - Customization requests

8. **WEBSITE REFERENCES**:
   - Mention naturally when relevant
   - Include specific URLs when helpful
   - ✓ "See sizing guide at ${bot.websiteURL}/guides"
   - ✗ "For more info, visit our website"

9. **QUALITY CHECKLIST**:
   ☑ Answer is in the provided context?
   ☑ Answer is specific (includes numbers/times)?
   ☑ I avoided jargon?
   ☑ I gave a clear action step?
   ☑ Response is 4 sentences max?
   ☑ Tone matches brand voice?

Remember: Your goal is to help customers solve their problem quickly, while directing them to human support when needed.
`;
};

// ============================
// MAIN CONVERSATION ROUTE
// ============================

router.post("/:botId", authMiddleware, async (req, res) => {
    const startTime = Date.now();

    try {
        const { botId } = req.params;
        let { message } = req.body;

        // ============================
        // INPUT VALIDATION
        // ============================

        if (!message?.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_MESSAGE",
                message: "Message cannot be empty",
            });
        }

        if (message.length > 3000) {
            return res.status(400).json({
                success: false,
                error: "MESSAGE_TOO_LONG",
                message: "Message must be under 3000 characters",
            });
        }

        // ============================
        // FETCH BOT
        // ============================

        const bot = await Bot.findById(botId);
        if (!bot) {
            return res.status(404).json({
                success: false,
                error: "BOT_NOT_FOUND",
                message: "Bot not found",
            });
        }

        if (!bot.isActive) {
            return res.status(403).json({
                success: false,
                error: "BOT_INACTIVE",
                message: "This bot is currently inactive",
            });
        }

        message = message.trim();

        // ============================
        // DETECT INTENT
        // ============================

        const intent = detectIntent(message);

        // ============================
        // BUILD CONTEXT
        // ============================

        const context = buildContextByIntent(bot, intent, message);

        // ============================
        // BUILD SYSTEM PROMPT
        // ============================

        const systemPrompt = buildSystemPrompt(bot, intent);

        // ============================
        // GENERATE RESPONSE
        // ============================

        let aiResponse;
        try {
            aiResponse = await generateResponse(message, context, systemPrompt, {
                temperature: bot.responseConfig?.temperature || 0.3,
                maxOutputTokens: bot.responseConfig?.maxOutputTokens || 250,
            });
        } catch (apiErr) {
            console.error("Claude API Error:", apiErr);
            aiResponse = `I'm temporarily unable to respond. Please contact our team at ${bot.supportEmail || bot.websiteURL} or call ${bot.supportPhone || "the number on our website"}.`;
        }

        const responseTimeMs = Date.now() - startTime;

        // ============================
        // SAVE CONVERSATION
        // ============================

        try {
            await Conversation.create({
                botId: bot._id,
                userMessage: message,
                aiMessage: aiResponse,
                responseTimeMs,
                intent,
                metadata: {
                    businessType: bot.businessType,
                    messageLength: message.length,
                    responseLength: aiResponse.length,
                    hasActionStep: /\b(click|visit|email|call|check|log|go to|contact|reach|schedule|book)\b/i.test(
                        aiResponse
                    ),
                    mentionsWebsite: aiResponse.includes(bot.websiteURL),
                    mentionsContact: /email|phone|call|contact|reach/i.test(aiResponse),
                },
            });

            // Update bot analytics
            await Bot.updateOne(
                { _id: bot._id },
                {
                    $inc: { totalConversations: 1 },
                    lastActivityAt: new Date(),
                    averageResponseTime:
                        (bot.averageResponseTime * bot.totalConversations + responseTimeMs) /
                        (bot.totalConversations + 1),
                }
            );
        } catch (saveErr) {
            console.warn("Failed to save conversation:", saveErr);
            // Don't fail the response if conversation save fails
        }

        // ============================
        // RETURN RESPONSE
        // ============================

        res.json({
            success: true,
            botId: bot._id,
            botName: bot.name,
            businessType: bot.businessType,
            websiteURL: bot.websiteURL,
            aiResponse,
            intent,
            responseTimeMs,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Unexpected error:", err);

        res.status(500).json({
            success: false,
            error: "INTERNAL_ERROR",
            message: "An unexpected error occurred. Please try again.",
            timestamp: new Date().toISOString(),
        });
    }
});

// ============================
// GET CONVERSATION HISTORY
// ============================

router.get("/:botId/history", authMiddleware, async (req, res) => {
    try {
        const { botId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        // Verify bot ownership
        const bot = await Bot.findOne({
            _id: botId,
            owner: req.user.id,
        });

        if (!bot) {
            return res.status(404).json({
                success: false,
                message: "Bot not found",
            });
        }

        const conversations = await Conversation.find({ botId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Conversation.countDocuments({ botId });

        res.json({
            success: true,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip),
            conversations,
        });
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch conversation history",
        });
    }
});

export default router;