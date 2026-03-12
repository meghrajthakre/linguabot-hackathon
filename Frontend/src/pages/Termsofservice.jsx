import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Mail } from "lucide-react";

const TermsOfService = () => {
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
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Terms of Service
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
              These Terms of Service ("Terms") constitute a legally binding agreement between you and LinguaBot ("Company," "we," "us," or "our") governing your access to and use of our website, services, and products. By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our services.
            </p>
          </section>

          {/* User Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. User Eligibility</h2>
            <p className="text-gray-600 leading-relaxed">
              By using LinguaBot services, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>You are at least 18 years of age or the age of majority in your jurisdiction</li>
              <li>You have the legal authority to enter into this agreement</li>
              <li>You are not prohibited from accessing our services under applicable laws</li>
              <li>You will comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptable Use Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You agree not to use our services for any unlawful or prohibited purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Violating any applicable laws, regulations, or third-party rights</li>
              <li>Transmitting malware, viruses, or malicious code</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Harassing, abusing, or threatening other users or staff members</li>
              <li>Posting offensive, defamatory, or discriminatory content</li>
              <li>Spamming, phishing, or engaging in fraudulent activities</li>
              <li>Reverse engineering or attempting to derive source code</li>
              <li>Interfering with the operation of our services</li>
            </ul>
          </section>

          {/* Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Intellectual Property Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All content, features, and functionality of our services, including text, graphics, logos, images, and software, are the exclusive property of LinguaBot or its licensors. You are granted a limited, non-exclusive, non-transferable license to use our services for personal and business purposes only.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may not reproduce, distribute, modify, or transmit any content without prior written permission from LinguaBot. Any unauthorized use may violate copyright, trademark, and other applicable laws.
            </p>
          </section>

          {/* User-Generated Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User-Generated Content</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By submitting content to our services, you retain ownership but grant LinguaBot a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your content.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You represent and warrant that you own or have the necessary rights to any content you submit, and that it does not infringe upon third-party rights.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              TO THE FULLEST EXTENT PERMITTED BY LAW, LINGUABOT SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damage to reputation or goodwill</li>
              <li>Any damages arising from service interruptions or unavailability</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Our total liability shall not exceed the amount you have paid us in the past 12 months.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for conduct that we believe:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Violates these Terms or our policies</li>
              <li>Is harmful to other users or third parties</li>
              <li>Violates applicable laws or regulations</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              You may terminate your account at any time by contacting us in writing.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless LinguaBot and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may modify these Terms at any time. Changes will be effective upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified Terms. We recommend reviewing these Terms periodically.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-yellow-600" />
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions or concerns about these Terms of Service, please contact us:
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

export default TermsOfService;