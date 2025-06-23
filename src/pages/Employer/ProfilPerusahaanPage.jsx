// src/pages/dashboard/perusahaan/ProfilPerusahaanPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { perusahaanAPI } from '../../services/perusahaanAPI';
import useAuthStore from '../../store/authStore'; 

const MySwal = withReactContent(Swal);

const ProfilPerusahaanPage = () => {
    // Ganti ini dengan data user dari state management Anda
    const { user } = useAuthStore();

    const [company, setCompany] = useState(null);
    const [formData, setFormData] = useState({
        nama_perusahaan: '',
        deskripsi: '',
        alamat: '',
        situs_web: '',
        logo_perusahaan: ''
    });
    const [newLogoFile, setNewLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fungsi untuk memuat data perusahaan saat halaman dibuka
    const loadCompanyData = useCallback(async () => {
        if (!user?.perusahaan_id) {
            setIsLoading(false);
            return;
        }
        try {
            const data = await perusahaanAPI.getCompanyById(user.perusahaan_id);
            setCompany(data);
            setFormData(data);
            if (data.logo_perusahaan) {
                setLogoPreview(data.logo_perusahaan);
            }
        } catch (error) {
            console.error("Gagal memuat data perusahaan:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.perusahaan_id]);

    useEffect(() => {
        loadCompanyData();
    }, [loadCompanyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        let updatedData = { ...formData };

        try {
            // Langkah 1: Jika ada file logo baru, unggah dulu
            if (newLogoFile) {
                const filePath = `public/${user.perusahaan_id}-${Date.now()}-${newLogoFile.name}`;
                await perusahaanAPI.uploadCompanyLogo(newLogoFile, filePath);
                const publicUrl = perusahaanAPI.getCompanyLogoUrl(filePath);
                updatedData.logo_perusahaan = publicUrl;
            }

            // Langkah 2: Update data perusahaan di database
            const updatedCompany = await perusahaanAPI.updateCompany(user.perusahaan_id, updatedData);
            setCompany(updatedCompany);
            setFormData(updatedCompany);

            MySwal.fire({
                title: 'Berhasil!',
                text: 'Profil perusahaan berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#f97316',
            });
        } catch (error) {
            MySwal.fire({
                title: 'Gagal!',
                text: `Terjadi kesalahan: ${error.message}`,
                icon: 'error',
                confirmButtonColor: '#f97316',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" size={32} /></div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Profil Perusahaan</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">

                {/* Bagian Logo */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Logo Perusahaan</label>
                    <div className="flex items-center gap-6">
                        <img
                            src={logoPreview || 'https://via.placeholder.com/150'}
                            alt="Logo preview"
                            className="h-24 w-24 rounded-full object-cover border-4 border-slate-100"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg inline-flex items-center transition-colors">
                            <UploadCloud size={18} className="mr-2" /> Ganti Logo
                        </label>
                        <input id="logo-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleLogoChange} />
                    </div>
                </div>

                {/* Informasi Umum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nama_perusahaan" className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
                        <input type="text" name="nama_perusahaan" id="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-orange-500" />
                    </div>
                    <div>
                        <label htmlFor="situs_web" className="block text-sm font-medium text-slate-700 mb-1">Situs Web</label>
                        <input type="url" name="situs_web" id="situs_web" value={formData.situs_web} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-orange-500" placeholder="https://..." />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Perusahaan</label>
                    <textarea name="deskripsi" id="deskripsi" rows="5" value={formData.deskripsi} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-orange-500" placeholder="Jelaskan tentang perusahaan Anda..."></textarea>
                </div>

                {/* Alamat */}
                <div>
                    <label htmlFor="alamat" className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                    <textarea name="alamat" id="alamat" rows="3" value={formData.alamat} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-orange-500" placeholder="Alamat lengkap perusahaan..."></textarea>
                </div>

                {/* Tombol Aksi */}
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button type="submit" disabled={isSaving} className="flex justify-center items-center bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-md disabled:bg-orange-300">
                        {isSaving ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} className="mr-2" /> Simpan Perubahan</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilPerusahaanPage;