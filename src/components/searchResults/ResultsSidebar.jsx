// src/components/searchResults/ResultsSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react'; // Atau ikon lain

const ResultsSidebar = () => {
    return (
        <aside className="lg:w-1/3 space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg shadow text-center">
                <Briefcase size={32} className="mx-auto text-orange-500 mb-3" />
                <h4 className="text-lg font-semibold text-orange-700 mb-2">Belum Menemukan yang Cocok?</h4>
                <p className="text-sm text-orange-600 mb-4">Buat Akun Gratis dan dapatkan notifikasi lowongan terbaru sesuai preferensi Anda!</p>
                <Link to="/daftar" className="w-full block bg-orange-500 text-white py-2.5 px-4 rounded-md hover:bg-orange-600 transition duration-150 font-semibold">
                    Daftar Sekarang
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">Tips Karir dari JoblessPortal</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/artikel/kesalahan-wawancara" className="text-orange-600 hover:underline">5 Kesalahan Umum Saat Wawancara Kerja</Link></li>
                    <li><Link to="/artikel/cv-ukm" className="text-orange-600 hover:underline">Cara Membuat CV yang Dilirik HRD UKM</Link></li>
                    <li><Link to="/artikel/negosiasi-gaji" className="text-orange-600 hover:underline">Negosiasi Gaji untuk Lulusan Baru</Link></li>
                </ul>
                <Link to="/blog" className="text-sm text-orange-600 hover:underline mt-3 block">Lihat Semua Artikel...</Link>
            </div>
        </aside>
    );
};

export default ResultsSidebar;