import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["shipping", "returns", "pricing", "account", "product", "hours", "technical", "contact", "general"],
    default: "general"
  },
  priority: { type: Number, default: 0 }, // Higher = more important
  tags: [{ type: String }], // For better search/categorization
});

const pricingSchema = new mongoose.Schema({
  plan: { type: String, required: true },
  price: { type: String, required: true },
  features: [{ type: String }],
  currency: { type: String, default: "USD" },
  billingPeriod: { type: String, enum: ["monthly", "yearly", "one-time"], default: "monthly" },
});

const contentChunkSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["faq", "pricing", "documentation", "shipping", "returns", "hours", "contact"],
    required: true
  },
  content: { type: String, required: true },
  relevanceScore: { type: Number, default: 0.5 }, // For RAG ranking
});

const botSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    language: {
      type: String,
      required: true,
      default: "en",
    },

    // Business Type & Information
    businessType: {
      type: String,
      required: true,
      enum: [
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
      ],
    },

    industry: {
      type: String,
      required: true,
      maxlength: 100, // e.g., "Electronics Retail", "Project Management SaaS", "Beauty Services"
    },

    // Website & Contact Information
    websiteURL: {
      type: String,
      required: true,
      match: /^https?:\/\/.+/,
    },

    supportEmail: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    supportPhone: {
      type: String,
    },

    supportHours: {
      type: String, // e.g., "Mon-Fri 9AM-6PM EST"
    },

    // Business Hours
    businessHours: {
      type: String, // e.g., "Mon-Sun 9AM-9PM"
    },

    holidays: {
      type: String, // e.g., "Closed Christmas, New Year's, Thanksgiving"
    },

    // Shipping Information (for e-commerce)
    shippingStandard: {
      type: String, // e.g., "3-5 business days (FREE over $50)"
    },

    shippingExpress: {
      type: String, // e.g., "1-2 business days ($9.99)"
    },

    shippingInternational: {
      type: String, // e.g., "10-21 business days"
    },

    // Return/Refund Policy
    returnDays: {
      type: Number,
      default: 30,
    },

    refundDays: {
      type: Number,
      default: 5,
    },

    returnPolicy: {
      type: String, // Detailed return policy
    },

    // Pricing & Subscription (for SaaS)
    freeTrial: {
      enabled: { type: Boolean, default: false },
      days: { type: Number, default: 14 },
    },

    // Service Information (for service-based businesses)
    appointmentDuration: {
      type: Number, // in minutes
    },

    cancellationPolicy: {
      type: String,
    },

    // Knowledge Base
    faqs: [faqSchema],

    pricing: [pricingSchema],

    docs: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    // Content Chunks for RAG
    contentChunks: [contentChunkSchema],

    // Owner & Access Control
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    allowedDomains: [
      {
        type: String,
      }
    ],

    // Bot Configuration
    publicKey: {
      type: String,
      required: true,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Response Configuration
    responseConfig: {
      temperature: { type: Number, default: 0.3, min: 0, max: 1 },
      maxOutputTokens: { type: Number, default: 250 },
      language: { type: String, default: "en" },
      tone: { 
        type: String, 
        enum: ["professional", "friendly", "casual", "formal"],
        default: "professional"
      },
    },

    // Analytics
    totalConversations: {
      type: Number,
      default: 0,
    },

    averageResponseTime: {
      type: Number,
      default: 0,
    },

    resolutionRate: {
      type: Number,
      default: 0,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for common queries
botSchema.index({ owner: 1, isActive: 1 });
botSchema.index({ businessType: 1 });
botSchema.index({ publicKey: 1 });

export default mongoose.model("Bot", botSchema);