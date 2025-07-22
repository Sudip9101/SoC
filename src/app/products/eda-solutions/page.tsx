import Image from 'next/image';
import Link from 'next/link';

export default function EDASolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Dark Background and Circuit Pattern */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-24 overflow-hidden">
        {/* Background Circuit Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path d="M100 100 L300 100 L300 200 L500 200 L500 100 L700 100" stroke="currentColor" strokeWidth="2" />
            <path d="M200 300 L400 300 L400 400 L600 400 L600 300 L800 300" stroke="currentColor" strokeWidth="2" />
            <path d="M150 150 L350 150 L350 250 L550 250 L550 150 L750 150" stroke="currentColor" strokeWidth="2" />
            <circle cx="300" cy="100" r="4" fill="currentColor" />
            <circle cx="500" cy="200" r="4" fill="currentColor" />
            <circle cx="600" cy="400" r="4" fill="currentColor" />
            <circle cx="400" cy="300" r="4" fill="currentColor" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold mb-8 leading-tight">
              EDA Solutions
            </h1>
            <div className="h-1 w-24 bg-sky-400 mb-8"></div>
            <h2 className="text-2xl font-light mb-6 text-gray-200">
              OVERVIEW
            </h2>
            <h3 className="text-4xl font-bold mb-8 leading-tight">
              AI-Driven Design-for-Test Platform for Next-Generation SoCs
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
              Our EDA vertical focuses on transforming Design-for-Test into a streamlined, automated, and AI-augmented process. SoCTeamup's DFT IPs are offered as a software platform—enabling test planning, scan chain generation, BIST creation, and fault coverage estimation without the need for deep in-house DFT expertise. Designed for compatibility with both open-source and commercial flows, our EDA tools help startups, SMEs, and academic teams accelerate DFT closure and improve silicon quality. We offer a 10X faster route to DFT-ready designs—making testability scalable, secure, and smarter than ever.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <Image
                  src="/ai.jpeg"
                  alt="EDA Solutions"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
            
            {/* Right: Content */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI-Driven DFT IPs Delivered as a Software Stack
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our EDA vertical is focused on redefining Design-for-Test (DFT) using AI and automation. We are building a suite of DFT IPs bundled as software tools—allowing designers to integrate advanced test architectures without manual effort.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                This revolutionary approach transforms traditional DFT methodology into an intelligent, automated workflow that seamlessly integrates with existing design environments. Our platform leverages machine learning algorithms to optimize test coverage while minimizing area overhead and test time.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                By abstracting complex DFT implementation details into user-friendly software interfaces, we enable design teams to focus on innovation rather than test infrastructure complexity, dramatically reducing development cycles and improving overall silicon quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Offerings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            {/* Right: Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <Image
                  src="/14.jpg"
                  alt="DFT Automation"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
            
            {/* Left: Content */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Key EDA Offerings
              </h2>
              
              <div className="mb-8">
                <ul className="space-y-4 text-lg text-gray-700 mb-8">
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Automated DFT Planning Assistants</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Scan Chain Generation & Balancing Tools</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>BIST IP Generators for logic and memory</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Test Access Security Modules</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>AI-based Fault Coverage Estimators</span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">This software suite enables:</h3>
                <ul className="space-y-3 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Up to 10X faster DFT closure</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Pre-silicon test coverage prediction</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Reusable test architecture across projects</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Seamless plug-in with existing SoC design flows</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                Our DFT-as-a-Platform solution is ideal for startups, universities, and SMEs that need high-quality test infrastructure without deep DFT expertise.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 