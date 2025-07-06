import axios from 'axios';

export async function downloadFileFromURL(url, filename = 'cv.pdf') {
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    } catch (err) {
        console.error("Gagal mengunduh file:", err);
        alert("Gagal mengunduh file. Silakan coba lagi.");
    }
}
