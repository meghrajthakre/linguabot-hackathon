import express from "express";
import publicAuth from "../middleware/publicAuth.js";
import Bot from "../models/Bot.model.js";
import Conversation from "../models/Conversation.model.js";
import { generateResponse } from "../services/claude.service.js"; // or gemini
import { translateText } from "../services/lingo.service.js"; 

const router = express.Router();

// ============================
// INTENT PATTERNS (copied from conversation route)
// ============================
const INTENT_PATTERNS = {
    shipping: {
        pattern:
            /ship|deliver|delivery|tracking|track|arrive|arrival|postage|expedited|overnight|express|how long|send|dispatch|sent|package/i,
        weight: 1.0,
        keywords: [
            "shipping",
            "delivery",
            "tracking",
            "order status",
            "postage",
            "arrive",
            "expect",
        ],
    },
    returns: {
        pattern:
            /return|refund|exchange|send back|money back|replace|damaged|broken|defective|warranty|not satisfied|quality|issue/i,
        weight: 1.0,
        keywords: [
            "return policy",
            "refund",
            "exchange",
            "damaged",
            "broken",
            "defect",
            "warranty",
        ],
    },
    pricing: {
        pattern:
            /price|cost|plan|subscription|rate|payment|how much|expensive|discount|coupon|deal|billing|charge|cost|value/i,
        weight: 0.95,
        keywords: [
            "pricing",
            "cost",
            "plan",
            "payment",
            "discount",
            "subscription",
            "billing",
        ],
    },
    account: {
        pattern:
            /account|login|password|sign up|register|reset|profile|email|username|forgot|verify|two factor|2fa|security|logout/i,
        weight: 0.9,
        keywords: [
            "account",
            "login",
            "password",
            "reset",
            "sign up",
            "profile",
            "security",
        ],
    },
    product: {
        pattern:
            /product|feature|specification|spec|what is|include|compatible|size|color|available|model|version|capacity|material/i,
        weight: 0.85,
        keywords: [
            "product",
            "features",
            "specifications",
            "available",
            "size",
            "color",
            "compatibility",
        ],
    },
    hours: {
        pattern:
            /hours?|open|close|when|available|time|business|holiday|weekend|weekday|am|pm|24\/7|operating/i,
        weight: 0.8,
        keywords: [
            "hours",
            "open",
            "closed",
            "available",
            "time",
            "operating",
            "business hours",
        ],
    },
    technical: {
        pattern:
            /error|bug|crash|slow|not working|broken|issue|problem|fail|glitch|loading|timeout|connection|sync|not responding/i,
        weight: 0.9,
        keywords: [
            "error",
            "bug",
            "technical",
            "not working",
            "problem",
            "crash",
            "issue",
        ],
    },
    contact: {
        pattern:
            /contact|support|call|email|help|agent|speak|phone|reach|customer service|assistance|representative|live chat/i,
        weight: 0.75,
        keywords: ["contact", "support", "help", "email", "phone", "chat", "agent"],
    },
    appointment: {
        pattern:
            /appointment|book|booking|reschedule|cancel|time|slot|availability|schedule|reserve|date|when can|how to book/i,
        weight: 0.95,
        keywords: [
            "appointment",
            "booking",
            "schedule",
            "time",
            "date",
            "available",
            "reserve",
        ],
    },
    order_status: {
        pattern:
            /order|status|where is|track|when will|received|arrived|dispatched|processing|pending|confirmed/i,
        weight: 1.0,
        keywords: [
            "order",
            "status",
            "track",
            "when",
            "received",
            "where",
            "arrive",
        ],
    },
};

// ============================
// LANGUAGE MAPPING & INSTRUCTIONS
// ============================
const LANGUAGE_MAP = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ja: "Japanese",
    zh: "Chinese",
    ko: "Korean",
    th: "Thai",
    vi: "Vietnamese",
    id: "Indonesian",
    ar: "Arabic",
    hi: "Hindi",
    bn: "Bengali",
    ur: "Urdu",
    ru: "Russian",
    uk: "Ukrainian",
    pl: "Polish",
    cs: "Czech",
    hu: "Hungarian",
    ro: "Romanian",
    sr: "Serbian",
    hr: "Croatian",
    sl: "Slovenian",
    sk: "Slovak",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    nl: "Dutch",
    el: "Greek",
    tr: "Turkish",
    ms: "Malay",
    fil: "Filipino",
    my: "Burmese",
    sw: "Swahili",
    af: "Afrikaans",
    he: "Hebrew",
    fa: "Persian",
};

