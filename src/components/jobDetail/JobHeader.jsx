// src/components/jobDetail/JobHeader.jsx
import React from 'react';

const JobHeader = ({ job }) => (
    <div className="pb-6 border-b border-slate-200 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">{job.judul}</h1>
        <p className="mt-2 text-md text-slate-600">
            di <span className="font-semibold text-slate-800">{job.perusahaan.nama_perusahaan}</span>
        </p>
    </div>
);

export default JobHeader;