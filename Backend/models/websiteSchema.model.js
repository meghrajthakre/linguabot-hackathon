import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const pricingSchema = new mongoose.Schema({
  plan: String,
  price: String,
  features: [String],
});

const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    websiteName: String,
    description: String,
    faqs: [faqSchema],
    pricing: [pricingSchema],
    docs: String,
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteData", websiteSchema);