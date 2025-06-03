// src/components/Footer.jsx
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Kategori Populer': [ // Diubah dari Find Remote Work
      { text: 'Lowongan Admin UKM', href: '#' },
      { text: 'Lowongan Digital Marketing', href: '#' },
      { text: 'Lowongan IT & Developer', href: '#' },
      { text: 'Lowongan Kerja Remote', href: '#' },
      { text: 'Lowongan Lulusan Baru', href: '#' },
    ],
    'Tentang JoblessPortal': [ // Diubah dari About JobPortal
      { text: 'Tentang Kami', href: '#' },
      { text: 'Cara Kerja Platform', href: '#' }, // Disesuaikan
      { text: 'Layanan Premium UKM', href: '#' }, // Ditambahkan
      { text: 'Karir di JoblessPortal', href: '#' },
      { text: 'Hubungi Kami', href: '#' },
    ],
    'Sumber Daya': [ // Diubah dari Job Search Resources
      { text: 'Tips Sukses Melamar Kerja', href: '#' },
      { text: 'Panduan Rekrutmen Efektif (UKM)', href: '#' }, // Ditambahkan
      { text: 'Jasa Penyusunan CV Profesional', href: '#' }, // Ditambahkan
      { text: 'Blog & Artikel Karir', href: '#' },
      { text: 'FAQ (Tanya Jawab)', href: '#' }, // Ditambahkan
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', name: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', name: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', name: 'Instagram' },
    { icon: <Linkedin size={20} />, href: '#', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-800 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-12">
          <div className="md:col-span-1 lg:col-span-1 "> {/* Kolom pertama untuk deskripsi */}
            <h3 className="text-xl font-bold text-white mb-4">Jobless<span className="text-orange-500">Portal</span></h3>
            <p className="text-sm mb-4 leading-relaxed">
              Solusi job portal modern untuk kemajuan karir Anda dan pertumbuhan bisnis UKM di Indonesia.
            </p>
             {/* Placeholder untuk badge aplikasi jika ada */}
            {/* <div className="mt-6">
                <h4 className="text-md font-semibold text-white mb-3">Unduh Aplikasi Kami</h4>
                <div className="flex space-x-3">
                  <a href="#" className="inline-block bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                    <span className="text-xs">App Store (Placeholder)</span>
                  </a>
                  <a href="#" className="inline-block bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                    <span className="text-xs">Google Play (Placeholder)</span>
                  </a>
                </div>
            </div> */}
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-md font-semibold text-white mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-3"> {/* Tambah spasi antar link */}
                {links.map((link) => (
                  <li key={link.text}>
                    <a href={link.href} className="hover:text-orange-400 transition-colors duration-200 text-sm">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-center md:text-left mb-4 md:mb-0">
              &copy; {currentYear} JoblessPortal. Hak Cipta Dilindungi.
              <span className="mx-2 hidden sm:inline">|</span><br className="sm:hidden"/>
              <a href="#" className="hover:text-orange-400">Kebijakan Privasi</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-orange-400">Syarat & Ketentuan</a>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} aria-label={social.name} className="text-slate-400 hover:text-orange-400 transition-colors duration-200">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;