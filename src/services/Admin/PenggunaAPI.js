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
                nama_tipe: user.tipe_user?.nama_tipe
            }));
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Mengambil data satu pengguna berdasarkan ID-nya.
     */
    async getPenggunaById(id) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/pengguna?user_id=eq.${id}&select=*`,
                // Meminta Supabase mengembalikan satu objek, bukan array
                { headers: { ...headers, Accept: 'application/vnd.pgrst.object+json' } }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Membuat pengguna baru dengan INSERT langsung ke tabel 'pengguna' menggunakan Axios.
     * @param {object} userData - Data pengguna dari form.
     */
    async createPengguna(userData) {
        try {
            const payload = {
                nama_lengkap: userData.namaLengkap,
                email: userData.email,
                password: userData.password, // Password dikirim sebagai teks biasa
                tipe_user_id: parseInt(userData.tipeUserId, 10),
            };
            await axios.post(
                `${API_BASE_URL}/pengguna`,
                payload,
                { headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' } }
            );
            return { success: true };
        } catch (error) {
            console.error("Error creating user:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Mengubah data pengguna yang ada.
     */
    async updatePengguna(id, userData) {
        try {
            const payload = {
                nama_lengkap: userData.namaLengkap,
                email: userData.email,
                tipe_user_id: parseInt(userData.tipeUserId, 10),
            };
            // Hanya tambahkan password ke payload jika diisi (tidak kosong)
            if (userData.password) {
                payload.password = userData.password;
            }

            await axios.patch(
                `${API_BASE_URL}/pengguna?user_id=eq.${id}`,
                payload,
                { headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' } }
            );
            return { success: true };
        } catch (error) {
            console.error("Error updating user:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Menghapus seorang pengguna berdasarkan ID-nya.
     */
    async deletePengguna(id) {
        try {
            // PERBAIKAN: Menggunakan 'user_id' sebagai kolom filter
            await axios.delete(`${API_BASE_URL}/pengguna?user_id=eq.${id}`, { headers });
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }
};
