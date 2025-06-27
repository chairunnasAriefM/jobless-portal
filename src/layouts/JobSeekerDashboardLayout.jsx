// src/layouts/JobSeekerDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import JobSeekerNavbar from '../components/dashboard/pencari_kerja/JobSeekerNavbar';
import Footer from '../components/Footer';

const JobSeekerDashboardLayout = () => {
    return (
        <div className="bg-slate-100 min-h-screen">
            <JobSeekerNavbar />
            <main className="pt-20">
                {/* Konten halaman  */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default JobSeekerDashboardLayout;