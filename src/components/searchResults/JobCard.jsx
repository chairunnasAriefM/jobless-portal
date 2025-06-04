// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, DollarSign, Award } from 'lucide-react';

const JobCard = ({ job }) => (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-slate-200 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-orange-600 hover:underline">
                {/* Arahkan ke halaman detail lowongan jika ada */}
                <Link to={`/lowongan/${job.id}`}>{job.title}</Link>
            </h3>
            <span className="text-xs text-slate-500 mt-1 sm:mt-0 whitespace-nowrap">{job.postedDate}</span>
        </div>
        <div className="mb-2">
            <p className="text-sm font-medium text-slate-700 flex items-center mb-1">
                <Building size={14} className="mr-2 text-slate-500" />{job.company}
            </p>
            <p className="text-sm text-slate-600 flex items-center">
                <MapPin size={14} className="mr-2 text-slate-500" />{job.location}
            </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
            {job.tags && job.tags.map(tag => ( // Tambahkan pengecekan job.tags
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tag}</span>
            ))}
            {job.salary && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                    <DollarSign size={12} className="mr-1" /> {job.salary}
                </span>
            )}
        </div>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
            {job.shortDescription}
        </p>
        {job.accolades && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md flex items-center">
                <Award size={14} className="mr-2 flex-shrink-0" /> {job.accolades}
            </div>
        )}
    </div>
);

export default JobCard;