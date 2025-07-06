// src/pages/jobseeker/MyApplicationsPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LamaranAPI } from '../../../services/LamaranAPI';
import useAuthStore from '../../../store/authStore';
import { Loader2, Briefcase, Clock, CheckCircle, XCircle, HelpCircle, FileSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDatePosted } from '../../../utils/formatters';

const ITEMS_PER_PAGE = 5; // Tampilkan 5 lamaran per halaman

// --- Komponen-Komponen Pendukung ---  

const StatusBadge = ({ statusName }) => {
    const styles = {
        'Menunggu': { icon: <Clock size={14} />, color: 'bg-yellow-100 text-yellow-800' },
        'Diterima': { icon: <CheckCircle size={14} />, color: 'bg-green-100 text-green-800' },
        'Ditolak': { icon: <XCircle size={14} />, color: 'bg-red-100 text-red-800' },
    };
    const style = styles[statusName] || { icon: <HelpCircle size={14} />, color: 'bg-slate-100 text-slate-600' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${style.color}`}>
            {style.icon} {statusName}
        </span>
    );
};

const ApplicationCard = ({ application }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 transition-shadow duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
            <Briefcase size={32} className="text-slate-500" />
        </div>
        <div className="flex-grow">
            <Link to={`/dashboard/pencari-kerja/lamaran-detail/${application.lamaran_id}`} className="font-bold text-lg text-slate-800 hover:text-orange-600">
                {application.lowongan_kerja.judul}
            </Link>
            <p className="text-sm text-slate-600">{application.lowongan_kerja.perusahaan.nama_perusahaan}</p>
            <p className="text-xs text-slate-400 mt-1">Dilamar pada: {formatDatePosted(application.tanggal_lamaran)}</p>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
            <StatusBadge statusName={application.status_lamaran.nama_status} />
        </div>
    </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="mt-8 flex justify-center items-center gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50"><ChevronLeft size={20} /></button>
        <span className="text-sm text-slate-600">Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong></span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50"><ChevronRight size={20} /></button>
    </div>
);

// --- Komponen Utama Halaman ---

const MyApplicationsPage = () => {
    const [allApplications, setAllApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('Semua'); // 'Semua', 'Menunggu', 'Diterima', 'Ditolak'
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user?.user_id) {
            setIsLoading(false);
            return;
        };
        LamaranAPI.getMyApplications(user.user_id)
            .then(data => setAllApplications(data || []))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [user]);

    const filteredApplications = useMemo(() => {
        if (filterStatus === 'Semua') {
            return allApplications;
        }
        return allApplications.filter(app => app.status_lamaran.nama_status === filterStatus);
    }, [allApplications, filterStatus]);

    const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredApplications]);

    const filterOptions = ['Semua', 'Menunggu', 'Diterima', 'Ditolak'];

    if (isLoading) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
    }

    return (
        <div className="bg-slate-50 win-w-screen pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-10xl">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Riwayat Lamaran Saya</h1>
                <p className="text-slate-500 mb-8">Lacak status semua pekerjaan yang telah Anda lamar di sini.</p>

                {/* Filter Buttons */}
                <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 inline-flex items-center gap-2 mb-8">
                    {filterOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filterStatus === status
                                ? 'bg-orange-500 text-white shadow'
                                : 'text-slate-600 hover:bg-orange-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Daftar Lamaran */}
                <div className="space-y-4">
                    {paginatedApplications.length > 0 ? (
                        paginatedApplications.map(app => (
                            <ApplicationCard key={app.lamaran_id} application={app} />
                        ))
                    ) : (
                        <div className="text-center py-20 px-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <FileSearch size={52} className="mx-auto text-slate-300" />
                            <h3 className="mt-4 text-xl font-semibold text-slate-700">Tidak Ada Lamaran</h3>
                            <p className="mt-1 text-slate-500">
                                {filterStatus === 'Semua'
                                    ? "Anda belum pernah melamar pekerjaan."
                                    : `Anda tidak memiliki lamaran dengan status "${filterStatus}".`
                                }
                            </p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
