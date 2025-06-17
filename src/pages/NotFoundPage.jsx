// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-6">

            <div className="relative mb-4">
                <Compass className="h-32 w-32 text-orange-200" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-orange-400">?</span>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
                Halaman Tidak Ditemukan
            </h1>

            <p className="mt-3 text-lg text-slate-500 max-w-md mx-auto">
                Oops! Sepertinya Anda tersesat. Halaman yang Anda cari mungkin tidak ada atau sudah dipindahkan.
            </p>

            <Link
                to="/"
                className="inline-flex items-center mt-8 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                <ArrowLeft size={20} className="mr-2" />
                Kembali ke Beranda
            </Link>

        </div>
    );
};

export default NotFoundPage;