const LANGUAGE_INSTRUCTIONS = {
    en: "You MUST respond ONLY in English. Every single word must be in English.",
    es: "Debes responder ÚNICAMENTE en español. Cada palabra debe estar en español.",
    fr: "Vous DEVEZ répondre UNIQUEMENT en français. Chaque mot doit être en français.",
    de: "Sie MÜSSEN ausschließlich auf Deutsch antworten. Jedes Wort muss auf Deutsch sein.",
    it: "Devi rispondere SOLO in italiano. Ogni parola deve essere in italiano.",
    pt: "Você DEVE responder APENAS em português. Cada palavra deve estar em português.",
    ja: "日本語ONLY で回答してください。すべての単語が日本語である必要があります。",
    zh: "您必须仅用中文回答。每个单词都必须用中文。",
    ko: "한국어로만 답변해야 합니다. 모든 단어가 한국어여야 합니다.",
    th: "คุณต้องตอบเป็นภาษาไทยเท่านั้น ทุกคำต้องเป็นภาษาไทย",
    vi: "Bạn PHẢI trả lời CHỈ bằng tiếng Việt. Mỗi từ phải bằng tiếng Việt.",
    id: "Anda HARUS menjawab HANYA dalam bahasa Indonesia. Setiap kata harus dalam bahasa Indonesia.",
    ar: "يجب عليك الرد باللغة العربية فقط. كل كلمة يجب أن تكون باللغة العربية.",
    hi: "आपको केवल हिंदी में उत्तर देना चाहिए। प्रत्येक शब्द हिंदी में होना चाहिए।",
    bn: "আপনাকে শুধুমাত্র বাংলায় উত্তর দিতে হবে। প্রতিটি শব্দ বাংলায় হতে হবে।",
    ur: "آپ کو صرف اردو میں جواب دینا چاہیے۔ ہر لفظ اردو میں ہونا چاہیے۔",
    ru: "Вы ДОЛЖНЫ отвечать ТОЛЬКО на русском языке. Каждое слово должно быть на русском.",
    uk: "Ви ПОВИННІ відповідати ЛИШЕ українською мовою. Кожне слово має бути українською.",
    pl: "Musisz odpowiadać TYLKO w języku polskim. Każde słowo musi być po polsku.",
    cs: "Musíte odpovídat POUZE v češtině. Každé slovo musí být v češtině.",
    hu: "Csak magyarul kell válaszolnia. Minden szónak magyarnak kell lennie.",
    ro: "Trebuie să răspunzi DOAR în limba română. Fiecare cuvânt trebuie să fie în limba română.",
    sr: "Морате одговорити САМО на српском језику. Свака реч мора бити на српском.",
    hr: "Morate odgovoriti SAMO na hrvatskom jeziku. Svaka riječ mora biti na hrvatskom.",
    sl: "Odgovoriти moraš SAMO v slovenščini. Vsaka beseda mora biti v slovenščini.",
    sk: "Musíš odpovedať LEN po slovensky. Každé slovo musí byť po slovensky.",
    sv: "Du MÅSTE svara ENDAST på svenska. Varje ord måste vara på svenska.",
    no: "Du MÅ svare KUN på norsk. Hvert ord må være på norsk.",
    da: "Du SKAL svare KUN på dansk. Hvert ord skal være på dansk.",
    fi: "Sinun on vastattava VAIN suomeksi. Jokaisen sanan on oltava suomeksi.",
    nl: "Je MOET alleen in het Nederlands antwoorden. Elk woord moet Nederlands zijn.",
    el: "Πρέπει να απαντήσεις ΜΟΝΟ στα ελληνικά. Κάθε λέξη πρέπει να είναι στα ελληνικά.",
    tr: "Sadece Türkçe cevap vermelisin. Her kelime Türkçe olmalıdır.",
    ms: "Anda MESTI menjawab HANYA dalam bahasa Melayu. Setiap kata mesti dalam bahasa Melayu.",
    fil: "Dapat mo lamang sagutin sa Filipino. Ang bawat salita ay dapat sa Filipino.",
    my: "သင်သည် ဗမာဘာသာစကားဖြင့်သာ ဖြေကြားရမည်။ ကောက်ကြောင်းတစ်ခုစီ ဗမာဘာသာဖြင့် ရှိရမည်။",
    sw: "Lazima ujibu KWA LUGHA YA KISWAHILI TU. Kila neno lazima liwe kwa Kiswahili.",
    af: "Jy MOET slegs in Afrikaans antwoord. Elke woord moet in Afrikaans wees.",
    he: "אתה חייב להשיב רק בעברית. כל מילה חייבת להיות בעברית.",
    fa: "شما باید فقط به فارسی پاسخ دهید. هر کلمه باید فارسی باشد.",
};

// ============================
// UTILITY FUNCTIONS
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

const buildContextByIntent = (bot, intent) => {
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
                    ? bot.pricing
                        .map((p) => `${p.plan}: ${p.price} (${p.features?.join(", ")})`)
                        .join("\n")
                    : "Pricing available on our website"
                }

      ${bot.freeTrial?.enabled ? `Free Trial: ${bot.freeTrial.days} days` : ""}

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
            context += `
        === GENERAL INFORMATION ===
        ${bot.faqs
                    ?.slice(0, 5)
                    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
                    ?.join("\n\n") || "More information available on our website."
                }
`;
    }

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

const buildSystemPrompt = (bot, intent) => {
    return `You are the official AI customer support assistant for "${bot.name}" (${bot.websiteURL}).

    === ⚠️ IMPORTANT INSTRUCTION ===
    You MUST respond in ENGLISH, regardless of the user's language.
    Your response will be translated automatically to the user's language.

    === RESPONSE RULES ===

1. **KNOWLEDGE BOUNDARIES**:
   - Use ONLY the provided information
   - Never invent facts, prices, or policies
   - Be honest if you don't have the answer
   - Direct to website or support team when needed

2. **RESPONSE QUALITY**:
   - Maximum 3 sentences per response
   - Lead with the direct answer
   - Add 1 supporting detail
   - Include actionable next step

3. **TONE**: ${bot.responseConfig?.tone || "professional"} yet helpful.

4. **SPECIFIC HANDLING BY QUESTION TYPE**:

   **Shipping/Order Tracking:**
   - Always provide specific timeframes
   - Offer tracking method
   - Mention alternative shipping if available

   **Returns/Refunds:**
   - State policy clearly upfront
   - Mention time limits
   - Give clear next steps

   **Pricing:**
   - Quote exact price upfront
   - Break down what's included
   - Mention any conditions

   **Account Issues:**
   - Offer specific troubleshooting steps
   - Provide reset/recovery options
   - Escalate if basic steps don't work

   **Technical Problems:**
   - Suggest clearing cache/cookies first
   - Try incognito/private mode
   - Check browser/app version

   **Appointments (Services):**
   - Provide availability options
   - Mention duration and cancellation policy
   - Confirm time clearly

   **Business Hours:**
   - State hours clearly
   - Mention any holidays/exceptions
   - Offer alternative contact method if closed

5. **WHEN YOU DON'T KNOW**:
   - Acknowledge the question
   - Say you don't have that information
   - Provide contact method: ${bot.supportEmail || bot.websiteURL}
   - Offer to help with other topics

6. **ESCALATION TRIGGERS**:
   Suggest contacting support for:
   - Complaints or frustrated customers
   - Account-specific issues
   - Financial disputes
   - Complex technical problems
   - Customization requests

7. **WEBSITE REFERENCES**:
   - Mention naturally when relevant
   - Include specific URLs when helpful
   - ✓ "See sizing guide at ${bot.websiteURL}/guides"
   - ✗ "For more info, visit our website"

8. **FINAL QUALITY CHECKLIST**:
   ☑ Answer is in provided context?
   ☑ Answer is specific?
   ☑ I avoided jargon?
   ☑ Clear action step included?
   ☑ Response is 4 sentences max?
   ☑ Tone matches brand?

    REMINDER: Your response MUST be in ENGLISH.`;
};

