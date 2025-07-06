// src/layouts/JobSeekerDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import JobSeekerNavbar from '../components/dashboard/pencari_kerja/JobSeekerNavbar';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';

const JobSeekerDashboardLayout = () => {
    return (
        <div className="bg-slate-100 min-h-screen">
            <JobSeekerNavbar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </div>
    );
};

export default JobSeekerDashboardLayout;