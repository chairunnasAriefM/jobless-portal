import React from 'react';
import { Search, Bell } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
// import { useSearch } from '../../../context/SearchContext';

const Header = () => {
    const { user } = useAuthStore();

    const userName = user?.nama_lengkap || user?.email || "Admin";

    // const { searchTerm, setSearchTerm } = useSearch();

    return (
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 invisible" />
                <input
                    type="text"
                    placeholder="Cari sesuatu..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 invisible"
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Ikon & Profil */}
            <div className="flex items-center space-x-6">
                {/* <button className="relative text-slate-500 hover:text-orange-600">
                    <Bell size={24} />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                </button> */}
                <div className="flex items-center space-x-3">
                    <img
                        src={`https://cdn-icons-png.flaticon.com/512/1253/1253756.png`}
                        alt="Admin Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-slate-800">{userName}</p>
                        <p className="text-xs text-slate-500">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
