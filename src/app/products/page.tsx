import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/Main picture.jpg"
            alt="AI Technology Background"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              PRODUCTS
            </h1>
            <h2 className="text-3xl md:text-5xl font-light mb-12 leading-tight">
              AI-Ready Technology for a Better Tomorrow
            </h2>
          </div>
        </div>
      </section>

      {/* Products and Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-4">
              PRODUCTS AND SOLUTIONS
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Compute Platform Components
            </h3>
          </div>

                     {/* Product Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* IPs & SoCs Tile */}
             <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
               {/* Image Section */}
               <div className="relative h-48 overflow-hidden">
                 <Image
                   src="/1b.jpg"
                   alt="IPs & SoCs"
                   fill
                   className="object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                     </svg>
                   </div>
                 </div>
               </div>
               
               <div className="p-8">
                 <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300">
                   IPs & SoCs
                 </h4>
                 
                 <h5 className="text-lg font-semibold text-sky-600 mb-4">
                   Modular IPs and Reference SoCs Built for Seamless Integration
                 </h5>
                 
                 <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                   At SoCTeamup, we develop high-performance, production-grade semiconductor IPs and reference SoCs tailored for low-cost, high-efficiency integration. Whether you're a startup building your first ASIC or an academic team prototyping RTL-to-GDSII flows, our IPs are built to plug into your design with ease.
                 </p>
                 
                 <Link
                   href="/products/ips-socs"
                   className="group/btn inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition-all duration-300 transform hover:scale-105"
                 >
                   <span>Explore</span>
                   <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </Link>
               </div>
             </div>

             {/* EDA Solutions Tile */}
             <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
               {/* Image Section */}
               <div className="relative h-48 overflow-hidden">
                 <Image
                   src="/ai.jpeg"
                   alt="EDA Solutions"
                   fill
                   className="object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                                   <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                     </svg>
                   </div>
                 </div>
               </div>
               
               <div className="p-8">
                                   <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                   EDA Solutions
                 </h4>
                 
                 <h5 className="text-lg font-semibold text-blue-600 mb-4">
                   AI-Driven DFT IPs Delivered as a Software Stack
                 </h5>
                 
                 <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                   Our EDA vertical is focused on redefining Design-for-Test (DFT) using AI and automation. We are building a suite of DFT IPs bundled as software tools—allowing designers to integrate advanced test architectures without manual effort.
                 </p>
                 
                 <Link
                   href="/products/eda-solutions"
                   className="group/btn inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                 >
                   <span>Explore</span>
                   <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </Link>
               </div>
             </div>

             {/* FotonixAI Systems Tile */}
             <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
               {/* Image Section */}
               <div className="relative h-48 overflow-hidden">
                 <Image
                   src="/auto.jpeg"
                   alt="FotonixAI Systems"
                   fill
                   className="object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                                   <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                     </svg>
                   </div>
                 </div>
               </div>
               
               <div className="p-8">
                                   <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                   FotonixAI Systems
                 </h4>
                 
                 <h5 className="text-lg font-semibold text-blue-600 mb-4">
                   Smart, AI-Powered Edge Systems for the Physical World
                 </h5>
                 
                 <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                   Fotonix.AI is SoCTeamup's system integration vertical that brings silicon and AI together to solve real-world automation and security challenges at the edge. We design and deploy end-to-end smart systems for campuses, societies, institutions, and commercial buildings—combining edge video analytics, biometric security, and connected automation.
                 </p>
                 
                 <Link
                   href="/products/fotonixai-systems"
                   className="group/btn inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                 >
                   <span>Explore</span>
                   <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </Link>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Ideas into Silicon Reality?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From semiconductor IPs to AI-powered edge systems, SoCTeamup provides the complete technology stack to accelerate your innovation journey.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition-colors duration-300"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
} 