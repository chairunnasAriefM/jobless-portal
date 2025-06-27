// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, DollarSign } from 'lucide-react';
import { formatDatePosted, formatSalary } from '../../utils/formatters'; // Impor helper

const JobCard = ({ job }) => {
    const salary = formatSalary(job.gaji_min, job.gaji_max);

    return (
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-slate-200 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-orange-600 hover:underline">
                    {/* Menggunakan ID dan judul dari API */}
                    <Link to={`/lowongan/${job.lowongan_id}`}>{job.judul}</Link>
                </h3>
                <span className="text-xs text-slate-500 mt-1 sm:mt-0 whitespace-nowrap">
                    {formatDatePosted(job.tanggal_diposting)}
                </span>
            </div>
            <div className="mb-3">
                <p className="text-sm font-medium text-slate-700 flex items-center mb-1">
                    <Building size={14} className="mr-2 text-slate-500" />
                    {/* Mengambil nama perusahaan dari data relasi */}
                    {job.perusahaan ? job.perusahaan.nama_perusahaan : 'Perusahaan Rahasia'}
                </p>
                <p className="text-sm text-slate-600 flex items-center">
                    <MapPin size={14} className="mr-2 text-slate-500" />
                    {job.lokasi}
                </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Menampilkan tipe pekerjaan sebagai tag */}
                {job.tipe_pekerjaan && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {job.tipe_pekerjaan.nama_tipe}
                    </span>
                )}
                {/* Menampilkan gaji jika ada */}
                {salary && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                        <DollarSign size={12} className="mr-1" /> {salary}
                    </span>
                )}
            </div>
            {/* Deskripsi diambil dari API dan dipotong jika terlalu panjang */}
            <div
                className="text-sm text-slate-500 leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: job.deskripsi }}
            />
        </div>
    );
};

export default JobCard;