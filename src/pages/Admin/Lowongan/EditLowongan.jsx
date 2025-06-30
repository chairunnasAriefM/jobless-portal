import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LowonganKerjaAPI } from '../../../services/Admin/LowonganKerjaAPI';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import RichTextEditor from '../../../components/forms/RichTextEditor';

const MySwal = withReactContent(Swal);

const EditLowongan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: '',
        lokasi: '',
        status_aktif: true,
        deskripsi: '',
        kualifikasi: '',
    });
    const [companyName, setCompanyName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const jobData = await LowonganKerjaAPI.getLowonganKerjaById(id);
                setFormData({
                    judul: jobData.judul,
                    lokasi: jobData.lokasi,
                    status_aktif: jobData.status_aktif,
                    deskripsi: jobData.deskripsi,
                    kualifikasi: jobData.kualifikasi,
                });
                setCompanyName(jobData.perusahaan?.nama_perusahaan || 'N/A');
            } catch (err) {
                setError('Gagal memuat data lowongan.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEditorChange = (content, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await LowonganKerjaAPI.updateLowonganKerja(id, formData);
            await MySwal.fire({
                title: 'Sukses!', text: 'Data lowongan berhasil diperbarui.',
                icon: 'success', timer: 2000, showConfirmButton: false,
            });
            navigate('/admin/lowongan');
        } catch (err) {
            setError(err.message || "Gagal memperbarui data.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to="/admin/lowongan"
                    className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                >
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Edit Lowongan</h1>
                    <p className="text-slate-500">Perusahaan: {companyName}</p>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg border-slate-200 max-w-screen mx-auto space-y-6"
            >
                {/* Judul & Lokasi */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="judul"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Judul Lowongan*
                        </label>
                        <input
                            type="text"
                            id="judul"
                            name="judul"
                            value={formData.judul}
                            onChange={handleChange}
                            required
                            className="input-style"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="lokasi"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Lokasi*
                        </label>
                        <input
                            type="text"
                            id="lokasi"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            required
                            className="input-style"
                        />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                    <RichTextEditor
                        content={formData.deskripsi}
                        onChange={(content) => handleEditorChange(content, 'deskripsi')}
                    />
                </div>

                {/* Kualifikasi */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kualifikasi</label>
                    <RichTextEditor
                        content={formData.kualifikasi}
                        onChange={(content) => handleEditorChange(content, 'kualifikasi')}
                    />
                </div>

                {/* Status Aktif */}
                <div className="flex items-center">
                    <input
                        id="status_aktif"
                        type="checkbox"
                        name="status_aktif"
                        checked={formData.status_aktif}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label
                        htmlFor="status_aktif"
                        className="ml-3 block text-sm text-slate-900"
                    >
                        Lowongan Aktif
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
                        {error}
                    </p>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center justify-center py-3 px-6 text-sm font-semibold text-white bg-orange-500 rounded-lg disabled:opacity-60"
                    >
                        {isSaving ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default EditLowongan;
