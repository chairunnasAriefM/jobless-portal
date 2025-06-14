// src/layouts/EmployerDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployerNavbar from '../components/dashboard/perusahaan/EmployerNavbar';
import Footer from '../components/Footer';

const EmployerDashboardLayout = () => {
    return (
        <div className="bg-slate-100 min-h-screen">
            <EmployerNavbar />
            {/* Konten halaman akan mulai 80px (h-20) dari atas agar tidak tertutup navbar */}
            <main className="pt-20">
                {/* Konten halaman dinamis (dasbor, list lowongan, dll) akan dirender di sini */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default EmployerDashboardLayout;