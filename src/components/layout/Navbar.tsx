'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, Shield, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    window.location.href = '/';
  };

  // Navigation order and items
  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Executive Team', href: '/executive-team' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const authNavigation = isLoggedIn 
    ? user?.role === 'admin'
      ? [
          { name: 'Admin Dashboard', href: '/admin/dashboard' },
          { name: 'User Dashboard', href: '/dashboard' },
        ]
      : [
          { name: 'Dashboard', href: '/dashboard' },
        ]
    : [
        { name: 'Login', href: '/login' },
      ];

  const productLinks = [
    { name: 'IPs & SoCs', href: '/products/ips-socs' },
    { name: 'EDA Solutions', href: '/products/eda-solutions' },
    { name: 'FotonixAI Systems', href: '/products/fotonixai-systems' },
    { name: 'View all product', href: '/products' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/Logo.png"
                alt="SocTeamUp"
                width={180}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </Link>
            {/* Navigation - now adjacent to logo */}
            <div className="hidden md:flex items-center space-x-8 ml-8">
              {navigation.map((item) => (
                item.name === 'Products' ? (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() => setShowProductsDropdown((open) => !open)}
                      onBlur={() => setTimeout(() => setShowProductsDropdown(false), 150)}
                      className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {showProductsDropdown && (
                      <div className="absolute left-0 mt-2 w-[1200px] bg-white text-gray-800 rounded-2xl shadow-2xl py-8 px-10 z-50 border border-sky-200 transition-all duration-300 ease-out transform opacity-100 translate-y-0 animate-dropdown">
                        <div className="flex gap-8">
                          {/* Left Column: IPs & SoCs */}
                          <div className="flex-1 group">
                            <Link href="/products/ips-socs" onClick={() => setShowProductsDropdown(false)}>
                              <h3 className="text-lg font-bold text-sky-700 mb-4 uppercase tracking-wide hover:text-sky-600 transition-colors duration-300 cursor-pointer transform hover:scale-105">IPs & SoCs</h3>
                            </Link>
                          </div>

                          {/* Middle Column: EDA Solutions */}
                          <div className="flex-1 group">
                            <Link href="/products/eda-solutions" onClick={() => setShowProductsDropdown(false)}>
                              <h3 className="text-lg font-bold text-sky-700 mb-4 uppercase tracking-wide hover:text-sky-600 transition-colors duration-300 cursor-pointer transform hover:scale-105">EDA Solutions</h3>
                            </Link>
                          </div>

                          {/* Right Column: FotonixAI Systems */}
                          <div className="flex-1 group">
                            <Link href="/products/fotonixai-systems" onClick={() => setShowProductsDropdown(false)}>
                              <h3 className="text-lg font-bold text-sky-700 mb-4 uppercase tracking-wide hover:text-sky-600 transition-colors duration-300 cursor-pointer transform hover:scale-105">FotonixAI Systems</h3>
                            </Link>
                          </div>

                          {/* Far Right: Image and Motto */}
                          <div className="w-80 flex flex-col items-center animate-fade-in">
                            <div className="relative overflow-hidden rounded-xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300">
                              <img src="/pic1.avif" alt="Products" className="w-72 h-48 object-cover transition-transform duration-300 hover:scale-105" />
                              <div className="absolute inset-0 bg-sky-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-sky-700 mb-2 animate-slide-up">Reinventing SoC</h4>
                              <p className="text-sm text-gray-600 leading-relaxed animate-slide-up-delay">
                                Learn about our different design models, determine which is the best fit for your company, and connect with a SoCTeamup representative.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Link */}
                        <div className="mt-8 pt-4 border-t border-sky-200">
                          <Link
                            href="/products"
                            className="text-sky-600 hover:text-sky-800 text-sm font-medium transition-colors duration-300 hover:underline"
                            onClick={() => setShowProductsDropdown(false)}
                          >
                            View Products →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Desktop Authentication Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Authentication Navigation */}
            {!isLoggedIn ? (
              authNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))
            ) : (
              <div className="relative">
                {/* User Menu Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span>{user?.name}</span>
                </button>
                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user?.role === 'admin' ? 'User Dashboard' : 'Dashboard'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              item.name === 'Products' ? (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => setShowProductsDropdown((open) => !open)}
                    className="flex items-center w-full text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {showProductsDropdown && (
                    <div className="mt-1 ml-4 bg-gradient-to-br from-white via-sky-100 to-sky-200 text-gray-900 rounded-2xl shadow-2xl py-6 px-8 z-50 border border-gray-200 transition-all duration-200 ease-out transform opacity-100 translate-y-0 animate-dropdown">
                      {/* Product Links - Vertical Layout for Mobile */}
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {productLinks.map((prod) => (
                          <Link
                            key={prod.name}
                            href={prod.href}
                            className="block px-4 py-3 rounded-lg hover:bg-sky-100 transition text-base font-semibold text-gray-900 text-center border border-gray-300"
                            onClick={() => setShowProductsDropdown(false)}
                          >
                            {prod.name}
                          </Link>
                        ))}
                      </div>
                      
                      {/* Image and Text Section for Mobile */}
                      <div className="flex flex-col items-center pt-4 border-t border-gray-200">
                        <img src="/pic1.avif" alt="Products" className="w-32 h-20 object-cover rounded-lg mb-3" />
                        <p className="text-sm font-medium text-gray-700">About the SoC</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Mobile Authentication Navigation */}
            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {user?.role === 'admin' ? 'User Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              authNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 