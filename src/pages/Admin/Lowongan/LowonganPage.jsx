import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LowonganKerjaAPI } from '../../../services/Admin/LowonganKerjaAPI';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, Search, Trash2, Edit, AlertCircle, Briefcase, Filter as FilterIcon } from 'lucide-react';

import DataTable from '../../../components/dashboard/Admin/DataTable';
import Pagination from '../../../components/dashboard/Admin/Pagination';

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 10;

const ManageLowonganPage = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk filter & sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua'); // 'Semua', 'Aktif', 'Ditutup'
    const [sortConfig, setSortConfig] = useState({ key: 'tanggal_diposting', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);

    const loadJobs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await LowonganKerjaAPI.fetchLowonganKerja();
            setAllJobs(data || []);
        } catch (err) {
            setError("Gagal memuat data lowongan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const processedJobs = useMemo(() => {
        let processableJobs = [...allJobs]
            .filter(job => { // Filter status
                if (filterStatus === 'Semua') return true;
                return filterStatus === 'Aktif' ? job.status_aktif : !job.status_aktif;
            })
            .filter(job => // Filter pencarian
                job.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (sortConfig.key) { // Sorting
            processableJobs.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return processableJobs;
    }, [allJobs, searchTerm, filterStatus, sortConfig]);

    const totalPages = Math.ceil(processedJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, processedJobs]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleDelete = async (jobId) => {
        MySwal.fire({
            title: 'Anda yakin?', text: "Lowongan yang dihapus tidak bisa dikembalikan!",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await LowonganKerjaAPI.deleteLowonganKerja(jobId);
                    MySwal.fire('Dihapus!', 'Lowongan telah dihapus.', 'success');
                    loadJobs();
                } catch (err) {
                    MySwal.fire('Gagal!', `Terjadi kesalahan: ${err.message}`, 'error');
                }
            }
        });
    };

    const columns = [
        { header: 'Judul Lowongan', key: 'judul', sortable: true },
        { header: 'Perusahaan', key: 'nama_perusahaan', sortable: true },
        { header: 'Status', key: 'status_aktif', sortable: true, className: 'text-center' },
        { header: 'Aksi', key: 'aksi', sortable: false, className: 'text-right' },
    ];

    const renderJobRow = (job) => (
        <>
            <td className="px-6 py-4">
                <Link to={`/admin/lowongan/show/${job.lowongan_id}`} className="font-semibold text-slate-800 hover:text-orange-600 transition-colors">
                    {job.judul}
                </Link>
                <div className="text-xs text-slate-500">{job.lokasi}</div>
            </td>
            <td className="px-6 py-4 text-slate-600">{job.nama_perusahaan}</td>
            <td className="px-6 py-4 ">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${job.status_aktif ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                    {job.status_aktif ? 'Aktif' : 'Ditutup'}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <Link to={`/admin/lowongan/edit/${job.lowongan_id}`} title="Edit Lowongan" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                        <Edit size={16} />
                    </Link>
                    <button title="Hapus Lowongan" onClick={() => handleDelete(job.lowongan_id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-5xl font-bold text-slate-800">Kelola Lowongan</h1>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:max-w-md">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Cari judul atau perusahaan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-auto px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="Semua">Semua Status</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Ditutup">Ditutup</option>
                    </select>
                </div>
            </div>

            {isLoading ? (<div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" /></div>)
                : error ? (<div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center"><AlertCircle size={18} className="mr-2" /> {error}</div>)
                    : processedJobs.length > 0 ? (
                        <>
                            <DataTable data={paginatedJobs} columns={columns} renderRow={renderJobRow} sortConfig={sortConfig} requestSort={requestSort} />
                            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={processedJobs.length} onPageChange={(page) => setCurrentPage(page)} />
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                            <FilterIcon size={48} className="mx-auto text-slate-300" />
                            <p className="mt-4 font-semibold text-slate-700">Tidak ada lowongan yang cocok.</p>
                        </div>
                    )}
        </div>
    );
};

export default ManageLowonganPage;
