import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    Code,
    Zap,
    BarChart3,
    Shield,
    Globe,
    BookOpen,
    CheckCircle,
    ArrowRight,
    Copy,
    Bot,
    Settings,
    DollarSign,
    Link as LinkIcon,
    Rocket,
    Sparkles,
    Phone,
    Mail,
    Clock,
    Gift,
    TrendingUp,
    ExternalLink,
} from "lucide-react";

const HowToMakeBot = () => {
    const [expandedStep, setExpandedStep] = useState(0);
    const [copiedCode, setCopiedCode] = useState(false);

    // Simplified 3-step overview
    const quickSteps = [
        {
            icon: Bot,
            title: "1. Configure",
            description: "Fill in your bot's details, contact info, and business settings.",
        },
        {
            icon: BookOpen,
            title: "2. Train",
            description: "Add FAQs, pricing, and documentation to train your AI.",
        },
        {
            icon: Rocket,
            title: "3. Launch",
            description: "Get your embed code, integrate, and go live.",
        },
    ];

    // Detailed 7 steps (expanded from actual bot data)
    const steps = [
        {
            id: 1,
            title: "Create Your Bot",
            description: "Initialize a new bot from your dashboard",
            details: `Fill in all the essential information about your bot. This includes:
• Bot name (required)
• Description (optional)
• Language (choose from 10+ languages)
• Business type (General, E‑commerce, SaaS, Service, Restaurant)
• Industry (e.g., Technology, Healthcare)
• Website URL (optional)
• Support email & phone
• Support hours & business hours
• Holidays / closures
• Return & refund periods (in days)
• Free trial settings (enable/disable, trial days)
• AI response settings (temperature, max tokens, tone)`,
            tips: [
                "Use a professional bot name that reflects your brand.",
                "Provide accurate contact details – users appreciate it.",
                "Set realistic return/refund days based on your policy.",
                "Adjust AI temperature: lower = more factual, higher = more creative.",
            ],
            icon: Bot,
        },
        {
            id: 2,
            title: "Configure Basic Settings",
            description: "Set language, documentation & behavior",
            details:
                "Configure the bot's language, documentation URL, and other base settings that define how your bot responds and interacts with users.",
            tips: [
                "Choose the primary language of your audience",
                "Add a documentation link if available",
                "Keep configuration simple in the beginning",
            ],
            icon: Settings,
        },
        {
            id: 3,
            title: "Add FAQs & Knowledge Base",
            description: "Train your bot with common user questions",
            details:
                "Add frequently asked questions with structured answers. This acts as your bot's training foundation. The more quality FAQs you add, the smarter your bot becomes.",
            tips: [
                "Add real user questions from support tickets",
                "Keep answers structured & clear",
                "Avoid overly long responses (2-3 sentences ideal)",
                "Continuously update FAQs based on feedback",
            ],
            icon: BookOpen,
        },
        {
            id: 4,
            title: "Set Up Pricing Plans",
            description: "Define monetization strategy",
            details:
                "Create free or paid plans depending on your business model. Define features clearly for each tier to help users understand what they're paying for.",
            tips: [
                "Always start with a free tier to attract users",
                "Keep pricing simple and transparent",
                "Highlight premium features clearly",
                "Consider usage-based pricing for scalability",
            ],
            icon: DollarSign,
        },
        {
            id: 5,
            title: "Train & Generate App Link",
            description: "Train your bot and get a public access link",
            details:
                "Once FAQs and configuration are complete, start training your bot. After training finishes, a public app link will be generated. You can also copy the embed code directly from your bot card using the code button.",
            tips: [
                "Wait for training completion confirmation",
                "Copy the generated app link from the bot card",
                "Use the embed code button (</>) on any bot card",
                "Test integration on staging first",
                "Monitor performance after deployment",
            ],
            icon: LinkIcon,
        },
        {
            id: 6,
            title: "Publish Your Bot",
            description: "Make your bot live",
            details:
                "Review everything one final time and publish your bot. It will now be available to users.",
            tips: [
                "Double-check FAQs & pricing",
                "Test bot responses thoroughly",
                "Ensure integration works properly",
                "Set up monitoring and alerts",
            ],
            icon: Rocket,
        },
        {
            id: 7,
            title: "Monitor & Optimize",
            description: "Track performance and improve",
            details:
                "Use analytics dashboard to track performance and improve based on feedback.",
            tips: [
                "Track engagement and conversation metrics",
                "Improve low-performing responses",
                "A/B test different answer formats",
                "Collect and implement user feedback regularly",
            ],
            icon: BarChart3,
        },
    ];

    const features = [
        { icon: Zap, title: "Lightning Fast", description: "Deploy your bot in minutes, not days" },
        { icon: Globe, title: "Multi-Language", description: "Support 11+ languages globally" },
        { icon: BarChart3, title: "Advanced Analytics", description: "Track every interaction and metric" },
        { icon: Shield, title: "Enterprise Security", description: "Bank-grade encryption & compliance" },
        { icon: Code, title: "Easy Integration", description: "Embed with iframe or API calls" },
        { icon: BookOpen, title: "Full Documentation", description: "Comprehensive guides and tutorials" },
    ];

    const integrationMethods = [
        {
            title: "Iframe Integration (Recommended)",
            description: "Easiest way to embed bot directly on your website",
            code: `<iframe
  src="https://app.linguabot.com/bot/YOUR_BOT_ID"
  width="100%"
  height="600px"
  style="border:none; border-radius: 12px;"
></iframe>`,
            pros: ["No coding required", "Responsive design", "Instant updates"],
        },
        {
            title: "API Integration",
            description: "Advanced integration for custom applications",
            code: `const response = await fetch(
  'https://api.linguabot.com/v1/chat',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      botId: 'YOUR_BOT_ID',
      message: 'User message here'
    })
  }
);`,
            pros: ["Full customization", "Advanced features", "Real-time updates"],
        },
        {
            title: "Chat Widget",
            description: "Floating chat widget for your website",
            code: `<script>
  window.LinguaBotConfig = {
    botId: 'YOUR_BOT_ID',
    position: 'bottom-right'
  };
</script>
<script src="https://cdn.linguabot.com/widget.js"></script>`,
            pros: ["Minimal setup", "Customizable", "Mobile-friendly"],
        },
    ];

    const faqs = [
        {
            q: "How long does it take to deploy a bot?",
            a: "You can have a working bot deployed in 10-15 minutes. Creating FAQs and testing might take 30-60 minutes depending on complexity.",
        },
        {
            q: "Do I need technical knowledge?",
            a: "No! LinguaBot is completely no-code. Anyone can create and deploy a bot using our intuitive dashboard.",
        },
        {
            q: "Can I modify my bot after publishing?",
            a: "Yes! You can edit FAQs, settings, pricing, and responses anytime. Changes take effect immediately.",
        },
        {
            q: "What if my bot needs training?",
            a: "Our AI automatically learns from conversations. You can also manually update FAQs and train data anytime.",
        },
        {
            q: "How much does it cost?",
            a: "Start free! Create and use basic bots at no cost. Premium plans start at $19/month with advanced analytics and customization.",
        },
        {
            q: "Can I have multiple bots?",
            a: "Yes! Create unlimited bots. Each bot has its own configuration, training data, and analytics.",
        },
    ];

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <div className="min-h-screen  bg-gradient-to-r from-[#f3efe6]/80 to-[#e8e1d2]/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                {/* Hero Section with 3-step tagline */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full border border-yellow-200">
                        <Sparkles size={16} className="text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">
                            Get Your Bot in 3 Simple Steps
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                        Create & Deploy Your AI Bot
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Follow our proven process to build, train, monetize and integrate your AI
                        bot into your website. No coding required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            to="/create-bot"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg text-white font-semibold rounded-lg transition-all hover:scale-105"
                        >
                            Start Creating Now
                            <ArrowRight size={18} />
                        </Link>
                        <button
                            onClick={() =>
                                document
                                    .getElementById("integration-section")
                                    .scrollIntoView({ behavior: "smooth" })
                            }
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-200 transition-all"
                        >
                            See Integration Options
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>

                {/* Quick 3-step overview */}
                <div className="mb-20">
                    <div className="grid md:grid-cols-3 gap-6">
                        {quickSteps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center hover:shadow-md transition"
                                >
                                    <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                                        <Icon size={28} className="text-yellow-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                        Powerful Features
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                                        <Icon size={24} className="text-yellow-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detailed Steps Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                        7‑Step Detailed Guide
                    </h2>

                    <div className="space-y-4">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isOpen = expandedStep === index;

                            return (
                                <div
                                    key={step.id}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedStep(isOpen ? -1 : index)
                                        }
                                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1 text-left">
                                            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                                <StepIcon size={22} className="text-yellow-600" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold text-sm">
                                                        {step.id}
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {step.title}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronDown
                                            size={20}
                                            className={`text-gray-400 transition-transform ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 space-y-4">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {step.details}
                                            </p>

                                            <div>
                                                <p className="font-semibold text-sm mb-3 text-gray-900 flex items-center gap-2">
                                                    <Zap size={16} className="text-yellow-500" />
                                                    Best Practices:
                                                </p>
                                                <ul className="space-y-2">
                                                    {step.tips.map((tip, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-gray-600"
                                                        >
                                                            <CheckCircle
                                                                size={16}
                                                                className="text-green-500 flex-shrink-0 mt-0.5"
                                                            />
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Integration Section */}
                <div id="integration-section" className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                        Website Integration Options
                    </h2>
                    <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                        After training completes, you'll receive a public app link. You can also
                        copy the embed code directly from any bot card using the <Code size={16} className="inline" /> button.
                    </p>

                    <div className="space-y-6">
                        {integrationMethods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="px-6 py-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {method.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{method.description}</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="relative">
                                        <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto font-mono">
                                            {method.code}
                                        </pre>
                                        <button
                                            onClick={() => copyCode(method.code)}
                                            className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-green-400 transition-colors"
                                            title="Copy code"
                                        >
                                            {copiedCode ? (
                                                <CheckCircle size={16} />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                        </button>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-blue-900 mb-2">
                                            ✨ Advantages:
                                        </p>
                                        <ul className="space-y-1">
                                            {method.pros.map((pro, i) => (
                                                <li
                                                    key={i}
                                                    className="text-sm text-blue-800 flex items-center gap-2"
                                                >
                                                    <CheckCircle size={14} className="text-blue-600" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 bg-yellow-400 rounded-2xl p-8 text-white text-center space-y-4">
                        <h3 className="text-2xl font-bold">Need Help Integrating?</h3>
                        <p>Check our integration documentation or contact our support team</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#docs"
                                className="px-6 py-2 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
                            >
                                View Documentation
                            </a>
                            <a
                                href="#support"
                                className="px-6 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/50"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {faqs.map((faq, index) => (
                            <FAQCard key={index} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Ready to Launch Your Bot?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Join thousands of businesses using LinguaBot to power their
                        customer support.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            to="/create-bot"
                            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg text-white font-semibold rounded-lg transition-all hover:scale-105"
                        >
                            Create Your Bot Now
                        </Link>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                        >
                            View Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQCard = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
                <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
                <ChevronRight
                    size={20}
                    className={`text-gray-400 transition-transform flex-shrink-0 ${
                        expanded ? "rotate-90" : ""
                    }`}
                />
            </button>

            {expanded && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-600 text-sm leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default HowToMakeBot;