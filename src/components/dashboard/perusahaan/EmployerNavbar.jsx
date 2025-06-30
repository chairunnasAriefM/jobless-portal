// src/components/dashboard/perusahaan/EmployerNavbar.jsx

import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, PlusCircle, User, Settings, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import useAuthStore from '../../../store/authStore';

// Komponen Logo untuk sisi employer
const EmployerLogo = () => (
    <Link to="/dashboard/perusahaan" className="flex items-center space-x-3">
        <img
            src="/LogoJoblessPortal-01.png"
            alt="Logo JoblessPortal"
            className="h-8 w-auto"
        />
        <span className="text-2xl font-bold text-white">
            Jobless<span className="text-orange-500">Portal</span>
        </span>
        <span className="text-xs font-semibold text-orange-400 border border-white/20 px-2 py-0.5 rounded-md">
            Perusahaan
        </span>
    </Link>
);

// Komponen dropdown menu untuk pengguna
const MySwal = withReactContent(Swal);

const UserMenu = () => {
    const navigate = useNavigate();

    const { user, logout } = useAuthStore();


    const handleSignOut = () => {
        MySwal.fire({
            title: 'Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Logout!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // logout sekarang membersihkan localStorage
                logout();
                navigate('/'); // Arahkan ke homepage
            }
        });
    };

    // 4. Ambil nama langsung dari objek user (bukan app_metadata)
    const userName = user?.nama_lengkap || user?.email;
    // const userEmail = user?.email;

    // 5. Tampilkan tombol Login/Daftar jika tidak ada user yang login
    if (!user) {
        return (
            <div className="flex items-center space-x-3">
                <Link to="/login-perusahaan" className="text-sm font-medium text-gray-300 hover:text-white">
                    Login
                </Link>
                <Link to="/daftar-perusahaan" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600">
                    Daftar
                </Link>
            </div>
        )
    }



    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex items-center w-full justify-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-slate-700">
                    <span>{userName}</span>
                    <ChevronDown size={16} />
                </Menu.Button>
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
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link to="/dashboard/perusahaan/profil" className={`${active ? 'bg-orange-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    <User className="mr-2 h-5 w-5" /> Profil
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link to="/dashboard/perusahaan/pengaturan" className={`${active ? 'bg-orange-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    <Settings className="mr-2 h-5 w-5" /> Pengaturan
                                </Link>
                            )}
                        </Menu.Item>
                    </div>
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                // Tombol logout sekarang memanggil handleSignOut yang baru
                                <button
                                    onClick={handleSignOut}
                                    className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                    Logout
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

const EmployerNavbar = () => {
    // Style untuk link navigasi
    const linkStyle = "text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200";
    const activeLinkStyle = "text-sm font-semibold text-white";

    return (
        <nav className="bg-slate-800 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Sisi Kiri: Logo dan Navigasi Utama */}
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0">
                            <EmployerLogo />
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink
                                to="/dashboard/perusahaan"
                                end
                                className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/dashboard/perusahaan/lowongan"
                                className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                            >
                                Jobs
                            </NavLink>
                        </div>
                    </div>

                    {/* Sisi Kanan: User dan Tombol Aksi */}
                    <div className="hidden md:flex items-center space-x-4">
                    <UserMenu />
                        <div className="h-8 border-l border-slate-600"></div>
                        <Link
                            to="/dashboard/perusahaan/lowongan/baru"
                            className="inline-flex items-center bg-orange-500 text-white font-bold py-2.5 px-5 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                        >
                            <PlusCircle size={18} className="mr-2" />
                            Buat Lowongan
                        </Link>
                    </div>

                    <div className="md:hidden">
                        {/* Anda bisa menambahkan tombol menu hamburger di sini jika perlu */}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default EmployerNavbar;