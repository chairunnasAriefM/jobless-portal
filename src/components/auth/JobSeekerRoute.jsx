import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Sesuaikan path jika perlu

const JobSeekerRoute = () => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Cek apakah tipe pengguna adalah Pencari Kerja (ID = 1)
    if (user.tipe_user_id !== 1) {
        // Jika bukan, arahkan ke dasbor yang sesuai
        if (user.tipe_user_id === 3) return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/dashboard/perusahaan" replace />;
    }

    return <Outlet />;
};

export default JobSeekerRoute;
