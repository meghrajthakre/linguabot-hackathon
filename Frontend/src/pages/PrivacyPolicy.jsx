import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Mail } from "lucide-react";

const PrivacyPolicy = () => {
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
            to="/dashboard"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Privacy Policy
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
              LinguaBot ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We collect information you voluntarily provide when you:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>Create an account or register for our services</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us via email or contact forms</li>
                  <li>Make purchases or payments</li>
                  <li>Participate in surveys or feedback forms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  When you visit our website, we automatically collect:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>IP addresses and device identifiers</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referral sources and navigation patterns</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send confirmation emails</li>
              <li>Send promotional emails and newsletters (with your consent)</li>
              <li>Respond to your inquiries and customer support requests</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations and regulations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use cookies and similar technologies to track activity on our site and enhance your experience. You can instruct your browser to refuse cookies or alert you when cookies are being sent.
            </p>
            <p className="text-gray-600 leading-relaxed">
              For more information about our cookie practices, please see our <Link to="/cookies" className="text-yellow-600 hover:text-yellow-700 font-medium">Cookies Policy</Link>.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We may share information with third-party service providers who assist us in operating our website and conducting our business, including payment processors, analytics providers, and hosting services. These third parties are obligated to use your information only as necessary to provide services to us.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data in portable format</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise these rights, please contact us at{" "}
              <a href="meghrajthakre444@gmail.com" className="text-yellow-600 hover:text-yellow-700 font-medium">
                privacy@linguabot.com
              </a>
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information and terminate the child's account.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by updating the "Last Updated" date at the top of this page. Your continued use of our services constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-yellow-600" />
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:meghrajthakre444@gmail.com" className="text-yellow-600 hover:text-yellow-700">
                  meghrajthakre444@gmail.com
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

export default PrivacyPolicy;