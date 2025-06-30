import { supabase } from '../../lib/supabaseClient'; // Pastikan path ini benar

export const DashboardAPI = {
    /**
     * Mengambil semua data statistik untuk dasbor admin dalam satu panggilan.
     */
    async fetchDashboardStats() {
        try {
            // Memanggil function 'get_admin_dashboard_stats' via RPC
            const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error.message);
            throw error;
        }
    }
};
