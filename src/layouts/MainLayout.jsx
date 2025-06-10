// src/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        // HAPUS "bg-slate-50" dari sini. Biarkan layout ini netral.
        <div className="flex flex-col min-h-screen text-gray-800">
            <Navbar />
            <main className="flex-grow">
                {/* Outlet akan merender halaman Anda (Index, JobSearch, dll) */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;