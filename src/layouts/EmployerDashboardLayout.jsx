// src/layouts/EmployerDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployerNavbar from '../components/dashboard/perusahaan/EmployerNavbar';
import Footer from '../components/Footer';

const EmployerDashboardLayout = () => {
    return (
        <div className="bg-slate-100 min-h-screen">
            <EmployerNavbar />
            <main className="pt-20">
                {/* Konten halaman  */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default EmployerDashboardLayout;