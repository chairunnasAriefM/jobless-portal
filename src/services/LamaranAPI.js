import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
};

export const LamaranAPI = {
    /**
     * Pencari kerja mengirim lamaran untuk sebuah lowongan.
     */
    async applyForJob(lowonganId, userId) {
        try {
            const payload = {
                lowongan_id: lowonganId,
                user_id: userId,
                status_lamaran_id: 1 // Default ke 'Menunggu'
            };
            await axios.post(`${API_BASE_URL}/lamaran`, payload, {
                headers: { ...headers, 'Prefer': 'return=minimal' }
            });
            return { success: true, message: 'Lamaran berhasil dikirim!' };
        } catch (error) {
            // Menangani error jika user sudah pernah melamar (unique constraint violation)
            if (error.response && error.response.data?.code === '23505') {
                throw new Error('Anda sudah pernah melamar lowongan ini.');
            }
            console.error("Error applying for job:", error.response?.data || error.message);
            throw new Error("Gagal mengirim lamaran.");
        }
    },

    /**
     * Mengambil riwayat lamaran untuk satu pengguna.
     */
    async getMyApplications(userId) {
        if (!userId) return [];
        try {
            const response = await axios.get(
                `${API_BASE_URL}/lamaran?user_id=eq.${userId}&select=*,lowongan_kerja(*,perusahaan(nama_perusahaan)),status_lamaran(nama_status)&order=tanggal_lamaran.desc`,
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching my applications:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Perusahaan mengambil daftar semua pelamar untuk satu lowongan.
     */
    async getApplicantsByJob(lowonganId) {
        if (!lowonganId) return [];
        try {
 
            const selectQuery = `*,pengguna(nama_lengkap,email,nomor_telepon,profil_pencari_kerja(file_cv)),status_lamaran(nama_status),lowongan_kerja(judul)`;

            const response = await axios.get(
                `${API_BASE_URL}/lamaran?lowongan_id=eq.${lowonganId}&select=${selectQuery}&order=tanggal_lamaran.desc`,
                { headers }
            );
            // Merapikan data agar mudah digunakan
            return response.data.map(app => ({
                ...app,
                nama_lengkap: app.pengguna.nama_lengkap,
                email: app.pengguna.email,
                // PERBAIKAN: Menambahkan nomor_telepon ke objek yang dirapikan
                nomor_telepon: app.pengguna.nomor_telepon,
                file_cv: app.pengguna.profil_pencari_kerja?.file_cv
            }));
        } catch (error) {
            console.error("Error fetching applicants:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Perusahaan mengubah status sebuah lamaran.
     */
    async updateApplicationStatus(lamaranId, newStatusId) {
        try {
            await axios.patch(
                `${API_BASE_URL}/lamaran?lamaran_id=eq.${lamaranId}`,
                { status_lamaran_id: newStatusId },
                { headers: { ...headers, 'Prefer': 'return=minimal' } }
            );
            return { success: true };
        } catch (error) {
            console.error("Error updating status:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Mengambil semua opsi status lamaran dari database.
     */
    async getStatusOptions() {
        try {
            const response = await axios.get(`${API_BASE_URL}/status_lamaran?select=*`, { headers });
            return response.data;
        } catch (error) {
            console.error("Error fetching status options:", error.response?.data || error.message);
            throw error;
        }
    },

    async checkIfApplied(lowonganId, userId) {
        if (!userId || !lowonganId) return false;

        try {
            // Header 'Prefer: count=exact' hanya akan mengembalikan jumlah baris,
            // bukan datanya. Ini sangat cepat dan efisien.
            const response = await axios.get(
                `${API_BASE_URL}/lamaran?user_id=eq.${userId}&lowongan_id=eq.${lowonganId}`,
                {
                    headers: {
                        ...headers,
                        'Prefer': 'count=exact'
                    }
                }
            );

            // Supabase akan mengembalikan jumlah total di header 'content-range'
            // Contoh: "0-4/15" artinya menampilkan 5 baris dari total 15.
            const count = parseInt(response.headers['content-range'].split('/')[1], 10);

            // Jika jumlahnya lebih dari 0, berarti sudah pernah melamar.
            return count > 0;

        } catch (error) {
            console.error("Error checking application status:", error.response?.data || error.message);
            // Anggap belum melamar jika terjadi error
            return false;
        }
    },

    async getApplicationDetails(lamaranId) {
        if (!lamaranId) return null;
        try {
            // Query select yang kompleks untuk mengambil semua data relasi
            const selectQuery = `
                lamaran_id,
                tanggal_lamaran,
                status_lamaran(*),
                lowongan_kerja(*),
                pelamar:pengguna(
                    user_id,
                    nama_lengkap,
                    nomor_telepon,
                    email,
                    profil:profil_pencari_kerja(*),
                    keahlian:keahlian_pencari_kerja(
                        keahlian(keahlian_id, nama_keahlian)
                    )
                )
            `.replace(/\s/g, ''); // Menghapus spasi dan baris baru

            const response = await axios.get(
                `${API_BASE_URL}/lamaran?lamaran_id=eq.${lamaranId}&select=${selectQuery}`,
                { headers: { ...headers, Accept: 'application/vnd.pgrst.object+json' } }
            );

            // Merapikan data agar lebih mudah digunakan di frontend
            const rawData = response.data;
            if (!rawData) return null;

            const formattedData = {
                ...rawData,
                pelamar: {
                    ...rawData.pelamar,
                    // Mengubah format keahlian dari { keahlian: { ... } } menjadi { ... }
                    keahlian: rawData.pelamar.keahlian.map(k => k.keahlian)
                }
            };

            return formattedData;

        } catch (error) {
            console.error("Error fetching application details:", error.response?.data || error.message);
            throw error;
        }
    },
};
