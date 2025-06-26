// src/services/EmployerAuthAPI.js

import { supabase } from '../lib/supabaseClient';

/**
 * authAPI adalah objek yang berisi semua fungsi untuk
 * otentikasi pengguna dan perusahaan.
 */
export const EmployerAuthAPI = {

    // --- PENDAFTARAN 

    /**
     * Memanggil RPC untuk mendaftarkan perusahaan dan pengguna baru secara bersamaan.
     * Ini adalah cara yang aman karena password di-hash oleh Supabase di backend.
     * @param {object} formData - Data dari form pendaftaran.
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async registerCompany(formData) {
        // Memanggil function 'register_company_and_user' yang sudah kita buat di database
        const { error } = await supabase.rpc('register_company_and_user', {
            company_name: formData.companyName,
            company_website: formData.companyWebsite,
            user_email: formData.workEmail,
            user_password: formData.password,
            user_full_name: `${formData.firstName} ${formData.lastName}`
        });

        if (error) {
            console.error("Supabase RPC registration error:", error);
            // Lempar error agar bisa ditangkap dan ditampilkan di komponen UI
            throw new Error(error.message || "Gagal melakukan pendaftaran.");
        }

        return { success: true, message: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.' };
    },

    // --- LOGIN DENGAN SUPABASE AUTH ---

    /**
     * Melakukan login menggunakan sistem otentikasi bawaan Supabase.
     * Aman, menghasilkan JWT, dan mendukung semua fitur Supabase.
     * @param {string} email - Email pengguna.
     * @param {string} password - Password pengguna.
     * @returns {Promise<object>} - Mengembalikan data sesi dan pengguna dari Supabase.
     */
    async signInWithSupabase(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return data;
    },

    // --- LOGIN MANUAL ---

    /**
     * @param {string} email - Email yang diinput pengguna.
     * @param {string} password - Password (plain text) yang diinput pengguna.
     * @returns {Promise<object|null>} - Data pengguna jika cocok, atau null jika gagal.
     */
    async loginManual(email, password) {
        const { data, error } = await supabase.rpc('login_perusahaan', {
            email_input: email,
            password_input: password
        });

        if (error) {
            console.error("Manual login error:", error);
            throw new Error("Terjadi kesalahan saat mencoba login.");
        }

        if (data && data.length > 0) {
            return data[0]; // Login berhasil, kembalikan data pengguna
        }

        return null; // Login gagal
    },

    // --- FUNGSI SESI DAN LOGOUT ---

    /**
     * Fungsi untuk logout. Ini akan menghapus sesi dari Supabase Auth
     * dan juga data sesi manual dari localStorage untuk memastikan bersih total.
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        localStorage.removeItem('manual_user_session'); // Hapus sesi manual jika ada

        if (error) {
            console.error("Sign out error:", error);
            throw new Error("Gagal untuk logout.");
        }
    },

    /**
     * Mengambil sesi pengguna yang sedang aktif dari Supabase.
     * @returns {Promise<object|null>} - Objek sesi atau null.
     */
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }

    

};