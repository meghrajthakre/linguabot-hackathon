import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Bot from "../models/Bot.model.js";
import { generatePublicKey } from "../utils/generatePublicKey.js";

const router = express.Router();

/* ===============================
   CREATE BOT
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
            publicKey: generatePublicKey(),   // 🔥 IMPORTANT
            allowedDomains,
        });

        res.status(201).json({
            success: true,
            bot,
            embedCode: `
            <script>
            window.LinguaBotConfig = {
                publicKey: "${bot.publicKey}"
            };
            </script>
            <script src="https://yourdomain.com/widget.js"></script>
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

        const { faqs = [], pricing = [], docs = "" } = req.body;

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

        await bot.save();

        res.json({ success: true, bot });
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

export default router;