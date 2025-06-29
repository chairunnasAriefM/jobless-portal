// src/components/admin/Sidebar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import logo from '../../../assets/images/LogoJoblessPortal-01.png'; 

const Sidebar = () => {
    const navItems = [
        { path: "/admin/dashboard", label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: "/admin/users", label: 'Pengguna', icon: <Users size={20} /> },
        { path: "/admin/companies", label: 'Perusahaan', icon: <Briefcase size={20} /> },
        { path: "/admin/jobs", label: 'Lowongan', icon: <FileText size={20} /> },
    ];

    const linkBaseStyle = "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";
    const linkInactiveStyle = "text-slate-400 hover:bg-slate-700/50 hover:text-white";
    const linkActiveStyle = "bg-slate-700 text-orange-400 font-semibold shadow-inner";

    return (
        <aside className="w-72 bg-slate-800 text-white flex flex-col border-r border-slate-700">
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
                    >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Settings and Profile */}
            <div className="mt-auto">
                <div className="px-2 py-3 space-y-1 border-t border-slate-700">
                    <NavLink to="/admin/settings" className={({ isActive }) =>
                        `${linkBaseStyle} ${isActive ? linkActiveStyle : linkInactiveStyle}`
                    }>
                        <Settings size={20} />
                        <span className="text-sm">Pengaturan</span>
                    </NavLink>

                    <button className={`${linkBaseStyle} text-red-400 hover:bg-red-500/10 hover:text-red-400`}>
                        <LogOut size={20} />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>

                {/* Admin Info */}
                <div className="flex items-center gap-3 p-4 border-t border-slate-700">
                    <img
                        src="https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff"
                        alt="Admin"
                        className="w-10 h-10 rounded-full border border-orange-400"
                    />
                    <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-xs text-slate-400">administrator</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
