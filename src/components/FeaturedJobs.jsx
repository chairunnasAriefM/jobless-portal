// src/components/FeaturedJobs.jsx
import React from 'react';
import { MapPin, Briefcase, CalendarDays, ArrowRight, TrendingUp } from 'lucide-react'; // Menambahkan TrendingUp

const jobListings = [ // Sesuaikan dengan jenis lowongan yang relevan untuk target pasar Anda
  {
    id: 1,
    title: 'Admin Toko Online (UKM Fashion)',
    company: 'Gaya Lokal Store',
    location: 'Pekanbaru, Riau', // Contoh lokasi lokal
    type: 'Full-Time',
    schedule: 'Jam Kerja Fleksibel',
    isNew: true,
    datePosted: 'Hari Ini',
  },
  {
    id: 2,
    title: 'Digital Marketing Staff untuk Startup Kuliner',
    company: 'Dapur Enak Nusantara',
    location: 'Indonesia (Remote)',
    type: 'Remote',
    schedule: 'Full-Time',
    isNew: true,
    datePosted: 'Hari Ini',
  },
  {
    id: 3,
    title: 'Pengembang Web (Project UKM)',
    company: 'Solusi Digital UKM',
    location: 'Bandung, Jawa Barat',
    type: 'Project-Based',
    schedule: 'Paruh Waktu',
    isNew: false,
    datePosted: 'Kemarin',
  },
   {
    id: 4,
    title: 'Customer Service untuk Layanan Jasa Lokal',
    company: 'Bersih Rapi Pekanbaru',
    location: 'Pekanbaru, Riau',
    type: 'Full-Time',
    schedule: 'Shift',
    isNew: true,
    datePosted: 'Hari Ini',
  },
];

const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col h-full">
    <div className="flex justify-between items-start mb-3">
      <span className="text-xs text-gray-500 flex items-center">
        <CalendarDays size={14} className="mr-1 text-slate-400"/> {job.datePosted}
      </span>
      {job.isNew && (
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
          <TrendingUp size={14} className="mr-1"/> Baru
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-orange-500 transition-colors">{job.title}</h3>
    
    <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
      <p className="flex items-center">
        <Briefcase size={16} className="mr-2 text-orange-500" /> {job.company}
      </p>
      <p className="flex items-center">
        <MapPin size={16} className="mr-2 text-orange-500" /> {job.location}
      </p>
      <p className="flex items-center flex-wrap gap-2 mt-1">
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{job.type}</span>
        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{job.schedule}</span>
      </p>
    </div>
    <a
      href="#" // Arahkan ke detail lowongan
      className="inline-flex items-center justify-center mt-auto text-orange-500 hover:text-orange-600 font-medium group"
    >
      Lihat Detail
      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
    </a>
  </div>
);

const FeaturedJobs = () => {
  return (
    <section id="find-jobs" className="py-16 bg-slate-50"> {/* Ubah background agar kontras */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Lowongan <span className="text-orange-500">Unggulan</span> Terbaru
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi ribuan peluang karir dari UKM dan perusahaan berkembang di berbagai industri.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobListings.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
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