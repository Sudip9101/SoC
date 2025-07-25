'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { Mail } from 'lucide-react';

// Executive Team Data
const executiveTeam = [
  
  {
    id: 1,
    name: 'Satish Chandra Tiwari',
    title: 'Co-Founder & CEO',
    image: '/team/michael-rodriguez.jpg',
    description: `Michael has 18+ years in ASIC design and verification, with deep expertise in advanced node technologies. He has successfully delivered 20+ complex SoC projects to production, ranging from automotive to high-performance computing applications.

    Before joining SoCTeamup, Michael held senior technical roles at leading semiconductor companies where he architected and implemented cutting-edge design flows for 7nm and 5nm technologies. His experience spans across digital design, physical implementation, and advanced verification methodologies.

    Michael is passionate about innovation and leads our technical vision, ensuring that SoCTeamup stays at the forefront of semiconductor technology evolution. He holds multiple patents in low-power design and high-speed circuit implementation.`,
    linkedin: 'https://linkedin.com/in/michael-rodriguez-cto',
    email: 'michael.rodriguez@socteamup.com',
    expertise: ['ASIC Design', 'SoC Architecture', 'Advanced Node Technologies', 'Physical Implementation', 'Low-Power Design']
  },
  {
    id: 2,
    name: 'Dr Kunwar Singh',
    title: 'Co-Founder & Technology Advisor',
    image: '/team/kunwar-singh.jpg',
    description: `Dr. Singh brings over 15 years of experience in semiconductor design and holds international patents with more than 25 publications in high-performance VLSI design. Previously led R&D teams at major semiconductor companies, spearheading breakthrough innovations in advanced node technologies.

    His expertise spans across digital design, verification methodologies, and DFT implementation. Dr. Singh has successfully managed complex SoC projects from conception to silicon, establishing SoCTeamup as a leader in semiconductor design services. He holds a PhD in Electronics and Communication Engineering and has been instrumental in developing next-generation IP solutions for the industry.

    Under his leadership, SoCTeamup has grown from a startup to a trusted partner for global semiconductor companies, maintaining a focus on quality, innovation, and customer success.`,
    linkedin: 'https://www.linkedin.com/in/ksdelhi/',
    email: 'Kunwar.Singh@socteamup.com',
    expertise: ['Strategic Leadership', 'IC Design', 'R&D Management', 'Digital Design', 'DFT Implementation']
  }
];

// Advisors Data
const advisors = [
  {
    name: 'U S Tandon',
    title: 'Advisor',
    image: '/team/us-tandon.jpg',
    linkedin: 'https://www.linkedin.com/in/us-tandon/',
    email: 'us.tandon@socteamup.com',
    description: `U S Tandon is a seasoned industry veteran with decades of experience in technology leadership and advisory roles. He has guided numerous startups and established companies to success with his strategic vision and mentorship.`
  },
  {
    name: 'Arti Noor',
    title: 'Advisor',
    image: '/team/arti-noor.jpg',
    linkedin: 'https://www.linkedin.com/in/arti-noor/',
    email: 'arti.noor@socteamup.com',
    description: `Arti Noor brings a wealth of expertise in business development and innovation. She has played a pivotal role in scaling organizations and fostering a culture of growth and excellence.`
  },
  {
    name: 'Paras Teotia',
    title: 'Financial Advisor',
    image: '/team/paras-teotia.jpg',
    linkedin: 'https://www.linkedin.com/in/paras-teotia/',
    email: 'paras.teotia@socteamup.com',
    description: `Paras Teotia is a financial strategist with deep experience in corporate finance, investment, and risk management. He provides invaluable guidance on financial planning and sustainable growth.`
  },
];

export default function ExecutiveTeamPage() {
  const [openModal, setOpenModal] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-white">
      {/* Heading and CTA Section */}
      <section className="py-16 text-center bg-white">
        <h1 className="text-5xl font-bold mb-4 text-sky-500 animate-fade-in">Meet our Executive Team</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
          Our philosophy is simple; hire great people and give them the resources and support to do their best work.
        </p>
      </section>

      {/* Executive Cards Row - Centered for 2 people, with Know More modal */}
      <section className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-center items-stretch gap-10 mb-16">
        {executiveTeam.slice(0, 2).map((member, index) => (
          <div 
            key={member.id} 
            className={`flex-1 flex flex-col bg-gray-100 rounded-xl overflow-hidden shadow group max-w-md mx-auto transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-slide-up`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="w-full h-72 bg-gray-200 transition-all duration-500 flex items-center justify-center group-hover:bg-gray-300">
              <Image
                src={member.image}
                alt={member.name}
                width={320}
                height={320}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="bg-white px-6 py-5 flex flex-col flex-1 transition-all duration-300 group-hover:bg-gray-50">
              <div className="font-bold text-gray-900 text-xl mb-1 transition-colors duration-300 group-hover:text-sky-600">{member.name}</div>
              <div className="text-gray-700 text-base mb-4 transition-colors duration-300 group-hover:text-gray-800">{member.title}</div>
              <div className="flex gap-3 mb-4">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium transform hover:scale-105">
                  <FaLinkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm font-medium transform hover:scale-105">
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
              <button
                className="mt-auto bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={() => setOpenModal(member.id)}
              >
                Know More
              </button>
            </div>
            {/* Modal for Know More */}
            {openModal === member.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-xl max-w-lg w-full p-8 relative shadow-lg">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={() => setOpenModal(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{member.name}</h2>
                  <div className="text-blue-600 font-medium mb-4">{member.title}</div>
                  <div className="text-gray-700 whitespace-pre-line mb-4">{member.description}</div>
                  <div className="flex gap-3">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <FaLinkedin className="w-4 h-4" /> LinkedIn
                    </a>
                    <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium">
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Advisors Section as tiles */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <h2 className="text-5xl font-bold text-sky-500 mb-4 text-center animate-fade-in">Meet our Advisors</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center animate-fade-in-delay">
          Our advisors bring a wealth of experience and guidance, helping us achieve excellence and growth.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-10">
          {advisors.map((advisor, idx) => (
            <div 
              key={advisor.name} 
              className={`flex-1 flex flex-col bg-gray-100 rounded-xl overflow-hidden shadow group max-w-md mx-auto transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-slide-up`}
              style={{ animationDelay: `${(idx + 2) * 200}ms` }}
            >
              <div className="w-full h-64 bg-gray-200 transition-all duration-500 flex items-center justify-center group-hover:bg-gray-300">
                <Image
                  src={advisor.image}
                  alt={advisor.name}
                  width={320}
                  height={320}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  onError={e => { e.currentTarget.src = '/team/placeholder.jpg'; }}
                />
              </div>
              <div className="bg-white px-6 py-5 flex flex-col flex-1 transition-all duration-300 group-hover:bg-gray-50">
                <div className="font-bold text-gray-900 text-xl mb-1 transition-colors duration-300 group-hover:text-sky-600">{advisor.name}</div>
                <div className="text-gray-700 text-base mb-2 transition-colors duration-300 group-hover:text-gray-800">{advisor.title}</div>
                <div className="text-gray-600 text-sm mb-4 flex-1 whitespace-pre-line transition-colors duration-300 group-hover:text-gray-700">{advisor.description}</div>
                <div className="flex gap-3 mb-2">
                  <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium transform hover:scale-105">
                    <FaLinkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a href={`mailto:${advisor.email}`} className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm font-medium transform hover:scale-105">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 