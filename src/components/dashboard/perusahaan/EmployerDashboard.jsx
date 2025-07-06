// src/components/dashboard/perusahaan/EmployerDashboard.jsx

import React, { useState, useEffect } from 'react'; // DIPERBAIKI: Semua hook diimpor di sini
import { Link } from 'react-router-dom';
import { Plus, Users, Eye, MoreVertical, Loader2, AlertTriangle, MapPin, Target } from "lucide-react";

import useAuthStore from '../../../store/authStore'; // Pastikan path ini benar
import { lowonganAPI } from '../../../services/lowonganAPI'; // Pastikan path ini benar

// --- Komponen Pendukung (Tidak ada perubahan, sudah bagus) ---

const WelcomeBanner = ({ user }) => (
  <div className="relative bg-gradient-to-r from-orange-50 via-red-50 to-white p-8 md:p-10 rounded-2xl shadow-sm overflow-hidden border border-slate-200">
    <div className="relative z-10">
      {/* Menggunakan nama dari user yang login */}
      <h1 className="text-3xl font-bold text-slate-800">Hai, {user?.nama_lengkap || 'Perekrut'}!</h1>
      <p className="mt-2 text-slate-600 max-w-lg">
        Selamat datang kembali. Anda berada di tempat yang tepat untuk menemukan talenta terbaik.
      </p>
      <Link to="/dashboard/perusahaan/lowongan/baru" className="inline-flex items-center mt-6 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
        <Plus size={20} className="mr-2" />
        Buat Iklan Lowongan
      </Link>
    </div>
  </div>
);

const JobRowCard = ({ job }) => {
  const candidateCount = job.kandidat?.[0]?.count || 0;
  const isActive = job.status_aktif;

  // Komponen kecil untuk metrik Pelamar
  const StatItem = ({ icon, value, label }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-base font-bold text-slate-700">{value}</p>
      </div>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 flex flex-col md:flex-row items-center gap-4 transition-all duration-300">

      <div className="flex-grow flex items-center gap-4 w-full">
        <div className="flex-shrink-0">
          <span className={`w-3 h-3 rounded-full block ${isActive ? 'bg-green-500' : 'bg-slate-400'}`} title={isActive ? 'Aktif' : 'Draft/Ditutup'}></span>
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

      <div className="flex-shrink-0 border-t md:border-t-0 md:border-x border-slate-200 px-4 md:px-6 w-full md:w-auto py-4 md:py-0">
        <StatItem icon={<Users size={14} className="text-slate-400" />} value={candidateCount} label="Pelamar" />
      </div>

      <div className="flex-shrink-0 flex items-center justify-end w-full md:w-auto">
        <Link
          to={`/dashboard/perusahaan/lowongan/edit/${job.lowongan_id}`}
          className="bg-orange-50 text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-100 transition-colors text-sm"
        >
          Kelola
        </Link>
      </div>

    </div>
  );
};


const JobList = ({ jobs, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-2 font-semibold text-red-700">Gagal memuat data</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center p-16 bg-white rounded-lg shadow-sm border-2 border-dashed border-slate-200">
        <p className="font-semibold text-slate-700">Anda belum memiliki iklan pekerjaan.</p>
        <p className="text-sm text-slate-500 mt-1">Mari buat iklan pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobRowCard key={job.lowongan_id} job={job} />
      ))}
    </div>
  );
};

// --- Komponen Utama yang akan Anda Ekspor ---
const ModernEmployerDashboard = () => {
  const { user } = useAuthStore();
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect sekarang hanya untuk mengambil data, tidak ada filter
  useEffect(() => {
    // Pastikan user dan perusahaan_id ada sebelum fetch
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
  }, [user?.perusahaan_id]); // Dependensi hanya pada user id

  // DIHAPUS: const filteredJobs tidak lagi diperlukan di sini
  // Logika filter dipindahkan ke halaman "Kelola Lowongan"

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10 bg-gray-50/50">
      <WelcomeBanner user={user} />
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Iklan Pekerjaan Terbaru
          </h2>
          <Link to="/dashboard/perusahaan/lowongan" className="font-semibold text-sm text-orange-600 hover:underline">
            Kelola Semua
          </Link>
        </div>
        {/* DIPERBAIKI: Menggunakan allJobs dan meneruskan state loading/error */}
        <JobList jobs={allJobs} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default ModernEmployerDashboard;