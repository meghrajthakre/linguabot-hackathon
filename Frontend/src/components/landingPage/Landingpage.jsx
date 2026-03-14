import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, MessageCircle, Zap, Shield, Bot } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => navigate("/signup");
  const handleLogin = () => {
    // Implement login logic or navigation
    navigate("/login");
  };
  const handleViewDemo = () => {
    // Implement demo viewing logic or navigation
    alert("Demo coming soon!");
  }

  return (
    <div className="relative bg-white text-gray-900 overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
          : "bg-white"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                <Bot className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight group-hover:text-yellow-400 transition-all duration-300">LinguaBot</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogin}
              className="px-6 py-2.5 text-gray-700 font-semibold hover:text-yellow-400 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="
    w-full sm:w-auto
    px-5 sm:px-6
    py-2.5 sm:py-2.5
    text-sm sm:text-base
    bg-black text-white
    font-semibold
    rounded-lg
    hover:bg-yellow-400 hover:text-black
    active:scale-95
    transition-all duration-300
  "
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <div className="flex justify-center mb-8 animate-fadeInDown ">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
              <span className="text-sm font-semibold text-gray-700 hover:text-yellow-500">✨ Now Live</span>
              <span className="text-xs text-gray-600 hover:text-yellow-500">AI chatbots for everyone</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center max-w-4xl mx-auto mb-12 space-y-6 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight ">
              Build  AI Chatbot in Minutes
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto hover:text-yellow-500">
              Deploy a conversational AI assistant in minutes. No coding, no
              complexity. Just pure automation that scales with your business.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-yellow-400 hover:text-black active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleViewDemo}
              className="px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-white hover:border-yellow-400 hover:text-yellow-400 active:scale-95 transition-all duration-300 border border-gray-300"
            >
              <p>View Demo</p>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-600 border-t border-gray-200 pt-8 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>2-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HERO IMAGE SECTION ================= */}
      <section className="relative px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative group animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            {/* Subtle shadow effect */}
            <div className="absolute inset-0 bg-gray-900 rounded-2xl opacity-5 blur-2xl transform translate-y-8"></div>

            {/* Chat Interface Mockup */}
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">LinguaBot</p>
                    <p className="text-xs text-gray-500">Always online</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-4 bg-white min-h-96">
                {/* Message 1 */}
                <div className="flex justify-start animate-messageSlideIn">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-gray-900 text-sm">
                      Hey! How can I help you build customer relationships today? 👋
                    </p>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex justify-end animate-messageSlideIn" style={{ animationDelay: "0.2s" }}>
                  <div className="bg-black text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                    <p className="text-sm">I want to automate customer support</p>
                  </div>
                </div>

                {/* Message 3 */}
                <div className="flex justify-start animate-messageSlideIn" style={{ animationDelay: "0.4s" }}>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-sm">
                    <p className="text-gray-900 text-sm mb-3">
                      Perfect! I can handle FAQ, ticket routing, and customer escalations. Setup takes 2 minutes. 🚀
                    </p>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Box */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                    disabled
                  />
                  <button className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors" disabled>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-24 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600">
              Build intelligent conversations without the overhead
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Respond to customers instantly with AI-powered answers trained on your data.",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Natural Conversations",
                description: "Deliver human-like interactions that understand context and intent.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Secure",
                description: "Bank-level encryption and compliance with GDPR, SOC 2, and HIPAA.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-900 hover:bg-yellow-400 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF SECTION ================= */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-8">
            Trusted by teams worldwide
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["TechCorp", "StartupXY", "Enterprise Co", "Growth Inc"].map((company, idx) => (
              <div key={idx} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight hover:text-yellow-500">
            Ready to transform your customer service?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join teams that are already saving hours every week with LinguaBot.
          </p>
          <button
            onClick={handleGetStarted}
            className="group px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-yellow-400 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-400 text-sm mt-6">
            No credit card. Setup in 2 minutes. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-sm hover:text-yellow-500">
              © {currentYear} LinguaBot. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm ">
              <button className=" transition-colors hover:text-yellow-500">Privacy</button>
              <button className=" transition-colors hover:text-yellow-500">Terms</button>
              <button className=" transition-colors hover:text-yellow-500">Contact</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-messageSlideIn {
          animation: messageSlideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        ::-webkit-scrollbar-thumb {
          background: #facc15;
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #eab308;
        }

        /* Firefox scrollbar */
        * {
          scrollbar-color: #facc15 #f3f4f6;
          scrollbar-width: thin;
        }

        /* Remove default input focus outline */
        input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;