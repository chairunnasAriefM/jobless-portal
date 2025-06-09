import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, CalendarDays, ArrowRight, TrendingUp } from 'lucide-react';
import { lowonganAPI } from '../services/lowonganAPI';

// Fungsi helper untuk format tanggal
const formatDatePosted = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hari Ini';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  }
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col h-full">
    <div className="flex justify-between items-start mb-3">
      <span className="text-xs text-gray-500 flex items-center">
        <CalendarDays size={14} className="mr-1 text-slate-400" />
        {formatDatePosted(job.tanggal_diposting)}
      </span>
      {/* Logika untuk "Baru" bisa disesuaikan, misalnya jika posting < 3 hari */}
      {new Date(job.tanggal_diposting) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
          <TrendingUp size={14} className="mr-1" /> Baru
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-orange-500 transition-colors">{job.judul}</h3>

    <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
      <p className="flex items-center">
        <Briefcase size={16} className="mr-2 text-orange-500" />
        {/* BENAR: job.perusahaan (semua huruf kecil) */}
        {job.perusahaan ? job.perusahaan.nama_perusahaan : 'Perusahaan tidak tersedia'}
      </p>
      <p className="flex items-center">
        <MapPin size={16} className="mr-2 text-orange-500" />
        {job.lokasi}
      </p>
      <p className="flex items-center flex-wrap gap-2 mt-1">
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
          {/* BENAR: job.tipe_pekerjaan (semua huruf kecil) */}
          {job.tipe_pekerjaan ? job.tipe_pekerjaan.nama_tipe : 'Tidak disebutkan'}
        </span>
      </p>
    </div>
    <a
      href={`/jobs/${job.lowongan_id}`} // Arahkan ke detail lowongan dengan ID dinamis
      className="inline-flex items-center justify-center mt-auto text-orange-500 hover:text-orange-600 font-medium group"
    >
      Lihat Detail
      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
    </a>
  </div>
);

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeaturedJobs = async () => {
      try {
        setLoading(true);
        // Panggil API dengan limit 6
        const data = await lowonganAPI.fetchLowongan(6);
        setJobs(data);
      } catch (err) {
        setError('Gagal memuat data lowongan. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedJobs();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  return (
    <section id="find-jobs" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Lowongan <span className="text-orange-500">Unggulan</span> Terbaru
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi ribuan peluang karir dari UKM dan perusahaan berkembang di berbagai industri.
          </p>
        </div>

        {loading && <p className="text-center">Memuat lowongan...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.lowongan_id} job={job} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Lihat Semua Lowongan
            <ArrowRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;