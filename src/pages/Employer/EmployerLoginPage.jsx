// src/pages/EmployerLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import useAuthStore from '../../store/authStore';
import { Loader2 } from 'lucide-react';

import { EmployerAuthAPI } from '../../services/EmployerAuthAPI';

import useAuthStore from '../../store/authStore';




const EmployerLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Panggil fungsi login manual yang baru
            const userData = await EmployerAuthAPI.loginManual(email, password);

            if (userData) {
                // LOGIN BERHASIL
                login(userData);
                console.log("Login manual berhasil:", userData);

                // Simpan data user ke localStorage (INI TIDAK AMAN, HANYA CONTOH)
                // Tidak ada token JWT di sini, ini kelemahan utamanya.
                localStorage.setItem('manual_user_session', JSON.stringify(userData));

                // Arahkan ke dasbor
                navigate('/dashboard/perusahaan');
            } else {
                // LOGIN GAGAL
                setError("Email atau password yang Anda masukkan salah.");
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Login Pemberi Kerja
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Akses dasbor Anda untuk mengelola lowongan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Alamat Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-slate-500">
                    Belum punya akun?{' '}
                    <Link to="/daftar-perusahaan" className="font-medium text-orange-600 hover:underline">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default EmployerLoginPage;