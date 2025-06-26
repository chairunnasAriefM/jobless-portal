// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Cek apakah "kunci" sesi login ada di localStorage
    const userSession = localStorage.getItem('manual_user_session');

    // 2. Jika tidak ada kunci (artinya belum login)...
    if (!userSession) {
        // ..."lemparkan" pengguna ke halaman login.
        // 'replace' digunakan agar pengguna tidak bisa menekan tombol "back" di browser
        // untuk kembali ke halaman dasbor yang seharusnya terlindungi.
        return <Navigate to="/login" replace />;
    }

    // 3. Jika kunci ada (artinya sudah login), izinkan akses.
    // <Outlet /> adalah komponen dari react-router-dom yang akan me-render 
    // komponen anak dari rute ini (dalam kasus kita, EmployerDashboardLayout).
    return <Outlet />;
};

export default ProtectedRoute;