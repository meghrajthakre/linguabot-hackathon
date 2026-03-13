import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        botId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bot",
            required: true,
            index: true,
        },

        userMessage: {
            type: String,
            required: true,
        },

        aiMessage: {
            type: String,
            required: true,
        },

        // 🆕 OPTIONAL: Track what type of question this was
        intent: {
            type: String,
            enum: ["pricing", "faq", "docs", "general"],
            default: "general",
        },

        responseTimeMs: {
            type: Number,
            default: 0,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index for faster queries
conversationSchema.index({ botId: 1, createdAt: -1 });

export default mongoose.model("Conversation", conversationSchema);