// src/services/perusahaanAPI.js
import { supabase } from '../lib/supabaseClient';

export const perusahaanAPI = {

    /**
     * Mengambil data detail satu perusahaan berdasarkan ID-nya.
     * @param {number} perusahaanId - ID perusahaan.
     */
    async getCompanyById(perusahaanId) {
        const { data, error } = await supabase
            .from('perusahaan')
            .select('*')
            .eq('perusahaan_id', perusahaanId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Mengunggah file logo ke Supabase Storage.
     * @param {File} file - File gambar yang akan diunggah.
     * @param {string} filePath - Path unik untuk file di bucket.
     */
    async uploadCompanyLogo(file, filePath) {
        const { data, error } = await supabase
            .storage
            .from('logo-perusahaan') // Nama bucket Anda
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true, // Timpa file jika sudah ada dengan nama yang sama
            });

        if (error) throw error;
        return data;
    },

    /**
     * Mengambil URL publik dari file yang sudah diunggah.
     * @param {string} filePath - Path file di bucket.
     */
    getCompanyLogoUrl(filePath) {
        const { data } = supabase
            .storage
            .from('logo-perusahaan')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    /**
    * Memperbarui data perusahaan di database.
    * @param {number} perusahaanId - ID perusahaan yang akan diupdate.
    * @param {object} updateData - Objek berisi data yang akan diubah.
    */
    async updateCompany(perusahaanId, updateData) {
        // Pastikan kita punya ID untuk melakukan update
        if (!perusahaanId) throw new Error("ID Perusahaan tidak ditemukan untuk melakukan update.");

        const { data, error } = await supabase
            .from('perusahaan')
            .update(updateData)
            .eq('perusahaan_id', perusahaanId) // <-- Menggunakan ID di sini
            .select()
            .single();

        if (error) {
            // Jika ada error dari Supabase (termasuk error RLS), lemparkan
            throw error;
        }
        return data;
    }
};