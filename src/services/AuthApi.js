// src/services/authAPI.js
import { supabase } from '../lib/supabaseClient';

export const authAPI = {

    /**
     * @param {object} formData - Data dari form pendaftaran job seeker.
     */
    async registerJobSeeker(formData) {
        const { error } = await supabase.rpc('register_job_seeker', {
            user_email: formData.email,
            user_password: formData.password,
            user_full_name: `${formData.firstName} ${formData.lastName}`
        });

        if (error) {
            throw error;
        }

        return { success: true, message: 'Pendaftaran berhasil! Silakan cek email Anda.' };
    }
};