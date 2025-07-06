import axios from 'axios';

const API_BASE_URL = "https://egnlohisxwbquhuuktri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmxvaGlzeHdicXVodXVrdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTg3NDUsImV4cCI6MjA2NDkzNDc0NX0.dcWlyT-ROw4AQfDp6-h7ZIsi4EIz5yyeKUr0x2Xxeis";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
};

export const DashboardAPI = {

    async fetchDashboardStats() {
        try {

            const response = await axios.post(
                `${API_BASE_URL}/rpc/get_admin_dashboard_stats`,
                {}, 
                { headers }
            );
            
            return response.data;

        } catch (error) {
            console.error("Error fetching dashboard stats:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }
};
