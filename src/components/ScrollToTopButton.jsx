// src/components/ScrollTo-TopButton.jsx

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Fungsi untuk mendeteksi scroll
    const toggleVisibility = () => {
        // Tampilkan tombol jika pengguna sudah scroll lebih dari 300px
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Fungsi untuk scroll ke atas
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Animasi mulus
        });
    };

    useEffect(() => {
        // Tambahkan event listener saat komponen dimuat
        window.addEventListener('scroll', toggleVisibility);

        // Hapus event listener saat komponen dilepas untuk mencegah memory leak
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110"
                    aria-label="Kembali ke atas"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
