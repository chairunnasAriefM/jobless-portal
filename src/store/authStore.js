// src/store/authStore.js
import { create } from 'zustand';

// Fungsi untuk mengambil data awal dari localStorage
const getInitialUser = () => {
    const storedUserSession = localStorage.getItem('manual_user_session');
    if (storedUserSession) {
        try {
            return JSON.parse(storedUserSession);
        } catch (e) {
            localStorage.removeItem('manual_user_session');
            return null;
        }
    }
    return null;
};

const useAuthStore = create((set) => ({
    // State awal diambil dari localStorage
    user: getInitialUser(),
    isLoading: false,

    // Aksi untuk login: simpan ke state DAN ke localStorage
    login: (userData) => {
        localStorage.setItem('manual_user_session', JSON.stringify(userData));
        set({ user: userData });
    },

    // Aksi untuk logout: hapus dari state DAN dari localStorage
    logout: () => {
        localStorage.removeItem('manual_user_session');
        set({ user: null });
    },
}));

export default useAuthStore;