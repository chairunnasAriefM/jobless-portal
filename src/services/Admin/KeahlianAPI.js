import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
};

export const KeahlianAPI = {
    /**
     * Mengambil semua keahlian, diurutkan berdasarkan nama.
     */
    async fetchKeahlian() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/keahlian?select=*&order=nama_keahlian.asc`,
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching skills:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Membuat keahlian baru.
     * @param {object} skillData - Contoh: { nama_keahlian: 'ReactJS' }
     */
    async createKeahlian(skillData) {
        try {
            await axios.post(
                `${API_BASE_URL}/keahlian`,
                skillData,
                { headers: { ...headers, 'Prefer': 'return=minimal' } }
            );
            return { success: true };
        } catch (error) {
            console.error("Error creating skill:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Mengubah nama keahlian yang ada.
     * @param {number} id - ID keahlian.
     * @param {object} skillData - Contoh: { nama_keahlian: 'React.js' }
     */
    async updateKeahlian(id, skillData) {
        try {
            await axios.patch(
                `${API_BASE_URL}/keahlian?keahlian_id=eq.${id}`,
                skillData,
                { headers: { ...headers, 'Prefer': 'return=minimal' } }
            );
            return { success: true };
        } catch (error) {
            console.error("Error updating skill:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },

    /**
     * Menghapus sebuah keahlian.
     * @param {number} id - ID keahlian.
     */
    async deleteKeahlian(id) {
        try {
            await axios.delete(`${API_BASE_URL}/keahlian?keahlian_id=eq.${id}`, { headers });
        } catch (error) {
            console.error("Error deleting skill:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }
};
