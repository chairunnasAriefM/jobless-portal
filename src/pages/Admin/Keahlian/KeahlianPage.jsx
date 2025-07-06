import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { KeahlianAPI } from '../../../services/Admin/KeahlianAPI';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, Search, Trash2, Edit, AlertCircle, Sparkles, Plus, X, Filter as FilterIcon } from 'lucide-react';

import DataTable from '../../../components/dashboard/Admin/DataTable';
import Pagination from '../../../components/dashboard/Admin/Pagination';

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 5;

//==================================================================
// Komponen Form untuk Tambah/Edit
//==================================================================
const SkillForm = ({ currentSkill, onSave, onCancelEdit, isLoading }) => {
    const [skillName, setSkillName] = useState('');
    const isEditMode = Boolean(currentSkill.keahlian_id);

    useEffect(() => {
        setSkillName(currentSkill.nama_keahlian || '');
    }, [currentSkill]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!skillName.trim()) return;
        onSave({ ...currentSkill, nama_keahlian: skillName });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full">
                <Sparkles size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder={isEditMode ? "Ubah nama keahlian..." : "Tambah keahlian baru..."}
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                {isEditMode && (
                    <button type="button" onClick={onCancelEdit} className="flex-shrink-0 bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-300 transition-colors flex items-center">
                        <X size={18} className="mr-2" /> Batal
                    </button>
                )}
                <button type="submit" disabled={isLoading} className="w-full md:w-auto flex-shrink-0 bg-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center">
                    {isLoading ? <Loader2 className="animate-spin" /> : (isEditMode ? <Edit size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />)}
                    {isEditMode ? 'Simpan' : 'Tambah'}
                </button>
            </div>
        </form>
    );
};


//==================================================================
// Komponen Utama Halaman
//==================================================================
const ManageKeahlianPage = () => {
    const [allSkills, setAllSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingSkill, setEditingSkill] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'nama_keahlian', direction: 'ascending' });

    const loadSkills = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await KeahlianAPI.fetchKeahlian();
            setAllSkills(data || []);
        } catch (err) {
            setError("Gagal memuat data keahlian.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSkills();
    }, [loadSkills]);

    const processedSkills = useMemo(() => {
        let processableSkills = [...allSkills]
            .filter(skill =>
                skill.nama_keahlian?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (sortConfig.key) {
            processableSkills.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return processableSkills;
    }, [allSkills, searchTerm, sortConfig]);

    const totalPages = Math.ceil(processedSkills.length / ITEMS_PER_PAGE);
    const paginatedSkills = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedSkills.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, processedSkills]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleSave = async (skillData) => {
        setIsProcessing(true);
        try {
            if (skillData.keahlian_id) {
                await KeahlianAPI.updateKeahlian(skillData.keahlian_id, { nama_keahlian: skillData.nama_keahlian });
                MySwal.fire('Sukses!', 'Keahlian berhasil diperbarui.', 'success');
            } else {
                await KeahlianAPI.createKeahlian({ nama_keahlian: skillData.nama_keahlian });
                MySwal.fire('Sukses!', 'Keahlian baru berhasil ditambahkan.', 'success');
            }
            setEditingSkill({});
            loadSkills();
        } catch (err) {
            MySwal.fire('Gagal!', `Terjadi kesalahan: ${err.message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (skillId) => {
        MySwal.fire({
            title: 'Anda yakin?', text: "Menghapus keahlian akan melepaskannya dari semua profil dan lowongan.",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await KeahlianAPI.deleteKeahlian(skillId);
                    MySwal.fire('Dihapus!', 'Keahlian telah dihapus.', 'success');
                    loadSkills();
                } catch (err) {
                    MySwal.fire('Gagal!', `Terjadi kesalahan: ${err.message}`, 'error');
                }
            }
        });
    };

    // Definisikan kolom untuk DataTable
    const columns = [
        { header: 'Nama Keahlian', key: 'nama_keahlian', sortable: true },
        { header: 'Aksi', key: 'aksi', sortable: false, className: 'text-center' },
    ];

    // Definisikan cara merender setiap baris untuk DataTable
    const renderSkillRow = (skill) => (
        <>
            <td className="px-6 py-4 font-medium text-slate-800">{skill.nama_keahlian}</td>
            <td className="px-6 py-4">
                <div className="gap-2">
                    <button onClick={() => setEditingSkill(skill)} title="Edit" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(skill.keahlian_id)} title="Hapus" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={16} /></button>
                </div>
            </td>
        </>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-5xl font-bold text-slate-800">Kelola Keahlian</h1>

            <SkillForm
                currentSkill={editingSkill}
                onSave={handleSave}
                onCancelEdit={() => setEditingSkill({})}
                isLoading={isProcessing}
            />

            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-400 w-full">
                <div className="relative w-full">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Cari keahlian..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>


            {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" /></div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg"><AlertCircle size={18} className="inline mr-2" />{error}</div>
            ) : processedSkills.length > 0 ? (
                <>
                    <DataTable
                        columns={columns}
                        data={paginatedSkills}
                        renderRow={renderSkillRow}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        totalItems={processedSkills.length}
                    />
                </>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <FilterIcon size={48} className="mx-auto text-slate-300" />
                    <p className="mt-4 font-semibold text-slate-700">Tidak ada keahlian yang cocok.</p>
                </div>
            )}
        </div>
    );
};

export default ManageKeahlianPage;
