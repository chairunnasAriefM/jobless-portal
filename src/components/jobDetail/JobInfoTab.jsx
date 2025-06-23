// src/components/jobDetail/JobInfoTab.jsx
import React from 'react';
import { formatDatePosted, formatSalary } from '../../utils/formatters';

const JobInfoTab = ({ job }) => {
    // Membuat daftar detail agar mudah di-render
    const details = [
        { label: 'Lokasi', value: job.lokasi },
        { label: 'Tipe Pekerjaan', value: job.tipe_pekerjaan?.nama_tipe },
        { label: 'Gaji', value: formatSalary(job.gaji_min, job.gaji_max) },
        { label: 'Diposting Pada', value: formatDatePosted(job.tanggal_diposting) },
    ];

    return (
        <div className="space-y-8"> {/* Memberi jarak lebih antar section */}
            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">Deskripsi Pekerjaan</h2>
                {/* Menggunakan class 'prose' dari Tailwind Typography untuk styling teks otomatis */}
                <div className="prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: job.deskripsi }} />
            </div>
            
            {/* ====== BAGIAN BARU: KEAHLIAN ====== */}
            {/* Tampilkan section ini hanya jika ada data keahlian */}
            {job.keahlian && job.keahlian.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Keahlian yang Dibutuhkan</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.keahlian.map((skill) => (
                            <span 
                                key={skill.keahlian_id} 
                                className="bg-orange-100 text-orange-800 text-sm font-medium px-4 py-1.5 rounded-full"
                            >
                                {skill.nama_keahlian}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {/* ===================================== */}

            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">Kualifikasi</h2>
                <div className="prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: job.kualifikasi }} />
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Ringkasan Pekerjaan</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border border-slate-200 p-4 rounded-lg">
                    {details.map(detail => detail.value && (
                        <div key={detail.label}>
                            <dt className="text-sm font-medium text-slate-500">{detail.label}</dt>
                            <dd className="mt-1 text-sm font-semibold text-slate-900">{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

export default JobInfoTab;