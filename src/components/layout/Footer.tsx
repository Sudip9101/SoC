import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';
import { FaFacebook, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white" style={{ backgroundColor: '#080225' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="SoCTeamUp"
                width={180}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
            <p className="text-gray-300 mb-4">
              Leading semiconductor design services company specializing in Analog, Digital, Mixed-Signal IC design, 
              DFT, Design Verification, Physical IC Design, and Silicon Layout solutions.
            </p>
            <p className="text-gray-400 text-sm">
              Innovating together for the future of semiconductor technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/executive-team" className="text-gray-300 hover:text-white transition-colors">
                  Executive Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">contact@socteamup.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">+91 120 XXX XXXX</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <div>
                  <a 
                    href="https://www.google.com/maps/dir//Sector+29,+Noida,+Uttar+Pradesh/@28.575006884254474,77.38205507452738,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    2nd Floor, PS-1D, Sector 29,<br />
                    Arun Vihar, Noida,<br />
                    Uttar Pradesh 201303, India
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          {/* Social Media Icons Row */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.facebook.com/SoCTeamup/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/company/socteamup/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/socteamup/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="https://github.com/SoCTeamup" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
              <FaGithub className="w-6 h-6" />
            </a>
          </div>
          {/* Policy Links Row */}
          <div className="flex flex-wrap justify-center items-center space-x-4 mb-4 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Policies</a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Use</a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SoCTeamup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 