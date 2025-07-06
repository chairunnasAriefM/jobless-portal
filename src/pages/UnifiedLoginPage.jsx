// src/pages/UnifiedLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Briefcase, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { EmployerAuthAPI } from '../services/EmployerAuthAPI';
import { JobSeekerAuthAPI } from '../services/JobSeekerAuthAPI';
import useAuthStore from '../store/authStore';
import { HashLink } from 'react-router-hash-link';

//==================================================================
// Komponen Panel Ilustrasi (Overlay)
//==================================================================
const IllustrationPanel = ({ onSwitch, isEmployerActive }) => {
    return (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-center items-center text-center rounded-2xl">
            <div className="max-w-xs">
                {isEmployerActive ? (
                    <>
                        <User size={48} className="mx-auto mb-4 text-orange-400" />
                        <h2 className="text-3xl font-bold mb-3">Pencari Kerja?</h2>
                        <p className="text-slate-300 mb-6">Login di sini untuk mencari ribuan peluang karir terbaik.</p>
                        <button onClick={onSwitch} className="inline-flex items-center bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-6 border-2 border-white/50 rounded-lg transition-all duration-300">
                            Login Pencari Kerja <ArrowLeft size={18} className="ml-2" />
                        </button>
                    </>
                ) : (
                    <>
                        <Briefcase size={48} className="mx-auto mb-4 text-orange-400" />
                        <h2 className="text-3xl font-bold mb-3">Apakah Anda Perusahaan?</h2>
                        <p className="text-slate-300 mb-6">Posting lowongan dan temukan talenta terbaik untuk perusahaan Anda.</p>
                        <button onClick={onSwitch} className="inline-flex items-center bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-6 border-2 border-white/50 rounded-lg transition-all duration-300">
                            Login Pemberi Kerja <ArrowRight size={18} className="ml-2" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

//==================================================================
// Komponen Form Login
//==================================================================
const LoginForm = ({ title, subtitle, onSubmit, isLoading, apiError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email, password);
    };



    return (
        <div className="w-full h-full p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
                <p className="text-slate-500 mt-2">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm" placeholder="anda@email.com" />
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm" placeholder="Masukkan password Anda" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {apiError && <p className="text-sm text-red-600 text-center">{apiError}</p>}
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none disabled:bg-orange-300">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                    </button>
                </div>
                <p className="text-sm text-center text-slate-500">
                    Belum punya akun? <HashLink to="/#signup" className="font-medium text-orange-600 hover:underline">Daftar di sini</HashLink>
                </p>
            </form>
        </div>
    );
};

//==================================================================
// Komponen Halaman Utama
//==================================================================
const UnifiedLoginPage = () => {
    const [activeForm, setActiveForm] = useState('jobSeeker');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const { login } = useAuthStore();

    const handleSwitchForm = () => {
        setApiError('');
        setActiveForm(prev => prev === 'jobSeeker' ? 'employer' : 'jobSeeker');
    };

    const handleLoginSubmit = async (email, password) => {
        setIsLoading(true);
        setApiError('');
        let userData = null;
        try {
            if (activeForm === 'jobSeeker') {
                // Panggil API login untuk pencari kerja
                userData = await JobSeekerAuthAPI.loginManual(email, password);
                if (userData) {
                    login(userData); // Simpan sesi ke state global (dan localStorage)
                    navigate('/dashboard/pencari-kerja'); // Arahkan ke homepage setelah login
                } else {
                    // Jika API mengembalikan null, berarti login gagal
                    throw new Error("Email atau password pencari kerja salah.");
                }

            } else { // activeForm === 'employer'
                // Panggil API login untuk perusahaan
                userData = await EmployerAuthAPI.loginManual(email, password);
                if (userData) {
                    login(userData); // Simpan sesi ke state global (dan localStorage)
                    navigate('/dashboard/perusahaan'); // Arahkan ke dasbor
                } else {
                    throw new Error("Email atau password pemberi kerja salah.");
                }
            }
        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isEmployerActive = activeForm === 'employer';



    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm md:max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden md:h-[650px]">

                {/* Panel Kiri (Form Pencari Kerja) */}
                <div className={`w-full md:w-1/2 flex-shrink-0 transition-all duration-300 ease-in-out ${isEmployerActive ? 'hidden md:flex' : 'flex'}`}>
                    <LoginForm
                        title="Login Pencari Kerja"
                        subtitle="Temukan ribuan peluang karir."
                        onSubmit={(email, password) => handleLoginSubmit(email, password, 'jobSeeker')}
                        isLoading={isLoading && !isEmployerActive}
                        apiError={!isEmployerActive ? apiError : ''}
                    />
                </div>

                {/* Panel Kanan (Form Pemberi Kerja)*/}
                <div className={`w-full md:w-1/2 flex-shrink-0 transition-all duration-300 ease-in-out ${isEmployerActive ? 'flex' : 'hidden md:flex'}`}>
                    <LoginForm
                        title="Login Pemberi Kerja"
                        subtitle="Akses dasbor & kelola lowongan."
                        onSubmit={(email, password) => handleLoginSubmit(email, password, 'employer')}
                        isLoading={isLoading && isEmployerActive}
                        apiError={isEmployerActive ? apiError : ''}
                    />
                </div>

                {/* <div
                    className={`absolute top-0 w-1/2 h-full transition-transform duration-700 ease-in-out 
                        ${isEmployerActive ? 'translate-x-0' : 'translate-x-full'}`}
                > */}

                <div
                    className={`
                        w-full md:w-1/2 md:h-full md:absolute md:top-0
                        transition-transform duration-700 ease-in-out
                         ${isEmployerActive ? 'md:translate-x-0' : 'md:translate-x-full'}`
                    }
                >
                    <IllustrationPanel onSwitch={handleSwitchForm} isEmployerActive={isEmployerActive} />
                </div>
            </div>
        </div>
    );
};

export default UnifiedLoginPage;
