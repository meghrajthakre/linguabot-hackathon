import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Bot from "../models/Bot.model.js";
import { generatePublicKey } from "../utils/generatePublicKey.js";

const router = express.Router();

// Helper: Validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return /^https?:\/\/.+/.test(url);
  } catch {
    return false;
  }
};

// Helper: Validate Email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ============================
// CREATE BOT
// ============================

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      name,
      description,
      language,
      businessType,
      industry,
      websiteURL,
      supportEmail,
      supportPhone,
      supportHours,
      businessHours,
      holidays,
      faqs = [],
      pricing = [],
      docs = "",
      allowedDomains = [],
      // Shipping info (e-commerce)
      shippingStandard,
      shippingExpress,
      shippingInternational,
      // Returns
      returnDays,
      refundDays,
      returnPolicy,
      // Free Trial (SaaS)
      freeTrial,
      // Service info
      appointmentDuration,
      cancellationPolicy,
      // Response config
      responseConfig,
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!name || !language || !businessType || !industry || !websiteURL) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, language, businessType, industry, websiteURL",
      });
    }

    if (!isValidUrl(websiteURL)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website URL format",
      });
    }

    if (supportEmail && !isValidEmail(supportEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid support email format",
      });
    }

    const validBusinessTypes = [
      "ecommerce",
      "saas",
      "service",
      "restaurant",
      "healthcare",
      "education",
      "real_estate",
      "finance",
      "technology",
      "other"
    ];

    if (!validBusinessTypes.includes(businessType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid businessType. Must be one of: ${validBusinessTypes.join(", ")}`,
      });
    }

    // ============================
    // BUILD CONTENT CHUNKS
    // ============================

    const contentChunks = [
      // FAQs
      ...faqs.map((f) => ({
        type: f.category || "faq",
        content: `Q: ${f.question}\nA: ${f.answer}`,
        relevanceScore: f.priority ? Math.min(f.priority / 10, 1) : 0.5,
      })),
      // Pricing
      ...pricing.map((p) => ({
        type: "pricing",
        content: `${p.plan}: ${p.price} - ${p.features?.join(", ")}`,
        relevanceScore: 0.7,
      })),
      // Documentation
      ...(docs
        ? [
          {
            type: "documentation",
            content: docs,
            relevanceScore: 0.8,
          },
        ]
        : []),
      // Shipping Info
      ...(shippingStandard || shippingExpress || shippingInternational
        ? [
          {
            type: "shipping",
            content: `Standard: ${shippingStandard || "Not specified"}\nExpress: ${shippingExpress || "Not specified"}\nInternational: ${shippingInternational || "Not specified"}`,
            relevanceScore: 0.85,
          },
        ]
        : []),
      // Return Policy
      ...(returnPolicy
        ? [
          {
            type: "returns",
            content: returnPolicy,
            relevanceScore: 0.85,
          },
        ]
        : []),
      // Business Hours
      ...(businessHours || supportHours
        ? [
          {
            type: "hours",
            content: `Business Hours: ${businessHours || "Available 24/7"}\nSupport Hours: ${supportHours || "24/7 support"}`,
            relevanceScore: 0.75,
          },
        ]
        : []),
      // Contact
      ...(supportEmail || supportPhone
        ? [
          {
            type: "contact",
            content: `Email: ${supportEmail || "Not provided"}\nPhone: ${supportPhone || "Not provided"}`,
            relevanceScore: 0.8,
          },
        ]
        : []),
    ];

    // ============================
    // CREATE BOT
    // ============================

    const bot = await Bot.create({
      name,
      description,
      language,
      businessType,
      industry,
      websiteURL,
      supportEmail,
      supportPhone,
      supportHours,
      businessHours,
      holidays,
      faqs,
      pricing,
      docs,
      contentChunks,
      owner: req.user.id,
      publicKey: generatePublicKey(),
      allowedDomains,
      // Additional fields based on business type
      ...(businessType === "ecommerce" && {
        shippingStandard,
        shippingExpress,
        shippingInternational,
        returnDays: returnDays || 30,
        refundDays: refundDays || 5,
        returnPolicy,
      }),
      ...(businessType === "saas" && {
        freeTrial: freeTrial || { enabled: false, days: 14 },
      }),
      ...(businessType === "service" && {
        appointmentDuration,
        cancellationPolicy,
      }),
      // Response configuration
      responseConfig: responseConfig || {
        temperature: 0.3,
        maxOutputTokens: 250,
        language,
        tone: "professional",
      },
    });

    res.status(201).json({
      success: true,
      message: "Bot created successfully",
      bot: {
        _id: bot._id,
        name: bot.name,
        businessType: bot.businessType,
        publicKey: bot.publicKey,
        websiteURL: bot.websiteURL,
        embedCode: `
        <script>
          window.LinguaBotConfig = {
            publicKey: "${bot.publicKey}",
            botName: "${bot.name}",
            businessType: "${bot.businessType}"
          };
        </script>
        <script src="http://localhost:4000/widget.js"><\/script>
      `.trim(),
      }

    });
  } catch (err) {
    next(err);
  }
});

// ============================
// GET ALL USER BOTS
// ============================

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { businessType, isActive } = req.query;

    // Build filter
    const filter = { owner: req.user.id };
    if (businessType) filter.businessType = businessType;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const bots = await Bot.find(filter)
      .select("-contentChunks -docs") // Exclude heavy fields
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bots.length,
      bots,
    });
  } catch (err) {
    next(err);
  }
});

// ============================
// GET SINGLE BOT
// ============================

router.get("/:botId", authMiddleware, async (req, res, next) => {
  try {
    const bot = await Bot.findOne({
      _id: req.params.botId,
      owner: req.user.id,
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        message: "Bot not found",
      });
    }

    res.json({
      success: true,
      bot,
    });
  } catch (err) {
    next(err);
  }
});

// ============================
// UPDATE BOT
// ============================

router.put("/:botId", authMiddleware, async (req, res, next) => {
  try {
    const bot = await Bot.findOne({
      _id: req.params.botId,
      owner: req.user.id,
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        message: "Bot not found",
      });
    }

    const {
      name,
      description,
      language,
      industry,
      websiteURL,
      supportEmail,
      supportPhone,
      supportHours,
      businessHours,
      faqs = [],
      pricing = [],
      docs = "",
      shippingStandard,
      shippingExpress,
      shippingInternational,
      returnDays,
      refundDays,
      returnPolicy,
      appointmentDuration,
      cancellationPolicy,
      responseConfig,
    } = req.body;

    // Validate URLs
    if (websiteURL && !isValidUrl(websiteURL)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website URL format",
      });
    }

    if (supportEmail && !isValidEmail(supportEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid support email format",
      });
    }

    // Rebuild content chunks
    const contentChunks = [
      ...faqs.map((f) => ({
        type: f.category || "faq",
        content: `Q: ${f.question}\nA: ${f.answer}`,
        relevanceScore: f.priority ? Math.min(f.priority / 10, 1) : 0.5,
      })),
      ...pricing.map((p) => ({
        type: "pricing",
        content: `${p.plan}: ${p.price} - ${p.features?.join(", ")}`,
        relevanceScore: 0.7,
      })),
      ...(docs
        ? [
          {
            type: "documentation",
            content: docs,
            relevanceScore: 0.8,
          },
        ]
        : []),
    ];

    // Update bot
    Object.assign(bot, {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(language && { language }),
      ...(industry && { industry }),
      ...(websiteURL && { websiteURL }),
      ...(supportEmail && { supportEmail }),
      ...(supportPhone && { supportPhone }),
      ...(supportHours && { supportHours }),
      ...(businessHours && { businessHours }),
      faqs,
      pricing,
      docs,
      contentChunks,
      ...(bot.businessType === "ecommerce" && {
        ...(shippingStandard && { shippingStandard }),
        ...(shippingExpress && { shippingExpress }),
        ...(shippingInternational && { shippingInternational }),
        ...(returnDays && { returnDays }),
        ...(refundDays && { refundDays }),
        ...(returnPolicy && { returnPolicy }),
      }),
      ...(bot.businessType === "service" && {
        ...(appointmentDuration && { appointmentDuration }),
        ...(cancellationPolicy && { cancellationPolicy }),
      }),
      ...(responseConfig && { responseConfig }),
    });

    await bot.save();

    res.json({
      success: true,
      message: "Bot updated successfully",
      bot,
    });
  } catch (err) {
    next(err);
  }
});

// ============================
// DELETE BOT
// ============================

router.delete("/:botId", authMiddleware, async (req, res, next) => {
  try {
    const bot = await Bot.findOneAndDelete({
      _id: req.params.botId,
      owner: req.user.id,
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        message: "Bot not found",
      });
    }

    res.json({
      success: true,
      message: "Bot deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

export default router;