import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  DollarSign,
  HelpCircle,
  Plus,
  Sparkles,
  Store,
  Code,
  Briefcase,
  Mail,
  Phone,
  Clock,
  Truck,
  RotateCcw,
} from "lucide-react";
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
 * Business type configurations for conditional fields
 */
const BUSINESS_TYPES = [
  { value: "ecommerce", label: "E-Commerce", icon: Store },
  { value: "saas", label: "SaaS / Software", icon: Code },
  { value: "service", label: "Services (Salon, Spa, etc.)", icon: Briefcase },
  { value: "restaurant", label: "Restaurant", icon: Store },
  { value: "healthcare", label: "Healthcare", icon: Briefcase },
  { value: "education", label: "Education", icon: Briefcase },
  { value: "real_estate", label: "Real Estate", icon: Briefcase },
  { value: "finance", label: "Finance", icon: DollarSign },
  { value: "technology", label: "Technology", icon: Code },
  { value: "other", label: "Other", icon: Briefcase },
];

/**
 * Main Improved CreateBot Component
 */
export const CreateBotForm = () => {
  const navigate = useNavigate();
  const { formData, handleChange, validate, reset, errors } = useFormManager();
  const { faqs, addFaq, updateFaq, removeFaq, cleanFaqs } = useFaqManager();
  const { pricing, addPricing, updatePricing, removePricing, cleanPricing } =
    usePricingManager();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [businessTypeExpanded, setBusinessTypeExpanded] = useState(true);

  // Memoize business-type-specific fields configuration
  const businessTypeConfig = useMemo(() => {
    const config = {
      ecommerce: {
        fields: [
          "shippingStandard",
          "shippingExpress",
          "shippingInternational",
          "returnDays",
          "refundDays",
          "returnPolicy",
        ],
        icon: Truck,
        color: "bg-orange-100 text-orange-600",
      },
      saas: {
        fields: ["freeTrial_enabled", "freeTrial_days"],
        icon: Code,
        color: "bg-blue-100 text-blue-600",
      },
      service: {
        fields: ["appointmentDuration", "cancellationPolicy"],
        icon: Briefcase,
        color: "bg-purple-100 text-purple-600",
      },
      restaurant: {
        fields: ["businessHours", "holidays"],
        icon: Store,
        color: "bg-red-100 text-red-600",
      },
      healthcare: {
        fields: ["appointmentDuration", "businessHours", "insuranceAccepted", "licenseInfo"],
        icon: Briefcase,
        color: "bg-green-100 text-green-600",
      },
      education: {
        fields: ["semesterStart", "semesterEnd", "gradeLevels", "subjectsOffered"],
        icon: Briefcase,
        color: "bg-yellow-100 text-yellow-600",
      },
      real_estate: {
        fields: ["propertyTypes", "areasServed", "licenseInfo"],
        icon: Briefcase,
        color: "bg-indigo-100 text-indigo-600",
      },
      finance: {
        fields: ["servicesOffered", "advisorCredentials", "consultationDuration"],
        icon: DollarSign,
        color: "bg-emerald-100 text-emerald-600",
      },
      technology: {
        fields: ["supportTiers", "serviceLevels"],
        icon: Code,
        color: "bg-sky-100 text-sky-600",
      },
      other: {
        fields: ["additionalInfo"],
        icon: Briefcase,
        color: "bg-gray-100 text-gray-600",
      },
    };

    return config[formData.businessType] || {
      fields: [],
      icon: Briefcase,
      color: "bg-gray-100 text-gray-600",
    };
  }, [formData.businessType]);

  const TABS = [
    { id: "basic", label: "Basic Info", icon: Bot, count: 5 },
    { id: "contact", label: "Contact & Hours", icon: Mail, count: 3 },
    { id: "business", label: "Business Details", icon: Sparkles, count: "?" },
    { id: "knowledge", label: "Knowledge Base", icon: HelpCircle, count: 2 },
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
        // Build comprehensive payload with all new fields
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          language: formData.language,
          businessType: formData.businessType,
          industry: formData.industry?.trim(),
          websiteURL: formData.websiteURL?.trim(),

          // Contact information
          supportEmail: formData.supportEmail?.trim(),
          supportPhone: formData.supportPhone?.trim(),
          supportHours: formData.supportHours?.trim(),

          // Business hours
          businessHours: formData.businessHours?.trim(),
          holidays: formData.holidays?.trim(),

          // E-commerce specific
          ...(formData.businessType === "ecommerce" && {
            shippingStandard: formData.shippingStandard?.trim(),
            shippingExpress: formData.shippingExpress?.trim(),
            shippingInternational: formData.shippingInternational?.trim(),
            returnDays: parseInt(formData.returnDays) || 30,
            refundDays: parseInt(formData.refundDays) || 5,
            returnPolicy: formData.returnPolicy?.trim(),
          }),

          // SaaS specific
          ...(formData.businessType === "saas" && {
            freeTrial: {
              enabled: formData.freeTrial_enabled === "true",
              days: parseInt(formData.freeTrial_days) || 14,
            },
          }),

          // Service specific
          ...(formData.businessType === "service" && {
            appointmentDuration: parseInt(formData.appointmentDuration) || 60,
            cancellationPolicy: formData.cancellationPolicy?.trim(),
          }),

          // Healthcare specific
          ...(formData.businessType === "healthcare" && {
            appointmentDuration: formData.appointmentDuration,
            insuranceAccepted: formData.insuranceAccepted,
            licenseInfo: formData.licenseInfo,
          }),

          // Education specific
          ...(formData.businessType === "education" && {
            semesterStart: formData.semesterStart,
            semesterEnd: formData.semesterEnd,
            gradeLevels: formData.gradeLevels,
            subjectsOffered: formData.subjectsOffered,
          }),

          // Real Estate specific
          ...(formData.businessType === "real_estate" && {
            propertyTypes: formData.propertyTypes,
            areasServed: formData.areasServed,
            licenseInfo: formData.licenseInfo,
          }),

          // Finance specific
          ...(formData.businessType === "finance" && {
            servicesOffered: formData.servicesOffered,
            advisorCredentials: formData.advisorCredentials,
            consultationDuration: formData.consultationDuration,
          }),

          // Technology specific
          ...(formData.businessType === "technology" && {
            supportTiers: formData.supportTiers,
            serviceLevels: formData.serviceLevels,
          }),

          // Other specific
          ...(formData.businessType === "other" && {
            additionalInfo: formData.additionalInfo,
          }),

          // Knowledge base
          faqs: cleanFaqs(),
          pricing: cleanPricing(),
          docs: formData.docs?.trim(),
        };

        if (process.env.NODE_ENV === "development") {
          console.log("Creating bot with payload:", payload);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          TIMINGS.API_TIMEOUT
        );

        const response = await api.post("/bots", payload, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const successMessage =
          response.data.message || "Bot created successfully!";
        toast.success(successMessage);

        reset();
        navigate("/dashboard", {
          state: {
            botCreated: true,
            botId: response.data.bot._id,
            businessType: formData.businessType,
          },
        });
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
    <div className="min-h-screen bg-gradient-to-br from-[#F6F1E8] to-[#EDE6D9] px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — FORM (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-b border-yellow-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-yellow-400 p-3 rounded-2xl shadow-sm">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Bot
                </h1>
                <p className="text-sm text-gray-600">
                  Configure your AI assistant with smart defaults for your business
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === id
                      ? "bg-yellow-100 text-yellow-800 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-selected={activeTab === id}
                  role="tab"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 px-8 pb-8 overflow-y-auto"
          >
            <div className="flex-1 space-y-6 py-6">
              {/* BASIC INFO TAB */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="text"
                      label="Bot Name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="My Support Bot"
                      error={errors.name}
                      maxLength={100}
                      showCharCount
                    />

                    <FormInput
                      type="select"
                      label="Business Type"
                      name="businessType"
                      required
                      value={formData.businessType}
                      onChange={handleChange}
                      error={errors.businessType}
                      options={BUSINESS_TYPES.map((type) => ({
                        value: type.value,
                        label: type.label,
                      }))}
                    />
                  </div>

                  <FormInput
                    type="text"
                    label="Industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Electronics Retail, Project Management SaaS"
                    error={errors.industry}
                    helperText="Specific industry for your business type"
                  />

                  <FormInput
                    type="url"
                    label="Website URL"
                    name="websiteURL"
                    required
                    value={formData.websiteURL}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    error={errors.websiteURL}
                    helperText="Your main website URL"
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

                  <FormInput
                    type="textarea"
                    label="Bot Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What does your bot do? e.g., Helps customers with product queries and order tracking..."
                    error={errors.description}
                    maxLength={500}
                    showCharCount
                    rows={3}
                  />

                  <FormInput
                    type="textarea"
                    label="Documentation / Context"
                    name="docs"
                    value={formData.docs}
                    onChange={handleChange}
                    placeholder="Paste product docs, policies, or any text context for the bot..."
                    error={errors.docs}
                    maxLength={10000}
                    showCharCount
                    rows={3}
                    helperText="This helps the bot provide more accurate answers"
                  />
                </div>
              )}

              {/* CONTACT & HOURS TAB */}
              {activeTab === "contact" && (
                <div className="space-y-4 animate-fadeIn">
                  <Section
                    icon={Mail}
                    label="Support Contact"
                    color="bg-blue-100 text-blue-600"
                  >
                    <div className="space-y-3">
                      <FormInput
                        type="email"
                        label="Support Email"
                        name="supportEmail"
                        value={formData.supportEmail}
                        onChange={handleChange}
                        placeholder="support@example.com"
                        error={errors.supportEmail}
                        helperText="Where customers can email for help"
                      />

                      <FormInput
                        type="tel"
                        label="Support Phone"
                        name="supportPhone"
                        value={formData.supportPhone}
                        onChange={handleChange}
                        placeholder="+1-800-SUPPORT"
                        error={errors.supportPhone}
                      />

                      <FormInput
                        type="text"
                        label="Support Hours"
                        name="supportHours"
                        value={formData.supportHours}
                        onChange={handleChange}
                        placeholder="Mon-Fri 9AM-6PM EST"
                        error={errors.supportHours}
                        helperText="e.g., Mon-Fri 9AM-6PM EST, Sat 10AM-4PM"
                      />
                    </div>
                  </Section>

                  <Section
                    icon={Clock}
                    label="Operating Hours"
                    color="bg-purple-100 text-purple-600"
                  >
                    <div className="space-y-3">
                      <FormInput
                        type="text"
                        label="Business Hours"
                        name="businessHours"
                        value={formData.businessHours}
                        onChange={handleChange}
                        placeholder="Mon-Fri 9AM-9PM, Sat 10AM-8PM, Sun 12PM-6PM"
                        error={errors.businessHours}
                        helperText="When your physical location or business operates"
                      />

                      <FormInput
                        type="text"
                        label="Holidays / Closures"
                        name="holidays"
                        value={formData.holidays}
                        onChange={handleChange}
                        placeholder="Closed: Christmas, New Year's, Thanksgiving"
                        error={errors.holidays}
                        helperText="Days when you're closed"
                      />
                    </div>
                  </Section>
                </div>
              )}

              {/* BUSINESS-TYPE SPECIFIC TAB */}
              {activeTab === "business" && (
                <div className="space-y-4 animate-fadeIn">
                  {!formData.businessType ? (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                      <p className="text-blue-900">
                        ← Go back to Basic Info and select a Business Type first
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* E-COMMERCE SPECIFIC FIELDS */}
                      {formData.businessType === "ecommerce" && (
                        <Section
                          icon={Truck}
                          label="Shipping & Returns"
                          color="bg-orange-100 text-orange-600"
                        >
                          <div className="space-y-4">
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <h4 className="font-semibold text-sm text-orange-900 mb-3">
                                Shipping Options
                              </h4>
                              <div className="space-y-3">
                                <FormInput
                                  type="text"
                                  label="Standard Shipping"
                                  name="shippingStandard"
                                  value={formData.shippingStandard}
                                  onChange={handleChange}
                                  placeholder="3-5 business days (FREE over $50)"
                                  helperText="e.g., timing and cost"
                                />

                                <FormInput
                                  type="text"
                                  label="Express Shipping"
                                  name="shippingExpress"
                                  value={formData.shippingExpress}
                                  onChange={handleChange}
                                  placeholder="1-2 business days ($9.99)"
                                />

                                <FormInput
                                  type="text"
                                  label="International Shipping"
                                  name="shippingInternational"
                                  value={formData.shippingInternational}
                                  onChange={handleChange}
                                  placeholder="10-21 business days"
                                />
                              </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-sm text-red-900 mb-3">
                                Return & Refund Policy
                              </h4>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <FormInput
                                    type="number"
                                    label="Return Window (days)"
                                    name="returnDays"
                                    value={formData.returnDays}
                                    onChange={handleChange}
                                    placeholder="30"
                                    min="0"
                                    max="365"
                                  />

                                  <FormInput
                                    type="number"
                                    label="Refund Processing (days)"
                                    name="refundDays"
                                    value={formData.refundDays}
                                    onChange={handleChange}
                                    placeholder="5"
                                    min="0"
                                    max="30"
                                  />
                                </div>

                                <FormInput
                                  type="textarea"
                                  label="Return Policy Details"
                                  name="returnPolicy"
                                  value={formData.returnPolicy}
                                  onChange={handleChange}
                                  placeholder="30-day money-back guarantee. Original packaging required. Free return shipping on all orders."
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        </Section>
                      )}

                      {/* SAAS SPECIFIC FIELDS */}
                      {formData.businessType === "saas" && (
                        <Section
                          icon={Code}
                          label="Free Trial Settings"
                          color="bg-blue-100 text-blue-600"
                        >
                          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="freeTrial_enabled"
                                checked={formData.freeTrial_enabled === "true"}
                                onChange={(e) =>
                                  handleChange({
                                    target: {
                                      name: "freeTrial_enabled",
                                      value: e.target.checked ? "true" : "false",
                                    },
                                  })
                                }
                                className="w-4 h-4"
                              />
                              <label
                                htmlFor="freeTrial_enabled"
                                className="text-sm font-medium text-gray-700"
                              >
                                Offer free trial
                              </label>
                            </div>

                            {formData.freeTrial_enabled === "true" && (
                              <FormInput
                                type="number"
                                label="Trial Duration (days)"
                                name="freeTrial_days"
                                value={formData.freeTrial_days}
                                onChange={handleChange}
                                placeholder="14"
                                min="1"
                                max="90"
                              />
                            )}
                          </div>
                        </Section>
                      )}

                      {/* SERVICE SPECIFIC FIELDS */}
                      {formData.businessType === "service" && (
                        <Section
                          icon={Briefcase}
                          label="Service Details"
                          color="bg-purple-100 text-purple-600"
                        >
                          <div className="space-y-3 bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <FormInput
                              type="number"
                              label="Default Appointment Duration (minutes)"
                              name="appointmentDuration"
                              value={formData.appointmentDuration}
                              onChange={handleChange}
                              placeholder="60"
                              min="15"
                              max="480"
                              helperText="How long a typical appointment lasts"
                            />

                            <FormInput
                              type="textarea"
                              label="Cancellation Policy"
                              name="cancellationPolicy"
                              value={formData.cancellationPolicy}
                              onChange={handleChange}
                              placeholder="24 hours notice required. Cancellations within 24 hours forfeit 50% of payment."
                              rows={3}
                            />
                          </div>
                        </Section>
                      )}

                      {/* HEALTHCARE SPECIFIC FIELDS */}
                      {formData.businessType === "healthcare" && (
                        <Section
                          icon={Briefcase}
                          label="Healthcare Details"
                          color="bg-green-100 text-green-600"
                        >
                          <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
                            <FormInput
                              type="number"
                              label="Appointment Duration (minutes)"
                              name="appointmentDuration"
                              value={formData.appointmentDuration}
                              onChange={handleChange}
                              placeholder="60"
                              min="15"
                              max="480"
                            />
                            <FormInput
                              type="text"
                              label="Business Hours"
                              name="businessHours"
                              value={formData.businessHours}
                              onChange={handleChange}
                              placeholder="Mon-Fri 9AM-5PM, Sat 9AM-12PM"
                            />
                            <FormInput
                              type="text"
                              label="Insurance Accepted"
                              name="insuranceAccepted"
                              value={formData.insuranceAccepted}
                              onChange={handleChange}
                              placeholder="e.g., Blue Cross, Aetna, Medicare"
                            />
                            <FormInput
                              type="text"
                              label="License / Certification Info"
                              name="licenseInfo"
                              value={formData.licenseInfo}
                              onChange={handleChange}
                              placeholder="e.g., Board Certified, License #12345"
                            />
                          </div>
                        </Section>
                      )}

                      {/* EDUCATION SPECIFIC FIELDS */}
                      {formData.businessType === "education" && (
                        <Section
                          icon={Briefcase}
                          label="Education Details"
                          color="bg-yellow-100 text-yellow-600"
                        >
                          <div className="space-y-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="grid grid-cols-2 gap-3">
                              <FormInput
                                type="text"
                                label="Semester Start"
                                name="semesterStart"
                                value={formData.semesterStart}
                                onChange={handleChange}
                                placeholder="e.g., Fall 2025"
                              />
                              <FormInput
                                type="text"
                                label="Semester End"
                                name="semesterEnd"
                                value={formData.semesterEnd}
                                onChange={handleChange}
                                placeholder="e.g., Spring 2026"
                              />
                            </div>
                            <FormInput
                              type="text"
                              label="Grade Levels"
                              name="gradeLevels"
                              value={formData.gradeLevels}
                              onChange={handleChange}
                              placeholder="e.g., K-12, Higher Ed"
                            />
                            <FormInput
                              type="text"
                              label="Subjects Offered"
                              name="subjectsOffered"
                              value={formData.subjectsOffered}
                              onChange={handleChange}
                              placeholder="e.g., Math, Science, Literature"
                            />
                          </div>
                        </Section>
                      )}

                      {/* REAL ESTATE SPECIFIC FIELDS */}
                      {formData.businessType === "real_estate" && (
                        <Section
                          icon={Briefcase}
                          label="Real Estate Details"
                          color="bg-indigo-100 text-indigo-600"
                        >
                          <div className="space-y-3 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <FormInput
                              type="text"
                              label="Property Types"
                              name="propertyTypes"
                              value={formData.propertyTypes}
                              onChange={handleChange}
                              placeholder="e.g., Residential, Commercial, Land"
                            />
                            <FormInput
                              type="text"
                              label="Areas Served"
                              name="areasServed"
                              value={formData.areasServed}
                              onChange={handleChange}
                              placeholder="e.g., Downtown, Suburbs"
                            />
                            <FormInput
                              type="text"
                              label="License Info"
                              name="licenseInfo"
                              value={formData.licenseInfo}
                              onChange={handleChange}
                              placeholder="e.g., Licensed Realtor #12345"
                            />
                          </div>
                        </Section>
                      )}

                      {/* FINANCE SPECIFIC FIELDS */}
                      {formData.businessType === "finance" && (
                        <Section
                          icon={DollarSign}
                          label="Finance Details"
                          color="bg-emerald-100 text-emerald-600"
                        >
                          <div className="space-y-3 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                            <FormInput
                              type="text"
                              label="Services Offered"
                              name="servicesOffered"
                              value={formData.servicesOffered}
                              onChange={handleChange}
                              placeholder="e.g., Tax Planning, Wealth Management"
                            />
                            <FormInput
                              type="text"
                              label="Advisor Credentials"
                              name="advisorCredentials"
                              value={formData.advisorCredentials}
                              onChange={handleChange}
                              placeholder="e.g., CFP, CFA"
                            />
                            <FormInput
                              type="number"
                              label="Consultation Duration (minutes)"
                              name="consultationDuration"
                              value={formData.consultationDuration}
                              onChange={handleChange}
                              placeholder="60"
                              min="15"
                              max="240"
                            />
                          </div>
                        </Section>
                      )}

                      {/* TECHNOLOGY SPECIFIC FIELDS */}
                      {formData.businessType === "technology" && (
                        <Section
                          icon={Code}
                          label="Technology Details"
                          color="bg-sky-100 text-sky-600"
                        >
                          <div className="space-y-3 bg-sky-50 p-4 rounded-lg border border-sky-200">
                            <FormInput
                              type="text"
                              label="Support Tiers"
                              name="supportTiers"
                              value={formData.supportTiers}
                              onChange={handleChange}
                              placeholder="e.g., Basic, Premium, Enterprise"
                            />
                            <FormInput
                              type="text"
                              label="Service Levels"
                              name="serviceLevels"
                              value={formData.serviceLevels}
                              onChange={handleChange}
                              placeholder="e.g., SLA, Uptime Guarantee"
                            />
                          </div>
                        </Section>
                      )}

                      {/* OTHER BUSINESS TYPE — generic additional info */}
                      {formData.businessType === "other" && (
                        <Section
                          icon={Briefcase}
                          label="Additional Information"
                          color="bg-gray-100 text-gray-600"
                        >
                          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <FormInput
                              type="textarea"
                              label="Any other details customers should know"
                              name="additionalInfo"
                              value={formData.additionalInfo}
                              onChange={handleChange}
                              placeholder="e.g., Special offers, unique policies..."
                              rows={4}
                            />
                          </div>
                        </Section>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* KNOWLEDGE BASE TAB */}
              {activeTab === "knowledge" && (
                <div className="space-y-5 animate-fadeIn">
                  <Section
                    icon={HelpCircle}
                    label="FAQs"
                    color="bg-blue-100 text-blue-600"
                  >
                    <div className="space-y-3">
                      {faqs.length === 0 && (
                        <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded">
                          No FAQs added yet. Add at least 5-10 for best results.
                        </p>
                      )}
                      {faqs.map((faq, i) => (
                        <FaqItem
                          key={i}
                          faq={faq}
                          index={i}
                          onUpdate={updateFaq}
                          onRemove={removeFaq}
                          businessType={formData.businessType}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-xl hover:bg-blue-50 transition w-full border border-dashed border-blue-300"
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
                        <div className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
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
                        className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium px-4 py-2.5 rounded-xl border border-dashed border-green-300 hover:bg-green-50 transition w-full"
                      >
                        <Plus size={15} />
                        Add Pricing Plan
                      </button>
                    </div>
                  </Section>
                </div>
              )}
            </div>

            {/* Footer - Sticky */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {activeTab !== "knowledge" && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabIds = TABS.map((t) => t.id);
                      const currentIndex = tabIds.indexOf(activeTab);
                      if (currentIndex < tabIds.length - 1) {
                        setActiveTab(tabIds[currentIndex + 1]);
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-yellow-400 text-yellow-700 text-sm font-medium hover:bg-yellow-50 transition"
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

        {/* RIGHT — CHAT PREVIEW (1/3 width) */}
        <div className="lg:col-span-1">
          <ChatPreview
            botName={formData.name}
            botDescription={formData.description}
            businessType={formData.businessType}
          />

          {/* Quick Info Card */}
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles size={18} />
              Bot Configuration
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Business Type:</span>
                <span className="font-medium text-gray-900">
                  {formData.businessType
                    ? BUSINESS_TYPES.find((t) => t.value === formData.businessType)
                        ?.label
                    : "Not selected"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium text-gray-900">
                  {LANGUAGES.find((l) => l.value === formData.language)?.label ||
                    "English"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">FAQs:</span>
                <span className="font-medium text-blue-600">{faqs.length}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Pricing Plans:</span>
                <span className="font-medium text-green-600">{pricing.length}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  ✓ All required fields are{" "}
                  <span className="font-medium">highlighted</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateBotForm;