import './assets/tailwind.css';
import { Routes, Route } from 'react-router-dom';
// import { Suspense } from 'react'; // Suspense bisa diaktifkan jika menggunakan React.lazy
import React from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Index from './pages/Index';
import JobSearchWizard from './pages/JobSearchWizard'; // Halaman wizard preferensi
import JobSearchResultsPage from './pages/JobSearchResultsPage'; // Halaman hasil pencarian
import CompanyRegistrationPage from './pages/CompanyRegistrationPage'; // Halaman pendaftaran perusahaan
import JobDetail from './pages/JobDetail';


// Contoh jika menggunakan React.lazy untuk halaman lain:
// const AboutPage = React.lazy(() => import("./pages/AboutPage"));
// const JobDetailsPage = React.lazy(() => import("./pages/JobDetailsPage"));

// Jika Anda memiliki komponen Loading:
// import Loading from './components/Loading';

function App() {
  return (
    // <Suspense fallback={<Loading />}> {/* Aktifkan Suspense jika ada React.lazy */}
    <Routes>
      {/* Rute yang menggunakan MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} />
        <Route path="/cari-lowongan-wizard" element={<JobSearchWizard />} />
        <Route path="/lowongan/hasil" element={<JobSearchResultsPage />} />
        <Route path="/lowongan/:id" element={<JobDetail />} />
        {/* <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} /> */}
        {/* Tambahkan rute lain yang menggunakan MainLayout di sini */}
        {/*
        <Route path="/tentang-kami" element={<AboutPage />} />
        <Route path="/lowongan/:jobId" element={<JobDetailsPage />} />
        */}
      </Route>

      {/* Rute lain yang mungkin tidak menggunakan MainLayout (misalnya halaman login khusus) */}
      {/* <Route path="/login" element={<LoginPage />} /> 
      */}
    </Routes>
    // </Suspense>
  );
}

export default App;