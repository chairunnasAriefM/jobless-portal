// src/components/Footer.jsx
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from 'lucide-react'; // Send untuk Telegram
// import AppStoreBadge from '../assets/images/app-store-badge.svg'; // Contoh path
// import GooglePlayBadge from '../assets/images/google-play-badge.svg'; // Contoh path

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Find Remote Work': [
      { text: 'New Remote Jobs Now', href: '#' },
      { text: 'Remote Jobs Near Me', href: '#' },
      { text: 'Part-Time Remote Jobs', href: '#' },
      { text: 'Freelance Remote Jobs', href: '#' },
      { text: 'Browse Remote Jobs by Category', href: '#' },
    ],
    'About JobPortal': [
      { text: 'About Us', href: '#' },
      { text: 'How JobPortal Works', href: '#' },
      { text: 'Press & Awards', href: '#' },
      { text: 'Careers at JobPortal', href: '#' },
      { text: 'Contact Us', href: '#' },
    ],
    'Job Search Resources': [
      { text: 'Work From Home Jobs No Experience', href: '#' },
      { text: 'How To Make Money Online', href: '#' },
      { text: 'High Paying Remote Jobs', href: '#' },
      { text: 'Best Remote Companies to Work For', href: '#' },
      { text: 'Online Resume Builder', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', name: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', name: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', name: 'Instagram' },
    { icon: <Linkedin size={20} />, href: '#', name: 'LinkedIn' },
    { icon: <Youtube size={20} />, href: '#', name: 'YouTube' },
    { icon: <Send size={20} />, href: '#', name: 'Telegram' }, // Send icon untuk Telegram
  ];

  return (
    <footer className="bg-slate-800 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Kolom pertama bisa untuk deskripsi singkat atau logo lagi */}
          <div className="md:col-span-1 lg:col-span-1 pr-8">
            <h3 className="text-xl font-bold text-white mb-4">Job<span className="text-orange-500">Portal</span></h3>
            <p className="text-sm mb-4">
              Your trusted partner in finding flexible and remote job opportunities worldwide.
            </p>
             <div className="mt-6">
                <h4 className="text-md font-semibold text-white mb-3">Get the JobPortal App</h4>
                <div className="flex space-x-3">
                  {/* Ganti dengan komponen gambar badge Anda */}
                  <a href="#" className="inline-block bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                    {/* <img src={AppStoreBadge} alt="Download on the App Store" className="h-10" /> */}
                    <span className="text-xs">App Store (Placeholder)</span>
                  </a>
                  <a href="#" className="inline-block bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                    {/* <img src={GooglePlayBadge} alt="Get it on Google Play" className="h-10" /> */}
                    <span className="text-xs">Google Play (Placeholder)</span>
                  </a>
                </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-md font-semibold text-white mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
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
            <div className="text-sm mb-4 md:mb-0">
              &copy; {currentYear} JobPortal. All rights reserved.
              <a href="#" className="ml-4 hover:text-orange-400">Manage Cookies</a>
              <a href="#" className="ml-4 hover:text-orange-400">Terms of Use</a>
              <a href="#" className="ml-4 hover:text-orange-400">Privacy Policy</a>
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