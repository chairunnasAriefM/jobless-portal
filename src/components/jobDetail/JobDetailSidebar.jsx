import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { LamaranAPI } from '../../services/LamaranAPI';
import useAuthStore from '../../store/authStore';

const MySwal = withReactContent(Swal);

const JobDetailSidebar = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isLoadingApply, setIsLoadingApply] = useState(false);

    // State baru untuk melacak status lamaran
    const [hasApplied, setHasApplied] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    // useEffect untuk memeriksa status lamaran saat komponen dimuat
    useEffect(() => {
        // Hanya periksa jika ada user dan user adalah pencari kerja
        if (user && user.tipe_user_id === 1) {
            const checkStatus = async () => {
                try {
                    const applied = await LamaranAPI.checkIfApplied(job.lowongan_id, user.user_id);
                    setHasApplied(applied);
                } catch (error) {
                    console.error("Gagal memeriksa status lamaran:", error);
                    // Jika gagal, anggap belum melamar agar tombol tetap muncul
                    setHasApplied(false);
                } finally {
                    setIsCheckingStatus(false);
                }
            };
            checkStatus();
        } else {
            setIsCheckingStatus(false);
        }
    }, [job.lowongan_id, user]);


    const handleApply = async () => {
        if (!user) {
            MySwal.fire('Anda Belum Login', 'Silakan login sebagai pencari kerja untuk melamar.', 'warning')
                .then(() => navigate('/login'));
            return;
        }
        if (user.tipe_user_id !== 1) {
            MySwal.fire('Aksi Ditolak', 'Hanya pencari kerja yang bisa melamar lowongan.', 'error');
            return;
        }

        MySwal.fire({
            title: 'Kirim Lamaran?',
            text: `Anda akan melamar untuk posisi "${job.judul}". Pastikan profil Anda sudah lengkap.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Kirim Lamaran!',
            confirmButtonColor: '#f97316',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoadingApply(true);
                try {
                    const response = await LamaranAPI.applyForJob(job.lowongan_id, user.user_id);
                    await MySwal.fire('Berhasil!', response.message, 'success');
                    setHasApplied(true); // Update UI untuk menampilkan status "Sudah Melamar"
                } catch (err) {
                    await MySwal.fire('Gagal!', err.message, 'error');
                } finally {
                    setIsLoadingApply(false);
                }
            }
        });
    };

    // Tentukan apakah tombol harus ditampilkan
    const shouldShowApplyButton = !user || user.tipe_user_id === 1;

    // Konten dinamis untuk tombol
    const renderButtonContent = () => {
        if (isCheckingStatus) {
            return <Loader2 className="animate-spin" />;
        }
        if (hasApplied) {
            return (
                <div className="flex flex-col items-center text-center text-green-700">
                    <CheckCircle className="h-8 w-8 mb-2" />
                    <p className="font-semibold">Anda Sudah Melamar</p>
                </div>
            );
        }
        return (
            <button
                onClick={handleApply}
                disabled={isLoadingApply}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-150 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
                {isLoadingApply ? <Loader2 className="animate-spin" /> : <><Send size={18} className="mr-2" /> Lamar Sekarang</>}
            </button>
        );
    };

    return (
        <aside className="w-full lg:w-1/3">
            <div className="sticky top-28 space-y-6">
                {/* Tampilkan tombol hanya jika kondisi terpenuhi */}
                {shouldShowApplyButton && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        {renderButtonContent()}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default JobDetailSidebar;
