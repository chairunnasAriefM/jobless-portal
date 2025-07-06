// src/pages/jobseeker/ApplicationDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LamaranAPI } from '../../../services/LamaranAPI'; 
import useAuthStore from '../../../store/authStore';
import { Loader2, AlertCircle, ArrowLeft, Briefcase, MapPin, DollarSign, Calendar, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { formatDatePosted, formatSalary } from '../../../utils/formatters'; 

// --- Komponen-Komponen Pendukung ---

// Kartu Status Lamaran yang menonjol
const StatusCard = ({ statusName }) => {
    const styles = {
        'Menunggu': { icon: <Clock size={24} />, color: 'bg-yellow-100 text-yellow-800', message: 'Lamaran Anda sedang ditinjau oleh perusahaan.' },
        'Diterima': { icon: <CheckCircle size={24} />, color: 'bg-green-100 text-green-800', message: 'Selamat! Lamaran Anda diterima. Tunggu informasi selanjutnya dari perusahaan.' },
        'Ditolak': { icon: <XCircle size={24} />, color: 'bg-red-100 text-red-800', message: 'Sayang sekali, Anda belum cocok untuk posisi ini. Tetap semangat!' },
    };
    const style = styles[statusName] || { icon: <HelpCircle size={24} />, color: 'bg-slate-100 text-slate-600', message: 'Status lamaran tidak diketahui.' };

    return (
        <div className={`p-6 rounded-2xl shadow-lg border-slate-800 flex items-center gap-4 ${style.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-50 border-')}`}>
            <div className={`p-3 rounded-full ${style.color}`}>
                {style.icon}
            </div>
            <div>
                <p className="font-bold text-lg">Status: {statusName}</p>
                <p className="text-sm">{style.message}</p>
            </div>
        </div>
    );
};

// Kartu untuk menampilkan informasi ringkas di sidebar
const InfoCard = ({ job }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Ringkasan Pekerjaan</h3>
        <div className="flex items-start gap-3">
            <Briefcase size={20} className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-slate-500">Perusahaan</p>
                <p className="font-semibold text-slate-700">{job.perusahaan?.nama_perusahaan || 'N/A'}</p>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <MapPin size={20} className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-slate-500">Lokasi</p>
                <p className="font-semibold text-slate-700">{job.lokasi}</p>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <DollarSign size={20} className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-slate-500">Gaji</p>
                <p className="font-semibold text-slate-700">{formatSalary(job.gaji_min, job.gaji_max) || 'Tidak ditampilkan'}</p>
            </div>
        </div>
    </div>
);

// --- Komponen Utama Halaman ---
const JobSeekerApplicationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [appData, setAppData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        // Keamanan di sisi klien: Pastikan user ada dan lamaran ini miliknya
        if (!user?.user_id) {
            navigate('/login');
            return;
        }
        try {
            const details = await LamaranAPI.getApplicationDetails(id);
            if (!details || details.pelamar.profil.user_id !== user.user_id) {
                throw new Error("Lamaran tidak ditemukan atau Anda tidak berhak mengaksesnya.");
            }
            setAppData(details);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id, user, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (isLoading) return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
    if (error) return <div className="p-8 text-center h-screen flex flex-col justify-center items-center"><AlertCircle className="w-12 h-12 text-red-500 mb-4" /><p className="text-red-600 font-semibold">{error}</p></div>;
    if (!appData) return <div className="p-8 text-center">Data lamaran tidak ditemukan.</div>;

    const { lowongan_kerja: lowongan, status_lamaran } = appData;

    return (
        <div className="bg-slate-50 min-h-screen pt-10 pb-12">
            <div className="container mx-auto px-4 max-w-5xl space-y-8">
                {/* Header Halaman */}
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/pencari-kerja/history-lamaran" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{lowongan.judul}</h1>
                        <p className="text-slate-500">Detail Lamaran Anda</p>
                    </div>
                </div>

                {/* Kartu Status */}
                <StatusCard statusName={status_lamaran.nama_status} />

                {/* Layout Utama (2 kolom) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Kolom Kiri (Konten Utama) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-4">Deskripsi Pekerjaan</h2>
                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: lowongan.deskripsi || '<p><i>Tidak ada deskripsi.</i></p>' }} />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-4">Kualifikasi</h2>
                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: lowongan.kualifikasi || '<p><i>Tidak ada kualifikasi.</i></p>' }} />
                        </div>
                    </div>

                    {/* Kolom Kanan (Sidebar Info) */}
                    <div className="lg:sticky lg:top-28">
                        <InfoCard job={lowongan} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerApplicationDetailPage;
