import axios from 'axios'

const API_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1/lowongan_kerja"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const lowonganAPI = {

    async fetchLowongan(limit = null) {
        // PERBAIKAN DI SINI: Gunakan nama tabel huruf kecil
        const selectQuery = 'select=lowongan_id,judul,lokasi,tanggal_diposting,perusahaan(nama_perusahaan),tipe_pekerjaan(nama_tipe)';

        const orderQuery = 'order=tanggal_diposting.desc';
        const limitQuery = limit ? `&limit=${limit}` : '';

        const response = await axios.get(`${API_URL}?${selectQuery}&${orderQuery}${limitQuery}`, { headers })
        return response.data
    },

    async createLowongan(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    async deleteLowongan(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    }



}