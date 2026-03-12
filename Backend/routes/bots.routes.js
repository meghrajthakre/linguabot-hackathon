import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Bot from "../models/Bot.model.js";
import { generatePublicKey } from "../utils/generatePublicKey.js";
// ADD THIS: Import training service
import { retrainBotOnWebsite, trainBotOnWebsite } from "../services/training.service.js";
import { getTrainingStatus } from "../services/training.service.js";

const router = express.Router();

/* ===============================
   CREATE BOT (WITH AUTO-TRAINING)
================================ */

router.post("/", authMiddleware, async (req, res, next) => {
    try {
        const {
            name,
            description,
            language,
            faqs = [],
            pricing = [],
            docs = "",
            allowedDomains = [],
            website,
        } = req.body;

        if (!name || !language) {
            return res.status(400).json({
                message: "Name and language are required",
            });
        }

        const contentChunks = [
            ...faqs.map(f => ({
                type: "faq",
                text: `Q: ${f.question}\nA: ${f.answer}`,
            })),
            ...pricing.map(p => ({
                type: "pricing",
                text: `${p.plan} - ${p.price} - ${p.features?.join(", ")}`,
            })),
            ...(docs
                ? [{
                    type: "doc",
                    text: docs,
                }]
                : []),
        ];

        const bot = await Bot.create({
            name,
            description,
            language,
            faqs,
            pricing,
            docs,
            contentChunks,
            owner: req.user.id,
            publicKey: generatePublicKey(),
            allowedDomains,
            website: website ? website.trim() : null,
            websiteStatus: website ? "idle" : "idle",
        });

        // ADD THIS: Auto-train if website provided
        if (website && website.trim()) {
            console.log(`🚀 Auto-training bot "${bot.name}" on ${website}`);
            
            // Start training asynchronously (don't wait)
            trainBotOnWebsite(bot._id, website.trim())
                .then(() => {
                    console.log(`✅ Auto-training completed for bot "${bot.name}"`);
                })
                .catch((err) => {
                    console.error(`❌ Auto-training failed for bot "${bot.name}":`, err.message);
                    // Don't throw - bot was created successfully
                    // User can check status and retry
                });
        }

        res.status(201).json({
            success: true,
            bot,
            // ADD THIS: Include training info
            trainingStarted: website ? true : false,
            trainingMessage: website 
                ? `Bot created successfully. Website training started in background. Check /train/status to monitor progress.`
                : `Bot created successfully.`,
            embedCode: `
            <script>
            window.LinguaBotConfig = {
                publicKey: "${bot.publicKey}"
            };
            </script>
            <script src="https://localhost:4000/widget.js"></script>
            `
        });

    } catch (err) {
        next(err);
    }
});

/* ===============================
   GET ALL USER BOTS
================================ */
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const bots = await Bot.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(bots);
    } catch (err) {
        next(err);
    }
});

/* ===============================
   GET SINGLE BOT
================================ */
router.get("/:botId", authMiddleware, async (req, res, next) => {
    try {
        const bot = await Bot.findOne({
            _id: req.params.botId,
            owner: req.user.id,
        });

        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        res.json(bot);
    } catch (err) {
        next(err);
    }
});

/* ===============================
   UPDATE BOT
================================ */
router.put("/:botId", authMiddleware, async (req, res, next) => {
    try {
        const bot = await Bot.findOne({
            _id: req.params.botId,
            owner: req.user.id,
        });

        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        const { faqs = [], pricing = [], docs = "", website } = req.body;

        const contentChunks = [
            ...faqs.map(f => ({
                type: "faq",
                text: `Q: ${f.question}\nA: ${f.answer}`,
            })),
            ...pricing.map(p => ({
                type: "pricing",
                text: `${p.plan} - ${p.price} - ${p.features?.join(", ")}`,
            })),
            ...(docs ? [{ type: "doc", text: docs }] : []),
        ];

        Object.assign(bot, req.body, { contentChunks });

        // ADD THIS: Handle website update
        if (website && website.trim() && website.trim() !== bot.website) {
            console.log(`🔄 Starting re-training for bot "${bot.name}" on new website`);
            
            // Start training asynchronously
            trainBotOnWebsite(bot._id, website.trim())
                .then(() => {
                    console.log(`✅ Re-training completed for bot "${bot.name}"`);
                })
                .catch((err) => {
                    console.error(`❌ Re-training failed for bot "${bot.name}":`, err.message);
                });
        }

        await bot.save();

        res.json({ 
            success: true, 
            bot,
            // ADD THIS: Notify if retraining started
            retrainingStarted: website && website.trim() && website.trim() !== bot.website ? true : false,
        });
    } catch (err) {
        next(err);
    }
});

/* ===============================
   DELETE BOT
================================ */
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const bot = await Bot.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id,
        });

        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        res.json({ message: "Bot deleted successfully" });
    } catch (err) {
        next(err);
    }
});

/**
 * get status of website training
 */

router.get("/:botId/train/status", authMiddleware, async (req, res) => {
  try {
    const { botId } = req.params;
 
    const bot = await Bot.findById(botId);
    if (!bot || bot.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
 
    const status = await getTrainingStatus(botId);
 
    res.json(status);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ message: "Failed to get status" });
  }
});


/**
 * Retrain on existing website
 */
router.post("/:botId/train/retrain", authMiddleware, async (req, res) => {
  try {
    const { botId } = req.params;
 
    const bot = await Bot.findById(botId);
    if (!bot || bot.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
 
    if (!bot.website) {
      return res.status(400).json({ message: "No website configured" });
    }
 
    // Start async retraining
    retrainBotOnWebsite(botId).catch((err) => {
      console.error("Async retraining failed:", err);
    });
 
    res.json({
      message: "Retraining started",
      status: "training",
    });
  } catch (error) {
    console.error("Retrain start error:", error);
    res.status(500).json({ message: "Failed to start retraining" });
  }
});
 

export default router;