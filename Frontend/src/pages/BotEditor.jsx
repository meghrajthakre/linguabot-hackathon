import React, { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Save, Plus, Trash2, AlertCircle, ArrowLeft,
  Globe, FileText, DollarSign, HelpCircle, Bot,
  X, Eye, Copy, Check, Phone, Mail, Clock, Calendar,
  Settings, Gift, TrendingUp
} from "lucide-react";
import api from "../api/axios";

const inputCls = "w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all placeholder:text-gray-400 shadow-sm hover:border-gray-300";
const labelCls = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";

// Language mapping (code -> display name)
const languageMap = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Chinese",
  // add more as needed
};

const BotEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form data - expanded to match API response
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "English",
    businessType: "general",
    industry: "",
    websiteURL: "",
    supportEmail: "",
    supportPhone: "",
    supportHours: "",
    businessHours: "",
    holidays: "",
    returnDays: 30,
    refundDays: 5,
    freeTrial: {
      enabled: false,
      days: 14
    },
    responseConfig: {
      temperature: 0.3,
      maxOutputTokens: 250,
      tone: "professional"
    },
    faqs: [],
    pricing: [],
    docs: "",
    allowedDomains: [],
    isActive: true
  });

  const [initialData, setInitialData] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ================= FETCH BOT ================= */
  useEffect(() => {
    const fetchBot = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/bots/${id}`);
        const bot = data.bot || data; // handle both { success, bot } and direct response

        // Map language code to display name if possible
        const languageDisplay = languageMap[bot.language] || bot.language || "English";

        const botData = {
          name: bot.name || "",
          description: bot.description || "",
          language: languageDisplay,
          businessType: bot.businessType || "general",
          industry: bot.industry || "",
          websiteURL: bot.websiteURL || "",
          supportEmail: bot.supportEmail || "",
          supportPhone: bot.supportPhone || "",
          supportHours: bot.supportHours || "",
          businessHours: bot.businessHours || "",
          holidays: bot.holidays || "",
          returnDays: bot.returnDays ?? 30,
          refundDays: bot.refundDays ?? 5,
          freeTrial: {
            enabled: bot.freeTrial?.enabled ?? false,
            days: bot.freeTrial?.days ?? 14
          },
          responseConfig: {
            temperature: bot.responseConfig?.temperature ?? 0.3,
            maxOutputTokens: bot.responseConfig?.maxOutputTokens ?? 250,
            tone: bot.responseConfig?.tone ?? "professional"
          },
          faqs: bot.faqs || [],
          pricing: bot.pricing || [],
          docs: bot.docs || "",
          allowedDomains: bot.allowedDomains || [],
          isActive: bot.isActive !== undefined ? bot.isActive : true
        };

        setFormData(botData);
        setInitialData(botData);
      } catch (err) {
        toast.error("Failed to load bot", {
          icon: '❌',
          style: toastStyle
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBot();
  }, [id, navigate]);

  /* ================= DETECT UNSAVED CHANGES ================= */
  useEffect(() => {
    if (initialData) {
      setHasUnsavedChanges(JSON.stringify(formData) !== JSON.stringify(initialData));
    }
  }, [formData, initialData]);

  // Toast style
  const toastStyle = {
    borderRadius: '12px',
    background: '#1a1a1a',
    color: '#fff',
    border: '1px solid #333'
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bot name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Bot name must be under 100 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be under 500 characters";
    }

    // Validate email if provided
    if (formData.supportEmail && !/^\S+@\S+\.\S+$/.test(formData.supportEmail)) {
      newErrors.supportEmail = "Invalid email format";
    }

    // Validate phone if provided (simple)
    if (formData.supportPhone && !/^[\d\s\+\-\(\)]{7,}$/.test(formData.supportPhone)) {
      newErrors.supportPhone = "Invalid phone number";
    }

    // Validate website URL if provided
    if (formData.websiteURL && !/^https?:\/\/.+\..+/.test(formData.websiteURL)) {
      newErrors.websiteURL = "Invalid URL (must start with http:// or https://)";
    }

    // Validate return/refund days
    if (formData.returnDays < 0) newErrors.returnDays = "Cannot be negative";
    if (formData.refundDays < 0) newErrors.refundDays = "Cannot be negative";

    // Validate temperature (0-1)
    if (formData.responseConfig.temperature < 0 || formData.responseConfig.temperature > 1) {
      newErrors.temperature = "Must be between 0 and 1";
    }

    // Validate max tokens (positive)
    if (formData.responseConfig.maxOutputTokens < 1) {
      newErrors.maxOutputTokens = "Must be at least 1";
    }

    // Validate FAQs
    formData.faqs.forEach((faq, i) => {
      if (faq.question.trim() && !faq.answer.trim()) {
        newErrors[`faq_${i}_answer`] = "Answer is required for this question";
      }
      if (faq.answer.trim() && !faq.question.trim()) {
        newErrors[`faq_${i}_question`] = "Question is required for this answer";
      }
    });

    // Validate Pricing
    formData.pricing.forEach((plan, i) => {
      if (plan.name && !plan.price) {
        newErrors[`pricing_${i}_price`] = "Price is required for this plan";
      }
      if (plan.price && !plan.name) {
        newErrors[`pricing_${i}_name`] = "Plan name is required";
      }
    });

    // Validate domains
    if (formData.allowedDomains.length > 0) {
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      formData.allowedDomains.forEach((domain, i) => {
        if (domain && !domainRegex.test(domain)) {
          newErrors[`domain_${i}`] = "Invalid domain format";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= FORM HANDLERS ================= */
  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  /* ================= FAQ HANDLERS ================= */
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
    setErrors(prev => ({
      ...prev,
      [`faq_${index}_${field}`]: undefined
    }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  /* ================= PRICING HANDLERS ================= */
  const addPricing = () => {
    setFormData(prev => ({
      ...prev,
      pricing: [...prev.pricing, { name: "", price: "", features: [] }]
    }));
  };

  const updatePricing = (index, field, value) => {
    const updated = [...formData.pricing];
    updated[index][field] = value;
    setFormData({ ...formData, pricing: updated });
    setErrors(prev => ({
      ...prev,
      [`pricing_${index}_${field}`]: undefined
    }));
  };

  const removePricing = (index) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }));
  };

  /* ================= DOMAIN HANDLERS ================= */
  const addDomain = () => {
    setFormData(prev => ({
      ...prev,
      allowedDomains: [...prev.allowedDomains, ""]
    }));
  };

  const updateDomain = (index, value) => {
    const updated = [...formData.allowedDomains];
    updated[index] = value;
    setFormData({ ...formData, allowedDomains: updated });
  };

  const removeDomain = (index) => {
    setFormData(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter((_, i) => i !== index)
    }));
  };

  /* ================= SAVE BOT ================= */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors", {
        icon: '⚠️',
        style: toastStyle
      });
      return;
    }

    try {
      setSaving(true);

      // Prepare data for API - need to convert language display name back to code?
      // Assuming backend accepts display names, but if it expects codes we'd need reverse mapping.
      // For now, we keep as is.
      const apiData = {
        ...formData,
        // Ensure empty strings for optional fields are sent as undefined if needed
        industry: formData.industry || undefined,
        docs: formData.docs || undefined,
        websiteURL: formData.websiteURL || undefined,
        supportEmail: formData.supportEmail || undefined,
        supportPhone: formData.supportPhone || undefined,
        supportHours: formData.supportHours || undefined,
        businessHours: formData.businessHours || undefined,
        holidays: formData.holidays || undefined,
      };

      await api.put(`/bots/${id}`, apiData);

      setInitialData(formData);

      toast.success("Bot updated successfully", {
        icon: '✅',
        duration: 3000,
        style: toastStyle
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", {
        icon: '❌',
        style: toastStyle
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= DISCARD CHANGES ================= */
  const handleDiscard = () => {
    setConfirmConfig({
      title: "Discard Changes?",
      message: "You have unsaved changes. Are you sure you want to discard them?",
      type: "warning",
      confirmText: "Yes, Discard",
      cancelText: "Keep Editing",
      onConfirm: () => {
        setFormData(initialData);
        setConfirmConfig(null);
        toast.success("Changes discarded", {
          icon: '↩️',
          style: toastStyle
        });
      },
      onCancel: () => setConfirmConfig(null)
    });
  };

  /* ================= COPY BOT ID ================= */
  const copyBotId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast.success("Bot ID copied to clipboard", {
        icon: '📋',
        style: toastStyle
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy", {
        icon: '❌',
        style: toastStyle
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin" />
            <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-500" size={24} />
          </div>
          <p className="text-sm font-medium text-gray-600">Loading your bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f3efe6]/80 to-[#e8e1d2]/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header with Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-all group"
          >
            <div className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all text-gray-700 hover:text-yellow-600"
            >
              <Eye size={18} />
              <span className="text-sm font-medium">{previewMode ? 'Edit Mode' : 'Preview'}</span>
            </button>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
              <span className="text-xs font-mono font-bold text-gray-600">ID: {id?.slice(0, 8)}</span>
              <button
                onClick={copyBotId}
                className="p-1 hover:bg-white rounded-lg transition"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center shadow-lg">
                  <Bot className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {formData.name || "Untitled Bot"}
                    {formData.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Status Toggle */}
              <button
                onClick={() => updateFormField('isActive', !formData.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Unsaved Changes Banner */}
            {hasUnsavedChanges && (
              <div className="mt-6 flex items-center justify-between bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">You have unsaved changes</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 rounded-lg transition"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {!previewMode ? (
            /* EDIT MODE */
            <>
              {/* Basic Information */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <FileText size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500">Core details about your bot</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bot Name */}
                  <div className="space-y-2">
                    <label className={labelCls}>
                      Bot Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormField("name", e.target.value)}
                      placeholder="e.g., Customer Support Assistant"
                      className={`${inputCls} ${errors.name ? 'border-red-500 ring-red-100' : ''}`}
                      maxLength={100}
                    />
                    <div className="flex justify-between">
                      {errors.name ? (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Required field</span>
                      )}
                      <span className="text-xs text-gray-400">{formData.name.length}/100</span>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className={labelCls}>Language</label>
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
                      <option>Japanese</option>
                      <option>Chinese</option>
                    </select>
                  </div>

                  {/* Business Type */}
                  <div className="space-y-2">
                    <label className={labelCls}>Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => updateFormField("businessType", e.target.value)}
                      className={inputCls}
                    >
                      <option value="general">General</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS</option>
                      <option value="service">Service</option>
                      <option value="restaurant">Restaurant</option>
                    </select>
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <label className={labelCls}>Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => updateFormField("industry", e.target.value)}
                      placeholder="e.g., Technology, Healthcare"
                      className={inputCls}
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-2">
                    <label className={labelCls}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormField("description", e.target.value)}
                      placeholder="Describe what your bot does..."
                      rows={3}
                      maxLength={500}
                      className={`${inputCls} resize-none`}
                    />
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Optional</span>
                      <span className="text-xs text-gray-400">{formData.description.length}/500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-sm text-gray-500">How customers can reach you</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Website URL */}
                  <div className="space-y-2">
                    <label className={labelCls}>Website URL</label>
                    <input
                      type="url"
                      value={formData.websiteURL}
                      onChange={(e) => updateFormField("websiteURL", e.target.value)}
                      placeholder="https://example.com"
                      className={`${inputCls} ${errors.websiteURL ? 'border-red-500' : ''}`}
                    />
                    {errors.websiteURL && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.websiteURL}
                      </span>
                    )}
                  </div>

                  {/* Support Email */}
                  <div className="space-y-2">
                    <label className={labelCls}>Support Email</label>
                    <input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => updateFormField("supportEmail", e.target.value)}
                      placeholder="support@example.com"
                      className={`${inputCls} ${errors.supportEmail ? 'border-red-500' : ''}`}
                    />
                    {errors.supportEmail && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.supportEmail}
                      </span>
                    )}
                  </div>

                  {/* Support Phone */}
                  <div className="space-y-2">
                    <label className={labelCls}>Support Phone</label>
                    <input
                      type="tel"
                      value={formData.supportPhone}
                      onChange={(e) => updateFormField("supportPhone", e.target.value)}
                      placeholder="+1 234 567 8900"
                      className={`${inputCls} ${errors.supportPhone ? 'border-red-500' : ''}`}
                    />
                    {errors.supportPhone && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.supportPhone}
                      </span>
                    )}
                  </div>

                  {/* Support Hours */}
                  <div className="space-y-2">
                    <label className={labelCls}>Support Hours</label>
                    <input
                      type="text"
                      value={formData.supportHours}
                      onChange={(e) => updateFormField("supportHours", e.target.value)}
                      placeholder="e.g., Mon-Fri 9am-5pm"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours & Holidays */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
                    <p className="text-sm text-gray-500">When your business is open</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelCls}>Business Hours</label>
                    <input
                      type="text"
                      value={formData.businessHours}
                      onChange={(e) => updateFormField("businessHours", e.target.value)}
                      placeholder="e.g., Mon-Sun 8am-8pm"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Holidays / Closures</label>
                    <input
                      type="text"
                      value={formData.holidays}
                      onChange={(e) => updateFormField("holidays", e.target.value)}
                      placeholder="e.g., Christmas, New Year"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Return & Refund Policy */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Return & Refund Policy</h2>
                    <p className="text-sm text-gray-500">Set your return and refund periods</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelCls}>Return Period (days)</label>
                    <input
                      type="number"
                      value={formData.returnDays}
                      onChange={(e) => updateFormField("returnDays", parseInt(e.target.value) || 0)}
                      className={`${inputCls} ${errors.returnDays ? 'border-red-500' : ''}`}
                      min="0"
                    />
                    {errors.returnDays && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.returnDays}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Refund Period (days)</label>
                    <input
                      type="number"
                      value={formData.refundDays}
                      onChange={(e) => updateFormField("refundDays", parseInt(e.target.value) || 0)}
                      className={`${inputCls} ${errors.refundDays ? 'border-red-500' : ''}`}
                      min="0"
                    />
                    {errors.refundDays && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.refundDays}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Response Settings */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Settings size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI Response Settings</h2>
                    <p className="text-sm text-gray-500">Customize how your bot responds</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className={labelCls}>Temperature (0-1)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={formData.responseConfig.temperature}
                      onChange={(e) => updateNestedField("responseConfig", "temperature", parseFloat(e.target.value) || 0)}
                      className={`${inputCls} ${errors.temperature ? 'border-red-500' : ''}`}
                    />
                    {errors.temperature && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.temperature}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Max Output Tokens</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.responseConfig.maxOutputTokens}
                      onChange={(e) => updateNestedField("responseConfig", "maxOutputTokens", parseInt(e.target.value) || 1)}
                      className={`${inputCls} ${errors.maxOutputTokens ? 'border-red-500' : ''}`}
                    />
                    {errors.maxOutputTokens && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.maxOutputTokens}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Tone</label>
                    <select
                      value={formData.responseConfig.tone}
                      onChange={(e) => updateNestedField("responseConfig", "tone", e.target.value)}
                      className={inputCls}
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Free Trial Settings */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Gift size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Free Trial</h2>
                    <p className="text-sm text-gray-500">Offer a free trial to new users</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.freeTrial.enabled}
                      onChange={(e) => updateNestedField("freeTrial", "enabled", e.target.checked)}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable free trial</span>
                  </label>

                  {formData.freeTrial.enabled && (
                    <div className="flex items-center gap-2">
                      <label className={labelCls}>Trial Days</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.freeTrial.days}
                        onChange={(e) => updateNestedField("freeTrial", "days", parseInt(e.target.value) || 14)}
                        className="w-24 border border-gray-200 bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Documentation */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Globe size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Documentation</h2>
                    <p className="text-sm text-gray-500">Link to your bot's documentation</p>
                  </div>
                </div>

                <input
                  type="url"
                  value={formData.docs}
                  onChange={(e) => updateFormField("docs", e.target.value)}
                  placeholder="https://docs.example.com"
                  className={inputCls}
                />
              </div>

              {/* FAQs Section */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <HelpCircle size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">FAQs</h2>
                      <p className="text-sm text-gray-500">Common questions and answers</p>
                    </div>
                  </div>
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                  >
                    <Plus size={16} />
                    Add FAQ
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          FAQ #{index + 1}
                        </span>
                        <button
                          onClick={() => removeFaq(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFaq(index, "question", e.target.value)}
                            placeholder="Enter question..."
                            className={inputCls}
                          />
                          {errors[`faq_${index}_question`] && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors[`faq_${index}_question`]}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, "answer", e.target.value)}
                            placeholder="Enter answer..."
                            rows={2}
                            className={`${inputCls} resize-none`}
                          />
                          {errors[`faq_${index}_answer`] && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors[`faq_${index}_answer`]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.faqs.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <HelpCircle size={40} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No FAQs added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Click "Add FAQ" to create your first Q&A pair</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <DollarSign size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Pricing Plans</h2>
                      <p className="text-sm text-gray-500">Define your pricing structure</p>
                    </div>
                  </div>
                  <button
                    onClick={addPricing}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                  >
                    <Plus size={16} />
                    Add Plan
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.pricing.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-green-300 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Plan #{index + 1}
                        </span>
                        <button
                          onClick={() => removePricing(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Plan Name</label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => updatePricing(index, "name", e.target.value)}
                            placeholder="e.g., Basic Plan"
                            className={inputCls}
                          />
                          {errors[`pricing_${index}_name`] && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors[`pricing_${index}_name`]}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Price</label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => updatePricing(index, "price", e.target.value)}
                            placeholder="e.g., $9.99/month"
                            className={inputCls}
                          />
                          {errors[`pricing_${index}_price`] && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors[`pricing_${index}_price`]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.pricing.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <DollarSign size={40} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No pricing plans added</p>
                      <p className="text-sm text-gray-400 mt-1">Click "Add Plan" to define your pricing</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Allowed Domains */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <Globe size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Allowed Domains</h2>
                      <p className="text-sm text-gray-500">Restrict where your bot can be embedded</p>
                    </div>
                  </div>
                  <button
                    onClick={addDomain}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                  >
                    <Plus size={16} />
                    Add Domain
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.allowedDomains.map((domain, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => updateDomain(index, e.target.value)}
                        placeholder="example.com"
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        onClick={() => removeDomain(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}

                  {formData.allowedDomains.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No domain restrictions (bot can be embedded anywhere)</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* PREVIEW MODE */
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Eye size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bot Preview</h2>
                  <p className="text-sm text-gray-500">See how your bot will appear to users</p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="max-w-md mx-auto">
                <div className="bg-yellow-500 rounded-2xl p-8 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Bot size={32} />
                    <div>
                      <h3 className="font-bold text-lg">{formData.name || "Your Bot"}</h3>
                      <p className="text-sm text-yellow-100">{formData.industry || "AI Assistant"}</p>
                    </div>
                  </div>

                  <p className="text-sm text-yellow-50 mb-6">
                    {formData.description || "No description provided"}
                  </p>

                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-xs font-semibold mb-1">Language</p>
                      <p className="text-sm">{formData.language}</p>
                    </div>

                    {formData.faqs.length > 0 && (
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs font-semibold mb-1">Sample FAQ</p>
                        <p className="text-sm font-medium">{formData.faqs[0]?.question}</p>
                        <p className="text-xs text-yellow-100 mt-1 line-clamp-2">{formData.faqs[0]?.answer}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <div className="flex-1 h-2 bg-white/20 rounded-full">
                      <div className="w-2/3 h-2 bg-white rounded-full" />
                    </div>
                    <div className="flex-1 h-2 bg-white/20 rounded-full" />
                  </div>
                </div>

                <p className="text-xs text-center text-gray-400 mt-4">
                  This is a preview. Actual appearance may vary.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            {hasUnsavedChanges && (
              <button
                onClick={handleDiscard}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition-all"
              >
                Discard Changes
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
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