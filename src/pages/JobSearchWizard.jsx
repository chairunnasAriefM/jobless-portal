// src/pages/JobSearchWizard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Briefcase, MapPin, DollarSign, CloudUpload, Type,
    CheckSquare, Award, Users, Building, Sparkles, Filter, Search, XCircle,
    BookOpen, TrendingUp, ShieldCheck, Coffee, UploadCloud, Edit3, Trash2, PlusCircle 
} from 'lucide-react';

// Impor komponen yang sudah dipisah
import SelectablePill from '../components/searchWizard/SelectablePill';
import SidebarInfo from '../components/searchWizard/SidebarInfo';
import StepIndicator from '../components/searchWizard/StepIndicator';
import StepNavigation from '../components/searchWizard/StepNavigation';


// Data untuk pilihan (tetap sama atau Anda bisa pindahkan ke file data/konstanta)
const workTypes = [
    { id: 'remote_full', icon: <Users />, title: '100% Remote', description: 'Kerja dari rumah atau lokasi pilihan Anda, tanpa perlu ke kantor.' },
    { id: 'hybrid', icon: <Building />, title: 'Hybrid Remote', description: 'Kombinasi kerja di kantor dan dari rumah.' },
    { id: 'office', icon: <Briefcase />, title: 'Kerja di Kantor (Lokal)', description: 'Bekerja penuh di lokasi kantor perusahaan.' },
];
const jobCategories = [
    "Teknologi Informasi", "Pemasaran & Komunikasi", "Desain & Kreatif", "Penjualan & BD",
    "Administrasi & Operasional", "Keuangan & Akuntansi", "SDM (HR)", "Pendidikan",
    "Kesehatan", "Manufaktur & Produksi", "Layanan Pelanggan", "Logistik & Supply Chain", "Lainnya"
];
const experienceLevels = [
    "Lulusan Baru / < 1 Tahun", "1 - 3 Tahun", "3 - 5 Tahun", "5 - 10 Tahun", "10+ Tahun"
];
const educationLevels = [
    "SMA/SMK Sederajat", "Diploma (D1-D3)", "Sarjana (S1)", "Magister (S2)", "Doktor (S3)", "Spesialis/Lainnya"
];
const desiredBenefitOptions = [
    "Asuransi Kesehatan", "BPJS Kesehatan & Ketenagakerjaan", "Tunjangan Transportasi",
    "Tunjangan Makan", "Cuti Tahunan Lebih Banyak", "Bonus & Insentif", "Program Pengembangan Diri",
    "Jam Kerja Fleksibel", "Opsi Remote (Tambahan)", "Laptop/Perangkat Kerja"
];


const JobSearchWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [searchPreferences, setSearchPreferences] = useState({
        workType: '',
        desiredSalary: { amount: '', type: 'per_month' },
        location: '',
        includeAnywhereID: false,
        includeAnywhereGlobal: false,
        resumeFile: null,
        resumeFileName: '',
        jobTitles: [],
        currentJobTitleInput: '',
        jobCategories: [],
        experienceYears: '',
        educationLevel: '',
        desiredBenefits: [],
    });

    const totalSteps = 9; // Pastikan ini sesuai dengan jumlah case di renderStepContent

    // ... (Fungsi nextStep, prevStep, handlePreferenceChange, handleSalaryChange, dll. TETAP SAMA seperti sebelumnya) ...
    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmitPreferences();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePreferenceChange = (field, value) => {
        setSearchPreferences(prev => ({ ...prev, [field]: value }));
    };

    const handleSalaryChange = (subField, value) => {
        setSearchPreferences(prev => ({
            ...prev,
            desiredSalary: { ...prev.desiredSalary, [subField]: value }
        }));
    };

    const handleCurrentJobTitleChange = (e) => {
        setSearchPreferences(prev => ({ ...prev, currentJobTitleInput: e.target.value }));
    };

    const addJobTitle = () => {
        if (searchPreferences.currentJobTitleInput.trim() !== '' && searchPreferences.jobTitles.length < 5) {
            setSearchPreferences(prev => ({
                ...prev,
                jobTitles: [...prev.jobTitles, prev.currentJobTitleInput.trim()],
                currentJobTitleInput: ''
            }));
        }
    };

    const removeJobTitle = (indexToRemove) => {
        setSearchPreferences(prev => ({
            ...prev,
            jobTitles: prev.jobTitles.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleToggleSelection = (field, value, maxSelection = 5) => {
        setSearchPreferences(prev => {
            const currentSelection = prev[field] || [];
            const isSelected = currentSelection.includes(value);
            let newSelection;
            if (isSelected) {
                newSelection = currentSelection.filter(item => item !== value);
            } else {
                if (currentSelection.length < maxSelection) {
                    newSelection = [...currentSelection, value];
                } else {
                    newSelection = currentSelection;
                }
            }
            return { ...prev, [field]: newSelection };
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validasi ukuran file (Contoh: maks 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file maksimal adalah 2MB.");
                return;
            }
            // Validasi tipe file
            const allowedTypes = ['.doc', '.docx', '.pdf', '.rtf', '.txt'];
            const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (!allowedTypes.includes(fileType)) {
                alert("Format file tidak didukung. Gunakan: DOC, DOCX, PDF, RTF, TXT.");
                return;
            }
            setSearchPreferences(prev => ({
                ...prev,
                resumeFile: file,
                resumeFileName: file.name
            }));
        }
    };

    const removeResumeFile = () => {
        setSearchPreferences(prev => ({
            ...prev,
            resumeFile: null,
            resumeFileName: ''
        }));
        if (document.getElementById('resumeUpload')) {
            document.getElementById('resumeUpload').value = "";
        }
    };

    const handleSubmitPreferences = () => {
        console.log("Preferensi Pencarian Pengguna:", searchPreferences);
        alert("Preferensi disimpan! (Simulasi) Anda akan diarahkan ke halaman hasil pencarian.");
        const queryParams = new URLSearchParams();
        Object.entries(searchPreferences).forEach(([key, value]) => {
            if (typeof value === 'object' && !Array.isArray(value) && value !== null && key === 'desiredSalary') {
                if (value.amount) queryParams.append('salaryAmount', value.amount);
                if (value.type) queryParams.append('salaryType', value.type);
            } else if (Array.isArray(value)) {
                value.forEach(item => queryParams.append(key, item));
            } else if (value !== '' && value !== null && value !== false && key !== 'resumeFile' && key !== 'currentJobTitleInput') { // Jangan kirim file atau input sementara
                queryParams.append(key, value.toString());
            }
        });
        // Hapus resumeFileName jika tidak ada resumeFile (meskipun sebaiknya tidak dikirim jika file null)
        if (!searchPreferences.resumeFile) {
            queryParams.delete('resumeFileName');
        }
        navigate(`/lowongan/hasil?${queryParams.toString()}`);
    };


    // Fungsi untuk merender konten langkah saat ini (TETAP SAMA, tapi sekarang bisa lebih fokus karena UI lain dipisah)
    const renderStepContent = () => {
        // Pastikan ikon diteruskan dengan benar ke komponen workTypes
        const updatedWorkTypes = workTypes.map(wt => ({
            ...wt,
            icon: React.cloneElement(wt.icon, { size: 36, className: "mb-3 text-orange-500" })
        }));

        switch (currentStep) {
            case 1: // Jenis Pekerjaan
                return (
                    <div className="md:flex gap-8">
                        <div className="md:flex-grow">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Jenis pekerjaan apa yang Anda cari?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {updatedWorkTypes.map(wt => (
                                    <button key={wt.id} onClick={() => { handlePreferenceChange('workType', wt.id); nextStep(); }}
                                        className={`p-6 lg:p-8 border-2 rounded-xl text-center hover:shadow-xl hover:border-orange-500 transition-all duration-200 h-full flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                                ${searchPreferences.workType === wt.id ? 'border-orange-500 bg-orange-50 shadow-xl ring-2 ring-orange-500' : 'border-slate-300 bg-white'}`}>
                                        {wt.icon}
                                        <h3 className="font-semibold text-slate-700 mb-1 text-lg lg:text-xl">{wt.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{wt.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Ekspektasi Gaji
                return (
                    <div className="md:flex gap-x-8 lg:gap-x-12 items-start">
                        <div className="md:flex-grow mb-8 md:mb-0">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Berapa ekspektasi gaji Anda?</h2>
                            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                                <div className="mb-5">
                                    <label htmlFor="salaryAmount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah Gaji (Rp)</label>
                                    <input type="number" id="salaryAmount" name="salaryAmount"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                                        placeholder="Contoh: 5000000" value={searchPreferences.desiredSalary.amount} onChange={(e) => handleSalaryChange('amount', e.target.value)} />
                                </div>
                                <div className="mb-8">
                                    <label htmlFor="salaryType" className="block text-sm font-medium text-slate-700 mb-1">Periode Gaji</label>
                                    <select id="salaryType" name="salaryType"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base appearance-none" // tambahkan appearance-none
                                        value={searchPreferences.desiredSalary.type} onChange={(e) => handleSalaryChange('type', e.target.value)}>
                                        <option value="per_month">Per Bulan</option> <option value="per_year">Per Tahun</option> <option value="per_hour">Per Jam</option>
                                    </select>
                                </div>
                                <button onClick={() => { handleSalaryChange('amount', ''); handleSalaryChange('type', 'per_month'); nextStep(); }}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium text-center w-full py-2">
                                    Lewati, saya belum yakin untuk saat ini
                                </button>
                            </div>
                        </div>
                        <SidebarInfo title="Mari bicara gaji...">
                            <p>Memberikan ekspektasi gaji membantu kami menyaring lowongan yang paling relevan untuk Anda.</p>
                            <p>Anda selalu bisa melewati langkah ini jika belum yakin, dan mengaturnya nanti di profil Anda.</p>
                        </SidebarInfo>
                    </div>
                );
            case 3: // Lokasi Kerja
                return (
                    <div className="md:flex gap-x-8 lg:gap-x-12 items-start">
                        <div className="md:flex-grow mb-8 md:mb-0">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Di mana Anda ingin bekerja?</h2>
                            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                                <div className="relative mb-4">
                                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Cari berdasarkan lokasi (Kota/Provinsi)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                        <input type="text" id="location" name="location"
                                            className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                                            placeholder="Cth: Pekanbaru, Riau atau Jakarta" value={searchPreferences.location} onChange={(e) => handlePreferenceChange('location', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-3 mt-6">
                                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-orange-50 transition-colors">
                                        <input type="checkbox" name="includeAnywhereID" checked={searchPreferences.includeAnywhereID} onChange={(e) => handlePreferenceChange('includeAnywhereID', e.target.checked)}
                                            className="h-5 w-5 text-orange-600 border-slate-300 rounded focus:ring-orange-500 focus:ring-offset-0" />
                                        <span className="text-sm text-slate-700">Termasuk lowongan yang bisa dikerjakan dari mana saja di Indonesia.</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-orange-50 transition-colors">
                                        <input type="checkbox" name="includeAnywhereGlobal" checked={searchPreferences.includeAnywhereGlobal} onChange={(e) => handlePreferenceChange('includeAnywhereGlobal', e.target.checked)}
                                            className="h-5 w-5 text-orange-600 border-slate-300 rounded focus:ring-orange-500 focus:ring-offset-0" />
                                        <span className="text-sm text-slate-700">Termasuk lowongan remote internasional (jika tersedia).</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <SidebarInfo title="Mengapa lokasi penting?">
                            <p>Beberapa perusahaan mungkin memiliki preferensi lokasi untuk pertimbangan pajak atau pertemuan tim sesekali, bahkan untuk peran remote.</p>
                            <p>Memilih "dari mana saja" akan memperluas pilihan Anda, terutama untuk pekerjaan yang sepenuhnya remote.</p>
                        </SidebarInfo>
                    </div>
                );
            case 4: // Unggah Resume
                return (
                    <div className="md:flex gap-8">
                        <div className="md:flex-grow">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Ingin mengunggah CV/resume Anda?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl flex flex-col items-center text-center">
                                    <UploadCloud size={48} className="text-orange-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Ya, unggah & percepat proses!</h3>
                                    <p className="text-xs text-slate-500 mb-4">Format: DOC, DOCX, PDF, RTF, TXT (Maks 2MB).</p>
                                    {searchPreferences.resumeFileName && (
                                        <div className="w-full bg-slate-100 p-3 rounded-md text-sm text-slate-700 mb-3 flex justify-between items-center">
                                            <span className="truncate max-w-[calc(100%-30px)]">{searchPreferences.resumeFileName}</span>
                                            <button onClick={removeResumeFile} type="button" className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                    <label htmlFor="resumeUpload" className={`w-full cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition duration-150 text-center block ${searchPreferences.resumeFileName ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
                                        {searchPreferences.resumeFileName ? '✔️ File Terpilih' : 'Pilih File CV'}
                                    </label>
                                    <input type="file" id="resumeUpload" className="hidden" onChange={handleFileChange} accept=".doc,.docx,.pdf,.rtf,.txt" />
                                    {searchPreferences.resumeFile && <button type="button" onClick={nextStep} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150">Lanjutkan dengan CV ini</button>}
                                </div>
                                <button type="button" onClick={() => { removeResumeFile(); nextStep(); }}
                                    className="bg-white p-6 sm:p-8 rounded-xl shadow-xl flex flex-col items-center text-center hover:ring-2 hover:ring-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 h-full justify-center">
                                    <Edit3 size={48} className="text-slate-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Tidak, lewati & isi manual</h3>
                                    <p className="text-sm text-slate-500">Saya ingin mengisi detail preferensi saya satu per satu.</p>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 5: // Posisi yang Diminati
                return (
                    <div className="md:flex gap-x-8 lg:gap-x-12 items-start">
                        <div className="md:flex-grow mb-8 md:mb-0">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Posisi apa yang Anda minati?</h2>
                            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                                <label htmlFor="jobTitleInput" className="block text-sm font-medium text-slate-700 mb-1">Ketik nama posisi (Anda bisa menambahkan hingga 5)</label>
                                <div className="flex items-center gap-2 mb-4">
                                    <input type="text" id="jobTitleInput" name="jobTitleInput"
                                        className="flex-grow px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                                        placeholder="Cth: Marketing Digital, Web Developer"
                                        value={searchPreferences.currentJobTitleInput}
                                        onChange={handleCurrentJobTitleChange}
                                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addJobTitle(); } }}
                                    />
                                    <button type="button" onClick={addJobTitle} disabled={searchPreferences.jobTitles.length >= 5 || searchPreferences.currentJobTitleInput.trim() === ''}
                                        className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-slate-300 flex-shrink-0">
                                        <PlusCircle size={24} /> {/* Ukuran ikon disesuaikan */}
                                    </button>
                                </div>
                                {searchPreferences.jobTitles.length > 0 && (
                                    <div className="mb-4 space-y-2">
                                        <p className="text-xs text-slate-500">Posisi yang dipilih:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {searchPreferences.jobTitles.map((title, index) => (
                                                <span key={index} className="flex items-center bg-orange-100 text-orange-700 text-sm px-3 py-1.5 rounded-full">
                                                    {title}
                                                    <button onClick={() => removeJobTitle(index)} type="button" className="ml-2 text-orange-500 hover:text-orange-700">
                                                        <XCircle size={16} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-slate-400 text-center mt-2">{searchPreferences.jobTitles.length}/5 posisi telah ditambahkan.</p>
                            </div>
                        </div>
                        <SidebarInfo title="Belum tahu posisi spesifik?">
                            <p>Tidak masalah! Anda bisa melewati langkah ini atau mengisi dengan bidang umum yang Anda minati.</p>
                            <p>Memilih kategori pekerjaan di langkah berikutnya juga akan membantu memperluas pencarian Anda.</p>
                        </SidebarInfo>
                    </div>
                );
            case 6: // Kategori Pekerjaan
                return (
                    <div className="md:flex gap-x-8 lg:gap-x-12 items-start">
                        <div className="md:flex-grow mb-8 md:mb-0">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Pilih hingga 5 kategori pekerjaan</h2>
                            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                                <div className="flex flex-wrap justify-center gap-3">
                                    {jobCategories.map(category => (
                                        <SelectablePill
                                            key={category}
                                            label={category}
                                            isSelected={searchPreferences.jobCategories.includes(category)}
                                            onClick={() => handleToggleSelection('jobCategories', category, 5)}
                                            className="min-w-[120px] text-center justify-center" // Contoh penyesuaian width
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 text-center mt-6">{searchPreferences.jobCategories.length}/5 kategori dipilih.</p>
                            </div>
                        </div>
                        <SidebarInfo title="Bagaimana kategori membantu?">
                            <p>Memilih kategori membantu kami menampilkan lowongan dari berbagai bidang yang mungkin relevan dengan keahlian dan minat Anda, bahkan jika judul posisinya berbeda.</p>
                        </SidebarInfo>
                    </div>
                );
            case 7: // Pengalaman Kerja
                return (
                    <div className="md:flex-grow">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Pengalaman kerja relevan Anda?</h2>
                        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                                {experienceLevels.map(level => (
                                    <SelectablePill
                                        key={level}
                                        label={level}
                                        isSelected={searchPreferences.experienceYears === level}
                                        onClick={() => { handlePreferenceChange('experienceYears', level); }}
                                        className="flex-grow sm:flex-grow-0" // Biar bisa full di mobile, adaptif di SM
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md text-center mt-8 flex items-center justify-center gap-2">
                                <TrendingUp size={18} /> Kami memiliki lowongan untuk semua level pengalaman!
                            </p>
                        </div>
                    </div>
                );
            case 8: // Tingkat Pendidikan
                return (
                    <div className="md:flex-grow">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Apa tingkat pendidikan terakhir Anda?</h2>
                        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                                {educationLevels.map(level => (
                                    <SelectablePill
                                        key={level}
                                        label={level}
                                        isSelected={searchPreferences.educationLevel === level}
                                        onClick={() => { handlePreferenceChange('educationLevel', level); }}
                                        className="flex-grow sm:flex-grow-0"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 text-center mt-8">Pilih yang paling sesuai dengan ijazah terakhir Anda.</p>
                        </div>
                    </div>
                );
            case 9: // Manfaat yang Dicari
                return (
                    <div className="md:flex gap-x-8 lg:gap-x-12 items-start">
                        <div className="md:flex-grow mb-8 md:mb-0">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 lg:mb-10 text-center">Manfaat tambahan apa yang Anda harapkan?</h2>
                            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                                <p className="text-sm text-slate-600 mb-4 text-center">Pilih beberapa yang paling penting bagi Anda (opsional, maks. 5).</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {desiredBenefitOptions.map(benefit => (
                                        <SelectablePill
                                            key={benefit}
                                            label={benefit}
                                            isSelected={searchPreferences.desiredBenefits.includes(benefit)}
                                            onClick={() => handleToggleSelection('desiredBenefits', benefit, 5)} // Batasi 5 manfaat
                                            className="min-w-[120px] text-center justify-center"
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 text-center mt-6">{searchPreferences.desiredBenefits.length}/5 manfaat dipilih.</p>
                            </div>
                        </div>
                        <SidebarInfo title="Pentingnya Manfaat">
                            <p>Selain gaji, manfaat seperti asuransi, cuti, dan peluang pengembangan bisa jadi pertimbangan penting dalam memilih pekerjaan.</p>
                            <p>Pilihan Anda di sini membantu kami menyoroti lowongan dengan fasilitas yang Anda cari.</p>
                        </SidebarInfo>
                    </div>
                );
            default:
                return <p>Langkah tidak ditemukan. Kesalahan konfigurasi.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 pt-8 sm:pt-12 px-4 pb-32"> {/* Tambahkan padding bawah untuk ruang tombol navigasi fixed */}
            <div className="container mx-auto max-w-6xl xl:max-w-7xl"> {/* Container lebih besar */}
                <div className="bg-transparent p-0 sm:px-6 rounded-lg min-h-[500px] flex flex-col">
                    <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                    <div className="flex-grow mb-10">
                        {renderStepContent()}
                    </div>
                </div>
            </div>
            <StepNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                prevStep={prevStep}
                nextStep={nextStep}
            />
        </div>
    );
};

export default JobSearchWizard;