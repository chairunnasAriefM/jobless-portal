import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
};

export const lowonganAPI = {
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

    async fetchLowongan({ limit = 6 } = {}) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/lowongan_kerja?select=*,perusahaan(nama_perusahaan,logo_perusahaan),tipe_pekerjaan(nama_tipe)&order=tanggal_diposting.desc&limit=${limit}`,
                { headers }
            );


            return response.data.map(job => ({
                ...job,
                nama_perusahaan: job.perusahaan?.nama_perusahaan
            }));
        } catch (error) {
            console.error("Error fetching latest job listings:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },



    async fetchLowonganByPerusahaan(id) {
        try {
            const selectQuery = '*,perusahaan(nama_perusahaan),kandidat:lamaran(count)';

            const response = await axios.get(
                `${API_BASE_URL}/lowongan_kerja?perusahaan_id=eq.${id}&select=${selectQuery}&order=tanggal_diposting.desc`,
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
            const selectQuery = '*,perusahaan(*),tipe_pekerjaan(nama_tipe),keahlian(*)';

            const response = await axios.get(
                `${API_BASE_URL}/lowongan_kerja?lowongan_id=eq.${id}&select=${selectQuery}`,
                // Meminta Supabase mengembalikan satu objek, bukan array
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
    async saveLowongan(jobData, skillIds = []) {
        try {
            const isEdit = !!jobData.lowongan_id;

            const payload = {
                judul: jobData.judul,
                lokasi: jobData.lokasi,
                status_aktif: jobData.status_aktif,
                deskripsi: jobData.deskripsi,
                kualifikasi: jobData.kualifikasi,
                tipe_pekerjaan_id: jobData.tipe_pekerjaan_id,
                gaji_min: jobData.gaji_min,
                gaji_max: jobData.gaji_max,
                perusahaan_id: jobData.perusahaan_id,
            };

            let lowonganId = jobData.lowongan_id;

            if (isEdit) {
                await axios.patch(
                    `${API_BASE_URL}/lowongan_kerja?lowongan_id=eq.${lowonganId}`,
                    payload,
                    {
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                            Prefer: 'return=minimal',
                        },
                    }
                );
            } else {
                const res = await axios.post(`${API_BASE_URL}/lowongan_kerja`, payload, {
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation',
                    },
                });
                lowonganId = res.data[0].lowongan_id;
            }

            // Hapus keahlian lama (jika edit)
            if (isEdit) {
                await axios.delete(
                    `${API_BASE_URL}/keahlian_lowongan?lowongan_id=eq.${lowonganId}`,
                    { headers }
                );
            }

            // Tambah keahlian baru
            if (skillIds.length > 0) {
                const insertPayload = skillIds.map(keahlian_id => ({
                    lowongan_id: lowonganId,
                    keahlian_id,
                }));

                await axios.post(`${API_BASE_URL}/keahlian_lowongan`, insertPayload, {
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                        Prefer: 'return=minimal',
                    },
                });
            }

            return { success: true };
        } catch (error) {
            console.error("Error saving job listing:", error.response?.data || error.message);
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
    },

    // seperti namanya
    async getAllKeahlian() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/keahlian?select=*`,
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

    // seperti namanya 
    async searchLowongan(filters = {}, page = 1) {
        const queryParts = [
            `select=*,perusahaan(nama_perusahaan),tipe_pekerjaan(nama_tipe)`,

            // Filter judul 
            filters.searchTerm
                ? `judul=ilike.*${encodeURIComponent(filters.searchTerm)}*`
                : '',

            // Lokasi
            filters.searchLocation
                ? `lokasi=ilike.*${encodeURIComponent(filters.searchLocation)}*`
                : '',

            // Tipe pekerjaan
            filters.jobType && filters.jobType !== '0'
                ? `tipe_pekerjaan_id=eq.${filters.jobType}`
                : '',

            // Rentang gaji (jika lengkap)
            (filters.gajiMin && filters.gajiMax)
                ? `and=(gaji_min.gte.${filters.gajiMin},gaji_max.lte.${filters.gajiMax})`
                : '',

            `order=tanggal_diposting.desc`,
        ].filter(Boolean);

        const query = queryParts.join('&');

        try {
            const response = await axios.get(
                `${API_BASE_URL}/lowongan_kerja?${query}`,
                {
                    headers: {
                        ...headers,
                        Prefer: 'count=exact'
                    }
                }
            );

            const contentRange = response.headers['content-range'];
            const count = contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;

            return {
                data: response.data,
                count,
                error: null
            };
        } catch (error) {
            console.error("Error fetching filtered jobs:", error.response?.data || error.message);
            return { data: [], count: 0, error };
        }
    }



};
