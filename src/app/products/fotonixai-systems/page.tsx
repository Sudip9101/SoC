import Image from 'next/image';
import Link from 'next/link';

export default function FotonixAISystemsPage() {
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
              FotonixAI Systems
            </h1>
            <div className="h-1 w-24 bg-sky-400 mb-8"></div>
            <h2 className="text-2xl font-light mb-6 text-gray-200">
              OVERVIEW
            </h2>
            <h3 className="text-4xl font-bold mb-8 leading-tight">
              Smart, AI-Powered Edge Systems for the Physical World
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
              Fotonix.AI is SoCTeamup's system integration vertical that brings silicon and AI together to solve real-world automation and security challenges at the edge. We design and deploy end-to-end smart systems for campuses, societies, institutions, and commercial buildings—combining edge video analytics, biometric security, and connected automation.
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
                  src="/auto.jpeg"
                  alt="FotonixAI Smart Systems"
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
                Intelligent Edge Computing Solutions
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                FotonixAI represents the convergence of our semiconductor expertise with cutting-edge artificial intelligence to create practical, deployable solutions for the physical world. Our systems operate at the edge, processing data locally to ensure real-time responses and enhanced privacy.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                By leveraging our deep understanding of silicon design and AI algorithms, we build systems that are not just smart, but also efficient, secure, and reliable. Our solutions bridge the gap between advanced technology and everyday infrastructure needs.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                From concept to deployment, our integrated approach ensures that every system is optimized for performance, cost-effectiveness, and long-term sustainability in real-world environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Line & Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            {/* Right: Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <Image
                  src="/6.jpeg"
                  alt="Smart Infrastructure"
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
                Fotonix.AI Product Line
              </h2>
              
              <div className="mb-8">
                <ul className="space-y-4 text-lg text-gray-700 mb-8">
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Face Recognition Boom Barriers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Visitor Management Kiosks with OTP and video-call options</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Smart Locks for PGs & Hotels with local face-based access</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Remote site management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Library and Classroom Automation via face recognition</span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Features:</h3>
                <ul className="space-y-3 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Local, on-device video analytics and identity recognition</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Offline-capable systems with edge storage</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Admin dashboards, mobile alerts, and integration with building management systems</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span>Designed, built, and maintained by SoCTeamup's in-house team</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                Fotonix.AI brings together our chip design heritage and AI systems expertise to deliver truly intelligent, secure, and real-time physical infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 