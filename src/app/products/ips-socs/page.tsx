import Image from 'next/image';
import Link from 'next/link';

export default function IPsSoCsPage() {
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
              IPs & SoCs
            </h1>
            <div className="h-1 w-24 bg-sky-400 mb-8"></div>
            <h2 className="text-2xl font-light mb-6 text-gray-200">
              OVERVIEW
            </h2>
            <h3 className="text-4xl font-bold mb-8 leading-tight">
              Integration-Ready Semiconductor Solutions for Tomorrow's Devices
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
              SoCTeamup offers a robust portfolio of integration-ready semiconductor IPs and reference SoCs. From advanced DFT IPs—including logic BIST, memory BIST, scan compression, to ongoing development of secure access lightweight SoC platforms, our offerings are tailored for both startups and large-scale design houses. Each IP block is optimized for reusability, scalability, and rapid RTL-to-GDSII implementation across commercial and open-source design environments. With experience of 30+ tapeouts under our belt, we help accelerate your time-to-silicon while reducing design risk and effort.
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
                  src="/1b.jpg"
                  alt="Semiconductor Design"
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
                Modular IPs and Reference SoCs Built for Seamless Integration
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At SoCTeamup, we develop high-performance, production-grade semiconductor IPs and reference SoCs tailored for low-cost, high-efficiency integration. Whether you're a startup building your first ASIC or an academic team prototyping RTL-to-GDSII flows, our IPs are built to plug into your design with ease.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our comprehensive IP portfolio spans across multiple domains, from foundational design-for-test (DFT) solutions to cutting-edge AI hardware blocks. Each IP is rigorously validated through silicon and comes with complete documentation, reference designs, and verification environments to ensure seamless integration into your SoC.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                With a proven track record of 30+ successful tapeouts, SoCTeamup bridges the gap between innovative IP design and practical silicon implementation, enabling faster time-to-market for semiconductor companies worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            {/* Right: Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <Image
                  src="/pic2.jpg"
                  alt="SoC Development"
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
                Our Key IP Offerings
              </h2>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>Automated DFT Insertion IPs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>Logic BIST / Memory BIST</span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>Boundary Scan & Scan Compression</span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>Secure Test Access Controllers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>Reusable DFX Blocks for power, debug, and reliability</span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>UVM Verification IPs and Scoreboards</span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span>Edge AI Hardware Blocks (developed in-house under Fotonix.AI)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 