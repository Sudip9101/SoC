'use client';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Developer <span className="text-primary-600">Resources</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Coming Soon - Comprehensive developer documentation, tools, and resources for SoCTeamup integration.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              What's Coming
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">API Documentation</h3>
                <p className="text-gray-600">Complete REST API reference with examples and integration guides.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SDK & Tools</h3>
                <p className="text-gray-600">Development kits and tools for seamless SoCTeamup integration.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Code Examples</h3>
                <p className="text-gray-600">Sample implementations and best practices for common use cases.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 