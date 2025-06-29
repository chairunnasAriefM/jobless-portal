import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
};

export const PenggunaAPI = {
    /**
     * Mengambil semua pengguna beserta nama tipe user dari tabel relasi.
     * @returns {Promise<Array>} Array berisi data pengguna.
     */
    async fetchPenggunas() {
        try {
            const response = await axios.get(
                // Query select untuk join dengan tabel 'tipe_user'
                `${API_BASE_URL}/pengguna?select=*,tipe_user(nama_tipe)&order=created_at.desc`,
                { headers }
            );

            // Merapikan data agar mudah digunakan di frontend
            return response.data.map(user => ({
                ...user,
                // Mengubah { tipe_user: { nama_tipe: '...' } } menjadi nama_tipe: '...'
                nama_tipe: user.tipe_user?.nama_tipe
            }));
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    /**
     * Menghapus seorang pengguna berdasarkan ID-nya.
     * @param {number} id - ID pengguna yang akan dihapus.
     */
    async deletePengguna(id) {
        try {
            await axios.delete(`${API_BASE_URL}/pengguna?user_id=eq.${id}`, { headers });
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
};
