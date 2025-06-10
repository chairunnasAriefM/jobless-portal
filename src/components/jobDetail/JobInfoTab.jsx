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
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">Deskripsi Pekerjaan</h2>
                <div className="prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: job.deskripsi?.replace(/\n/g, '<br />') }} />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">Kualifikasi</h2>
                <div className="prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: job.kualifikasi?.replace(/\n/g, '<br />') }} />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Detail Tambahan</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    {details.map(detail => detail.value && (
                        <div key={detail.label}>
                            <dt className="text-sm font-medium text-slate-500">{detail.label}</dt>
                            <dd className="mt-1 text-sm text-slate-900">{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

export default JobInfoTab;