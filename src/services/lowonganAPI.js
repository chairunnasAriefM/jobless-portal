// src/services/lowonganAPI.js

// Impor klien supabase yang sudah kita buat di src/lib/supabaseClient.js
import { supabase } from '../lib/supabaseClient';

// Tentukan jumlah data yang akan ditampilkan per halaman untuk paginasi
const ITEMS_PER_PAGE = 5;

/**
 * lowonganAPI adalah objek yang berisi semua fungsi untuk berinteraksi 
 * dengan data lowongan pekerjaan di Supabase.
 */
export const lowonganAPI = {

    /**
     * Mengambil daftar lowongan dengan filter, sorting, dan pagination yang dinamis.
     * Fungsi ini adalah inti dari halaman pencarian dan homepage.
     * @param {object} filters - Objek berisi filter seperti searchTerm, jobType, limit, dll.
     * @param {number} page - Nomor halaman saat ini untuk pagination.
     * @returns {Promise<{data: Array, count: number}>} - Sebuah objek berisi array data dan total data yang cocok.
     */
    async fetchLowongan(filters = {}, page = 1) {
        const { searchTerm, searchLocation, jobType, sortBy, limit } = filters;

        // ================== LOGIKA BARU DIMULAI DI SINI ==================

        let companyIds = []; // Siapkan array untuk menampung ID perusahaan yang cocok

        // LANGKAH A: Jika ada searchTerm, cari dulu ID perusahaan yang cocok
        if (searchTerm) {
            const { data: companies, error: companyError } = await supabase
                .from('perusahaan')
                .select('perusahaan_id')
                .ilike('nama_perusahaan', `%${searchTerm}%`);

            if (companyError) {
                console.error("Gagal mencari perusahaan:", companyError);
            } else if (companies && companies.length > 0) {
                companyIds = companies.map(c => c.perusahaan_id);
            }
        }

        // LANGKAH B: Bangun query utama ke tabel lowongan_kerja
        let query = supabase
            .from('lowongan_kerja')
            .select(`
        lowongan_id, judul, lokasi, deskripsi, tanggal_diposting,
        gaji_min, gaji_max,
        perusahaan (nama_perusahaan),
        tipe_pekerjaan (nama_tipe),
        tipe_pekerjaan_id
      `, { count: 'exact' });

        // Terapkan filter searchTerm dengan logika OR yang sudah diperbaiki
        if (searchTerm) {
            const orConditions = [
                `judul.ilike.%${searchTerm}%`, // Kondisi 1: judul cocok
            ];

            // Hanya tambahkan kondisi ID perusahaan jika ada ID yang ditemukan
            if (companyIds.length > 0) {
                orConditions.push(`perusahaan_id.in.(${companyIds.join(',')})`); // Kondisi 2: perusahaan_id cocok
            }

            query = query.or(orConditions.join(','));
        }

        // ================== LOGIKA BARU SELESAI ==================


        // Filter
        if (searchLocation) {
            query = query.ilike('lokasi', `%${searchLocation}%`);
        }
        if (jobType && jobType !== '0') {
            query = query.eq('tipe_pekerjaan_id', jobType);
        }

        // Sorting
        if (sortBy === 'date_asc') {
            query = query.order('tanggal_diposting', { ascending: true });
        } else {
            query = query.order('tanggal_diposting', { ascending: false });
        }

        // Pagination
        if (limit) {
            query = query.limit(limit);
        } else {
            const offset = (page - 1) * ITEMS_PER_PAGE;
            query = query.range(offset, offset + ITEMS_PER_PAGE - 1);
        }

        // Eksekusi dan kembalikan hasil
        const { data, error, count } = await query;
        if (error) {
            console.error("Supabase fetch error:", error);
            throw new Error("Gagal mengambil data lowongan.");
        }
        return { data, count };
    },

    /**
     * Mengambil detail satu lowongan pekerjaan berdasarkan ID-nya.
     * @param {string|number} id - ID dari lowongan yang akan diambil.
     * @returns {Promise<object|null>} - Sebuah objek lowongan atau null jika tidak ditemukan.
     */
    async fetchLowonganById(id) {
        if (!id) return null;
        const { data, error } = await supabase
            .from('lowongan_kerja')
            .select('*, perusahaan(*), tipe_pekerjaan(*), keahlian(*)') // Ambil data keahlian terkait
            .eq('lowongan_id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // BARU: Mengambil semua keahlian untuk dropdown
    async getAllKeahlian() {
        const { data, error } = await supabase.from('keahlian').select('keahlian_id, nama_keahlian');
        if (error) throw error;
        return data;
    },

    // BARU: Satu fungsi untuk Create & Update lowongan beserta keahliannya
    async saveLowongan(jobData, skillIds) {
        const { data, error } = await supabase.rpc('create_or_update_lowongan', {
            job_payload: jobData,
            skill_ids: skillIds
        });

        if (error) throw error;
        return data;
    },

    /**
     * (Contoh) Fungsi untuk membuat lowongan baru.
     * @param {object} jobData - Objek berisi data lowongan baru.
     */
    async createLowongan(jobData) {
        const { data, error } = await supabase
            .from('lowongan_kerja')
            .insert([jobData]) // data harus dalam bentuk array
            .select()
            .single();

        if (error) {
            console.error("Supabase create error:", error);
            throw new Error("Gagal membuat lowongan baru.");
        }

        return data;
    },

    /**
     * (Contoh) Fungsi untuk menghapus lowongan.
     * @param {string|number} id - ID lowongan yang akan dihapus.
     */
    async deleteLowongan(id) {
        const { error } = await supabase
            .from('lowongan_kerja')
            .delete()
            .eq('lowongan_id', id);

        if (error) {
            console.error("Supabase delete error:", error);
            throw new Error("Gagal menghapus lowongan.");
        }

        return { message: "Lowongan berhasil dihapus" };
    },

    /**
   * Mengambil semua lowongan milik satu perusahaan tertentu
   * beserta jumlah pelamarnya. Ini untuk halaman dasbor.
   * @param {number} perusahaanId - ID dari perusahaan yang sedang login.
   * @returns {Promise<Array>} - Sebuah array berisi data lowongan.
   */
    async fetchLowonganByPerusahaan(perusahaanId) {
        // Pastikan ada ID perusahaan sebelum menjalankan query
        if (!perusahaanId) {
            console.warn("fetchLowonganByPerusahaan dipanggil tanpa perusahaanId.");
            return [];
        }

        // Query untuk mengambil data lowongan dan menghitung pelamar (kandidat)
        const { data, error } = await supabase
            .from('lowongan_kerja')
            .select(`
        lowongan_id,
        judul,
        lokasi,
        status_aktif,
        kandidat:lamaran(count) 
      `)
            .eq('perusahaan_id', perusahaanId)
            .order('tanggal_diposting', { ascending: false });

        if (error) {
            console.error("Supabase error fetching jobs for company:", error);
            throw new Error("Gagal mengambil data lowongan milik perusahaan.");
        }

        return data;
    },
};