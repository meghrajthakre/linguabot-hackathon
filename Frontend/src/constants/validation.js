/**
 * Validation rules for all form fields
 */
export const VALIDATION_RULES = {
  name: { required: true, minLength: 1, maxLength: 100 },
  language: { required: true },
  description: { maxLength: 500 },
  docs: { maxLength: 5000 },
  faqQuestion: { maxLength: 300 },
  faqAnswer: { maxLength: 1000 },
  pricingPlan: { maxLength: 50 },
  pricingPrice: { maxLength: 50 },
  pricingFeatures: { maxLength: 500 },
};