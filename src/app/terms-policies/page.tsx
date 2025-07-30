'use client';

export default function TermsPoliciesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms & Policies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive guidelines and policies that govern our services, partnerships, and business operations at SoCTeamup.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Service Policies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Policies</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quality Assurance</h3>
                <p className="text-gray-700 mb-4">
                  SoCTeamup maintains the highest standards of quality in all our semiconductor design services. Our quality assurance processes include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Comprehensive design verification and validation</li>
                  <li>Multi-stage review processes for all deliverables</li>
                  <li>Industry-standard compliance and best practices</li>
                  <li>Continuous improvement and feedback integration</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property Protection</h3>
                <p className="text-gray-700 mb-4">
                  We understand the critical importance of protecting your intellectual property. Our IP protection policies include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Confidentiality agreements for all client engagements</li>
                  <li>Secure development environments and data handling</li>
                  <li>Clear ownership definitions for deliverables</li>
                  <li>Non-disclosure agreements with all team members</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Project Management</h3>
                <p className="text-gray-700 mb-4">
                  Our project management approach ensures timely delivery and transparent communication:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Regular progress updates and milestone tracking</li>
                  <li>Flexible engagement models to suit project requirements</li>
                  <li>Risk assessment and mitigation strategies</li>
                  <li>Post-delivery support and maintenance</li>
                </ul>
              </div>
            </div>

            {/* Partnership Policies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Partnership Policies</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Client Engagement</h3>
                <p className="text-gray-700 mb-4">
                  We believe in building long-term partnerships based on trust, transparency, and mutual success:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Clear communication channels and escalation procedures</li>
                  <li>Dedicated project managers for each engagement</li>
                  <li>Regular stakeholder meetings and progress reviews</li>
                  <li>Flexible engagement models (project-based, retainer, or hybrid)</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Vendor Relationships</h3>
                <p className="text-gray-700 mb-4">
                  Our vendor and partner relationships are governed by strict ethical and quality standards:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Thorough vendor assessment and qualification processes</li>
                  <li>Regular performance reviews and feedback mechanisms</li>
                  <li>Compliance with industry standards and regulations</li>
                  <li>Continuous improvement and capability development</li>
                </ul>
              </div>
            </div>

            {/* Business Policies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Business Policies</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ethics and Compliance</h3>
                <p className="text-gray-700 mb-4">
                  SoCTeamup is committed to maintaining the highest ethical standards in all our business operations:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Zero tolerance for corruption, bribery, or unethical practices</li>
                  <li>Compliance with all applicable laws and regulations</li>
                  <li>Fair and transparent business practices</li>
                  <li>Regular ethics training for all employees</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Environmental Responsibility</h3>
                <p className="text-gray-700 mb-4">
                  We are committed to sustainable business practices and environmental responsibility:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Energy-efficient office operations and equipment</li>
                  <li>Digital-first approach to reduce paper waste</li>
                  <li>Green computing practices in our development processes</li>
                  <li>Partnership with environmentally conscious vendors</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h3>
                <p className="text-gray-700 mb-4">
                  Protecting client data and maintaining security is paramount to our operations:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ISO 27001 compliant information security management</li>
                  <li>Encrypted data transmission and storage</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection and privacy</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Policies?</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about our terms and policies, or would like to discuss how they apply to your specific needs, please don't hesitate to reach out to our team.
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
                  href="mailto:contact@socteamup.com" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Email Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
} 