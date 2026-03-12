import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Mail } from "lucide-react";

const CookiesPolicy = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-[#f5f0e8]">
      {/* Header */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-[#e8e0d0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Cookie className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Cookies Policy
              </h1>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-sm sm:prose max-w-none text-gray-700 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              This Cookies Policy explains how LinguaBot uses cookies and similar tracking technologies on our website and services. We encourage you to read this policy carefully to understand our cookie practices and your options regarding cookies.
            </p>
          </section>

          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files that are stored on your device (computer, tablet, smartphone) when you visit a website. They contain information about your browsing activities and preferences. Cookies allow websites to remember information about your visit, such as your language preferences, login information, and browsing history.
            </p>
          </section>

          {/* Types of Cookies We Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies are necessary for the basic functioning of our website. They enable you to navigate and use core features such as authentication, security, and performance. Essential cookies cannot be disabled without affecting site functionality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Cookies</h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies collect information about how you use our website, such as which pages you visit, how long you spend on each page, and what errors you encounter. This data helps us improve our services and user experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Functional Cookies</h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies remember your preferences and choices (such as language, region, and user settings) to provide a personalized experience. They enable features like "remember me" functionality and customized content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Marketing Cookies</h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies track your browsing activity across different websites to deliver targeted advertisements and promotional content based on your interests. They may be set by third-party advertising partners.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use analytics cookies (such as Google Analytics) to understand how visitors use our website. These cookies help us analyze traffic patterns, user behavior, and website performance to enhance our services.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookie Duration</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Cookies can be categorized by their lifespan:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Session Cookies:</strong> These are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> These remain on your device for a specified period or until you manually delete them</li>
            </ul>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Our website may contain links to third-party websites and services that set their own cookies. These include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Google Analytics for website analytics and performance monitoring</li>
              <li>Social media platforms (Facebook, Twitter, LinkedIn) for social sharing</li>
              <li>Payment processors for secure transaction handling</li>
              <li>Advertising networks for targeted marketing</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              We are not responsible for the cookie practices of third-party services. Please review their privacy policies for more information.
            </p>
          </section>

          {/* Managing Your Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How to Manage Your Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You have the right to control and manage cookies on your device:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Browser Settings</h3>
                <p className="text-gray-600 leading-relaxed">
                  Most browsers allow you to control cookie preferences through settings. You can choose to accept all cookies, reject all cookies, or be notified when cookies are being set. Please note that disabling essential cookies may affect website functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Opt-Out Options</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can opt out of analytics cookies by installing browser extensions or visiting the provider's opt-out pages. For Google Analytics, visit: <a href="https://tools.google.com/dlpage/gaoptout" className="text-yellow-600 hover:text-yellow-700">https://tools.google.com/dlpage/gaoptout</a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Do Not Track</h3>
                <p className="text-gray-600 leading-relaxed">
                  Some browsers include a "Do Not Track" feature. While we respect this preference, third-party services may not honor this setting.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Consent */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookie Consent</h2>
            <p className="text-gray-600 leading-relaxed">
              When you first visit our website, we display a cookie consent banner allowing you to accept or reject non-essential cookies. Essential cookies for site functionality are used regardless of your consent. You can change your cookie preferences at any time through your browser settings or by contacting us.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Security and Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              We take the security and privacy of cookie data seriously. Sensitive information is encrypted, and cookies do not store personally identifiable information unless you voluntarily provide it. For more details on how we handle your personal data, please review our <Link to="/privacy" className="text-yellow-600 hover:text-yellow-700 font-medium">Privacy Policy</Link>.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Compliance with Regulations</h2>
            <p className="text-gray-600 leading-relaxed">
              LinguaBot complies with applicable data protection and privacy regulations, including the General Data Protection Regulation (GDPR) and local laws. We ensure that cookies are used in accordance with these regulations and user consent requirements.
            </p>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookies Policy periodically to reflect changes in our cookie practices or legal requirements. We will notify you of significant changes by updating the "Last Updated" date at the top of this page.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-yellow-600" />
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions about our cookie practices or need assistance managing your cookie preferences, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@linguabot.com" className="text-yellow-600 hover:text-yellow-700">
                  privacy@linguabot.com
                </a>
              </p>
              <p>
                <strong>Address:</strong> Nagpur, India 445304
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;