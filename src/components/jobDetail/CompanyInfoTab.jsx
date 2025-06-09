// src/components/jobDetail/CompanyInfoTab.jsx
import React from 'react';

const CompanyInfoTab = ({ job }) => {
    const company = job.perusahaan;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{company.nama_perusahaan}</h2>
                {/* Logo bisa ditampilkan di sini jika ada di data */}
                {/* <img src={company.logo_perusahaan} alt={`Logo ${company.nama_perusahaan}`} className="h-16 w-auto mb-4"/> */}
            </div>
            <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Tentang Kami</h3>
                <p className="text-slate-600 leading-relaxed">
                    {company.deskripsi || 'Informasi deskripsi perusahaan tidak tersedia.'}
                </p>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Informasi Lainnya</h3>
                <dl>
                    {company.alamat && (
                        <div className="mb-2">
                            <dt className="text-sm font-medium text-slate-500">Alamat</dt>
                            <dd className="mt-1 text-sm text-slate-900">{company.alamat}</dd>
                        </div>
                    )}
                    {company.situs_web && (
                        <div className="mb-2">
                            <dt className="text-sm font-medium text-slate-500">Situs Web</dt>
                            <dd className="mt-1 text-sm text-orange-600 hover:underline">
                                <a href={company.situs_web} target="_blank" rel="noopener noreferrer">{company.situs_web}</a>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </div>
    );
};

export default CompanyInfoTab;