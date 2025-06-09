import axios from 'axios'

const API_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1/lowongan_kerja"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const lowonganAPI = {

    async fetchLowongan(filters = {}) {
        const { searchTerm, searchLocation, jobType, sortBy } = filters;

        // Query dasar untuk mengambil data dan relasinya
        let query = 'select=lowongan_id,judul,lokasi,tanggal_diposting,perusahaan(nama_perusahaan),tipe_pekerjaan(nama_tipe)';

        // Filter Pencarian (kata kunci) - Mencari di judul DAN nama perusahaan
        if (searchTerm) {
            query += `&or=(judul.ilike.%${searchTerm}%,perusahaan.nama_perusahaan.ilike.%${searchTerm}%)`;
        }

        // Filter Lokasi
        if (searchLocation) {
            query += `&lokasi.ilike.%${searchLocation}%`;
        }

        // Filter Tipe Pekerjaan
        if (jobType && jobType !== 'Semua') {
            query += `&tipe_pekerjaan.nama_tipe=eq.${jobType}`;
        }

        // Menambahkan filter lain di sini jika ada (experience, education, dll)
        // Contoh:
        // if (filters.experienceLevel && filters.experienceLevel !== 'Semua') {
        //   query += `&experience_level=eq.${filters.experienceLevel}`;
        // }

        // Logika Pengurutan (Sort)
        if (sortBy === 'date_desc') {
            query += '&order=tanggal_diposting.desc';
        } else {
            // Default sort (bisa berdasarkan relevansi atau tanggal posting)
            query += '&order=tanggal_diposting.desc';
        }

        const response = await axios.get(`${API_URL}?${query}`, { headers });
        return response.data;
    },

    async fetchLowonganById(id) {
        if (!id) return null;

        // Query untuk mengambil semua kolom dari lowongan dan data relasinya
        const selectQuery = 'select=*,perusahaan(*),tipe_pekerjaan(*)';

        // Header khusus untuk meminta Supabase mengembalikan satu objek, bukan array
        const singleObjectHeader = {
            ...headers,
            Accept: 'application/vnd.pgrst.object+json'
        };

        const response = await axios.get(
            `${API_URL}?lowongan_id=eq.${id}&${selectQuery}`,
            { headers: singleObjectHeader }
        );

        return response.data;
    },


    async createLowongan(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    async deleteLowongan(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    }



}