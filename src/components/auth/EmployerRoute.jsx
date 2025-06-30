import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Sesuaikan path jika perlu

const EmployerRoute = () => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Cek apakah tipe pengguna adalah Perusahaan (ID = 2)
    if (user.tipe_user_id !== 2) {
        // Jika bukan, arahkan ke dasbor yang sesuai atau halaman utama
        // Contoh: jika admin yang mencoba masuk, arahkan ke dasbor admin
        if (user.tipe_user_id === 3) return <Navigate to="/admin/dashboard" replace />;
        // Jika pencari kerja, arahkan ke dasbornya
        return <Navigate to="/dashboard/pencari-kerja" replace />;
    }

    return <Outlet />;
};

export default EmployerRoute;
