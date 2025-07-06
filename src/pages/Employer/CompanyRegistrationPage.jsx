// src/pages/CompanyRegistrationPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, Users, TrendingUp, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { EmployerAuthAPI } from '../../services/EmployerAuthAPI'; 

const MySwal = withReactContent(Swal);

const CompanyRegistrationPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        companyWebsite: '',
        jobTitle: '',
        workEmail: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
            const result = await EmployerAuthAPI.registerCompany(formData);

            await MySwal.fire({
                title: 'Pendaftaran Berhasil!',
                text: result.message,
                icon: 'success',
                confirmButtonText: 'Lanjutkan ke Login',
                confirmButtonColor: '#f97316',
            });

            navigate('/login-perusahaan');

        } catch (error) {
            setApiError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-24 pb-12">
            <div className="container mx-auto max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden md:flex">

                {/* Kolom Kiri - Informasi & Ilustrasi */}
                <div className="md:w-1/2 bg-gradient-to-br from-slate-700 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-center">
                    <div className="text-center md:text-left">
                        <Briefcase size={48} className="mx-auto md:mx-0 mb-4 text-orange-400" />
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Rekrut Talenta Lokal Terbaik untuk <span className="text-orange-400">Perusahaan Anda</span>
                        </h2>
                        <p className="text-slate-200 mb-6 leading-relaxed">
                            JoblessPortal dirancang untuk membantu bisnis di Indonesia menemukan kandidat berkualitas dengan proses yang mudah, cepat, dan efisien.
                        </p>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start">
                                <TrendingUp size={20} className="mr-3 mt-1 text-orange-400 flex-shrink-0" />
                                Jangkau ribuan pencari kerja aktif di berbagai daerah.
                            </li>
                            <li className="flex items-start">
                                <Users size={20} className="mr-3 mt-1 text-orange-400 flex-shrink-0" />
                                Proses rekrutmen yang disederhanakan, hemat waktu dan biaya.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Kolom Kanan - Formulir Pendaftaran */}
                <div className="md:w-1/2 p-8 sm:p-12">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-1">Daftarkan Perusahaan Anda</h3>
                    <p className="text-slate-600 mb-6">Buat akun untuk mulai memposting lowongan pekerjaan.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Nama Depan</label>
                                <input type="text" name="firstName" id="firstName" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Cth: Budi" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                                <input type="text" name="lastName" id="lastName" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Cth: Santoso" value={formData.lastName} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan / UKM</label>
                            <input type="text" name="companyName" id="companyName" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Cth: UKM Maju Jaya Bersama" value={formData.companyName} onChange={handleChange} />
                        </div>

                        <div>
                            <label htmlFor="workEmail" className="block text-sm font-medium text-slate-700 mb-1">Email Kerja</label>
                            <input type="email" name="workEmail" id="workEmail" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="anda@perusahaan.com" value={formData.workEmail} onChange={handleChange} />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                            <input type={showPassword ? "text" : "password"} name="password" id="password" required minLength="8" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ulangi kata sandi" value={formData.confirmPassword} onChange={handleChange} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {apiError && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
                                {apiError}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Sudah punya akun?
                        <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500"> Masuk di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompanyRegistrationPage;