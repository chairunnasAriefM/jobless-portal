// src/components/dashboard/pencari_kerja/JobSeekerDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Bookmark, TrendingUp, ArrowRight, MessageSquare, Bell, Loader2, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../../store/authStore'; // Sesuaikan path jika perlu
import { supabase } from '../../../lib/supabaseClient'; // Impor Supabase client
import { lowonganAPI } from '../../../services/lowonganAPI'; // Impor service lowongan
import { jobSeekerAPI } from '../../../services/jobSeekerAPI'; // Impor service profil

//==================================================================
// Komponen-Komponen Pendukung (tidak ada perubahan)
//==================================================================

const WelcomeHeader = ({ user }) => (
    <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, {user?.nama_lengkap || 'Pencari Kerja'}!</h1>
            <p className="mt-1 text-slate-500">Mari temukan peluang karir terbaik untukmu hari ini.</p>
        </div>
        {/* <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <MessageSquare size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <Bell size={22} />
            </button>
        </div> */}
    </div>
);

const ProfileStrength = ({ percentage }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-1">Kekuatan Profil Anda</h3>
        <p className="text-sm text-slate-500 mb-4">Lengkapi profil Anda untuk meningkatkan peluang dilirik oleh perusahaan.</p>
        <div className="flex items-center gap-4">
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
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex items-start gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

const RecommendedJobCard = ({ job }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
        <div>
            <Link to={`/lowongan/${job.lowongan_id}`} className="font-semibold text-slate-800 hover:text-orange-600">{job.judul}</Link>
            <p className="text-sm text-slate-500">{job.perusahaan?.nama_perusahaan || 'Perusahaan'} - {job.lokasi}</p>
        </div>
        <Link to={`/lowongan/${job.lowongan_id}`} className="flex-shrink-0 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm">
            Lamar
        </Link>
    </div>
);


//==================================================================
// Komponen Utama Dasbor
//==================================================================
const JobSeekerDashboard = () => {
    const { user } = useAuthStore();

    // State untuk menyimpan data dari API
    const [stats, setStats] = useState({ lamaranTerkirim: 0, lowonganDisimpan: 0, wawancaraDijadwalkan: 0 });
    const [rekomendasi, setRekomendasi] = useState([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi untuk menghitung persentase kelengkapan profil
    const calculateProfileStrength = (profile) => {
        if (!profile) return 0;
        const fields = [
            profile.headline,
            profile.nomor_telepon,
            profile.ringkasan,
            profile.linkedin_url,
            profile.file_cv
        ];
        const totalFields = fields.length;
        const filledFields = fields.filter(field => field && field.trim() !== '').length;
        return Math.round((filledFields / totalFields) * 100);
    };

    const fetchDashboardData = useCallback(async () => {
        if (!user?.user_id) {
            setIsLoading(false);
            setError("Gagal mengidentifikasi pengguna. Silakan login ulang.");
            return;
        }

        try {
            setIsLoading(true);
            const [profileResponse, lamaranData, rekomendasiData] = await Promise.all([
                jobSeekerAPI.getProfile(user.user_id),
                supabase.from('lamaran').select('*', { count: 'exact', head: true }).eq('user_id', user.user_id),
                lowonganAPI.fetchLowongan({ limit: 3 })
            ]);
            
            // Proses data profil
            if (profileResponse) {
                const completion = calculateProfileStrength(profileResponse.profil);
                setProfileCompletion(completion);
            }

            // Proses data statistik
            if (lamaranData.error) throw lamaranData.error;
            setStats(prev => ({ ...prev, lamaranTerkirim: lamaranData.count || 0 }));
            // TODO: Tambahkan query untuk lowongan disimpan dan wawancara

            // Proses data rekomendasi
            if (rekomendasiData.error) throw rekomendasiData.error;
            setRekomendasi(rekomendasiData.data || []);

        } catch (err) {
            console.error("Gagal memuat data dasbor:", err);
            setError("Tidak dapat memuat data dasbor Anda.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
        );
    }
    
    if (error) {
         return (
             <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] text-center p-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-red-600">Terjadi Kesalahan</h2>
                <p className="text-slate-500">{error}</p>
            </div>
         );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <WelcomeHeader user={user} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileStrength percentage={profileCompletion} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard icon={<Briefcase size={22} className="text-blue-600"/>} label="Lamaran Terkirim" value={stats.lamaranTerkirim} color="bg-blue-100" />
                    <StatCard icon={<Bookmark size={22} className="text-purple-600"/>} label="Lowongan Disimpan" value={stats.lowonganDisimpan} color="bg-purple-100" />
                    <StatCard icon={<TrendingUp size={22} className="text-green-600"/>} label="Wawancara" value={stats.wawancaraDijadwalkan} color="bg-green-100" />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Rekomendasi Untuk Anda</h2>
                {rekomendasi.length > 0 ? (
                    <div className="space-y-3">
                        {rekomendasi.map(job => (
                            <RecommendedJobCard key={job.lowongan_id} job={job} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 bg-white p-6 rounded-xl text-center border">Saat ini belum ada rekomendasi pekerjaan untuk Anda.</p>
                )}
                 <div className="text-center mt-6">
                    <Link to="/lowongan" className="font-semibold text-orange-600 hover:underline">
                        Lihat Semua Lowongan
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
