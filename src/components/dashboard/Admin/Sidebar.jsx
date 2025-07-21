import React, { useState } from 'react'; // Import useState
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, LogOut, Sparkles, Menu, X } from 'lucide-react'; // Add Menu and X icons
import useAuthStore from '../../../store/authStore';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import logo from '../../../assets/images/LogoJoblessPortal-01.png';

const MySwal = withReactContent(Swal);

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

    const handleLogout = () => {
        MySwal.fire({
            title: 'Anda yakin ingin logout?',
            text: "Anda akan keluar dari sesi admin dan dikembalikan ke halaman utama.",
            icon: 'warning',
            iconColor: '#f97316',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Logout!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-xl',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/');
            }
        });
    };

    const navItems = [
        { path: "/admin/dashboard", label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: "/admin/users", label: 'Pengguna', icon: <Users size={20} /> },
        { path: "/admin/keahlian", label: 'Keahlian', icon: <Sparkles size={20} /> },
        { path: "/admin/lowongan", label: 'Lowongan', icon: <FileText size={20} /> },
    ];

    const linkBaseStyle = "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";
    const linkInactiveStyle = "text-slate-400 hover:bg-slate-700/50 hover:text-white";
    const linkActiveStyle = "bg-slate-900 text-orange-400 font-semibold shadow-inner";

    const userName = user?.nama_lengkap || 'Admin';

    return (
        <>
            {/* Mobile Sidebar Toggle Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile (when sidebar is open) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 w-72 bg-slate-800 text-white flex-shrink-0 flex flex-col border-r border-slate-700
                    transform transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0 md:flex
                    ${isSidebarOpen ? 'translate-x-0 z-50' : '-translate-x-full'}
                `}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-slate-700">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <img src={logo} alt="JoblessPortal Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold tracking-wide">Admin Panel</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-grow pt-6 px-2 space-y-1">
                    <p className="text-xs text-slate-500 font-medium px-2 mb-2 uppercase tracking-wider">Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.path === "/admin/dashboard"}
                            className={({ isActive }) =>
                                `${linkBaseStyle} ${isActive ? linkActiveStyle : linkInactiveStyle}`
                            }
                            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                        >
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Settings and Profile */}
                <div className="mt-auto">
                    <div className="px-2 py-3 space-y-1 border-t border-slate-700">
                        <button onClick={handleLogout} className={`${linkBaseStyle} text-red-400 hover:bg-red-500/10 hover:text-red-400`}>
                            <LogOut size={20} />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>

                    {/* Admin Info */}
                    <div className="flex items-center gap-3 p-4 border-t border-slate-700">
                        <img
                            src={`https://cdn-icons-png.flaticon.com/512/1253/1253756.png`}
                            alt="Admin"
                            className="w-10 h-10 rounded-full border-2 border-slate-600"
                        />
                        <div>
                            <p className="font-medium">{userName}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;