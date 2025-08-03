'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const shortDesc = `SoCTeamup Semiconductors Pvt. Ltd. is a deeptech startup and a full-spectrum semiconductor company, delivering comprehensive solutions across the chip design landscape—from advanced IP development and AI-driven EDA automation to edge AI-enabled systems.`;
  const fullDesc = `SoCTeamup Semiconductors Pvt. Ltd. is a deeptech startup and a full-spectrum semiconductor company, delivering comprehensive solutions across the chip design landscape—from advanced IP development and AI-driven EDA automation to edge AI-enabled systems.

SoCTeamup Semiconductors specializes in the development of cutting-edge semiconductor IPs, particularly in the Design-for-Test (DFT) domain, including logic and memory BIST, scan compression, boundary scan, and secure test access controllers. Proprietary in-house tools are used to enable automated DFT architecture planning, reducing design complexity and accelerating silicon readiness.

In addition to IP development, SoCTeamup Semiconductors offers SoC design services, supporting clients across RTL design, verification, physical implementation, and DFT insertion. Turnkey project execution is also delivered, combining domain expertise with industry-standard methodologies to ensure seamless end-to-end delivery.

At the system level, the FotonixAI vertical of SoCTeamup Semiconductors focuses on building AI-powered edge solutions for security, surveillance, and automation—ranging from face recognition access barriers and smart kiosks to intelligent video analytics systems, all developed and deployed entirely in-house.

With a proven track record of execution from 2nm to mature nodes, SoCTeamup Semiconductors integrates silicon, software, and system-level innovation to power the future of electronics.`;

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && videoRef.current) {
      const video = videoRef.current;
      
      const tryAutoplay = async () => {
        try {
          // Start with muted autoplay (browser-friendly)
          video.muted = true;
          video.currentTime = 0;
          video.volume = 0.7; // Pre-set volume for when unmuted
          await video.play();
          console.log('Video started playing (muted autoplay)');
          setIsVideoPlaying(true);
          
          // Keep playing muted - user can manually unmute using controls
          console.log('Video is playing muted. Use controls to enable sound.');
          
        } catch (error) {
          console.log('Autoplay failed, user interaction required:', error);
          video.muted = false; // Unmute for manual play
          setIsVideoPlaying(false);
        }
      };

      const onLoadedData = () => {
        console.log('Video loaded, attempting autoplay...');
        tryAutoplay();
      };
      
      const onCanPlay = () => {
        console.log('Video can play');
        if (video.paused) {
          tryAutoplay();
        }
      };

      // Ensure video keeps playing when state changes
      const onPause = () => {
        console.log('Video paused');
        setIsVideoPlaying(false);
      };

      const onPlay = () => {
        console.log('Video playing');
        setIsVideoPlaying(true);
      };
      
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('loadeddata', onLoadedData);
      video.addEventListener('pause', onPause);
      video.addEventListener('play', onPlay);
      
      // Force load the video
      video.load();

      return () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('loadeddata', onLoadedData);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('play', onPlay);
      };
    }
  }, [isClient]);

  const handlePlayClick = async () => {
    if (videoRef.current) {
      try {
        // When user clicks, enable sound and play
        videoRef.current.muted = false;
        videoRef.current.volume = 0.7;
        videoRef.current.currentTime = 0; // Restart from beginning
        await videoRef.current.play();
        setIsVideoPlaying(true);
        console.log('Video started with sound via user interaction');
      } catch (error) {
        console.log('Manual play failed:', error);
        // If that fails, try muted play
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsVideoPlaying(true);
          console.log('Video started muted as fallback');
        } catch (mutedError) {
          console.log('Even muted play failed:', mutedError);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Headline Above Video - Fixed Position */}
      <div className="relative z-20 bg-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold slide-in-left" style={{ color: '#624DF4' }}>
            Reinventing SoC Design
          </h1>
        </div>
      </div>

      {/* Hero Video Section - Full Height */}
      <section className="relative h-screen overflow-hidden -mt-20">
        {/* Full-Screen Hero Video */}
        {isClient ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              loop
              playsInline
              controls
              preload="auto"
              onError={() => setVideoError(true)}
            >
              <source src="/SoCTeamup_IC_Design_Solutions.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Click to Play Overlay */}
            {!isVideoPlaying && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer z-10 transition-all duration-300"
                onClick={handlePlayClick}
              >
                <div className="bg-white bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all">
                  <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Fallback for server-side rendering
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
            <p className="text-white text-lg">Loading video...</p>
          </div>
        )}
        
        {/* Show error message if video fails to load */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center z-20">
            <div className="text-center">
              <p className="text-white text-lg mb-4">Unable to load video</p>
              <button 
                onClick={() => {
                  setVideoError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Description Below Image */}
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-left">
              {showFullDesc ? fullDesc : shortDesc}
            </p>
            <div className="text-left">
              {!showFullDesc && (
                <button
                  onClick={() => setShowFullDesc(true)}
                  className="inline-flex items-center text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#7233F7' }}
                >
                  Read more
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Shaping the Future Through Collaborative Innovation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 - Design Verification */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 w-[240px] h-[160px] overflow-hidden rounded-lg flex items-center justify-center">
              <Image
                src="/1.jpg"
                alt="Design Verification"
                width={240}
                height={160}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Design Verification</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              We deliver robust, scalable, and reusable verification environments that ensure first-silicon success for complex SoCs.
            </p>
            <button 
              onClick={() => toggleCardExpansion('verification')}
              className="mt-auto text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#7233F7' }}
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'verification' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Functional Verification (RTL/Subsystem/SoC level)</li>
                    <li>UVM-based testbench architecture and development</li>
                    <li>SystemVerilog assertions and coverage-driven verification</li>
                    <li>Low-power and clock-domain crossing verification</li>
                    <li>Formal Verification and static analysis</li>
                    <li>Regression automation and debug support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Verification IPs (VIPs) for standard and custom protocols</li>
                    <li>Portable testbench architectures</li>
                    <li>Assertion libraries</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Card 2 - Design for Test (DFT) */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 w-[240px] h-[160px] overflow-hidden rounded-lg flex items-center justify-center">
              <Image
                src="/2.jpg"
                alt="Design for Test (DFT)"
                width={240}
                height={160}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Design for Test (DFT)</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              Our DFT services ensure high fault coverage, yield optimization, and efficient silicon debug across technology nodes.
            </p>
            <button 
              onClick={() => toggleCardExpansion('dft')}
              className="mt-auto text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#7233F7' }}
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'dft' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Scan insertion and ATPG support</li>
                    <li>Boundary scan and JTAG integration</li>
                    <li>Memory BIST and Logic BIST implementation</li>
                    <li>Test compression and decompression</li>
                    <li>DFT-aware synthesis and netlist signoff</li>
                    <li>Post-silicon validation and debug support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Plug-and-play BIST IPs</li>
                    <li>Secure test access IP for mission-critical applications</li>
                    <li>Configurable scan controller and wrappers</li>
                    <li>DFX libraries for power, reliability, and safety</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Card 3 - Physical Design */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 w-[240px] h-[160px] overflow-hidden rounded-lg flex items-center justify-center">
              <Image
                src="/3.jpg"
                alt="Physical Design"
                width={240}
                height={160}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Physical Design</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              We provide complete RTL-to-GDSII implementation services tailored for high-performance, low-power, and area-optimized designs.
            </p>
            <button 
              onClick={() => toggleCardExpansion('physical')}
              className="mt-auto text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#7233F7' }}
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'physical' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Floorplanning and power planning</li>
                    <li>Placement, CTS, and routing</li>
                    <li>Timing closure and ECO handling</li>
                    <li>Physical verification (LVS/DRC)</li>
                    <li>IR drop and EM analysis</li>
                    <li>Multi-voltage domain implementation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Automation scripts for STA, PnR, and power optimization</li>
                    <li>Parameterized hard macros</li>
                    <li>Physical-aware IP blocks</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 4 - Analog and Mixed-Signal Design */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 w-[240px] h-[160px] overflow-hidden rounded-lg flex items-center justify-center">
              <Image src="/4.jpg" alt="Analog and Mixed-Signal Design" width={240} height={160} className="object-cover w-full h-full rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Analog and Mixed-Signal Design</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              We support full AMS development across high-speed interfaces, sensor signal chains, power management, and more.
            </p>
            <button 
              onClick={() => toggleCardExpansion('analog')}
              className="mt-auto text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#7233F7' }}
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'analog' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Schematic entry and circuit design</li>
                    <li>Analog layout and device-level LVS/DRC</li>
                    <li>Mixed-signal verification (Verilog-AMS, Spectre, etc.)</li>
                    <li>ADC/DAC design, LDOs, amplifiers, PLLs, and clocking</li>
                    <li>Silicon validation and performance tuning</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Configurable analog IPs (e.g., LDOs, PLLs, bandgaps)</li>
                    <li>Mixed-signal wrappers for digital interface</li>
                    <li>Custom AMS simulation environments</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Keep the existing Silicon Layout card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 w-[240px] h-[160px] overflow-hidden rounded-lg flex items-center justify-center">
              <Image src="/6.jpeg" alt="Silicon Layout" width={240} height={160} className="object-cover w-full h-full rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Silicon Layout</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">We don't just place polygons — we sculpt silicon. Our team handles complex analog and full-custom layouts with deep tech precision, ensuring every transistor, via, and metal layer aligns with your performance and yield goals.</p>
            <Link href="#" className="mt-auto text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: '#7233F7' }}>
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#080225' }}>
  {/* Background geometric lines - similar to the attached image */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Top right geometric shapes */}
    <div className="absolute top-0 right-0 w-96 h-96">
      <div className="absolute top-20 right-20 w-40 h-40 border border-blue-500/20 rounded-lg transform rotate-12"></div>
      <div className="absolute top-40 right-40 w-32 h-32 border border-blue-400/15 rounded-lg transform -rotate-12"></div>
      <div className="absolute top-60 right-10 w-24 h-24 border border-blue-300/10 rounded-lg transform rotate-45"></div>
    </div>
    
    {/* Bottom left geometric shapes */}
    <div className="absolute bottom-0 left-0 w-80 h-80">
      <div className="absolute bottom-20 left-20 w-36 h-36 border border-blue-500/15 rounded-lg transform -rotate-12"></div>
      <div className="absolute bottom-40 left-5 w-28 h-28 border border-blue-400/10 rounded-lg transform rotate-12"></div>
    </div>
    
    {/* Center decorative lines */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
      <div className="absolute top-1/4 left-1/4 w-48 h-48 border border-blue-600/10 rounded-lg transform rotate-45"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border border-blue-500/15 rounded-lg transform -rotate-45"></div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    
    {/* Centered Title and Subtitle */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Industries We Serve
      </h2>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto">
        Our expertise spans a wide range of industries, we help you see the world of Electronics differently.
      </p>
    </div>

    {/* Grid of 5 Horizontal Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      
      {/* Card 1: Semiconductor & Fabless Design Houses */}
      <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
        <div className="aspect-[4/3] overflow-hidden">
          <Image 
            src="/1a.jpg" 
            alt="Semiconductor & Fabless Design Houses" 
            width={300} 
            height={200} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-3">
            Semiconductor & Fabless Design Houses
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Full-spectrum RTL to GDSII support for analog, digital, and mixed-signal SoCs at advanced nodes (2nm–28nm).
          </p>
        </div>
      </div>

      {/* Card 2: Automotive Electronics */}
      <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
        <div className="aspect-[4/3] overflow-hidden">
          <Image 
            src="/auto.jpeg" 
            alt="Automotive Electronics" 
            width={300} 
            height={200} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-3">
            Automotive Electronics
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Functional safety, mission-critical DFT, and AMS design support for ADAS.
          </p>
        </div>
      </div>

      {/* Card 3: Consumer Electronics */}
      <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
        <div className="aspect-[4/3] overflow-hidden">
          <Image 
            src="/4.jpg" 
            alt="Consumer Electronics" 
            width={300} 
            height={200} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-3">
            Consumer Electronics
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            High-volume verification and IP integration for multimedia, smart devices, and edge AI products.
          </p>
        </div>
      </div>

      {/* Card 4: Cloud & AI Infrastructure */}
      <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
        <div className="aspect-[4/3] overflow-hidden">
          <Image 
            src="/ai.jpeg" 
            alt="Cloud & AI Infrastructure" 
            width={300} 
            height={200} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-3">
            Cloud & AI Infrastructure
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            DFT automation and IP support for data center AI accelerators, inference engines, and custom silicon for hyperscalers.
          </p>
        </div>
      </div>

      {/* Card 5: IoT & Edge Computing */}
      <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
        <div className="aspect-[4/3] overflow-hidden">
          <Image 
            src="/aboutus2.jpg" 
            alt="IoT & Edge Computing" 
            width={300} 
            height={200} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-3">
            IoT & Edge Computing
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            IP development and verification for ultra-low-power edge chips, smart sensors, and connectivity solutions.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Our Clients Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Clients
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our client ecosystem is a network of trusted collaborators. Together, we strive to build the next hardware success story. We grow, thrive, and succeed as one.
            </p>
          </div>

          {/* Direct Clients */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Direct Clients</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
              {[
                { name: 'Scaleflux India', logo: '/logo/scale-flux.avif' },
                { name: 'HCL Technologies', logo: '/logo/hcl.png' },
                { name: 'Tessolve', logo: '/logo/tessolve.jpg' },
                { name: 'Cyient', logo: '/logo/cyient-logo-vector.png' },
                { name: 'USTGlobal', logo: '/logo/UST_Global_Logo.jpg' },
                { name: 'QuestGlobal', logo: '/logo/QuestGlobalLogo_250pxwidthx200px.avif' },
                { name: 'Sasken Technologies', logo: '/logo/sasken.png' },
                { name: 'Einfochips', logo: '/logo/einfochips_an_arrow_company_logo_promo.640b5879b753c.avif' }
              ].map((client, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 flex items-center justify-center mx-auto mb-2">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          width={64}
                          height={64}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        {client.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* End Clients Served */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">End Clients Served</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
              {[
                { name: 'Tesla', logo: '/logo/tesla.png' },
                { name: 'Microsoft', logo: '/logo/Microsoft-Logo.png' },
                { name: 'AMD', logo: '/logo/AMD.png' },
                { name: 'Renesas', logo: '/logo/Renesas.png' },
                { name: 'STMicroelectronics', logo: '/logo/stm.png' },
                { name: 'NXP Semiconductor', logo: '/logo/NXP_logo_RGB_web.avif' },
                { name: 'Global Unichip Corporation', logo: '/logo/GUC.png' }
              ].map((client, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 flex items-center justify-center mx-auto mb-2">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          width={64}
                          height={64}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        {client.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}