const sanitizeInput = (message) => {
    if (!message || typeof message !== "string") return null;
    const trimmed = message.trim();
    if (trimmed.length < 1) return null;
    if (trimmed.length > 3000) return trimmed.substring(0, 3000);
    return trimmed;
};

// ============================
// MAIN PUBLIC ENDPOINT
// ============================

router.post("/", publicAuth, async (req, res) => {
    const startTime = Date.now();

    try {
        const bot = req.bot;
        let { message, language: userLanguage } = req.body;

        console.log(`[Public] Received message: "${message}" with user language: ${userLanguage}`);

        // Input validation
        const sanitizedMessage = sanitizeInput(message);
        if (!sanitizedMessage) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_MESSAGE",
                message: "Message cannot be empty",
            });
        }

        // Validate user language if provided
        if (userLanguage && !LANGUAGE_MAP[userLanguage]) {
            console.error(`Invalid language code received: ${userLanguage}`);
            return res.status(400).json({
                success: false,
                error: "INVALID_LANGUAGE",
                message: `Invalid language code: ${userLanguage}. Supported: ${Object.keys(LANGUAGE_MAP).join(", ")}`,
            });
        }

        // Detect intent
        const intent = detectIntent(sanitizedMessage);
        console.log(`[Public] Detected intent: ${intent}`);

        // Build context
        const context = buildContextByIntent(bot, intent);

        // Build system prompt – ALWAYS in English
        const systemPrompt = buildSystemPrompt(bot, intent);

        // Generate AI response (in English)
        let aiResponse;
        try {
            aiResponse = await generateResponse(sanitizedMessage, context, systemPrompt, {
                temperature: bot.responseConfig?.temperature || 0.3,
                maxOutputTokens: bot.responseConfig?.maxOutputTokens || 250,
            });
        } catch (apiErr) {
            console.error("Claude API Error:", apiErr);
            aiResponse = `I'm temporarily unable to respond. Please contact our team at ${bot.supportEmail || bot.websiteURL} or call ${bot.supportPhone || "the number on our website"}.`;
        }

        // ============================
        // TRANSLATE RESPONSE IF NEEDED
        // ============================
        let finalResponse = aiResponse;
        let responseLanguage = "en"; // source is English

        if (userLanguage && userLanguage !== "en") {
            try {
                // Translate from English to user's language
                finalResponse = await translateText(aiResponse, "en", userLanguage);
                responseLanguage = userLanguage;
                console.log(`[Public] Translated response from English to ${userLanguage}`);
            } catch (transErr) {
                console.error("Translation failed, using English response:", transErr);
                // fallback to original English
                finalResponse = aiResponse;
                responseLanguage = "en";
            }
        }

        const responseTimeMs = Date.now() - startTime;

        // Save conversation
        try {
            await Conversation.create({
                botId: bot._id,
                userMessage: sanitizedMessage,
                aiMessage: finalResponse,            // what user sees (translated or English)
                originalAiMessage: aiResponse,       // store original English for analytics
                responseTimeMs,
                intent,
                language: responseLanguage,           // language of displayed response
                metadata: {
                    businessType: bot.businessType,
                    messageLength: sanitizedMessage.length,
                    responseLength: finalResponse.length,
                    wasTranslated: responseLanguage !== "en",
                    hasActionStep:
                        /\b(click|visit|email|call|check|log|go to|contact|reach|schedule|book)\b/i.test(finalResponse),
                    mentionsWebsite: finalResponse.includes(bot.websiteURL),
                    mentionsContact: /email|phone|call|contact|reach/i.test(finalResponse),
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
        }

        // Return final response
        res.json({
            success: true,
            botId: bot._id,
            botName: bot.name,
            businessType: bot.businessType,
            websiteURL: bot.websiteURL,
            aiResponse: finalResponse,
            intent,
            responseLanguage,
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
export default router;