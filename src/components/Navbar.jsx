// src/components/Navbar.jsx
import React, { useState } from 'react';
// Ganti RouterLink menjadi NavLink untuk mendapatkan status 'isActive'
import { useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { HashLink } from 'react-router-hash-link';
import { Search, Menu, X } from 'lucide-react';

// Logo selalu menggunakan HashLink agar bisa kembali ke atas dari halaman manapun
const Logo = () => (
  <HashLink smooth to="/#home" className="text-2xl font-bold text-white cursor-pointer">
    Jobless<span className="text-orange-500">Portal</span>
  </HashLink>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const onHomepage = location.pathname === '/';

  const scrollLinks = [
    { href: 'why-choose-us', text: 'Kenapa Pilih Kami' },
    { href: 'testimoni', text: 'Testimoni' },
    // { href: 'for-employers-nav', text: 'Untuk Perusahaan' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Komponen Link Dinamis yang "Pintar" (Tidak ada perubahan di sini)
  const ConditionalNavLink = ({ to, children, isMobile = false }) => {
    const baseClasses = "text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors duration-150 cursor-pointer";
    const mobileClasses = `block px-3 py-2 text-base font-medium ${baseClasses}`;
    const desktopClasses = `px-3 py-2 text-sm font-medium ${baseClasses}`;

    if (onHomepage) {
      return (
        <ScrollLink
          to={to} spy smooth offset={-80} duration={500}
          className={isMobile ? mobileClasses : desktopClasses}
          activeClass="text-white bg-slate-700"
          onClick={isMobile ? closeMobileMenu : undefined}
        >
          {children}
        </ScrollLink>
      );
    }
    return (
      <HashLink
        to={`/#${to}`} smooth
        onClick={isMobile ? closeMobileMenu : undefined}
        className={isMobile ? mobileClasses : desktopClasses}
      >
        {children}
      </HashLink>
    );
  };

  // Definisikan style di luar agar mudah dibaca
  const baseLinkStyle = "px-3 py-2 rounded-md text-sm font-medium";
  const normalStyle = `text-gray-300 hover:bg-slate-700 hover:text-white ${baseLinkStyle}`;
  const activeStyle = `text-white bg-slate-700 ${baseLinkStyle}`;


  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* <div className="hidden md:flex flex-grow max-w-xl mx-8">
            <div className="relative w-full">
              <input type="text" placeholder="Ketik posisi, keahlian, atau perusahaan..." className="w-full py-2.5 pl-4 pr-12 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600">
                <Search size={20} />
              </button>
            </div>
          </div> */}

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* ====== PERUBAHAN DI SINI ====== */}
            {/* Ganti RouterLink menjadi RouterNavLink dan gunakan fungsi untuk className */}
            <RouterNavLink
              to="/lowongan"
              className={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              Cari Lowongan
            </RouterNavLink>

            {scrollLinks.map((link) => (
              <ConditionalNavLink key={link.text} to={link.href}>
                {link.text}
              </ConditionalNavLink>
            ))}

            {/* // Ganti dua <HashLink> Anda dengan div ini */}

            <div className="hidden md:flex items-center space-x-3">

              <HashLink
                to="/EmployerSignIN"
                smooth
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Pasang Lowongan
              </HashLink>

              <HashLink
                to="/#signup"
                smooth
                className="bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Sign In
              </HashLink>

            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* ... Search bar mobile ... */}

            {/* ====== PERUBAHAN DI SINI JUGA (untuk mobile) ====== */}
            <RouterNavLink
              to="/lowongan"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-slate-700' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
              }
            >
              Cari Lowongan
            </RouterNavLink>



            {scrollLinks.map((link) => (
              <ConditionalNavLink key={link.text} to={link.href} isMobile={true}>
                {link.text}
              </ConditionalNavLink>
            ))}

            <RouterNavLink
              to="/EmployerSignIN"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-slate-700' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
              }
            >
              Pasang Lowongan
            </RouterNavLink>

            <HashLink to="/#signup" smooth onClick={closeMobileMenu} className="bg-orange-500 text-white block w-full text-center mt-2 px-4 py-2.5 rounded-lg text-base font-semibold hover:bg-orange-600">
              Daftar
            </HashLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;