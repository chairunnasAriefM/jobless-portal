import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LamaranAPI } from '../../../../services/LamaranAPI';
import { Loader2, AlertCircle, ArrowLeft, FileSearch, CheckCircle, XCircle, Clock, HelpCircle, Search, ArrowUpDown } from 'lucide-react';
import { formatDatePosted } from '../../../../utils/formatters';

// --- Komponen-Komponen Pendukung ---

const StatusBadge = ({ statusName }) => {
    const styles = {
        'Menunggu': { icon: <Clock size={14} />, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        'Diterima': { icon: <CheckCircle size={14} />, color: 'bg-green-100 text-green-800 border-green-200' },
        'Ditolak': { icon: <XCircle size={14} />, color: 'bg-red-100 text-red-800 border-red-200' },
    };
    const style = styles[statusName] || { icon: <HelpCircle size={14} />, color: 'bg-slate-100 text-slate-600' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${style.color}`}>
            {style.icon} {statusName}
        </span>
    );
};

const DataTable = ({ columns, data, sortConfig, requestSort }) => {
    const getSortIcon = (key) => {
        if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-2 text-slate-300" />;
        if (sortConfig.direction === 'ascending') return <ArrowUpDown size={14} className="ml-2 text-orange-500 transform rotate-180" />;
        return <ArrowUpDown size={14} className="ml-2 text-orange-500" />;
    };
    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} scope="col" className={`px-6 py-4 ${col.className || ''}`}>
                                {col.sortable ? (
                                    <button onClick={() => requestSort(col.key)} className="flex items-center hover:text-orange-600">{col.header}{getSortIcon(col.key)}</button>
                                ) : col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {data.map(app => (
                        <tr key={app.lamaran_id} className="hover:bg-slate-50">
                            <td className="p-4 px-6 font-semibold text-slate-800">{app.nama_lengkap}</td>
                            <td className="p-4 px-6 text-slate-500">{formatDatePosted(app.tanggal_lamaran)}</td>
                            <td className="p-4 px-6 text-center"><StatusBadge statusName={app.status_lamaran.nama_status} /></td>
                            <td className="p-4 px-6 text-right">
                                <Link to={`/dashboard/perusahaan/lamaran-detail/${app.lamaran_id}`} className="font-semibold text-orange-600 hover:underline">Lihat Detail</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Komponen Utama Halaman ---
const ManageApplicantsPage = () => {
    const { lowonganId } = useParams();
    const [allApplicants, setAllApplicants] = useState([]);
    const [lowonganTitle, setLowonganTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk filter dan sort
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [sortConfig, setSortConfig] = useState({ key: 'tanggal_lamaran', direction: 'descending' });

    const loadData = useCallback(async () => {
        try {
            const applicantsData = await LamaranAPI.getApplicantsByJob(lowonganId);
            setAllApplicants(applicantsData || []);
            if (applicantsData && applicantsData.length > 0) {
                setLowonganTitle(applicantsData[0].lowongan_kerja.judul);
            }
        } catch (err) {
            setError("Gagal memuat data pelamar.");
        } finally {
            setIsLoading(false);
        }
    }, [lowonganId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const processedApplicants = useMemo(() => {
        let processableData = [...allApplicants];
        if (filterStatus !== 'Semua') {
            processableData = processableData.filter(app => app.status_lamaran.nama_status === filterStatus);
        }
        if (sortConfig.key) {
            processableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return processableData;
    }, [allApplicants, filterStatus, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
    if (error) return <div className="p-8 text-center text-red-500"><AlertCircle className="mx-auto mb-2" />{error}</div>;

    const columns = [
        { header: 'Nama Pelamar', key: 'nama_lengkap', sortable: true },
        { header: 'Tanggal Melamar', key: 'tanggal_lamaran', sortable: true },
        { header: 'Status', key: 'status_lamaran', sortable: false, className: 'text-center' },
        { header: 'Aksi', key: 'aksi', sortable: false, className: 'text-right' },
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/perusahaan/lowongan" className="p-2 rounded-full hover:bg-slate-200">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Daftar Pelamar</h1>
                    <p className="text-slate-500">{lowonganTitle}</p>
                </div>
            </div>

            {/* Panel Filter */}
            <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 inline-flex items-center gap-2 mb-6">
                {['Semua', 'Menunggu', 'Diterima', 'Ditolak'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filterStatus === status
                                ? 'bg-orange-500 text-white shadow'
                                : 'text-slate-600 hover:bg-orange-50'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {processedApplicants.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={processedApplicants}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    renderRow={(app) => (
                        <>
                            <td className="p-4 px-6 font-semibold text-slate-800">{app.nama_lengkap}</td>
                            <td className="p-4 px-6 text-slate-500">{formatDatePosted(app.tanggal_lamaran)}</td>
                            <td className="p-4 px-6 text-center"><StatusBadge statusName={app.status_lamaran.nama_status} /></td>
                            <td className="p-4 px-6 text-right">
                                <Link to={`/dashboard/perusahaan/lamaran-detail/${app.lamaran_id}`} className="font-semibold text-orange-600 hover:underline">
                                    Lihat Detail
                                </Link>
                            </td>
                        </>
                    )}
                />
            ) : (
                <div className="text-center p-16 text-slate-500 bg-white rounded-xl shadow-lg border">
                    <FileSearch size={48} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">Belum ada pelamar dengan status "{filterStatus}".</p>
                </div>
            )}

        </div>
    );
};

export default ManageApplicantsPage;
