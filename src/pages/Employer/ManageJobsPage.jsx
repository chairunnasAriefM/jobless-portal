import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search, PlusCircle, FileText, Trash2, Users, MapPin, Edit } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { lowonganAPI } from '../../services/lowonganAPI';
import useAuthStore from '../../store/authStore';

const MySwal = withReactContent(Swal);




const JobRow = ({ job, onDelete }) => {
    const candidateCount = job.kandidat?.[0]?.count || 0;
    const isActive = job.status_aktif;

    // Komponen kecil untuk menampilkan statistik dengan ikon
    const StatItem = ({ icon, value, label }) => (
        <div className="flex flex-col items-center justify-center p-2 text-center">
            <p className="flex items-center gap-1.5 text-base font-bold text-slate-700">
                {icon}
                {value}
            </p>
            <p className="text-xs text-slate-500">{label}</p>
        </div>
    );

    return (
        // Layout utama menggunakan Flexbox yang lebih modern dan responsif
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 flex flex-col md:flex-row items-center gap-4 transition-all duration-300">

            {/* Bagian Kiri: Informasi Utama Lowongan */}
            <div className="flex-grow flex items-center gap-4 w-full">
                <div className="flex-shrink-0">
                    {/* Indikator Status */}
                    <span className={`w-3 h-3 rounded-full block ${isActive ? 'bg-green-500' : 'bg-slate-400'}`} title={isActive ? 'Aktif' : 'Ditutup'}></span>
                </div>
                <div>
                    <Link to={`/dashboard/perusahaan/lowongan/detail/${job.lowongan_id}`} className="font-semibold text-slate-800 hover:text-orange-600 transition-colors">
                        {job.judul}
                    </Link>
                    <p className="text-sm text-slate-500 flex items-center">
                        <MapPin size={12} className="mr-1.5" />{job.lokasi}
                    </p>
                </div>
            </div>

            {/* Bagian Tengah: Statistik Pelamar */}
            <div className="flex-shrink-0 border-t md:border-t-0 md:border-x border-slate-200 px-4 md:px-6 w-full md:w-auto py-4 md:py-0">
                <StatItem icon={<Users size={14} className="text-slate-400" />} value={candidateCount} label="Pelamar" />
            </div>

            {/* Bagian Kanan: Tombol Aksi (Kelola & Hapus) */}
            <div className="flex-shrink-0 flex items-center justify-end gap-2 w-full md:w-auto">
                <Link
                    to={`/dashboard/perusahaan/lowongan/edit/${job.lowongan_id}`}
                    title="Kelola Lowongan"
                    className="inline-flex items-center bg-orange-50 text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                >
                    <Edit size={14} className="md:mr-2" />
                    <span className="hidden md:inline">Kelola</span>
                </Link>
                <button
                    onClick={() => onDelete(job.lowongan_id)}
                    title="Hapus Lowongan"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

        </div>
    );
};

/**
 * Komponen untuk ditampilkan saat tidak ada lowongan pekerjaan.
 */
const EmptyState = () => (
    <div className="text-center py-20 px-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="inline-block bg-slate-100 p-5 rounded-full">
            <FileText size={48} className="text-slate-400" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-slate-800">Anda belum punya iklan lowongan</h3>
        <p className="mt-1 text-slate-500">Ayo buat iklan pekerjaan pertama Anda dan temukan talenta terbaik.</p>
        <Link
            to="/dashboard/perusahaan/lowongan/baru"
            className="inline-flex items-center mt-6 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
            <PlusCircle size={20} className="mr-2" />
            Buat Iklan Lowongan
        </Link>
    </div>
);


//=================================================================
// Komponen Utama Halaman
//=================================================================

const ManageJobsPage = () => {
    // Ganti ini dengan data user dari state management Anda (misal: Zustand)
    const { user } = useAuthStore();
    // State untuk data dan UI
    const [allJobs, setAllJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('Aktif');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const tabs = ['Aktif', 'Ditutup', 'Semua'];

    // Mengambil semua data lowongan milik perusahaan saat halaman dimuat
    useEffect(() => {
        if (!user?.perusahaan_id) {
            setIsLoading(false);
            setError("Profil perusahaan tidak ditemukan. Mohon login ulang.");
            return;
        }
        lowonganAPI.fetchLowonganByPerusahaan(user.perusahaan_id)
            .then(data => {
                setAllJobs(data || []);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user?.perusahaan_id]);

    // Melakukan filter di sisi client (browser) secara efisien
    const filteredJobs = useMemo(() => {
        return allJobs
            .filter(job => {
                if (activeTab === 'Aktif') return job.status_aktif === true;
                if (activeTab === 'Ditutup') return job.status_aktif === false;
                return true; // Untuk tab 'Semua'
            })
            .filter(job => {
                return job.judul.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [allJobs, activeTab, searchTerm]);

    // Fungsi untuk menangani penghapusan lowongan
    const handleDelete = (jobId) => {
        MySwal.fire({
            title: 'Anda yakin?',
            text: "Lowongan yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await lowonganAPI.deleteLowonganKerja(jobId);
                    // Hapus dari state agar UI langsung update tanpa refresh
                    setAllJobs(prevJobs => prevJobs.filter(j => j.lowongan_id !== jobId));
                    MySwal.fire('Dihapus!', 'Lowongan telah dihapus.', 'success');
                } catch (error) {
                    MySwal.fire('Gagal!', error.message, 'error');
                }
            }
        });
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-orange-500" size={32} /></div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            {/* Header: Judul, Search, dan Tombol Aksi */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-800">
                    Lowongan Saya ({allJobs.length})
                </h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-72">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari lowongan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <Link
                        to="/dashboard/perusahaan/lowongan/baru"
                        className="inline-flex items-center bg-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                        <PlusCircle size={18} className="mr-2" />
                        Buat Lowongan
                    </Link>
                </div>
            </div>

            {/* Navigasi Tab */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Konten Daftar Lowongan */}
            <div className="mt-6">
                {filteredJobs.length > 0 ? (
                    <div className="space-y-4">
                        {filteredJobs.map(job => (
                            <JobRow key={job.lowongan_id} job={job} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default ManageJobsPage;