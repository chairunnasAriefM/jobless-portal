import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PenggunaAPI } from '../../services/Admin/PenggunaAPI';
import GenericTable from '../../components/dashboard/Admin/GenericTable';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, Search, Trash2, Edit, AlertCircle, UserPlus, Filter as FilterIcon } from 'lucide-react';
import { formatDatePosted } from '../../utils/formatters';

const MySwal = withReactContent(Swal);

const Pengguna = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Semua');

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

    const filteredUsers = useMemo(() => {
        return allUsers
            .filter(user => {
                if (filterType === 'Semua') return user.tipe_user_id !== 3; // Selalu kecualikan admin
                if (user.tipe_user_id === 3) return false;
                return user.nama_tipe === filterType;
            })
            .filter(user =>
                user.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [allUsers, searchTerm, filterType]);

    const handleDelete = async (userId) => {
        MySwal.fire({
            title: 'Anda yakin?',
            text: "Pengguna yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
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

    const columns = ['Nama Pengguna', 'Email', 'Tipe', 'Bergabung Pada', 'Aksi'];

    const renderUserRow = (user) => {
        const getTypeBadge = (tipe) => {
            switch (tipe) {
                case 'perusahaan': return 'bg-orange-100 text-orange-800';
                case 'pencari_kerja': return 'bg-blue-100 text-blue-800';
                default: return 'bg-slate-100 text-slate-600';
            }
        };
        return (
            <>
                <td className="px-6 py-4 font-semibold text-slate-800">{user.nama_lengkap}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getTypeBadge(user.nama_tipe)}`}>
                        {user.nama_tipe?.replace('_', ' ') || 'N/A'}
                    </span>
                </td>
                <td className="px-6 py-4 text-center text-slate-600">{formatDatePosted(user.created_at)}</td>
                <td className="px-6 py-4 text-right flex justify-end items-center gap-2">
                    <button title="Edit Pengguna" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Edit size={16} /></button>
                    <button title="Hapus Pengguna" onClick={() => handleDelete(user.user_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={16} /></button>
                </td>
            </>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Kelola Pengguna</h1>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:max-w-md">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full md:w-auto px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="Semua">Semua Tipe</option>
                        <option value="pencari_kerja">Pencari Kerja</option>
                        <option value="perusahaan">Perusahaan</option>
                    </select>
                    <button className="flex-shrink-0 bg-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                        <UserPlus size={18} className="mr-2" /> Tambah Pengguna
                    </button>
                </div>
            </div>

            {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" size={32} /></div>}
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center"><AlertCircle size={18} className="mr-2" /> {error}</div>}

            {!isLoading && !error && filteredUsers.length > 0 && (
                <GenericTable
                    columns={columns}
                    data={filteredUsers}
                    renderRow={renderUserRow}
                />
            )}
            {!isLoading && !error && filteredUsers.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <FilterIcon size={48} className="mx-auto text-slate-300" />
                    <p className="mt-4 font-semibold text-slate-700">Tidak ada pengguna yang cocok.</p>
                </div>
            )}
        </div>
    );
};

export default Pengguna;
