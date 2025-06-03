import React, { useState } from 'react';
import { Eye, EyeOff, Briefcase, Users, TrendingUp } from 'lucide-react';

import mountainImageUrl from '../assets/images/fuji.jpeg';

const CompanyRegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        companyWebsite: '',
        jobTitle: '',
        workEmail: '',
        password: '',
        confirmPassword: '',
        howHeard: '',
        subscribeNewsletter: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
            return;
        }
        console.log('Data Pendaftaran Perusahaan:', formData);
        alert('Pendaftaran berhasil! (Simulasi)');
    };

    const howHeardOptions = [
        { value: '', label: 'Pilih sumber...' },
        { value: 'social_media', label: 'Media Sosial' },
        { value: 'recommendation', label: 'Rekomendasi Teman/Kolega' },
        { value: 'online_ad', label: 'Iklan Online' },
        { value: 'search_engine', label: 'Mesin Pencari (Google, dll.)' },
        { value: 'event', label: 'Acara/Seminar' },
        { value: 'other', label: 'Lainnya' },
    ];

    return (
        // Div pembungkus utama halaman ini. Navbar dan Footer akan ada di luar komponen ini, dari MainLayout.
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden md:flex">
                {/* Kolom Kiri - Informasi & Ilustrasi */}
                <div className="md:w-1/2 bg-gradient-to-br from-slate-700 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-center">
                    <div className="text-center md:text-left">
                        <Briefcase size={48} className="mx-auto md:mx-0 mb-4 text-orange-400" />
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Rekrut Talenta Lokal Terbaik untuk <span className="text-orange-400">Perusahan Anda</span>?
                        </h2>
                        <p className="text-slate-200 mb-6 leading-relaxed">
                            JoblessPortal adalah platform yang dirancang khusus untuk membantu Perusahaan UKM dan bisnis berkembang di Indonesia menemukan kandidat berkualitas dengan proses yang mudah, cepat, dan efisien.
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
                            <li className="flex items-start">
                                <Briefcase size={20} className="mr-3 mt-1 text-orange-400 flex-shrink-0" />
                                Fitur posting lowongan premium dan branding perusahaan untuk hasil maksimal.
                            </li>
                        </ul>
                        <p className="mt-8 text-sm text-slate-400">
                            Bergabunglah sekarang dan tingkatkan kualitas rekrutmen Anda!
                        </p>
                    </div>
                </div>

                {/* Kolom Kanan - Formulir Pendaftaran */}
                <div className="md:w-1/2 p-8 sm:p-12">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-1">Daftarkan Perusahaan Anda</h3>
                    <p className="text-slate-600 mb-6">Isi informasi di bawah untuk membuat akun perusahaan.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ... Isi formulir (input fields, buttons, etc.) seperti yang sudah dibuat sebelumnya ... */}
                        {/* Nama Depan, Nama Belakang */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Nama Depan (Kontak)</label>
                                <input type="text" name="firstName" id="firstName" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Cth: Budi" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang (Kontak)</label>
                                <input type="text" name="lastName" id="lastName" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Cth: Santoso" value={formData.lastName} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Nama Perusahaan */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan / UKM</label>
                            <input type="text" name="companyName" id="companyName" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Cth: UKM Maju Jaya Bersama" value={formData.companyName} onChange={handleChange} />
                        </div>

                        {/* Website Perusahaan */}
                        <div>
                            <label htmlFor="companyWebsite" className="block text-sm font-medium text-slate-700 mb-1">Website Perusahaan (Opsional)</label>
                            <input type="url" name="companyWebsite" id="companyWebsite" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="https://www.ukmajujaya.co.id" value={formData.companyWebsite} onChange={handleChange} />
                        </div>

                        {/* Jabatan Anda */}
                        <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-1">Jabatan Anda</label>
                            <input type="text" name="jobTitle" id="jobTitle" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Cth: Pemilik, Manajer HRD" value={formData.jobTitle} onChange={handleChange} />
                        </div>

                        {/* Email Kerja */}
                        <div>
                            <label htmlFor="workEmail" className="block text-sm font-medium text-slate-700 mb-1">Email Kerja</label>
                            <input type="email" name="workEmail" id="workEmail" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="anda@perusahaan.com" value={formData.workEmail} onChange={handleChange} />
                        </div>

                        {/* Kata Sandi */}
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                            <input type={showPassword ? "text" : "password"} name="password" id="password" required minLength="8" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Konfirmasi Kata Sandi */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" required className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Ulangi kata sandi" value={formData.confirmPassword} onChange={handleChange} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* How Heard */}
                        <div>
                            <label htmlFor="howHeard" className="block text-sm font-medium text-slate-700 mb-1">Bagaimana Anda mengetahui JoblessPortal?</label>
                            <select name="howHeard" id="howHeard" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-white" value={formData.howHeard} onChange={handleChange}>
                                {howHeardOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Newsletter */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="subscribeNewsletter" name="subscribeNewsletter" type="checkbox" className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-slate-300 rounded" checked={formData.subscribeNewsletter} onChange={handleChange} />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="subscribeNewsletter" className="font-medium text-slate-700">Ya, kirimi saya newsletter</label>
                                <p className="text-slate-500 text-xs">Dapatkan tips rekrutmen, berita industri, dan info terbaru dari JoblessPortal.</p>
                            </div>
                        </div>

                        {/* Agreement */}
                        <div>
                            <p className="text-xs text-slate-500">
                                Dengan mengklik "Daftar Sekarang", Anda menyetujui
                                <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-600 hover:text-orange-500"> Ketentuan Penggunaan </a>
                                dan
                                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-600 hover:text-orange-500"> Kebijakan Privasi </a> kami.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                            Daftar Sekarang & Posting Lowongan
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Sudah punya akun?
                        <a href="/login-perusahaan" className="font-medium text-orange-600 hover:text-orange-500"> Masuk di sini</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompanyRegistrationPage;