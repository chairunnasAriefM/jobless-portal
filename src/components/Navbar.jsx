// src/components/Navbar.jsx
import React, { useState, Fragment } from 'react';
import { useLocation, NavLink as RouterNavLink, Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { HashLink } from 'react-router-hash-link';
import { Search, Menu, X, LayoutDashboard, User, LogOut } from 'lucide-react';
import { Transition, Menu as HeadlessMenu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import useAuthStore from '../store/authStore';

const Logo = () => (
  <HashLink
    smooth
    to="/#home"
    className="flex items-center gap-2 text-2xl font-bold text-white cursor-pointer"
  >
    <img
      src="/LogoJoblessPortal-01.png"
      alt="Logo JoblessPortal"
      className="h-8 w-auto"
    />
    <span>
      Jobless<span className="text-orange-500">Portal</span>
    </span>
  </HashLink>
);

//==================================================================
// Komponen Dropdown untuk Pengguna yang Sudah Login
//==================================================================
const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan keluar dari sesi ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, logout!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proses logout
        logout();

        // Tampilkan notifikasi sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Anda telah berhasil logout.',
          icon: 'success',
          timer: 1500, // Notifikasi hilang setelah 1.5 detik
          showConfirmButton: false
        });

        // Arahkan ke homepage
        navigate('/');
      }
    });
  };

  // Tentukan path dasbor berdasarkan tipe user
  const dashboardPath = user?.tipe_user_id === 2
    ? '/dashboard/perusahaan'
    : '/dashboard/pencari-kerja';

  const userName = user?.nama_lengkap || 'Pengguna';

  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <div>
        <HeadlessMenu.Button className="inline-flex items-center w-full justify-center gap-x-2 rounded-full px-2 py-1.5 text-sm font-semibold text-gray-300 hover:bg-slate-700">
          {/* <Avatar name={userName} size="sm" /> */}
          <span className="hidden sm:block mr-1">{userName}</span>
        </HeadlessMenu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <HeadlessMenu.Item>
              {({ active }) => (
                <Link to={dashboardPath} className={`${active ? 'bg-orange-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                  <LayoutDashboard className="mr-2 h-5 w-5" /> Dasbor Saya
                </Link>
              )}
            </HeadlessMenu.Item>
            <HeadlessMenu.Item>
              {({ active }) => (
                <Link to={`${dashboardPath}/profil`} className={`${active ? 'bg-orange-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                  <User className="mr-2 h-5 w-5" /> Profil
                </Link>
              )}
            </HeadlessMenu.Item>
          </div>
          <div className="py-1">
            <HeadlessMenu.Item>
              {({ active }) => (
                <button onClick={handleSignOut} className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                  <LogOut className="mr-2 h-5 w-5" /> Logout
                </button>
              )}
            </HeadlessMenu.Item>
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();
  const onHomepage = location.pathname === '/';

  const scrollLinks = [
    { href: 'why-choose-us', text: 'Kenapa Pilih Kami' },
    { href: 'testimoni', text: 'Testimoni' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
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

            <HashLink
              to="/dashboard/perusahaan/lowongan/baru"
              smooth
              className="text-gray-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Pasang Lowongan
            </HashLink>

            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-3">
                <HashLink
                  to="/login"
                  smooth
                  className="text-gray-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Masuk
                </HashLink>
                <HashLink
                  to="/#signup"
                  smooth
                  className="bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Daftar
                </HashLink>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
              to="/dashboard/perusahaan/lowongan/baru"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              Pasang Lowongan
            </RouterNavLink>

            {user ? (
              <div className="border-t border-slate-700 mt-3 pt-3">
                <div className="flex items-center px-3 mb-2">
                  <div className="ml-3">
                    <p className="text-base font-medium text-white">{user.nama_lengkap || 'Pengguna'}</p>
                    <p className="text-sm font-medium text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to={user?.tipe_user_id === 2 ? '/dashboard/perusahaan' : '/dashboard/pencari-kerja'} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white">Dasbor Saya</Link>
                  <Link to={user?.tipe_user_id === 2 ? '/dashboard/perusahaan/profil' : '/dashboard/pencari-kerja/profil'} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white">Profil</Link>
                  {/* PENAMBAHAN: Logika Swal untuk logout di menu mobile */}
                  <button
                    onClick={() => {
                      closeMobileMenu(); // Tutup menu dulu
                      Swal.fire({
                        title: 'Apakah Anda yakin?',
                        text: "Anda akan keluar dari sesi ini.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, logout!',
                        cancelButtonText: 'Batal'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          LogOut();
                          Swal.fire({
                            title: 'Berhasil!',
                            text: 'Anda telah berhasil logout.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                          });
                          navigate('/');
                        }
                      });
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-700 mt-3 pt-3 space-y-2">
                <RouterNavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                >
                  Masuk
                </RouterNavLink>
                <HashLink to="/#signup" smooth onClick={closeMobileMenu} className="bg-orange-500 text-white block w-full text-center mt-2 px-4 py-2.5 rounded-lg text-base font-semibold hover:bg-orange-600">
                  Daftar
                </HashLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;