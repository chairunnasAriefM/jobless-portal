// src/components/CallToAction.jsx
import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-slate-700 text-white">
      {/* Mirip dengan Hero, bisa tambahkan pola latar belakang atau gambar jika mau */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Over <span className="text-orange-400">10 Million</span> Job Seekers Have Used JobPortal
        </h2>
        <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
          Find a better way to work. Your dream job is waiting for you. Join our community today!
        </p>
        <a
          href="#" // Arahkan ke halaman registrasi
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Find Your Next Remote Job!
        </a>
      </div>
    </section>
  );
};

export default CallToAction;