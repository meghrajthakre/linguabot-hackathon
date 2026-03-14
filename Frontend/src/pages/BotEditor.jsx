import React, { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Save, Plus, Trash2, AlertCircle, CheckCircle, ArrowLeft, 
  Globe, FileText, DollarSign, HelpCircle, Bot, Sparkles,
  X, Edit3, Eye, Copy, Check
} from "lucide-react";
import api from "../api/axios";

const inputCls = "w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all placeholder:text-gray-400 shadow-sm hover:border-gray-300";
const labelCls = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";

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

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "English",
    businessType: "general",
    industry: "",
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
        
        const botData = {
          name: data.name || "",
          description: data.description || "",
          language: data.language || "English",
          businessType: data.businessType || "general",
          industry: data.industry || "",
          faqs: data.faqs || [],
          pricing: data.pricing || [],
          docs: data.docs || "",
          allowedDomains: data.allowedDomains || [],
          isActive: data.isActive !== undefined ? data.isActive : true
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
    
    // Clear error for this field
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
      
      // Prepare data for API
      const apiData = {
        ...formData,
        // Ensure empty strings for optional fields
        industry: formData.industry || undefined,
        docs: formData.docs || undefined
      };

      await api.put(`/bots/${id}`, apiData);
      
      setInitialData(formData);
      
      toast.success("Bot updated successfully", {
        icon: '✅',
        duration: 3000,
        style: toastStyle
      });

      // Navigate after short delay
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

  /* ================= COPY PUBLIC KEY ================= */
  const copyPublicKey = async () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
                onClick={copyPublicKey}
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
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
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-200"
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-200"
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
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200"
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
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
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
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
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