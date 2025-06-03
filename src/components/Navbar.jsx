// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Search, Briefcase, Menu, X } from 'lucide-react'; // Menggunakan ikon dari lucide-react

// Anda bisa mengganti ini dengan logo Anda
const Logo = () => (
  <a href="#" className="text-2xl font-bold text-white">
    Job<span className="text-orange-500">Portal</span>
  </a>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#', text: 'Find Jobs' },
    { href: '#', text: 'How It Works' },
    { href: '#', text: 'Career Advice' },
    { href: '#', text: 'For Employers' },
  ];

  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-grow max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by job title, keyword, etc."
                className="w-full py-2.5 pl-4 pr-12 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                {link.text}
              </a>
            ))}
            <a
              href="#"
              className="bg-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative w-full p-2">
               <input
                type="text"
                placeholder="Search jobs..."
                className="w-full py-2.5 pl-4 pr-12 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center mr-2 px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                <Search size={20} />
              </button>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
              >
                {link.text}
              </a>
            ))}
            <a
              href="#"
              className="bg-orange-500 text-white block w-full text-center mt-2 px-4 py-2.5 rounded-lg text-base font-semibold hover:bg-orange-600 transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;