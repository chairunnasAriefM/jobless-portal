// src/services/Admin/AdminAuthAPI.js

import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
};

/**
 * AdminAuthAPI adalah objek yang berisi semua fungsi untuk
 * otentikasi khusus ADMIN.
 */
export const AdminAuthAPI = {

    /**
     * Mencocokkan email dan password langsung di tabel 'pengguna'.
     * Ini adalah metode login manual tanpa token.
     * @param {string} email - Email yang diinput.
     * @param {string} password - Password (plain text) yang diinput.
     * @returns {Promise<object|null>} - Data pengguna jika cocok, atau null jika gagal.
     */
    async loginAdmin(email, password) {
        try {
            // 1. Buat query untuk mencari pengguna dengan email, password, DAN tipe_user_id yang cocok
            const response = await axios.get(
                `${API_BASE_URL}/pengguna?email=eq.${email}&password=eq.${password}&tipe_user_id=eq.3&select=*`,
                { headers }
            );

            // 2. Cek apakah ada hasil yang ditemukan
            if (response.data && response.data.length > 0) {
                // Jika ditemukan, kembalikan data pengguna pertama (seharusnya hanya ada satu)
                return response.data[0];
            } else {
                // Jika tidak ada yang cocok, kembalikan null
                return null;
            }

        } catch (error) {
            console.error("Admin manual login error:", error.response?.data || error.message);
            // Lempar error untuk ditangani oleh komponen UI
            throw new Error("Terjadi kesalahan saat mencoba login admin.");
        }
    },

};
