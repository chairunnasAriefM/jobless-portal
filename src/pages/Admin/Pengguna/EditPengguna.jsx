import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PenggunaAPI } from '../../../services/Admin/PenggunaAPI';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, ArrowLeft, Save } from 'lucide-react';

const MySwal = withReactContent(Swal);

const EditUserPage = () => {
    const { id } = useParams(); // Mengambil ID pengguna dari URL
    const navigate = useNavigate();

    // State form, mirip dengan halaman tambah, tapi akan diisi data dari API
    const [formData, setFormData] = useState({
        namaLengkap: '',
        email: '',
        password: '', // Dibuat kosong, hanya diisi jika ingin diubah
        tipeUserId: '1',
    });

    const [originalEmail, setOriginalEmail] = useState(''); // Untuk menampilkan email asli
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Mengambil data pengguna yang akan diedit saat halaman dimuat
    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) {
                navigate('/admin/users'); // Kembali jika tidak ada ID
                return;
            }
            try {
                const userData = await PenggunaAPI.getPenggunaById(id);
                if (userData) {
                    setFormData({
                        namaLengkap: userData.nama_lengkap,
                        email: userData.email,
                        password: '', // Selalu mulai dengan password kosong
                        tipeUserId: userData.tipe_user_id.toString(),
                    });
                    setOriginalEmail(userData.email); // Simpan email asli untuk ditampilkan
                } else {
                    setError('Pengguna tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat data pengguna.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [id, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validasi: hanya jika password baru diisi, cek panjangnya
        if (formData.password && formData.password.length < 8) {
            setError("Password baru harus memiliki minimal 8 karakter.");
            return;
        }
        setIsSaving(true);
        setError('');
        try {
            // Memanggil fungsi update dari API
            await PenggunaAPI.updatePengguna(id, formData);
            await MySwal.fire({
                title: 'Sukses!',
                text: 'Data pengguna berhasil diperbarui.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            navigate('/admin/users');
        } catch (err) {
            setError(err.message || "Gagal memperbarui data pengguna.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center"><Loader2 className="animate-spin text-orange-500 mx-auto" size={32} /></div>;
    }

    if (error && !formData.email) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/users" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Edit Pengguna</h1>
                    <p className="text-slate-500">Memperbarui data untuk: {originalEmail}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-screen space-y-6">
                <div>
                    <label htmlFor="namaLengkap" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap*</label>
                    <input type="text" id="namaLengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required className="input-style" placeholder="Cth: Budi Santoso" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email*</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input-style" placeholder="pengguna@email.com" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="input-style" placeholder="Isi hanya jika ingin mengubah" />
                </div>
                <div>
                    <label htmlFor="tipeUserId" className="block text-sm font-medium text-slate-700 mb-1">Tipe Pengguna</label>
                    <select id="tipeUserId" name="tipeUserId" value={formData.tipeUserId} onChange={handleChange} className="input-style bg-white">
                        <option value="1">Pencari Kerja</option>
                        <option value="2">Perusahaan</option>
                    </select>
                </div>

                {error && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button type="submit" disabled={isSaving} className="flex items-center justify-center py-3 px-6 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                        {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Simpan Perubahan</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserPage;
