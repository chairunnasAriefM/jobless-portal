// //src/services/jobSeekerAPI.js

// import { supabase } from '../lib/supabaseClient';

// export const jobSeekerAPI = {

//     // --- PROFIL UTAMA ---

//     /**
//      * Memanggil RPC untuk mengambil profil lengkap seorang pencari kerja.
//      * @param {string} userId - UUID pengguna yang sedang login.
//      * @returns {Promise<object>} - Objek berisi profil, pengalaman, dan pendidikan.
//      */
//     async getProfile(userId) {
//         if (!userId) throw new Error("User ID tidak ditemukan.");

//         const { data, error } = await supabase.rpc('get_jobseeker_profile', {
//             p_user_id: userId
//         });

//         if (error) throw error;
//         return data;
//     },

//     /**
//      * Memanggil RPC untuk mengupdate data utama profil pencari kerja.
//      * @param {string} userId - UUID pengguna.
//      * @param {object} profileData - Data profil yang akan diupdate.
//      */
//     async updateProfile(userId, profileData) {
//         if (!userId) throw new Error("User ID tidak ditemukan.");

//         const { error } = await supabase.rpc('update_jobseeker_profile', {
//             p_user_id: userId,
//             p_nama_lengkap: profileData.nama_lengkap,
//             p_nomor_telepon: profileData.nomor_telepon,
//             p_headline: profileData.headline,
//             p_ringkasan: profileData.ringkasan,
//             p_linkedin_url: profileData.linkedin_url,
//         });

//         if (error) throw error;
//         return { success: true };
//     },

//     // --- KEAHLIAN ---

//     /**
//      * Mengambil semua keahlian yang ada di database untuk ditampilkan di dropdown.
//      */
//     async getAllKeahlian() {
//         const { data, error } = await supabase.from('keahlian').select('keahlian_id, nama_keahlian');
//         if (error) throw error;
//         return data;
//     },

//     /**
//      * Memanggil RPC untuk menyimpan keahlian yang dipilih oleh pengguna.
//      * @param {string} userId - UUID pengguna yang sedang login.
//      * @param {number[]} skillIds - Array berisi ID dari keahlian yang dipilih.
//      */
//     async saveSkills(userId, skillIds) {
//         const { error } = await supabase.rpc('update_jobseeker_skills', {
//             p_user_id: userId,
//             p_skill_ids: skillIds
//         });

//         if (error) throw error;
//         return { success: true };
//     },

//     // --- CV & RESUME ---

//     /**
//      * Mengunggah file CV ke Supabase Storage.
//      * @param {string} userId - UUID pengguna untuk penamaan file.
//      * @param {File} file - File CV yang akan diunggah.
//      */
//     async uploadCV(userId, file) {
//         if (!file || !userId) throw new Error("File atau User ID tidak valid.");

//         // Membuat nama file yang unik untuk menghindari tumpang tindih
//         const filePath = `resumes/${userId}/${Date.now()}-${file.name}`;

//         const { error: uploadError } = await supabase.storage
//             .from('resume-cv') // Pastikan bucket ini ada dan publik
//             .upload(filePath, file, { upsert: true });

//         if (uploadError) throw uploadError;

//         // Dapatkan URL publik dari file yang baru diunggah
//         const { data: urlData } = supabase.storage
//             .from('resume-cv')
//             .getPublicUrl(filePath);

//         // Simpan URL baru ini ke tabel profil pengguna
//         const { error: updateError } = await supabase
//             .from('profil_pencari_kerja')
//             .update({ file_cv: urlData.publicUrl })
//             .eq('user_id', userId);

//         if (updateError) throw updateError;

//         return { success: true, url: urlData.publicUrl };
//     }
// };

// src/services/jobSeekerAPI.js

import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const STORAGE_URL = "https://egnlohisxwbquhuuktri.supabase.co/storage/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
};

