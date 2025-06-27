// src/pages/dashboard/employer/JobFormPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Select from 'react-select';
import { lowonganAPI } from '../../services/lowonganAPI';
import useAuthStore from '../../store/authStore';
import RichTextEditor from '../../components/forms/RichTextEditor';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

const MySwal = withReactContent(Swal);

// Data untuk Tipe Pekerjaan sekarang didefinisikan secara manual di sini
const JOB_TYPES = [
    { tipe_pekerjaan_id: 1, nama_tipe: 'Penuh Waktu' },
    { tipe_pekerjaan_id: 2, nama_tipe: 'Paruh Waktu' },
    { tipe_pekerjaan_id: 3, nama_tipe: 'Kontrak' },
    { tipe_pekerjaan_id: 4, nama_tipe: 'Magang' },
    { tipe_pekerjaan_id: 5, nama_tipe: 'Lepas' },
];

const JobFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        judul: '',
        lokasi: '',
        tipe_pekerjaan_id: '',
        gaji_min: '',
        gaji_max: '',
        deskripsi: '',
        kualifikasi: '',
        status_aktif: true,
    });

    // State untuk Keahlian (diambil dari API)
    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // State untuk UI
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Mengambil data awal (sekarang hanya Keahlian dan data lowongan jika edit)
    const loadInitialData = useCallback(async () => {
        if (!user) return;
        try {
            const [skills, jobData] = await Promise.all([
                lowonganAPI.getAllKeahlian(),
                isEditMode ? lowonganAPI.fetchLowonganById(id) : null
            ]);

            setAllSkills(skills.map(s => ({ value: s.keahlian_id, label: s.nama_keahlian })) || []);

            if (isEditMode && jobData) {
                if (jobData.perusahaan_id !== user.perusahaan_id) {
                    navigate('/dashboard/perusahaan/lowongan');
                    return;
                }
                setFormData(jobData);
                setSelectedSkills(jobData.keahlian.map(s => ({ value: s.keahlian_id, label: s.nama_keahlian })) || []);
            }
        } catch (err) {
            setError("Gagal memuat data awal. Pastikan RLS SELECT sudah diatur dengan benar.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [id, isEditMode, user, navigate]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleEditorChange = (content, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: content }));
    };

    const handleSkillsChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions || []);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        const perusahaanId = user?.perusahaan_id;
        if (!perusahaanId) {
            setError("Tidak bisa mengidentifikasi perusahaan Anda. Silakan login ulang.");
            setIsSaving(false);
            return;
        }

        const payload = {
            lowongan_id: isEditMode ? id : undefined, // Sertakan ID hanya jika mode edit
            judul: formData.judul,
            lokasi: formData.lokasi,
            tipe_pekerjaan_id: Number(formData.tipe_pekerjaan_id),
            gaji_min: formData.gaji_min ? Number(formData.gaji_min) : null,
            gaji_max: formData.gaji_max ? Number(formData.gaji_max) : null,
            deskripsi: formData.deskripsi,
            kualifikasi: formData.kualifikasi,
            status_aktif: formData.status_aktif,
            perusahaan_id: perusahaanId,
        };

        const skillIds = selectedSkills.map(s => s.value);

        try {
            await lowonganAPI.saveLowongan(payload, skillIds);
            await MySwal.fire({
                title: 'Sukses!',
                text: `Lowongan pekerjaan berhasil ${isEditMode ? 'diperbarui' : 'diposting'}.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            navigate('/dashboard/perusahaan/lowongan');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" size={32} /></div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
            <div className="flex items-center mb-6">
                <Link to="/dashboard/perusahaan/lowongan" className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-slate-800 ml-4">
                    {isEditMode ? 'Edit Lowongan Pekerjaan' : 'Buat Lowongan Baru'}
                </h1>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">

                {/* --- Bagian Informasi Utama --- */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Informasi Utama</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="judul" className="block text-sm font-medium text-slate-700 mb-1">Judul Posisi*</label>
                            <input type="text" id="judul" name="judul" value={formData.judul} onChange={handleChange} required className="input-style" placeholder="Contoh: Digital Marketing Specialist" />
                        </div>
                        <div>
                            <label htmlFor="lokasi" className="block text-sm font-medium text-slate-700 mb-1">Lokasi*</label>
                            <input type="text" id="lokasi" name="lokasi" value={formData.lokasi} onChange={handleChange} required className="input-style" placeholder="Contoh: Jakarta Selatan, atau Remote" />
                        </div>
                    </div>
                </section>

                {/* --- Bagian Detail Pekerjaan --- */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Detail Pekerjaan</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="tipe_pekerjaan_id" className="block text-sm font-medium text-slate-700 mb-1">Tipe Pekerjaan*</label>
                            <select id="tipe_pekerjaan_id" name="tipe_pekerjaan_id" value={formData.tipe_pekerjaan_id} onChange={handleChange} required className="input-style bg-white">
                                <option value="">Pilih Tipe...</option>
                                {JOB_TYPES.map(type => (
                                    <option key={type.tipe_pekerjaan_id} value={type.tipe_pekerjaan_id}>{type.nama_tipe}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="gaji_min" className="block text-sm font-medium text-slate-700 mb-1">Gaji Minimum (Opsional)</label>
                            <input type="number" id="gaji_min" name="gaji_min" value={formData.gaji_min} onChange={handleChange} className="input-style" placeholder="Contoh: 5000000" />
                        </div>
                        <div>
                            <label htmlFor="gaji_max" className="block text-sm font-medium text-slate-700 mb-1">Gaji Maksimum (Opsional)</label>
                            <input type="number" id="gaji_max" name="gaji_max" value={formData.gaji_max} onChange={handleChange} className="input-style" placeholder="Contoh: 8000000" />
                        </div>
                    </div>
                </section>

                {/* --- Bagian Keahlian --- */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Keahlian yang Dibutuhkan</h2>
                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">Pilih Keahlian</label>
                        <Select
                            id="skills"
                            isMulti
                            name="skills"
                            options={allSkills}
                            value={selectedSkills}
                            onChange={handleSkillsChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Pilih atau ketik untuk mencari keahlian..."
                            noOptionsMessage={() => "Tidak ada opsi"}
                        />
                    </div>
                </section>

                {/* --- Bagian Deskripsi & Kualifikasi --- */}
                <section>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xl font-semibold text-slate-700 mb-3">Deskripsi Pekerjaan</label>
                            <RichTextEditor content={formData.deskripsi} onChange={(content) => handleEditorChange(content, 'deskripsi')} />
                        </div>
                        <div>
                            <label className="block text-xl font-semibold text-slate-700 mb-3">Kualifikasi</label>
                            <RichTextEditor content={formData.kualifikasi} onChange={(content) => handleEditorChange(content, 'kualifikasi')} />
                        </div>
                    </div>
                </section>

                {/* --- Pengaturan Publikasi --- */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                    <h2 className="text-xl font-semibold text-slate-700">Pengaturan Publikasi</h2>
                    <div className="flex items-center">
                        <input id="status_aktif" type="checkbox" name="status_aktif" checked={formData.status_aktif} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                        <label htmlFor="status_aktif" className="ml-3 block text-sm text-slate-900">Aktifkan lowongan ini (akan langsung tampil untuk pelamar)</label>
                    </div>
                </div>

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                <div className="flex justify-end">
                    <button type="submit" disabled={isSaving} className="flex justify-center items-center bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:bg-orange-300 disabled:scale-100">
                        {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> {isEditMode ? 'Simpan Perubahan' : 'Posting Lowongan'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobFormPage;