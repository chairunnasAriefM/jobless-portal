// src/components/FeaturedJobs.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Gunakan Link dari react-router-dom untuk navigasi
import { MapPin, Briefcase, CalendarDays, ArrowRight, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { lowonganAPI } from '../services/lowonganAPI';

// Fungsi helper untuk format tanggal
const formatDatePosted = (dateString) => {
  if (!dateString) return 'Tanggal tidak tersedia';
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

const  JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col h-full">
    <div className="flex justify-between items-start mb-3">
      <span className="text-xs text-gray-500 flex items-center">
        <CalendarDays size={14} className="mr-1 text-slate-400" />
        {formatDatePosted(job.tanggal_diposting)}
      </span>
      {new Date(job.tanggal_diposting) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
          <TrendingUp size={14} className="mr-1" /> Baru
        </span>
      )}
    </div>
    {/* Gunakan Link dari react-router-dom untuk navigasi */}
    <Link to={`/lowongan/${job.lowongan_id}`}>
      <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-orange-500 transition-colors">{job.judul}</h3>
    </Link>

    <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
      <p className="flex items-center">
        <Briefcase size={16} className="mr-2 text-orange-500" />
        {job.perusahaan ? job.perusahaan.nama_perusahaan : 'Perusahaan tidak tersedia'}
      </p>
      <p className="flex items-center">
        <MapPin size={16} className="mr-2 text-orange-500" />
        {job.lokasi}
      </p>
      <p className="flex items-center flex-wrap gap-2 mt-1">
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
          {job.tipe_pekerjaan ? job.tipe_pekerjaan.nama_tipe : 'Tidak disebutkan'}
        </span>
      </p>
    </div>
    {/* Gunakan Link dari react-router-dom untuk navigasi */}
    <Link
      to={`/lowongan/${job.lowongan_id}`}
      className="inline-flex items-center justify-center mt-auto text-orange-500 hover:text-orange-600 font-medium group"
    >
      Lihat Detail
      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
    </Link>
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
        setError(null);

        const jobs = await lowonganAPI.fetchLowongan({ limit: 6 });
        setJobs(jobs);

      } catch (err) {
        setError('Gagal memuat data lowongan. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedJobs();
  }, []);


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

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        )}

        {error && (
          <div className="flex flex-col justify-center items-center py-10 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <JobCard key={job.lowongan_id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">Saat ini belum ada lowongan unggulan yang tersedia.</p>
          )
        )}

        <div className="text-center mt-12">
          <Link to="/lowongan" className='bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105'>
            Lihat Semua Lowongan
            <ArrowRight size={20} className="inline ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;