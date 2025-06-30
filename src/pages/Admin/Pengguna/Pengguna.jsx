import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PenggunaAPI } from '../../../services/Admin/PenggunaAPI';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, Search, Trash2, Edit, AlertCircle, UserPlus, Filter as FilterIcon } from 'lucide-react';
import { formatDatePosted } from '../../../utils/formatters';
import { Link } from 'react-router-dom';

import DataTable from '../../../components/dashboard/Admin/DataTable';
import Pagination from '../../../components/dashboard/Admin/Pagination';

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 10;

const PenggunaPage = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk filter, search, sort, dan pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Semua');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await PenggunaAPI.fetchPenggunas();
            setAllUsers(data || []);
        } catch (err) {
            setError("Gagal memuat data pengguna.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Logika untuk memproses data: filter, lalu sort
    const processedUsers = useMemo(() => {
        let processableUsers = [...allUsers]
            .filter(user => {
                if (filterType === 'Semua') return user.tipe_user_id !== 3;
                if (user.tipe_user_id === 3) return false;
                return user.nama_tipe === filterType;
            })
            .filter(user =>
                user.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (sortConfig.key) {
            processableUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return processableUsers;
    }, [allUsers, searchTerm, filterType, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, processedUsers]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Kembali ke halaman pertama setelah sorting
    };

    const handleDelete = async (userId) => {
        MySwal.fire({
            title: 'Anda yakin?', text: "Pengguna yang dihapus tidak bisa dikembalikan!",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await PenggunaAPI.deletePengguna(userId);
                    MySwal.fire('Dihapus!', 'Pengguna telah berhasil dihapus.', 'success');
                    loadUsers();
                } catch (err) {
                    MySwal.fire('Gagal!', `Terjadi kesalahan: ${err.message}`, 'error');
                }
            }
        });
    };

    // Definisikan kolom untuk tabel
    const columns = [
        { header: 'Nama Pengguna', key: 'nama_lengkap', sortable: true },
        { header: 'Email', key: 'email', sortable: false },
        { header: 'Tipe', key: 'nama_tipe', sortable: true, className: 'text-center' },
        { header: 'Bergabung Pada', key: 'created_at', sortable: true, className: 'text-center' },
        { header: 'Aksi', key: 'aksi', sortable: false, className: 'text-right' },
    ];

    // Fungsi untuk merender setiap baris pada tabel
    const renderUserRow = (user) => (
        <>
            <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">{user.nama_lengkap}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.nama_tipe === 'perusahaan' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {user.nama_tipe?.replace('_', ' ') || 'N/A'}
                </span>
            </td>
            <td className="px-6 py-2 text-slate-500">{formatDatePosted(user.created_at)}</td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <Link
                        to={`/admin/users/edit/${user.user_id}`}
                        title="Edit Pengguna"
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                    >
                        <Edit size={16} />
                    </Link>
                    <button title="Hapus Pengguna" onClick={() => handleDelete(user.user_id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"><Trash2 size={16} /></button>
                </div>
            </td>
        </>
    );

    return (
        <div className="space-y-6">
            {/* <Header/> */}
            <h1 className="text-5xl font-bold text-slate-800">Kelola Pengguna</h1>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:max-w-md">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                        className="w-full md:w-auto px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="Semua">Semua Tipe</option>
                        <option value="pencari_kerja">Pencari Kerja</option>
                        <option value="perusahaan">Perusahaan</option>
                    </select>
                    <Link
                        to="/admin/users/new"
                        className="flex-shrink-0 bg-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    >
                        <UserPlus size={18} className="mr-2" /> Tambah Pengguna
                    </Link>
                </div>
            </div>

            {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" size={32} /></div>}
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center"><AlertCircle size={18} className="mr-2" /> {error}</div>}

            {!isLoading && !error && processedUsers.length > 0 ? (
                <>
                    <DataTable
                        columns={columns}
                        data={paginatedUsers}
                        renderRow={renderUserRow}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={processedUsers.length}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <FilterIcon size={48} className="mx-auto text-slate-300" />
                    <p className="mt-4 font-semibold text-slate-700">Tidak ada pengguna yang cocok dengan filter.</p>
                </div>
            )}
        </div>
    );
};

export default PenggunaPage;
