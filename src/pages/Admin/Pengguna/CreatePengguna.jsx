import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenggunaAPI } from '../../../services/Admin/PenggunaAPI'; // Sesuaikan path jika perlu
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader2, ArrowLeft, UserPlus, Save } from 'lucide-react';

const MySwal = withReactContent(Swal);

const CreatePengguna = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        namaLengkap: '',
        email: '',
        password: '',
        tipeUserId: '1', // Default ke 'Pencari Kerja'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            setError("Password harus memiliki minimal 8 karakter.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await PenggunaAPI.createPengguna(formData);
            await MySwal.fire({
                title: 'Sukses!',
                text: 'Pengguna baru berhasil ditambahkan.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            navigate('/admin/pengguna'); // Kembali ke halaman daftar pengguna
        } catch (err) {
            setError(err.message || "Gagal menambahkan pengguna. Email mungkin sudah terdaftar.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/pengguna" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <h1 className="text-5xl font-bold text-slate-800">Tambah Pengguna Baru</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 min-w-full space-y-6">
                <div>
                    <label htmlFor="namaLengkap" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap*</label>
                    <input type="text" id="namaLengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required className="input-style" placeholder="Cth: Budi Santoso" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email*</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input-style" placeholder="pengguna@email.com" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password*</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="input-style" placeholder="Minimal 8 karakter" />
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
                    <button type="submit" disabled={isLoading} className="flex items-center justify-center py-3 px-6 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                        {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Simpan Pengguna</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePengguna;
