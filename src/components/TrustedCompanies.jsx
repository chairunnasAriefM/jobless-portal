// src/components/TrustedCompanies.jsx
import React from 'react';
// Jika Anda memiliki logo sebagai SVG atau gambar, import di sini
// import { Briefcase, Building, Users } from 'lucide-react'; // Contoh ikon jika tidak ada logo gambar

const companies = [
    { name: 'Spotify', logoUrl: '/path/to/spotify-logo.svg' }, // Ganti dengan path logo Anda
    { name: 'Netflix', logoUrl: '/path/to/netflix-logo.svg' },
    { name: 'Dropbox', logoUrl: '/path/to/dropbox-logo.svg' },
    { name: 'Peloton', logoUrl: '/path/to/peloton-logo.svg' },
    { name: 'CVS Health', logoUrl: '/path/to/cvshealth-logo.svg' },
    { name: 'Zillow', logoUrl: '/path/to/zillow-logo.svg' },
];

// Placeholder sederhana jika gambar logo tidak tersedia
const LogoPlaceholder = ({ name }) => (
    <div className="flex items-center justify-center h-12 text-gray-500 filter grayscale hover:grayscale-0 transition-all duration-300 text-2xl font-semibold">
        {name}
    </div>
);


const TrustedCompanies = () => {
    return (
        <section className="py-12 bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-8">
                    Awesome Companies Hiring for Remote Jobs*
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                    {companies.map((company) => (
                        <div key={company.name} className="flex justify-center">
                            {/* Ganti LogoPlaceholder dengan <img> jika Anda punya file logo */}
                            {/* <img src={company.logoUrl} alt={company.name} className="h-8 md:h-10 filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300" /> */}
                            <LogoPlaceholder name={company.name} />
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-6">*As seen on various job boards and company career pages.</p>
            </div>
        </section>
    );
};

export default TrustedCompanies;