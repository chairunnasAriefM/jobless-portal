// src/pages/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertTriangle, ChevronDown } from 'lucide-react';
import { lowonganAPI } from '../services/lowonganAPI';

// Komponen-komponen pendukung yang akan kita buat di bawah
import JobHeader from '../components/jobDetail/JobHeader';
import JobInfoTab from '../components/jobDetail/JobInfoTab';
import CompanyInfoTab from '../components/jobDetail/CompanyInfoTab';
import JobDetailSidebar from '../components/jobDetail/JobDetailSidebar';

const JobDetail = () => {
    const { id } = useParams(); // Mengambil 'id' dari URL, misal: /lowongan/5
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('job'); // 'job' atau 'company'

    useEffect(() => {
        const loadJobDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await lowonganAPI.fetchLowonganById(id);
                if (data) {
                    setJob(data);
                } else {
                    setError('Lowongan tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat detail lowongan.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadJobDetails();
    }, [id]); // Jalankan ulang jika ID di URL berubah

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-red-600">{error}</h2>
                <Link to="/" className="mt-4 text-orange-500 hover:underline">Kembali ke Beranda</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6 text-slate-600" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex items-center">
                        <li className="flex items-center"><Link to="/" className="hover:text-orange-500">Beranda</Link><ChevronDown size={14} className="mx-1 transform -rotate-90" /></li>
                        <li className="flex items-center"><Link to="/jobs" className="hover:text-orange-500">Lowongan</Link><ChevronDown size={14} className="mx-1 transform -rotate-90" /></li>
                        <li className="flex items-center"><span className="text-slate-500 line-clamp-1">{job.judul}</span></li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Kolom Utama */}
                    <main className="w-full lg:w-2/3">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
                            <JobHeader job={job} />

                            {/* Tab Switcher */}
                            <div className="border-b border-slate-200 mb-6">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('job')} className={`${activeTab === 'job' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Detail Pekerjaan
                                    </button>
                                    <button onClick={() => setActiveTab('company')} className={`${activeTab === 'company' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Tentang Perusahaan
                                    </button>
                                </nav>
                            </div>

                            {/* Konten Tab */}
                            <div>
                                {activeTab === 'job' && <JobInfoTab job={job} />}
                                {activeTab === 'company' && <CompanyInfoTab job={job} />}
                            </div>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <JobDetailSidebar job={job} />
                </div>
            </div>
        </div>
    );
};

export default JobDetail;