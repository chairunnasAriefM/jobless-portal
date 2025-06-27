// src/pages/jobseeker/EditJobSeekerProfilePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { supabase } from '../../../lib/supabaseClient'; // Sesuaikan path jika perlu
import useAuthStore from '../../../store/authStore'; // Sesuaikan path jika perlu
import { jobSeekerAPI } from '../../../services/jobSeekerAPI'; // Pastikan service API ini ada
import RichTextEditor from '../../../components/forms/RichTextEditor'; // Pastikan komponen ini ada
import { User, Linkedin, Sparkles, Save, Loader2, AlertCircle, ArrowLeft, UploadCloud, FileText, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Komponen untuk setiap bagian form agar lebih rapi
const FormSection = ({ title, icon, children }) => (
    <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex items-center border-b border-slate-200 pb-3 mb-6">
            {React.cloneElement(icon, { className: "mr-3 text-orange-500" })}
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </section>
);

// Komponen untuk input field yang bisa digunakan kembali
const InputField = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} name={id} {...props} className="input-style" />
    </div>
);

// --- Halaman Utama ---
const EditJobSeekerProfilePage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        nama_lengkap: '',
        email: '',
        headline: '',
        nomor_telepon: '',
        ringkasan: '',
        linkedin_url: '',
        file_cv: ''
    });

    // State untuk Keahlian
    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // State baru untuk file CV
    const [cvFile, setCvFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const loadProfileData = useCallback(async () => {
        if (!user?.user_id) return;
        try {
            const [profileResponse, skillsResponse] = await Promise.all([
                jobSeekerAPI.getProfile(user.user_id),
                jobSeekerAPI.getAllKeahlian()
            ]);

            if (profileResponse.error) throw profileResponse.error;
            if (skillsResponse.error) throw skillsResponse.error;

            setProfileData(profileResponse.profil || {});
            setSelectedSkills(profileResponse.keahlian?.map(s => ({ value: s.keahlian_id, label: s.nama_keahlian })) || []);
            setAllSkills(skillsResponse.map(s => ({ value: s.keahlian_id, label: s.nama_keahlian })) || []);

        } catch (err) {
            setError('Gagal memuat data profil.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions || []);
    };

    const handleEditorChange = (content, fieldName) => {
        setProfileData(prev => ({ ...prev, [fieldName]: content }));
    };

    const handleCvFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Batas 2MB
                MySwal.fire('Ukuran File Terlalu Besar', 'Ukuran CV tidak boleh melebihi 2MB.', 'error');
                return;
            }
            if (!['application/pdf'].includes(file.type)) { // Hanya izinkan PDF
                MySwal.fire('Format Tidak Sesuai', 'Harap unggah CV dalam format PDF.', 'error');
                return;
            }
            setCvFile(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        if (!user?.user_id) {
            setError("Sesi pengguna tidak valid. Silakan login kembali.");
            setIsSaving(false);
            return;
        }

        try {
            // Langkah 1: Unggah CV jika ada file baru yang dipilih
            if (cvFile) {
                setIsUploading(true);
                await jobSeekerAPI.uploadCV(user.user_id, cvFile);
                setIsUploading(false);
            }

            // Memanggil RPC secara langsung dengan semua parameter yang diharapkan
            const { error: profileError } = await supabase.rpc('update_jobseeker_profile', {
                p_user_id: user.user_id,
                p_nama_lengkap: profileData.nama_lengkap || null,
                p_nomor_telepon: profileData.nomor_telepon || null,
                p_headline: profileData.headline || null,
                p_ringkasan: profileData.ringkasan || null,
                p_linkedin_url: profileData.linkedin_url || null
            });

            if (profileError) throw profileError;

            // Langkah 3: Simpan keahlian
            await jobSeekerAPI.saveSkills(user.user_id, selectedSkills.map(s => s.value));

            // Jika semua langkah berhasil, tampilkan notifikasi sukses
            await MySwal.fire({
                title: 'Sukses!',
                text: 'Profil Anda berhasil diperbarui.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/dashboard/pencari-kerja/profil');

        } catch (err) {
            // Jika ada satu saja langkah yang gagal, proses akan berhenti di sini
            console.error("Kesalahan saat menyimpan:", err);
            setError(err.message);
            MySwal.fire('Gagal!', `Terjadi kesalahan saat menyimpan profil: ${err.message}`, 'error');
        } finally {
            setIsSaving(false);
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-500 mx-auto" size={32} /></div>;
    }

    return (
        <div className="bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="container mx-auto max-w-4xl space-y-8">
                <div className="flex items-center">
                    <Link to="/dashboard/pencari-kerja/profil" className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-800 ml-4">Edit Profil</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Informasi Pribadi */}
                    <FormSection title="Informasi Pribadi" icon={<User />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField id="nama_lengkap" label="Nama Lengkap*" type="text" value={profileData.nama_lengkap || ''} onChange={handleChange} required />
                            <InputField id="headline" label="Headline Profesional" type="text" value={profileData.headline || ''} onChange={handleChange} placeholder="Contoh: Junior Web Developer" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" id="email" value={profileData.email || ''} disabled className="input-style bg-slate-100 cursor-not-allowed" />
                            </div>
                            <InputField id="nomor_telepon" label="Nomor Telepon" type="tel" value={profileData.nomor_telepon || ''} onChange={handleChange} placeholder="0812..." />
                        </div>
                    </FormSection>

                    {/* Tentang Saya */}
                    <FormSection title="Tentang Saya" icon={<User />}>
                        <label htmlFor="ringkasan" className="sr-only">Tentang Saya</label>
                        <RichTextEditor
                            content={profileData.ringkasan || ''}
                            onChange={(content) => handleEditorChange(content, 'ringkasan')}
                        />
                    </FormSection>

                    {/* Keahlian */}
                    <FormSection title="Keahlian" icon={<Sparkles />}>
                        <p className="text-sm text-slate-500 -mt-2 mb-2">Pilih keahlian yang paling Anda kuasai. Ini akan membantu perusahaan menemukan Anda.</p>
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
                    </FormSection>

                    {/* tautan dan CV */}
                    <FormSection title="Tautan & Resume" icon={<Linkedin />}>
                        <InputField id="linkedin_url" label="URL Profil LinkedIn" type="url" value={profileData.linkedin_url || ''} onChange={handleChange} placeholder="https://www.linkedin.com/in/..." />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CV/Resume (PDF, maks. 2MB)</label>
                            <div className="mt-2 flex items-center flex-wrap gap-4">
                                <label htmlFor="cv-upload" className="cursor-pointer bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg inline-flex items-center hover:bg-slate-50 transition-colors">
                                    <UploadCloud size={18} className="mr-2" />
                                    {cvFile ? "Ganti File" : "Pilih File"}
                                </label>
                                <input id="cv-upload" name="cvFile" type="file" className="hidden" accept="application/pdf" onChange={handleCvFileChange} />

                                {isUploading && <Loader2 className="animate-spin text-orange-500" />}

                                {/* ====== IMPLEMENTASI TOMBOL LIHAT CV ====== */}
                                {!cvFile && profileData.file_cv && (
                                    <a
                                        href={profileData.file_cv}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        <ExternalLink size={16} className="mr-2" />
                                        Lihat CV Saat Ini
                                    </a>
                                )}

                                {cvFile && (
                                    <span className="text-sm text-slate-600 flex items-center">
                                        <FileText size={16} className="mr-2 text-red-500" />
                                        {cvFile.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center">
                            <AlertCircle size={16} className="mr-2" /> {error}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSaving} className="flex justify-center items-center bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:bg-orange-300">
                            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Simpan Perubahan</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditJobSeekerProfilePage;
