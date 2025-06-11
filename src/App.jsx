// src/App.jsx

import "./api/axiosConfig";
import "./assets/tailwind.css";
import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react"; // Impor Suspense dan lazy
import { Loader2 } from "lucide-react";

import ScrollToTop from "./components/ScrollToTop";

// Layouts
import MainLayout from "./layouts/MainLayout";

// komponen Loading
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-slate-50">
    <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
  </div>
);

// pages
const Index = lazy(() => import("./pages/Index"));
const JobSearchWizard = lazy(() => import("./pages/JobSearchWizard"));
const JobSearchResultsPage = lazy(() => import("./pages/JobSearchResultsPage"));
const CompanyRegistrationPage = lazy(() =>
  import("./pages/CompanyRegistrationPage")
);
const JobDetail = lazy(() => import("./pages/JobDetail"));

const EmployerHome = lazy(() => import("./pages/Employer/EmployerHome"));

// Contoh jika menggunakan React.lazy untuk halaman lain:
// const AboutPage = React.lazy(() => import("./pages/AboutPage"));
// const JobDetailsPage = React.lazy(() => import("./pages/JobDetailsPage"));

// Jika Anda memiliki komponen Loading:
// import Loading from './components/Loading';

function App() {
  return (
    // <Suspense fallback={<Loading />}> {/* Aktifkan Suspense jika ada React.lazy */}
    // <Routes>
    //   {/* Rute yang menggunakan MainLayout */}
    //   <Route element={<MainLayout />}>
    //     <Route path="/" element={<Index />} />
    //     <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} />
    //     <Route path="/cari-lowongan-wizard" element={<JobSearchWizard />} />
    //     <Route path="/lowongan" element={<JobSearchResultsPage />} />
    //     <Route path="/lowongan/:id" element={<JobDetail />} />
    //     {/* <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} /> */}
    //     {/* Tambahkan rute lain yang menggunakan MainLayout di sini */}
    //     {/*
    //     <Route path="/tentang-kami" element={<AboutPage />} />
    //     <Route path="/lowongan/:jobId" element={<JobDetailsPage />} />
    //     */}
    //   </Route>

    //   {/* Rute lain yang mungkin tidak menggunakan MainLayout (misalnya halaman login khusus) */}
    //   {/* <Route path="/login" element={<LoginPage />} />
    //   */}
    // </Routes>
    // </Suspense>

    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>
        {/* Rute yang menggunakan MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route
            path="/daftar-perusahaan"
            element={<CompanyRegistrationPage />}
          />
          <Route path="/cari-lowongan-wizard" element={<JobSearchWizard />} />
          <Route path="/lowongan" element={<JobSearchResultsPage />} />
          <Route path="/lowongan/:id" element={<JobDetail />} />
          {/* Employer */}
          <Route path="/teshome" element={<EmployerHome />} />
        </Route>

        {/* Rute lain bisa ditambahkan di sini */}
      </Routes>
    </Suspense>
  );
}

export default App;
