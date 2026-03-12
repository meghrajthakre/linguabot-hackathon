import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const pricingSchema = new mongoose.Schema({
  plan: { type: String },
  price: { type: String },
  features: [{ type: String }],
});

const contentChunkSchema = new mongoose.Schema({
  type: {
    type: String, // "faq" | "pricing" | "doc" | "website"
    enum: ["faq", "pricing", "doc", "website"],
  },
  text: String,
  source: String, // URL or section identifier
  chunkIndex: Number, // Order of chunk
});

const botSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      required: true,
      default: "en",
    },

    // Structured Data
    faqs: [faqSchema],

    pricing: [pricingSchema],

    docs: {
      type: String,
      default: "",
    },

    // ADD THIS: Website Training Fields
    website: {
      type: String,
      trim: true,
    },

    websiteStatus: {
      type: String,
      enum: ["idle", "training", "completed", "failed"],
      default: "idle",
    },

    websiteLastTrained: {
      type: Date,
    },

    websiteTrainingError: {
      type: String,
    },

    // RAG Ready
    contentChunks: [contentChunkSchema],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    publicKey: {
      type: String,
      required: true,
      unique: true,
    },

    pages: [
      {
        url: String,
        content: String,
      },
    ],

    allowedDomains: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// ADD THIS: Index for faster chunk searches
contentChunkSchema.index({ text: "text" });

export default mongoose.model("Bot", botSchema);