// src/services/manualAuthAPI.js
import { supabase } from '../lib/supabaseClient';

export const manualAuthAPI = {
    /**
     * Mencoba login dengan memeriksa langsung ke tabel 'Pengguna'.
     * @param {string} email - Email yang diinput pengguna.
     * @param {string} password - Password (plain text) yang diinput pengguna.
     * @returns {Promise<object|null>} - Data pengguna jika cocok, atau null jika gagal.
     */
    async login(email, password) {
        // Memanggil function 'login_manual' yang kita buat di database
        const { data, error } = await supabase.rpc('login_perusahaan', {
            email_input: email,
            password_input: password
        });

        if (error) {
            console.error("Manual login error:", error);
            throw new Error("Terjadi kesalahan saat mencoba login.");
        }

        // RPC akan mengembalikan array. Jika ada data, ambil elemen pertama.
        if (data && data.length > 0) {
            return data[0]; // Login berhasil, kembalikan data pengguna
        } else {
            return null; // Login gagal, tidak ada data yang cocok
        }
    }
};