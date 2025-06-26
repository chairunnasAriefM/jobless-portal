// src/pages/jobseeker/auth/JobSeekerRegistrationPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, LogIn, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { JobSeekerAuthAPI } from '../../../services/JobSeekerAuthAPI';

const MySwal = withReactContent(Swal);

const JobSeekerRegistrationPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (formData.password !== formData.confirmPassword) {
            setApiError("Kata sandi dan konfirmasi kata sandi tidak cocok!");
            return;
        }
        if (formData.password.length < 8) {
            setApiError("Kata sandi harus memiliki minimal 8 karakter.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await JobSeekerAuthAPI.registerJobSeeker(formData);

            await MySwal.fire({
                title: 'Pendaftaran Berhasil!',
                text: 'Akun Anda telah dibuat. Silakan login untuk memulai pencarian kerja.',
                icon: 'success',
                confirmButtonText: 'Lanjutkan ke Login',
                confirmButtonColor: '#f97316',
            });

            // Arahkan ke halaman login yang sesuai untuk job seeker
            navigate('/login');

        } catch (error) {
            setApiError(error.message || 'Terjadi kesalahan. Email ini mungkin sudah terdaftar.');
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="text-center mb-8">
                    <User size={48} className="mx-auto text-orange-500 mb-3" />
                    <h2 className="text-3xl font-bold text-slate-800">Buat Akun Pencari Kerja</h2>
                    <p className="text-slate-500 mt-2">Satu langkah lagi menuju karir impian Anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Nama Depan</label>
                            <input type="text" name="firstName" id="firstName" required className="input-style" placeholder="Cth: Budi" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                            <input type="text" name="lastName" id="lastName" required className="input-style" placeholder="Cth: Santoso" value={formData.lastName} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" name="email" id="email" required className="input-style" placeholder="anda@email.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                        <input type={showPassword ? "text" : "password"} name="password" id="password" required minLength="8" className="input-style" placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" required className="input-style" placeholder="Ulangi kata sandi" value={formData.confirmPassword} onChange={handleChange} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500">
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {apiError && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
                            {apiError}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-orange-300">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Buat Akun'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 inline-flex items-center">
                        Masuk Sekarang <LogIn size={14} className="ml-1" />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default JobSeekerRegistrationPage;