import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-gray-800">
            <Navbar />
            <main className="flex-grow">
                {/* Konten halaman dinamis akan dirender di sini */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;