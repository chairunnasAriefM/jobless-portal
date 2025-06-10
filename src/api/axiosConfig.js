// src/api/axiosConfig.js

import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

// Interceptor untuk Request (Tidak perlu diubah)
axios.interceptors.request.use(
    (config) => {
        NProgress.start();
        return config;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

// ====== UBAH BAGIAN DI BAWAH INI ======

// Interceptor untuk Response
axios.interceptors.response.use(
    (response) => {
        // Tambahkan jeda waktu sebelum menghentikan progress bar
        setTimeout(() => {
            NProgress.done();
        }, 500); // <-- Ubah angka ini (dalam milidetik) untuk mengatur jeda
        return response;
    },
    (error) => {
        // Lakukan hal yang sama untuk error
        setTimeout(() => {
            NProgress.done();
        }, 500);
        return Promise.reject(error);
    }
);

export default axios;