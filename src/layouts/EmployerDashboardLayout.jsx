// src/layouts/EmployerDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployerNavbar from '../components/dashboard/perusahaan/EmployerNavbar';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';

const EmployerDashboardLayout = () => {
    return (
        <div className="bg-slate-100 min-h-screen flex flex-col">
            <EmployerNavbar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {/* Konten halaman  */}
                <Outlet />
            </main>

            <Footer />
            <ScrollToTopButton />
        </div>
    );
};

export default EmployerDashboardLayout;