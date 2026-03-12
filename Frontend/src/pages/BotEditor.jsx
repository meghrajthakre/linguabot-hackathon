import React, { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, Plus, Trash2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import api from "../api/axios";

const inputCls =
  "w-full border border-[#e8e0d0] bg-[#fdf9f3] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder:text-gray-400";

const BotEditor = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "English",
    faqs: [],
    pricing: [],
    docs: "",
  });

  const [initialData, setInitialData] = useState(null);

  const [confirmConfig, setConfirmConfig] = useState(null);

  const openConfirmModal = (config) => {
    setConfirmConfig(config);
  };

  const closeConfirmModal = () => {
    setConfirmConfig(null);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /* ================= FETCH BOT ================= */
  useEffect(() => {
    const fetchBot = async () => {
      try {
        const { data } = await api.get(`/bots/${id}`);
        const botData = {
          name: data.name || "",
          description: data.description || "",
          language: data.language || "English",
          faqs: data.faqs || [],
          pricing: data.pricing || [],
          docs: data.docs || "",
        };
        setFormData(botData);
        setInitialData(botData);
      } catch (err) {
        toast.error("Failed to load bot ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [id]);

  /* ================= DETECT UNSAVED CHANGES ================= */
  useEffect(() => {
    if (initialData) {
      setHasUnsavedChanges(JSON.stringify(formData) !== JSON.stringify(initialData));
    }
  }, [formData, initialData]);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Bot name is required";
    if (formData.name.length > 100) newErrors.name = "Bot name must be under 100 characters";

    if (formData.description.length > 500)
      newErrors.description = "Description must be under 500 characters";

    formData.faqs.forEach((faq, i) => {
      if (faq.question.trim() && !faq.answer.trim()) {
        newErrors[`faq_${i}_answer`] = "Answer required for question";
      }
      if (faq.answer.trim() && !faq.question.trim()) {
        newErrors[`faq_${i}_question`] = "Question required for answer";
      }
    });

    formData.pricing.forEach((plan, i) => {
      if (!plan.name.trim()) newErrors[`pricing_${i}_name`] = "Plan name required";
      if (!plan.price) newErrors[`pricing_${i}_price`] = "Price required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= FORM HANDLERS ================= */
  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= FAQ HANDLERS ================= */
  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const updateFaq = (i, field, value) => {
    const updated = [...formData.faqs];
    updated[i][field] = value;
    setFormData({ ...formData, faqs: updated });
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [`faq_${i}_${field}`]: undefined,
    }));
  };

  const removeFaq = (i) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== i),
    }));
  };

  /* ================= PRICING HANDLERS ================= */
  const addPricing = () => {
    setFormData((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { name: "", price: "", features: [] }],
    }));
  };

  const updatePricing = (i, field, value) => {
    const updated = [...formData.pricing];
    updated[i][field] = value;
    setFormData({ ...formData, pricing: updated });
    setErrors((prev) => ({
      ...prev,
      [`pricing_${i}_${field}`]: undefined,
    }));
  };

  const removePricing = (i) => {
    setFormData((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, idx) => idx !== i),
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors ❌");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/bots/${id}`, formData);
      setInitialData(formData);
      toast.success("Bot updated successfully ");
      navigate('/dashboard');
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    openConfirmModal({
      title: "Discard Changes?",
      message:
        "You have unsaved changes. Are you sure you want to discard them?",
      type: "warning",
      confirmText: "Discard",
      cancelText: "Keep Editing",
      onConfirm: () => {
        setFormData(initialData);   // 🔥 restore original data
        closeConfirmModal();
        toast.success("Changes discarded");
      },
      onCancel: closeConfirmModal,
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-3 border-yellow-300 border-t-yellow-500 rounded-full" />
          <p className="text-sm text-gray-500 font-medium">Loading bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      {/* BACK BUTTON */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back
        </button>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">


        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Bot Editor</h1>
            <p className="text-sm text-gray-500 mt-1">
              Customize your AI assistant with all the details
            </p>
          </div>

          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <button
                onClick={handleDiscard}
                className="px-4 py-2.5 rounded-lg border border-[#e8e0d0] text-gray-700 hover:bg-[#fdf9f3] font-medium text-sm transition"
              >
                Discard
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 px-6 py-2.5 rounded-lg font-semibold text-gray-900 shadow-md hover:shadow-lg transition disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* UNSAVED INDICATOR */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <AlertCircle size={16} className="flex-shrink-0" />
            You have unsaved changes
          </div>
        )}

        {/* BASIC INFO CARD */}
        <div className="bg-white border border-[#e8e0d0] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">Bot Details</h2>
            <p className="text-sm text-gray-500">Basic information about your bot</p>
          </div>

          <div className="space-y-5">
            {/* Bot Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bot Name <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="e.g., Customer Support Bot"
                className={inputCls}
                maxLength={100}
              />
              <div className="flex justify-between items-start">
                {errors.name ? (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Required field</span>
                )}
                <span className="text-xs text-gray-400">
                  {formData.name.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="Tell us what this bot does..."
                rows={3}
                maxLength={500}
                className={`${inputCls} resize-none`}
              />
              <div className="flex justify-between items-start">
                {errors.description ? (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.description}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Optional</span>
                )}
                <span className="text-xs text-gray-400">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => updateFormField("language", e.target.value)}
                className={inputCls}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Portuguese</option>
                <option>Arabic</option>
                <option>Japanese</option>
                <option>Chinese</option>
                <option>Korean</option>
                <option>Russian</option>
              </select>
            </div>

            {/* Documentation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Documentation URL
              </label>
              <input
                type="url"
                value={formData.docs}
                onChange={(e) => updateFormField("docs", e.target.value)}
                placeholder="https://example.com/docs"
                className={inputCls}
              />
              <p className="text-xs text-gray-400">Link to your bot's documentation</p>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="bg-white border border-[#e8e0d0] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
              <p className="text-sm text-gray-500">
                Common questions and answers ({formData.faqs.length})
              </p>
            </div>

            <button
              onClick={addFaq}
              className="flex items-center gap-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap"
            >
              <Plus size={14} />
              Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[#fdf9f3] border border-[#e8e0d0] rounded-xl p-5 space-y-4 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Question */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Question
                      </label>
                      <input
                        value={faq.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        placeholder="e.g., How do I reset my password?"
                        className={inputCls}
                      />
                      {errors[`faq_${i}_question`] && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors[`faq_${i}_question`]}
                        </span>
                      )}
                    </div>

                    {/* Answer */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                        placeholder="Provide a helpful answer..."
                        rows={2}
                        className={`${inputCls} resize-none`}
                      />
                      {errors[`faq_${i}_answer`] && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors[`faq_${i}_answer`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFaq(i)}
                    className="mt-1 text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
                    title="Remove FAQ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {formData.faqs.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-[#e8e0d0] rounded-xl">
                <p className="text-sm text-gray-400">No FAQs added yet</p>
                <p className="text-xs text-gray-300 mt-1">
                  Click "Add FAQ" to help users find answers
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="bg-white border border-[#e8e0d0] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Pricing Plans</h2>
              <p className="text-sm text-gray-500">
                Define your pricing tiers ({formData.pricing.length})
              </p>
            </div>

            <button
              onClick={addPricing}
              className="flex items-center gap-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap"
            >
              <Plus size={14} />
              Add Plan
            </button>
          </div>

          <div className="space-y-4">
            {formData.pricing.map((plan, i) => (
              <div
                key={i}
                className="bg-[#fdf9f3] border border-[#e8e0d0] rounded-xl p-5 space-y-4 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Plan Name */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Plan Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={plan.name || ""}
                          onChange={(e) => updatePricing(i, "name", e.target.value)}
                          placeholder="e.g., Basic"
                          className={inputCls}
                        />
                        {errors[`pricing_${i}_name`] && (
                          <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors[`pricing_${i}_name`]}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={plan.price || ""}
                          onChange={(e) => updatePricing(i, "price", e.target.value)}
                          placeholder="e.g., $9.99/month"
                          className={inputCls}
                        />
                        {errors[`pricing_${i}_price`] && (
                          <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors[`pricing_${i}_price`]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removePricing(i)}
                    className="mt-1 text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
                    title="Remove pricing plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {formData.pricing.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-[#e8e0d0] rounded-xl">
                <p className="text-sm text-gray-400">No pricing plans added yet</p>
                <p className="text-xs text-gray-300 mt-1">
                  Click "Add Plan" to define your pricing structure
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {hasUnsavedChanges && (
            <button
              onClick={handleDiscard}
              className="px-4 py-2.5 rounded-lg border border-[#e8e0d0] text-gray-700 hover:bg-[#fdf9f3] font-medium text-sm transition"
            >
              Discard Changes
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 px-6 py-2.5 rounded-lg font-semibold text-gray-900 shadow-md hover:shadow-lg transition disabled:cursor-not-allowed flex-1 sm:flex-initial"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
      {confirmConfig && (
        <ConfirmationModal
          isOpen={true}
          title={confirmConfig.title}
          message={confirmConfig.message}
          type={confirmConfig.type}
          confirmText={confirmConfig.confirmText}
          cancelText={confirmConfig.cancelText}
          onConfirm={confirmConfig.onConfirm}
          onCancel={confirmConfig.onCancel}
        />
      )}
    </div>
  );

};

export default BotEditor;