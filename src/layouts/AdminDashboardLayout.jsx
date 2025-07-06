import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Admin/Sidebar";
import Header from "../components/dashboard/Admin/Header";
import { SearchProvider } from '../context/SearchContext';
import ScrollToTopButton from '../components/ScrollToTopButton';

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <Header />
                <Outlet />
            </main>
            <ScrollToTopButton />
        </div>
        // <SearchProvider>
        //     <div className="flex h-screen bg-slate-100">
        //         <Sidebar />
        //         <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        //             <Header />
        //             <Outlet />
        //         </main>
        //     </div>
        // </SearchProvider>
    )
}