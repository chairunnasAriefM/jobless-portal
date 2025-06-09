// src/components/Navbar.jsx
import React, { useState } from 'react';
// Import Link dari react-scroll
import { Link } from 'react-scroll';
import { Search, Menu, X } from 'lucide-react';

const Logo = () => (
  // Gunakan Link dari react-scroll juga untuk logo agar kembali ke atas dengan mulus
  <Link
    to="home" // Asumsi section paling atas memiliki id="home"
    smooth={true}
    duration={500}
    className="text-2xl font-bold text-white cursor-pointer"
  >
    Jobless<span className="text-orange-500">Portal</span>
  </Link>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // navLinks tidak perlu diubah, kita akan gunakan 'href' sebagai 'to'
  const navLinks = [
    { href: 'find-jobs', text: 'Cari Lowongan' },
    { href: 'how-it-works', text: 'Cara Kerja' },
    { href: 'career-advice', text: 'Tips Karir' },
    { href: 'for-employers-nav', text: 'Untuk Perusahaan' },
  ];

  return (
    // Navbar Anda sticky dengan tinggi h-20 (80px), ini penting untuk 'offset'
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search bar tidak berubah */}
          <div className="hidden md:flex flex-grow max-w-xl mx-8">
            {/* ... kode search bar Anda ... */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ketik posisi, keahlian, atau perusahaan..."
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

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              // GANTI <a> DENGAN <Link>
              <Link
                key={link.text}
                to={link.href} // 'href' menjadi 'to', tanpa '#'
                spy={true} // Untuk menandai link yang aktif
                smooth={true} // Efek smooth scroll
                offset={-80} // Offset scroll sejumlah tinggi navbar Anda (h-20 = 80px)
                duration={500} // Durasi animasi dalam milidetik
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer"
                activeClass="text-white bg-slate-700" // Class untuk link yang sedang aktif
              >
                {link.text}
              </Link>
            ))}
            {/* Tombol Daftar juga bisa menggunakan Link jika section pendaftaran ada di homepage */}
            <Link
              to="signup" // Ganti dengan id section pendaftaran Anda
              smooth={true}
              offset={-80}
              duration={500}
              className="bg-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              Daftar
            </Link>
          </div>

          {/* Tombol menu mobile tidak berubah */}
          <div className="md:hidden flex items-center">
            {/* ... kode tombol menu mobile Anda ... */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* ... kode search bar mobile Anda ... */}
            <div className="relative w-full p-2">
              <input
                type="text"
                placeholder="Cari lowongan..."
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
              <Link
                key={link.text}
                to={link.href}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 cursor-pointer"
                activeClass="text-white bg-slate-700"
                onClick={() => setIsMobileMenuOpen(false)} // Menutup menu setelah di-klik
              >
                {link.text}
              </Link>
            ))}
            <Link
              to="signup"
              smooth={true}
              offset={-80}
              duration={500}
              className="bg-orange-500 text-white block w-full text-center mt-2 px-4 py-2.5 rounded-lg text-base font-semibold hover:bg-orange-600 transition-colors duration-150 shadow-md hover:shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;