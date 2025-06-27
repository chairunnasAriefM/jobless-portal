// src/components/auth/PublicOnlyRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Sesuaikan path jika perlu

const PublicOnlyRoute = () => {
    // 1. Ambil informasi pengguna dari state global kita
    const { user } = useAuthStore();

    // 2. Jika ada data pengguna (artinya sudah login)...
    if (user) {
        // ...langsung arahkan/redirect ke halaman dasbor perusahaan.
        return <Navigate to="/dashboard/perusahaan" replace />;
    }

    // 3. Jika tidak ada data pengguna (artinya belum login), izinkan akses.
    // <Outlet/> akan me-render halaman Login atau Pendaftaran.
    return <Outlet />;
};

export default PublicOnlyRoute;