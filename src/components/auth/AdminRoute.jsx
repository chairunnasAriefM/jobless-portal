import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Sesuaikan path jika perlu

const AdminRoute = () => {
    const { user } = useAuthStore();

    // 1. Cek apakah ada sesi pengguna
    if (!user) {
        // Jika tidak ada sesi sama sekali, lempar ke halaman login
        return <Navigate to="/login-admin" replace />;
    }

    // 2. Cek apakah tipe pengguna adalah Admin (ID = 3)
    if (user.tipe_user_id !== 3) {
        // Jika sudah login tapi bukan admin, lempar ke halaman utama
        // Ini mencegah pencari kerja/perusahaan masuk ke panel admin
        return <Navigate to="/" replace />;
    }

    // 3. Jika sudah login DAN adalah admin, izinkan akses
    return <Outlet />;
};

export default AdminRoute;
