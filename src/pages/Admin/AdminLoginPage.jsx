import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Sesuaikan path jika perlu
import { AdminAuthAPI } from '../../services/Admin/AdminAuthAPI'; // Impor service API admin
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore(); // Ambil fungsi 'login' dari store

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Panggil fungsi loginAdmin dari service API yang baru
            const userData = await AdminAuthAPI.loginAdmin(email, password);

            // Cek apakah API mengembalikan data pengguna
            if (userData) {
                // Jika berhasil, simpan sesi ke state global (dan localStorage)
                login(userData);
                // Arahkan ke dasbor admin
                navigate('/admin/dashboard');
            } else {
                // Jika API mengembalikan null, berarti kredensial salah
                throw new Error("Akses ditolak. Email atau password salah.");
            }
        } catch (err) {
            const errorMessage = err.message || "Terjadi kesalahan. Silakan coba lagi.";
            setError(errorMessage);
            MySwal.fire({
                title: 'Login Gagal',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-800">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="inline-block bg-orange-100 p-3 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Admin Login
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Hanya untuk pengguna yang berwenang.
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
                            className="w-full px-3 py-2.5 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2.5 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="text-xs text-center text-slate-400">
                    Kembali ke <Link to="/" className="font-medium text-orange-600 hover:underline">Situs Utama</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
