// src/components/TrustedCompanies.jsx
import React from 'react';

const initialCompanies = [
  { name: 'Spotify', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1024px-Spotify_logo_with_text.svg.png' },
  { name: 'Netflix', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/600px-Netflix_2015_logo.svg.png' },
  { name: 'Dropbox', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/500px-Dropbox_Icon.svg.png' },
  // { name: 'Peloton', logoUrl: 'https://logowik.com/content/uploads/images/peloton-interactive4777.logowik.com.webp' },
  { name: 'CVS Health', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/CVS_Health_Logo.svg/600px-CVS_Health_Logo.svg.png' },
  { name: 'Zillow', logoUrl: 'https://s.zillowstatic.com/pfs/static/z-logo-default.svg' },
  { name: 'Salesforce', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/600px-Salesforce.com_logo.svg.png' },
  { name: 'HubSpot', logoUrl: 'https://www.vectorlogo.zone/logos/hubspot/hubspot-ar21.svg' },
];

// Duplikasi logo untuk efek loop yang mulus, tergantung lebar layar dan jumlah logo
const duplicatedCompanies = [...initialCompanies, ...initialCompanies];


const TrustedCompanies = () => {
  return (
    <section className="py-12 bg-slate-100 overflow-hidden"> {/* Tambahkan overflow-hidden di sini */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-10">
           Telah Dipercaya oleh Berbagai <span className="text-orange-500">Perusahaan Besar</span>
        </h2>
      </div>
      {/* Wrapper untuk animasi marquee */}
      <div className="marquee-container">
        <div className="marquee-content flex"> {/* flex untuk item berjajar */}
          {duplicatedCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex-shrink-0 w-48 h-20 mx-4 sm:mx-6 md:mx-8 flex items-center justify-center p-2" // Atur lebar dan tinggi tetap
            >
              <img
                src={company.logoUrl}
                alt={company.name}
                className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-gray-400 mt-10">*Contoh partner perusahaan kami.</p>
      </div>
    </section>
  );
};

export default TrustedCompanies;