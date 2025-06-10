import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Mengambil informasi path dari URL saat ini
    const { pathname } = useLocation();

    // Menggunakan useEffect untuk menjalankan sebuah fungsi setiap kali 'pathname' berubah
    useEffect(() => {
        // Scroll window ke posisi paling atas (0, 0)
        window.scrollTo(0, 0);
    }, [pathname]); // <-- Kunci utamanya: efek ini akan terpicu setiap kali URL path berubah

    return null; // Komponen ini tidak perlu me-render elemen visual apapun
};

export default ScrollToTop;