export const jobSeekerAPI = {

    // --- PROFIL UTAMA ---

    /**
     * Memanggil RPC untuk mengambil profil lengkap seorang pencari kerja.
     * @param {number} userId - ID pengguna yang sedang login.
     * @returns {Promise<object>} - Objek berisi profil, keahlian, dll.
     */
    async getProfile(userId) {
        if (!userId) throw new Error("User ID tidak ditemukan.");
        try {
            const response = await axios.post(
                `${API_BASE_URL}/rpc/get_jobseeker_profile`,
                { p_user_id: userId },
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching profile via RPC:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Memanggil RPC untuk mengupdate data utama profil pencari kerja.
     * @param {number} userId - ID pengguna.
     * @param {object} profileData - Data profil yang akan diupdate.
     */
    async updateProfile(userId, profileData) {
        if (!userId) throw new Error("User ID tidak ditemukan.");
        try {
            await axios.post(
                `${API_BASE_URL}/rpc/update_jobseeker_profile`,
                {
                    p_user_id: userId,
                    p_nama_lengkap: profileData.nama_lengkap,
                    p_nomor_telepon: profileData.nomor_telepon,
                    p_headline: profileData.headline,
                    p_ringkasan: profileData.ringkasan,
                    p_linkedin_url: profileData.linkedin_url,
                    p_portfolio_url: profileData.portfolio_url,
                },
                { headers }
            );
            return { success: true };
        } catch (error) {
            console.error("Error updating profile via RPC:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    // --- KEAHLIAN ---

    /**
     * Mengambil semua keahlian yang ada di database untuk ditampilkan di dropdown.
     */
    async getAllKeahlian() {
        try {
            const response = await axios.get(`${API_BASE_URL}/keahlian?select=*`, { headers });
            return response.data;
        } catch (error) {
            console.error("Error fetching skills:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Memanggil RPC untuk menyimpan keahlian yang dipilih oleh pengguna.
     * @param {number} userId - ID pengguna.
     * @param {number[]} skillIds - Array berisi ID dari keahlian yang dipilih.
     */
    async saveSkills(userId, skillIds) {
        try {
            await axios.post(
                `${API_BASE_URL}/rpc/update_jobseeker_skills`,
                {
                    p_user_id: userId,
                    p_skill_ids: skillIds
                },
                { headers }
            );
            return { success: true };
        } catch (error) {
            console.error("Error saving skills via RPC:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    // --- CV & RESUME ---

    /**
     * Mengunggah file CV ke Supabase Storage dan mengupdate URL di profil.
     * @param {number} userId - ID pengguna untuk penamaan file.
     * @param {File} file - File CV yang akan diunggah.
     */
    async uploadCV(userId, file) {
        if (!file || !userId) throw new Error("File atau User ID tidak valid.");

        const BUCKET_NAME = 'resume-cv'; // sesuaikan dengan nama bucket kamu
        const filePath = `resumes/${userId}/${Date.now()}-${encodeURIComponent(file.name)}`;
        const uploadUrl = `${STORAGE_URL}/object/${BUCKET_NAME}/${filePath}`;
        const publicUrl = `${STORAGE_URL}/object/public/${BUCKET_NAME}/${filePath}`;

        try {
            // Upload file ke Supabase Storage
            await axios.put(
                uploadUrl,
                file,
                {
                    headers: {
                        ...headers,
                        'Content-Type': file.type || 'application/octet-stream',
                        'x-upsert': 'true'
                    }
                }
            );

            // Simpan URL CV ke profil user via RPC
            await axios.post(
                `${API_BASE_URL}/rpc/update_jobseeker_cv`,
                {
                    p_user_id: userId,
                    p_cv_url: publicUrl
                },
                { headers }
            );

            return { success: true, url: publicUrl };

        } catch (error) {
            console.error("Error uploading CV:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },


    async fetchLowonganSaran({ skillIds, limit = 3 }) {
        // Jika pengguna tidak memiliki keahlian, kembalikan array kosong untuk efisiensi
        if (!skillIds || skillIds.length === 0) {
            return [];
        }

        try {
            // Memanggil function 'get_recommended_jobs' via RPC menggunakan axios
            const response = await axios.post(
                `${API_BASE_URL}/rpc/get_recommended_jobs`,
                {
                    // Nama parameter harus sama persis dengan yang ada di function SQL
                    p_skill_ids: skillIds,
                    p_limit: limit
                },
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching recommended jobs:", error.response?.data || error.message);
            // Lempar error agar bisa ditangani oleh komponen UI
            throw error.response?.data || error;
        }
    },


};
