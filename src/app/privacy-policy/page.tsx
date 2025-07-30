'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and safeguard your data.
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

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  We may collect the following types of personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Name, email address, and contact information</li>
                  <li>Company name and job title</li>
                  <li>Project requirements and technical specifications</li>
                  <li>Communication preferences and history</li>
                  <li>Payment and billing information (processed securely)</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Technical Information</h3>
                <p className="text-gray-700 mb-4">
                  When you visit our website or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>IP address and browser information</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Device information and operating system</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Providing and improving our semiconductor design services</li>
                  <li>Communicating with you about projects and services</li>
                  <li>Processing payments and managing billing</li>
                  <li>Sending important updates and notifications</li>
                  <li>Analyzing website usage to improve user experience</li>
                  <li>Complying with legal obligations and regulations</li>
                </ul>
                <p className="text-gray-700">
                  We will only use your information for purposes that are compatible with the original purpose of collection, unless we obtain your consent for other uses.
                </p>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Information Sharing and Disclosure</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our business (e.g., payment processors, cloud storage)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Protection:</strong> To protect our rights, property, or safety, or that of our users</li>
                </ul>
                <p className="text-gray-700">
                  All third-party service providers are contractually obligated to maintain the confidentiality and security of your information.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Data Security</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and vulnerability testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection and privacy</li>
                  <li>Incident response procedures and monitoring</li>
                </ul>
                <p className="text-gray-700">
                  While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but we continuously work to maintain the highest standards of data protection.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Data Retention</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Active client information: Retained for the duration of our business relationship plus 7 years for legal compliance</li>
                  <li>Website analytics data: Retained for 2 years</li>
                  <li>Marketing communications: Retained until you opt out</li>
                  <li>Technical logs: Retained for 90 days for security monitoring</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Your Rights and Choices</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications at any time</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, please contact us using the information provided at the end of this policy.
                </p>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Cookies and Tracking Technologies</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience on our website:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with your consent)</li>
                </ul>
                <p className="text-gray-700">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. International Data Transfers</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Your personal information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We use standard contractual clauses approved by relevant authorities</li>
                  <li>We implement appropriate safeguards for international transfers</li>
                  <li>We ensure that third-party service providers maintain adequate protection</li>
                </ul>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Children's Privacy</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700">
                  Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to This Policy</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Updating the "Last Updated" date at the top of this policy</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">privacy@socteamup.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-700">
                    2nd Floor, PS-1D, Sector 29,<br />
                    Arun Vihar, Noida,<br />
                    Uttar Pradesh 201303, India
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#7233F7' }}
                >
                  Contact Us
                </a>
                <a 
                  href="mailto:privacy@socteamup.com" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Privacy Team
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
} 