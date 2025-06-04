// src/components/Hero.jsx
import React from 'react';
import heroImageUrl from '../assets/images/hero.png';

const Hero = () => {
  return (
    <div
      className="relative bg-slate-700 text-white py-20 md:py-32"
      // Jika ingin menggunakan gambar latar belakang:
      style={{ backgroundImage: `url(${heroImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay jika menggunakan gambar latar belakang untuk kontras teks */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Temukan <span className="text-orange-400">Peluang Karir</span> & Talenta Terbaik
          <br className="hidden md:block" /> untuk <span className="text-orange-400">Perusahaan Anda</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto">
          Platform job portal modern yang dirancang untuk kemudahan dan efisiensi.
          Bergabunglah dengan ratusan Perusahaan dan pencari kerja lokal.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="/cari-lowongan-wizard" // Arahkan ke section pencarian nanti
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            Cari Lowongan Sekarang
          </a>
          <a
            href="/daftar-perusahaan" // Arahkan ke section khusus untuk perusahaan
            className="bg-transparent hover:bg-slate-600 text-slate-100 font-semibold py-3.5 px-8 border-2 border-slate-300 hover:border-slate-400 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            Rekrut Talenta
          </a>
        </div>

        {/* Placeholder untuk ilustrasi/gambar di samping teks jika diinginkan */}
        {/* <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20 -z-1">
          <img src="path-to-your-illustration.svg" alt="Illustration" className="w-64 h-auto" />
        </div> */}
      </div>

      {/* Efek gelombang atau bentuk di bawah hero (opsional) */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-20 md:h-32 text-white fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31.74,907.2,72.46,996.09,90.83c70.49,14.08,141.54,10.07,212.22,6.26V0H0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" ></path>
        </svg>
      </div> */}
    </div>
  );
};

export default Hero;