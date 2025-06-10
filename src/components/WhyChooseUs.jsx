// src/components/WhyChooseUs.jsx
import React from 'react';
import { CheckCircle, Zap, Users, ShieldCheck, Award, DollarSign } from 'lucide-react'; // Menambahkan Award, DollarSign

const features = [
  {
    icon: <Zap size={36} className="text-orange-500 mb-4" />,
    title: 'Proses Cepat & Efisien',
    description: 'Platform ramah pengguna untuk rekrutmen dan lamaran kerja yang lebih cepat. Hemat waktu Anda dan perusahaan.',
  },
  {
    icon: <CheckCircle size={36} className="text-orange-500 mb-4" />,
    title: 'Lowongan Terverifikasi & Relevan',
    description: 'Kami memastikan setiap lowongan valid dan cocok untuk kebutuhan pasar kerja lokal dan UKM.',
  },
  {
    icon: <Users size={36} className="text-orange-500 mb-4" />,
    title: 'Fokus pada UKM & Talenta Lokal',
    description: 'Dukung pertumbuhan UKM dengan menghubungkan mereka dengan talenta-talenta terbaik di daerah Anda.',
  },
  {
    icon: <DollarSign size={36} className="text-orange-500 mb-4" />,
    title: 'Solusi Rekrutmen Terjangkau',
    description: 'Pilihan layanan yang disesuaikan dengan anggaran UKM, termasuk fitur premium yang kompetitif.',
  },
  {
    icon: <Award size={36} className="text-orange-500 mb-4" />,
    title: 'Layanan Bernilai Tambah',
    description: 'Manfaatkan fitur lowongan unggulan, bantuan penyusunan CV profesional, dan tips karir eksklusif.',
  },
  {
    icon: <ShieldCheck size={36} className="text-orange-500 mb-4" />,
    title: 'Aman, Terpercaya, Mudah Digunakan',
    description: 'Prioritas kami adalah keamanan data Anda dan pengalaman pengguna yang bersih dan intuitif.',
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-16 bg-white"> {/* Ubah background agar kontras */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" id="how-it-works"> {/* Menambahkan ID untuk Cara Kerja */}
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Mengapa Memilih <span className="text-orange-500">JoblessPortal</span>?
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto" id="for-employers-hero"> {/* Menambahkan ID untuk Perusahaan */}
            Solusi rekrutmen modern untuk UKM dan platform pencarian kerja yang mengerti kebutuhan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"> {/* Ubah ke lg:grid-cols-3 jika ada 6 item */}
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center md:flex-row md:text-left md:items-start space-x-0 md:space-x-6">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;