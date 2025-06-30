import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
};

export const LowonganKerjaAPI = {
    /**
     * Mengambil semua lowongan kerja beserta nama perusahaan dari tabel relasi.
     * @returns {Promise<Array>} Array berisi data lowongan kerja.
     */
    async fetchLowonganKerja() {
        try {
            const response = await axios.get(
                // Query select untuk join dengan tabel 'perusahaan'
                `${API_BASE_URL}/lowongan_kerja?select=*,perusahaan(nama_perusahaan)&order=tanggal_diposting.desc`,
                { headers }
            );

            // Merapikan data agar mudah digunakan di frontend
            return response.data.map(job => ({
                ...job,
                nama_perusahaan: job.perusahaan?.nama_perusahaan
            }));
        } catch (error) {
            console.error("Error fetching job listings:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Mengambil data satu lowongan kerja berdasarkan ID-nya.
     * @param {number} id - ID lowongan kerja.
     */
    async getLowonganKerjaById(id) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/lowongan_kerja?lowongan_id=eq.${id}&select=*,perusahaan(nama_perusahaan),tipe_pekerjaan(nama_tipe)`,
                { headers: { ...headers, Accept: 'application/vnd.pgrst.object+json' } }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching job by ID:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Mengubah data lowongan kerja yang ada.
     * @param {number} id - ID lowongan kerja.
     * @param {object} jobData - Data baru untuk lowongan.
     */
    async updateLowonganKerja(id, jobData) {
        try {
            // Payload hanya berisi data yang relevan untuk di-update oleh admin
            const payload = {
                judul: jobData.judul,
                lokasi: jobData.lokasi,
                status_aktif: jobData.status_aktif,
                deskripsi: jobData.deskripsi,
                kualifikasi: jobData.kualifikasi,
            };

            await axios.patch(
                `${API_BASE_URL}/lowongan_kerja?lowongan_id=eq.${id}`,
                payload,
                { headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' } }
            );
            return { success: true };
        } catch (error) {
            console.error("Error updating job listing:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Menghapus sebuah lowongan kerja berdasarkan ID-nya.
     * @param {number} id - ID lowongan kerja yang akan dihapus.
     */
    async deleteLowonganKerja(id) {
        try {
            await axios.delete(`${API_BASE_URL}/lowongan_kerja?lowongan_id=eq.${id}`, { headers });
        } catch (error) {
            console.error("Error deleting job listing:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }
};
