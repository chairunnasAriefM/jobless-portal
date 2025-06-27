// src/services/JobSeekerAuthAPI.js

import { supabase } from '../lib/supabaseClient';

/**
 * JobSeekerAuthAPI adalah objek yang berisi semua fungsi untuk
 * otentikasi khusus PENCARI KERJA.
 */
export const JobSeekerAuthAPI = {

  // --- PENDAFTARAN ---

  /**
   * Memanggil RPC untuk mendaftarkan PENCARI KERJA baru.
   * @param {object} formData - Data dari form pendaftaran.
   */
  async registerJobSeeker(formData) {
    const { error } = await supabase.rpc('register_job_seeker', {
      user_email: formData.email,
      user_password: formData.password,
      user_full_name: `${formData.firstName} ${formData.lastName}`
    });

    if (error) {
      console.error("Supabase job seeker registration error:", error);
      throw error;
    }

    return { success: true, message: 'Pendaftaran berhasil! Silakan login.' };
  },

  // --- LOGIN MANUAL ---
  
  /**
   * Memanggil RPC untuk memverifikasi login PENCARI KERJA.
   * @param {string} email - Email yang diinput.
   * @param {string} password - Password (plain text) yang diinput.
   * @returns {Promise<object|null>} - Data pengguna jika cocok, atau null jika gagal.
   */
  async loginManual(email, password) {
    const { data, error } = await supabase.rpc('login_job_seeker', {
      email_input: email,
      password_input: password
    });

    if (error) {
      console.error("Manual job seeker login error:", error);
      throw new Error("Terjadi kesalahan saat mencoba login.");
    }

    if (data && data.length > 0) {
      return data[0]; // Login berhasil
    }

    return null; // Login gagal
  },
};
