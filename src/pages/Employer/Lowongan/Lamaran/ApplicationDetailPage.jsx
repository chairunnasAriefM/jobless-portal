import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LamaranAPI } from '../../../../services/LamaranAPI'; // Sesuaikan path
import { Loader2, AlertCircle, ArrowLeft, User, Mail, Phone, Linkedin, Sparkles, Download, Eye, ExternalLink } from 'lucide-react';
import { formatDatePosted } from '../../../../utils/formatters'; // Sesuaikan path
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { downloadFileFromURL } from '../../../../utils/downloadFile';

const MySwal = withReactContent(Swal);



// --- Komponen-Komponen Pendukung ---

// Kartu untuk setiap bagian profil
const ProfileSection = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex items-center border-b border-slate-200 pb-3 mb-4">
            {React.cloneElement(icon, { className: "mr-3 text-orange-500" })}
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600">
            {children}
        </div>
    </div>
);


// Sidebar untuk aksi dan info cepat
const ActionSidebar = ({ lamaran, statusOptions, onStatusChange }) => {
    return (
        <div className="lg:sticky lg:top-28 space-y-6">
            {/* Status Lamaran */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Status Lamaran</h3>
                <p className="text-sm text-slate-500 mb-4">Ubah status untuk melanjutkan proses rekrutmen.</p>
                <select
                    value={lamaran.status_lamaran?.status_lamaran_id || ''}
                    onChange={(e) => onStatusChange(lamaran.lamaran_id, e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                >
                    {statusOptions.map(opt => (
                        <option key={opt.status_lamaran_id} value={opt.status_lamaran_id}>
                            {opt.nama_status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dokumen */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Dokumen</h3>
                {lamaran.pelamar?.profil?.file_cv ? (
                    <div className="space-y-3">
                        {/* Tombol Preview CV */}
                        <a
                            href={lamaran.pelamar.profil.file_cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-orange-600 transition-all shadow-sm hover:shadow-md"
                        >
                            <ExternalLink size={18} className="mr-2" />
                            Lihat CV
                        </a>

                        {/* Tombol Unduh CV */}
                        <button
                            type="button"
                            onClick={() => downloadFileFromURL(lamaran.pelamar.profil.file_cv, 'CV_Pelamar.pdf')}
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-all border border-slate-300"
                        >
                            <Download size={18} className="mr-2" />
                            Unduh CV
                        </button>
                    </div>

                ) : (
                    <p className="text-sm text-slate-500 italic">Pelamar belum mengunggah CV.</p>
                )}
            </div>

        </div>
    );
};

// --- Komponen Utama Halaman ---
const ApplicationDetailPage = () => {
    const { lamaranId } = useParams();
    const navigate = useNavigate();
    const [appData, setAppData] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [details, statuses] = await Promise.all([
                LamaranAPI.getApplicationDetails(lamaranId),
                LamaranAPI.getStatusOptions()
            ]);
            if (!details) throw new Error("Lamaran tidak ditemukan.");
            setAppData(details);
            setStatusOptions(statuses || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [lamaranId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = async (currentLamaranId, newStatusId) => {
        try {
            await LamaranAPI.updateApplicationStatus(currentLamaranId, newStatusId);
            // Muat ulang data untuk menampilkan status terbaru
            loadData();
            MySwal.fire({
                title: 'Sukses!',
                text: 'Status lamaran berhasil diperbarui.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            MySwal.fire('Gagal!', 'Tidak dapat mengubah status lamaran.', 'error');
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
    if (error) return <div className="p-8 text-center text-red-500"><AlertCircle className="mx-auto mb-2" />{error}</div>;
    if (!appData) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

    const { pelamar, lowongan_kerja: lowongan } = appData;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to={`/dashboard/perusahaan/lowongan/${lowongan.lowongan_id}/pelamar`} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{pelamar.profil.nama_lengkap}</h1>
                    <p className="text-slate-500">Melamar untuk posisi: <span className="font-semibold">{lowongan.judul}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Kolom Kiri (Profil Detail) */}
                <div className="lg:col-span-2 space-y-8">
                    <ProfileSection title="Tentang Pelamar" icon={<User />}>
                        <div dangerouslySetInnerHTML={{ __html: pelamar.profil.ringkasan || '<i>Belum ada ringkasan.</i>' }} />
                    </ProfileSection>

                    <ProfileSection title="Kontak & Tautan" icon={<Mail />}>
                        <div className="space-y-2 text-sm">
                            <p><strong>Email:</strong> {pelamar.email}</p>
                            <p><strong>Telepon:</strong> {pelamar.nomor_telepon || 'N/A'}</p>
                            {pelamar.profil.linkedin_url && (
                                <p><strong>LinkedIn:</strong> <a href={pelamar.profil.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat Profil</a></p>
                            )}
                            {pelamar.profil.linkedin_url && (
                                <p><strong>Portfolio:</strong> <a href={pelamar.profil.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat Profil</a></p>
                            )}
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Keahlian" icon={<Sparkles />}>
                        {pelamar.keahlian && pelamar.keahlian.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {pelamar.keahlian.map(skill => (
                                    <span key={skill.keahlian_id} className="bg-orange-100 text-orange-800 text-sm font-medium px-4 py-1.5 rounded-full">{skill.nama_keahlian}</span>
                                ))}
                            </div>
                        ) : <p className="text-slate-500 italic">Tidak ada keahlian yang dicantumkan.</p>}
                    </ProfileSection>
                </div>

                {/* Kolom Kanan (Aksi & Info Cepat) */}
                <ActionSidebar lamaran={appData} statusOptions={statusOptions} onStatusChange={handleStatusChange} />
            </div>
        </div>
    );
};

export default ApplicationDetailPage;
