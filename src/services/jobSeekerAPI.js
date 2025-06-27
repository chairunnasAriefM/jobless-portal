//src/services/jobSeekerAPI.js

import { supabase } from '../lib/supabaseClient';

export const jobSeekerAPI = {

    // --- PROFIL UTAMA ---

    /**
     * Memanggil RPC untuk mengambil profil lengkap seorang pencari kerja.
     * @param {string} userId - UUID pengguna yang sedang login.
     * @returns {Promise<object>} - Objek berisi profil, pengalaman, dan pendidikan.
     */
    async getProfile(userId) {
        if (!userId) throw new Error("User ID tidak ditemukan.");
        
        const { data, error } = await supabase.rpc('get_jobseeker_profile', {
            p_user_id: userId
        });

        if (error) throw error;
        return data;
    },

    /**
     * Memanggil RPC untuk mengupdate data utama profil pencari kerja.
     * @param {string} userId - UUID pengguna.
     * @param {object} profileData - Data profil yang akan diupdate.
     */
    async updateProfile(userId, profileData) {
        if (!userId) throw new Error("User ID tidak ditemukan.");
        
        const { error } = await supabase.rpc('update_jobseeker_profile', {
            p_user_id: userId,
            p_nama_lengkap: profileData.nama_lengkap,
            p_nomor_telepon: profileData.nomor_telepon,
            p_headline: profileData.headline,
            p_ringkasan: profileData.ringkasan,
            p_linkedin_url: profileData.linkedin_url,
        });

        if (error) throw error;
        return { success: true };
    },

    // --- KEAHLIAN ---
    
    /**
     * Mengambil semua keahlian yang ada di database untuk ditampilkan di dropdown.
     */
    async getAllKeahlian() {
        const { data, error } = await supabase.from('keahlian').select('keahlian_id, nama_keahlian');
        if (error) throw error;
        return data;
    },

    /**
     * Memanggil RPC untuk menyimpan keahlian yang dipilih oleh pengguna.
     * @param {string} userId - UUID pengguna yang sedang login.
     * @param {number[]} skillIds - Array berisi ID dari keahlian yang dipilih.
     */
    async saveSkills(userId, skillIds) {
        const { error } = await supabase.rpc('update_jobseeker_skills', {
            p_user_id: userId,
            p_skill_ids: skillIds
        });

        if (error) throw error;
        return { success: true };
    },

    // --- CV & RESUME ---

    /**
     * Mengunggah file CV ke Supabase Storage.
     * @param {string} userId - UUID pengguna untuk penamaan file.
     * @param {File} file - File CV yang akan diunggah.
     */
    async uploadCV(userId, file) {
        if (!file || !userId) throw new Error("File atau User ID tidak valid.");
        
        // Membuat nama file yang unik untuk menghindari tumpang tindih
        const filePath = `resumes/${userId}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
            .from('resume-cv') // Pastikan bucket ini ada dan publik
            .upload(filePath, file, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        // Dapatkan URL publik dari file yang baru diunggah
        const { data: urlData } = supabase.storage
            .from('resume-cv')
            .getPublicUrl(filePath);

        // Simpan URL baru ini ke tabel profil pengguna
        const { error: updateError } = await supabase
            .from('profil_pencari_kerja')
            .update({ file_cv: urlData.publicUrl })
            .eq('user_id', userId);
        
        if (updateError) throw updateError;
        
        return { success: true, url: urlData.publicUrl };
    }
};
