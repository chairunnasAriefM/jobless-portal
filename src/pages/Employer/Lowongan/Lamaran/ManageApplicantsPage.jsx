import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LamaranAPI } from '../../../../services/LamaranAPI'; 
import { Loader2, AlertCircle, ArrowLeft, User, Download, ChevronDown, FileSearch } from 'lucide-react';
import { formatDatePosted } from '../../../../utils/formatters';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Komponen Dropdown untuk mengubah status
const StatusChanger = ({ currentStatusId, lamaranId, statusOptions, onStatusChange }) => {
    const [isSaving, setIsSaving] = useState(false);

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1: return 'bg-yellow-100 text-yellow-800'; // Menunggu
            case 2: return 'bg-green-100 text-green-800'; // Diterima
            case 3: return 'bg-red-100 text-red-800'; // Ditolak
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const handleChange = async (e) => {
        const newStatusId = e.target.value;
        setIsSaving(true);
        try {
            await LamaranAPI.updateApplicationStatus(lamaranId, newStatusId);
            onStatusChange(lamaranId, parseInt(newStatusId)); // Update state di parent
            MySwal.fire({ icon: 'success', title: 'Status Diperbarui!', showConfirmButton: false, timer: 1500 });
        } catch (error) {
            MySwal.fire('Gagal!', 'Tidak dapat mengubah status.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative">
            <select
                value={currentStatusId}
                onChange={handleChange}
                disabled={isSaving}
                className={`w-full appearance-none text-xs font-semibold rounded-full px-3 py-1.5 transition-colors ${getStatusColor(currentStatusId)}`}
            >
                {statusOptions.map(opt => (
                    <option key={opt.status_lamaran_id} value={opt.status_lamaran_id}>
                        {opt.nama_status}
                    </option>
                ))}
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
    );
};

// Komponen Utama Halaman
const ManageApplicantsPage = () => {
    const { lowonganId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [lowonganTitle, setLowonganTitle] = useState('');
    const [statusOptions, setStatusOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [applicantsData, statusesData] = await Promise.all([
                LamaranAPI.getApplicantsByJob(lowonganId),
                LamaranAPI.getStatusOptions()
            ]);

            setApplicants(applicantsData || []);
            setStatusOptions(statusesData || []);
            if (applicantsData && applicantsData.length > 0) {
                setLowonganTitle(applicantsData[0].lowongan_kerja.judul);
            }
        } catch (err) {
            setError("Gagal memuat data pelamar.");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [lowonganId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = (lamaranId, newStatusId) => {
        setApplicants(prev => prev.map(app =>
            app.lamaran_id === lamaranId
                ? { ...app, status_lamaran_id: newStatusId, status_lamaran: { ...app.status_lamaran, status_lamaran_id: newStatusId, nama_status: statusOptions.find(s => s.status_lamaran_id === newStatusId)?.nama_status } }
                : app
        ));
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
    if (error) return <div className="p-8 text-center text-red-500"><AlertCircle className="mx-auto mb-2" />{error}</div>;

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

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                        <tr>
                            <th className="p-4 text-left">Nama Pelamar</th>
                            <th className="p-4 text-left">Tanggal Melamar</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {applicants.length > 0 ? applicants.map(app => (
                            <tr key={app.lamaran_id} className="hover:bg-slate-50">
                                <td className="p-4 font-semibold text-slate-800">{app.nama_lengkap}</td>
                                <td className="p-4 text-slate-500">{formatDatePosted(app.tanggal_lamaran)}</td>
                                <td className="p-4 w-48">
                                    <StatusChanger
                                        currentStatusId={app.status_lamaran_id}
                                        lamaranId={app.lamaran_id}
                                        statusOptions={statusOptions}
                                        onStatusChange={handleStatusChange}
                                    />
                                </td>
                                <td className="p-4 text-right">
                                    <Link to={`/dashboard/perusahaan/lamaran-detail/${app.lamaran_id}`} className="font-semibold text-orange-600 hover:underline">
                                        Lihat Detail
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center p-16 text-slate-500">
                                    <FileSearch size={48} className="mx-auto text-slate-300 mb-2" />
                                    Belum ada pelamar untuk lowongan ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageApplicantsPage;
