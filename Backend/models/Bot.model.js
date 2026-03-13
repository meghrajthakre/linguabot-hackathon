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
    type: String, // "faq" | "pricing" | "doc"
    enum: ["faq", "pricing", "doc"],
  },
  text: String,
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

    // Future RAG Ready
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
    websiteURL:{
      type: String,
      
    
    },

    allowedDomains: [
      {
        type: String,
      }],
  },
  { timestamps: true }
);

export default mongoose.model("Bot", botSchema);