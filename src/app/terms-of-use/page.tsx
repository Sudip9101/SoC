'use client';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Use
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of SoCTeamup's services, website, and all related offerings. By using our services, you agree to these terms.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Last Updated */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-blue-800 font-medium">
                <strong>Last Updated:</strong> December 2024
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  By accessing and using SoCTeamup's services, website, and related offerings, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.
                </p>
                <p className="text-gray-700">
                  These terms apply to all users of our services, including clients, partners, and visitors to our website.
                </p>
              </div>
            </div>

            {/* Services Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Services Description</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  SoCTeamup provides semiconductor design services including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Design Verification and Validation</li>
                  <li>Design for Test (DFT) Implementation</li>
                  <li>Physical Design and Layout</li>
                  <li>Analog and Mixed-Signal Design</li>
                  <li>Silicon Layout Services</li>
                  <li>EDA Solutions and IP Development</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to modify, suspend, or discontinue any aspect of our services at any time with reasonable notice.
                </p>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">As a user of our services, you agree to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Provide accurate and complete information when engaging our services</li>
                  <li>Maintain the confidentiality of any account credentials or access information</li>
                  <li>Use our services only for lawful purposes and in accordance with these terms</li>
                  <li>Not attempt to reverse engineer, decompile, or disassemble our software or services</li>
                  <li>Not interfere with or disrupt the operation of our services or servers</li>
                  <li>Respect intellectual property rights and not infringe on third-party rights</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Intellectual Property Rights</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Rights</h3>
                <p className="text-gray-700 mb-4">
                  All content, software, technology, and materials provided by SoCTeamup, including but not limited to designs, documentation, and proprietary tools, remain our exclusive property unless otherwise specified in a written agreement.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Client Rights</h3>
                <p className="text-gray-700 mb-4">
                  Deliverables created specifically for clients under written agreements will be governed by the terms of those agreements. Clients retain rights to their own intellectual property and confidential information.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">License to Use</h3>
                <p className="text-gray-700">
                  We grant you a limited, non-exclusive, non-transferable license to use our services in accordance with these terms and any applicable service agreements.
                </p>
              </div>
            </div>

            {/* Privacy and Data */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Privacy and Data Protection</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms of Use by reference.
                </p>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Limitation of Liability</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by applicable law, SoCTeamup shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
                </p>
                <p className="text-gray-700">
                  Our total liability for any claims arising from the use of our services shall not exceed the amount paid by you for the specific service giving rise to the claim.
                </p>
              </div>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Termination</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Either party may terminate these terms or any service agreement with written notice as specified in the applicable agreement. Upon termination:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Your right to use our services will cease immediately</li>
                  <li>You must return or destroy any confidential information in your possession</li>
                  <li>Provisions relating to intellectual property, confidentiality, and liability shall survive</li>
                </ul>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Governing Law and Dispute Resolution</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or our services shall be resolved through good faith negotiations.
                </p>
                <p className="text-gray-700">
                  If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the Indian Arbitration and Conciliation Act, 1996.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms of Use or need clarification on any provision, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#7233F7' }}
                >
                  Contact Us
                </a>
                <a 
                  href="mailto:legal@socteamup.com" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Legal Team
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
} 