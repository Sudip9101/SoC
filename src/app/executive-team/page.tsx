'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { Mail } from 'lucide-react';

// Executive Team Data
const executiveTeam = [
  {
    id: 1,
    name: 'Satish Chandra Tiwari',
    title: 'Co-Founder & CEO',
    image: '/team/tiwari.png',
    description: `Accomplished VLSI professional with 15+ years of research and industry experience. Expertise spans DFT/ATPG, tool development, and full-spectrum VLSI design. 
   Proven track record in mentoring teams, managing turnkey engagements, and delivering diverse SoCs across Automotive, Consumer, and Server applications. Collaborated with leading global players like Intel, NXP, Microchip to drive innovation and success`,
    linkedin: 'https://www.linkedin.com/in/satishchandratiwari/',
    email: 'satish@socteamup.com',
    expertise: ['ASIC Design', 'SoC Architecture', 'Advanced Node Technologies', 'Physical Implementation', 'Low-Power Design']
  },
  {
    id: 2,
    name: 'Dr Kunwar Singh',
    title: 'Co-Founder & Director',
    image: '/team/kunwar-singh.png',
    description: `VLSI expert with 15+ years of R&D experience. Co-author of 50+ publications with expertise in AI-driven EDA tool development and emerging technologies. Strong global network in academia, industry, and government, actively engaged in fostering innovation and connecting with startups, entrepreneurs, and investor community`,
    linkedin: 'https://www.linkedin.com/in/ksdelhi/',
    email: 'Kunwar.Singh@socteamup.com',
    expertise: ['Strategic Leadership', 'IC Design', 'R&D Management', 'Digital Design', 'DFT Implementation']
  }
];

export default function ExecutiveTeamPage() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const openModal = (id: number) => {
    setSelectedMember(id);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 text-center bg-white">
        <h1 className="text-5xl font-bold mb-4 text-sky-500">Meet Our Team</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Our philosophy is simple; hire great people and give them the resources and support to do their best work.
        </p>
      </section>

      {/* Team Cards Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 justify-items-center">
          {executiveTeam.map((member) => (
            <div 
              key={member.id}
              className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.title}</p>
                
                {/* Contact Buttons */}
                <div className="flex gap-3 mb-4">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    <FaLinkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a 
                    href={`mailto:${member.email}`} 
                    className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                </div>

                {/* Know More Button */}
                <button
                  onClick={() => openModal(member.id)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const member = executiveTeam.find(m => m.id === selectedMember);
              if (!member) return null;
              
              return (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                      <p className="text-blue-600 font-medium">{member.title}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <div className="text-gray-700 leading-relaxed">
                      {member.description}
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-sky-100 text-sky-800 text-sm rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      <FaLinkedin className="w-4 h-4" /> LinkedIn
                    </a>
                    <a 
                      href={`mailto:${member.email}`} 
                      className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
} 