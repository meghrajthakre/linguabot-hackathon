import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Send,
  Sparkles,
  Bot,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "https://x.com/meghraj_thakre1" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/meghraj-thakre-01a09b23a/" },
    { icon: Github, label: "GitHub", href: "https://github.com/meghrajthakre" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/meghrajthakre" },
  ];

  return (
    <>
      <footer className="bg-gradient-to-b from-white via-gray-50 to-[#f5f0e8] border-t border-[#e8e0d0] relative">
        {/* Top Section - Newsletter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Branding */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3 group w-fit">
                <div className="bg-yellow-400 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">
                    LinguaBot
                  </span>
                  <p className="text-xs text-gray-500 font-medium tracking-wide">
                    AI Multilingual Support
                  </p>
                </div>
              </Link>

              <p className="text-gray-600 max-w-sm leading-relaxed">
                Empower your business with intelligent AI bots that understand
                and respond in multiple languages.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 group">
                  <Mail size={16} className="text-yellow-600 flex-shrink-0" />
                  <a
                    href="mailto:meghrajthakre444@gmail.com"
                    className="hover:text-yellow-600 transition-colors duration-200"
                  >
                    meghrajthakre444@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-yellow-600 flex-shrink-0" />
                  <a
                    href="tel:+918390302033"
                    className="hover:text-yellow-600 transition-colors duration-200"
                  >
                    +91 8390302033
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-yellow-600 flex-shrink-0 mt-1" />
                  <span>India, Nagpur 445304</span>
                </div>
              </div>
            </div>

            {/* Right - Newsletter Signup */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-600" />
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-600">
                  Get the latest updates about LinguaBot features and tips.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white border border-[#e8e0d0] rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none text-sm transition duration-200"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                  >
                    <Send size={16} className="text-yellow-600" />
                  </button>
                </div>

                {subscribed && (
                  <div className="text-sm text-green-600 font-medium flex items-center gap-2 p-2 bg-green-50 rounded-lg animate-in fade-in">
                    ✓ Thanks for subscribing!
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>

              {/* Social Links */}
              <div className="flex gap-3 pt-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-yellow-100 text-gray-600 hover:text-yellow-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                      title={social.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[#e8e0d0] to-transparent" />
        </div>

        {/* Bottom Section - Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} LinguaBot. All rights reserved. Made with{" "}
              <span className="text-yellow-500">♥</span>
            </p>

            {/* Quick Links Row */}
            <div className="flex gap-6 flex-wrap">
              <Link
                to="/privacy"
                className="hover:text-yellow-600 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-yellow-600 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="hover:text-yellow-600 transition-colors duration-200"
              >
                Cookies
              </Link>
              <button
                onClick={scrollToTop}
                className="hover:text-yellow-600 transition-colors duration-200 font-medium flex items-center gap-1"
              >
                Back to top <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Smooth Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          showScrollTop
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0 pointer-events-none"
        }`}
        title="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
};

export default Footer;