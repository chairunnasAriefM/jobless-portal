// src/components/CallToAction.jsx
import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-slate-700 text-white" id="signup"> {/* Menambahkan ID untuk Daftar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Siap Mengembangkan <span className="text-orange-400">Karir & Bisnis UKM</span> Anda?
        </h2>
        <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
          Bergabunglah dengan JoblessPortal sekarang. Proses mudah, cepat, dan efisien untuk semua kebutuhan rekrutmen dan pencarian kerja Anda.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
            href="#for-employers-cta" // Arahkan ke halaman registrasi perusahaan
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
            Daftar Sebagai Perusahaan
            </a>
            <a
            href="#jobseeker-signup" // Arahkan ke halaman registrasi pencari kerja
            className="bg-white hover:bg-gray-100 text-slate-700 font-bold py-4 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
            Daftar Sebagai Pencari Kerja
            </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;