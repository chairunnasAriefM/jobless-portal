// src/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen text-gray-800">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </div>
    );
};

export default MainLayout;