// src/components/dashboard/pencari_kerja/JobSeekerDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, ArrowRight, MessageSquare, Bell, Loader2, AlertTriangle, FileText, CheckCircle, MapPin } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { supabase } from '../../../lib/supabaseClient';
import { lowonganAPI } from '../../../services/lowonganAPI';
import { jobSeekerAPI } from '../../../services/jobSeekerAPI';

//==================================================================
// Komponen-Komponen Pendukung yang Didesain Ulang
//==================================================================

const WelcomeHeader = ({ user }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, {user?.nama_lengkap || 'Pencari Kerja'}!</h1>
            <p className="mt-1 text-slate-500">Mari temukan peluang karir terbaik untukmu hari ini.</p>
        </div>

    </div>
);

const ProfileStrength = ({ percentage }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-full flex flex-col">
        <h3 className="font-semibold text-slate-800 mb-1">Kekuatan Profil Anda</h3>
        <p className="text-sm text-slate-500 mb-4">Lengkapi profil untuk meningkatkan peluang dilirik oleh perusahaan.</p>
        <div className="flex items-center gap-4 mt-auto">
            <div className="relative h-4 w-full bg-slate-200 rounded-full">
                <div
                    className="absolute top-0 left-0 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="font-bold text-orange-600">{percentage}%</span>
        </div>
        <Link to="/dashboard/pencari-kerja/edit-profil" className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 mt-4">
            Lengkapi Profil <ArrowRight size={16} className="ml-1" />
        </Link>
    </div>
);

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-4">
        <div className={`p-4 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-500">{label}</p>
        </div>
    </div>
);

const RecommendedJobCard = ({ job }) => {
    const logoUrl = job.perusahaan?.logo_perusahaan
        ? job.perusahaan.logo_perusahaan
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            job.perusahaan?.nama_perusahaan || "P"
        )}&background=f97316&color=fff&size=64`;

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
                <img
                    src={logoUrl}
                    alt={job.perusahaan?.nama_perusahaan || "Perusahaan"}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-sm"
                />

                <div className="space-y-1">
                    <Link
                        to={`/lowongan/${job.lowongan_id}`}
                        className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1"
                    >
                        {job.judul}
                    </Link>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Briefcase size={14} className="text-orange-500" />
                        {job.perusahaan?.nama_perusahaan || "Perusahaan"}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <MapPin size={14} className="text-orange-500" />
                        {job.lokasi}
                    </div>
                </div>
            </div>

            <Link
                to={`/lowongan/${job.lowongan_id}`}
                className="flex-shrink-0 bg-orange-500 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors shadow"
            >
                Detail
            </Link>
        </div>
    );
};


//==================================================================
// Komponen Utama Dasbor
//==================================================================
const JobSeekerDashboard = () => {
    const { user } = useAuthStore();

    const [stats, setStats] = useState({ lamaranTerkirim: 0, lamaranDiterima: 0 });
    const [rekomendasi, setRekomendasi] = useState([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateProfileStrength = useCallback((profile) => {
        if (!profile) return 0;
        const fields = [
            profile.headline, profile.nomor_telepon,
            profile.ringkasan, profile.linkedin_url, profile.file_cv
        ];
        const totalFields = fields.length;
        const filledFields = fields.filter(field => field && String(field).trim() !== '').length;
        return Math.round((filledFields / totalFields) * 100);
    }, []);

    const fetchDashboardData = useCallback(async () => {
        if (!user?.user_id) {
            setIsLoading(false);
            setError("Gagal mengidentifikasi pengguna. Silakan login ulang.");
            return;
        }

        try {
            const [profileResponse, lamaranData, rekomendasiData] = await Promise.all([
                jobSeekerAPI.getProfile(user.user_id),
                supabase.from('lamaran').select('status_lamaran_id', { count: 'exact' }).eq('user_id', user.user_id),
                lowonganAPI.fetchLowongan({ limit: 3 })
            ]);

            if (profileResponse) {
                const completion = calculateProfileStrength(profileResponse.profil);
                setProfileCompletion(completion);
            }

            if (lamaranData.error) throw lamaranData.error;
            const lamaranDiterimaCount = lamaranData.data.filter(l => l.status_lamaran_id === 2).length;
            setStats({ lamaranTerkirim: lamaranData.count || 0, lamaranDiterima: lamaranDiterimaCount });

            if (rekomendasiData.error) throw rekomendasiData.error;
            setRekomendasi(Array.isArray(rekomendasiData) ? rekomendasiData : rekomendasiData.data || []);

        } catch (err) {
            console.error("Gagal memuat data dasbor:", err);
            setError("Tidak dapat memuat data dasbor Anda.");
        } finally {
            setIsLoading(false);
        }
    }, [user, calculateProfileStrength]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin text-orange-500" /></div>;
    }

    if (error) {
        return <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] text-center p-4"><AlertTriangle className="h-12 w-12 text-red-500 mb-4" /><h2 className="text-xl font-semibold text-red-600">Terjadi Kesalahan</h2><p className="text-slate-500">{error}</p></div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <WelcomeHeader user={user} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ProfileStrength percentage={profileCompletion} />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <StatCard icon={<FileText size={22} className="text-blue-600" />} label="Lamaran Terkirim" value={stats.lamaranTerkirim} color="bg-blue-100" />
                    <StatCard icon={<CheckCircle size={22} className="text-green-600" />} label="Lamaran Diterima" value={stats.lamaranDiterima} color="bg-green-100" />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Rekomendasi Untuk Anda</h2>
                    <Link to="/lowongan" className="font-semibold text-sm text-orange-600 hover:underline">
                        Lihat Semua
                    </Link>
                </div>
                {rekomendasi.length > 0 ? (
                    <div className="space-y-3">
                        {rekomendasi.map(job => (
                            <RecommendedJobCard key={job.lowongan_id} job={job} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 bg-white p-6 rounded-xl text-center border">Saat ini belum ada rekomendasi pekerjaan untuk Anda.</p>
                )}
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
