import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LowonganKerjaAPI } from '../../../services/Admin/LowonganKerjaAPI';
import { Loader2, AlertCircle, ArrowLeft, Briefcase, MapPin, DollarSign, Calendar, CheckCircle, XCircle, Edit, Users } from 'lucide-react'; // Ditambahkan Users
import { formatDatePosted, formatSalary } from '../../../utils/formatters';

// --- Komponen-komponen Pendukung ---

// Kartu untuk menampilkan informasi ringkas di sidebar
const InfoCard = ({ job }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4">
        <div>
            <p className="text-sm text-slate-500">Perusahaan</p>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
                <Briefcase size={16} className="text-slate-400" /> {job.perusahaan?.nama_perusahaan || 'N/A'}
            </p>
        </div>
        <div>
            <p className="text-sm text-slate-500">Lokasi</p>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" /> {job.lokasi}
            </p>
        </div>
        <div>
            <p className="text-sm text-slate-500">Tipe Pekerjaan</p>
            <p className="font-semibold text-slate-800">{job.tipe_pekerjaan?.nama_tipe || 'N/A'}</p>
        </div>
        <div>
            <p className="text-sm text-slate-500">Gaji</p>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
                <DollarSign size={16} className="text-slate-400" /> {formatSalary(job.gaji_min, job.gaji_max) || 'Tidak ditampilkan'}
            </p>
        </div>
        <div>
            <p className="text-sm text-slate-500">Diposting</p>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" /> {formatDatePosted(job.created_at)}
            </p>
        </div>
        <div>
            <p className="text-sm text-slate-500">Status</p>
            <div className={`flex items-center gap-2 font-semibold ${job.status_aktif ? 'text-green-600' : 'text-red-600'}`}>
                {job.status_aktif ? <CheckCircle size={16} /> : <XCircle size={16} />}
                <span>{job.status_aktif ? 'Aktif' : 'Ditutup'}</span>
            </div>
        </div>
    </div>
);

// --- Komponen Utama Halaman ---

const ShowLowonganPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) {
                navigate('/admin/lowongan');
                return;
            }
            try {
                const data = await LowonganKerjaAPI.getLowonganKerjaById(id);
                setJob(data);
            } catch (err) {
                setError("Gagal memuat detail lowongan.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobDetails();
    }, [id, navigate]);

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-orange-500" size={32} /></div>;
    }

    if (error) {
        return <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center"><AlertCircle size={18} className="mr-2" /> {error}</div>;
    }

    if (!job) {
        return <div className="p-8 text-center">Lowongan tidak ditemukan.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/perusahaan/lowongan" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{job.judul}</h1>
                        <p className="text-slate-500">Detail Lowongan Pekerjaan</p>
                    </div>
                </div>
                {/* Tombol Aksi di Header */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link to={`/dashboard/perusahaan/lowongan/${job.lowongan_id}/pelamar`} className="bg-orange-50 text-orange-600 font-semibold py-2.5 px-5 rounded-lg hover:bg-orange-100 transition-colors flex items-center">
                        <Users size={16} className="mr-2" /> Lihat Pelamar
                    </Link>
                    <Link to={`/dashboard/perusahaan/lowongan/edit/${job.lowongan_id}`} className="bg-slate-700 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-slate-800 transition-colors flex items-center">
                        <Edit size={16} className="mr-2" /> Edit
                    </Link>
                </div>
            </div>

            {/* Layout Utama (2 kolom) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Kolom Kiri (Konten Utama) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-4">Deskripsi Pekerjaan</h2>
                        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: job.deskripsi || '<p><i>Tidak ada deskripsi.</i></p>' }} />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-4">Kualifikasi</h2>
                        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: job.kualifikasi || '<p><i>Tidak ada kualifikasi.</i></p>' }} />
                    </div>
                </div>

                {/* Kolom Kanan (Sidebar Info) */}
                <div className="lg:sticky lg:top-8">
                    <InfoCard job={job} />
                </div>
            </div>
        </div>
    );
};

export default ShowLowonganPage;
