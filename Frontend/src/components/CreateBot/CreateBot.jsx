import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, DollarSign, HelpCircle, Plus, Sparkles } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useFaqManager, usePricingManager, useFormManager } from "./hooks";
import {
  Section,
  FormInput,
  FaqItem,
  PricingItem,
  LoadingButton,
} from "./components";
import { ChatPreview } from "./ChatPreview";
import { LANGUAGES, VALIDATION_RULES, TIMINGS } from "../../constants";

/**
 * Main CreateBot Component
 */
export const CreateBotForm = () => {
  const navigate = useNavigate();
  const { formData, handleChange, validate, reset, errors } = useFormManager();
  const { faqs, addFaq, updateFaq, removeFaq, cleanFaqs } = useFaqManager();
  const { pricing, addPricing, updatePricing, removePricing, cleanPricing } =
    usePricingManager();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const TABS = [
    { id: "basic", label: "Basic Info", icon: Bot },
    { id: "knowledge", label: "Knowledge Base", icon: Sparkles },
  ];

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) {
        toast.error("Please fix the errors above");
        return;
      }

      setLoading(true);

      try {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          language: formData.language,
          faqs: cleanFaqs(),
          pricing: cleanPricing(),
          docs: formData.docs.trim(),
          website: formData.website?.trim() || null, // ADD THIS
        };

        if (process.env.NODE_ENV === "development") {
          console.log("Creating bot with payload:", payload);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          TIMINGS.API_TIMEOUT
        );

        const response = await api.post("/bots", payload, { signal: controller.signal });
        clearTimeout(timeoutId);

        // ADD THIS: Handle auto-training response
        const { trainingStarted } = response.data;

        if (trainingStarted) {
          toast.success("Bot created! Training website in background... 🚀");
        } else {
          toast.success("Bot created successfully! 🎉");
        }

        reset();
        navigate("/dashboard", { state: { botCreated: true } });
      } catch (error) {
        console.error("Bot creation error:", error);

        let errorMessage = "Failed to create bot";
        if (error.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.response?.status === 400) {
          errorMessage =
            error.response.data?.message || "Invalid bot configuration.";
        } else if (error.response?.status === 409) {
          errorMessage = "A bot with this name already exists.";
        } else if (error.response?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (!error.response) {
          errorMessage = "Network error. Please check your connection.";
        }

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [formData, validate, reset, cleanFaqs, cleanPricing, navigate]
  );

  return (
    <div className="min-h-screen bg-[#F6F1E8] px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — FORM */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
          <div className="px-8 pt-8 pb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-yellow-400 p-3 rounded-2xl shadow-sm">
                <Bot size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Bot</h1>
                <p className="text-sm text-gray-400">
                  Configure your multilingual AI assistant
                </p>
              </div>
            </div>

            <div className="flex gap-1 bg-[#F6F1E8] p-1 rounded-xl w-fit mb-6">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-selected={activeTab === id}
                  role="tab"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 px-8 pb-8 overflow-y-auto"
          >
            <div className="flex-1 space-y-4">
              {activeTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
                  <FormInput
                    type="text"
                    label="Bot Name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="SupportBot"
                    error={errors.name}
                    maxLength={VALIDATION_RULES.name.maxLength}
                    showCharCount
                  />

                  <FormInput
                    type="textarea"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Helps customers with product queries..."
                    error={errors.description}
                    maxLength={VALIDATION_RULES.description.maxLength}
                    showCharCount
                    rows={3}
                  />

                  <FormInput
                    type="select"
                    label="Primary Language"
                    name="language"
                    required
                    value={formData.language}
                    onChange={handleChange}
                    error={errors.language}
                    options={LANGUAGES}
                  />

                  {/* ADD THIS: Website URL field */}
                  <FormInput
                    type="text"
                    label="Website URL (optional)"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />

                  <FormInput
                    type="textarea"
                    label="Documentation / Context"
                    name="docs"
                    value={formData.docs}
                    onChange={handleChange}
                    placeholder="Paste product docs, policies, or any text context..."
                    error={errors.docs}
                    maxLength={VALIDATION_RULES.docs.maxLength}
                    showCharCount
                    rows={3}
                  />
                </div>
              )}

              {activeTab === "knowledge" && (
                <div className="space-y-5 animate-fadeIn">
                  <Section
                    icon={HelpCircle}
                    label="FAQs"
                    color="bg-blue-100 text-blue-600"
                  >
                    <div className="space-y-3">
                      {faqs.length === 0 && (
                        <p className="text-xs text-gray-400 italic">
                          No FAQs added yet.
                        </p>
                      )}
                      {faqs.map((faq, i) => (
                        <FaqItem
                          key={i}
                          faq={faq}
                          index={i}
                          onUpdate={updateFaq}
                          onRemove={removeFaq}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium px-3 py-2 rounded-xl hover:bg-yellow-50 transition w-full"
                      >
                        <Plus size={15} /> Add FAQ
                      </button>
                    </div>
                  </Section>

                  <Section
                    icon={DollarSign}
                    label="Pricing Plans"
                    color="bg-green-100 text-green-600"
                  >
                    <div className="space-y-4">
                      {pricing.length === 0 && (
                        <div className="text-xs text-gray-400 bg-[#f5f0e8] border border-dashed border-[#e8e0d0] rounded-xl p-4 text-center">
                          No pricing plans added yet.
                        </div>
                      )}
                      {pricing.map((p, i) => (
                        <PricingItem
                          key={i}
                          pricing={p}
                          index={i}
                          onUpdate={updatePricing}
                          onRemove={removePricing}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={addPricing}
                        className="flex items-center justify-center gap-2 text-sm text-yellow-700 font-medium px-4 py-2.5 rounded-xl border border-dashed border-yellow-300 hover:bg-yellow-50 transition w-full"
                      >
                        <Plus size={15} />
                        Add Pricing Plan
                      </button>
                    </div>
                  </Section>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 mt-4 border-t border-[#f0e8d8]">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {activeTab === "basic" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("knowledge")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-yellow-300 text-yellow-700 text-sm font-medium hover:bg-yellow-50 transition"
                  >
                    Next <Sparkles size={14} />
                  </button>
                )}
                <LoadingButton loading={loading} type="submit">
                  <Bot size={15} /> Create Bot
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT — CHAT PREVIEW */}
        <ChatPreview
          botName={formData.name}
          botDescription={formData.description}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};