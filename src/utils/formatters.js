// src/utils/formatters.js

/**
 * Mengubah format tanggal ISO menjadi "Hari Ini", "Kemarin", atau tanggal lokal.
 * @param {string} dateString - Tanggal dalam format ISO (dari Supabase).
 * @returns {string} - Tanggal yang sudah diformat.
 */
export const formatDatePosted = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hari Ini';
    if (date.toDateString() === yesterday.toDateString()) return 'Kemarin';

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Mengubah format gaji dari angka menjadi rentang yang mudah dibaca.
 * @param {number} min - Gaji minimum.
 *
 * @param {number} max - Gaji maksimum.
 * @returns {string|null} - Rentang gaji yang diformat atau null.
 */
export const formatSalary = (min, max) => {
    if (!min && !max) return null;

    const format = (num) => {
        if (num >= 1000000) {
            return `Rp ${num / 1000000}jt`;
        }
        return `Rp ${num / 1000}rb`;
    };

    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `Mulai dari ${format(min)}`;
    if (max) return `Hingga ${format(max)}`;

    return null;
}