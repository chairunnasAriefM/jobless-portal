// src/App.jsx

import "./api/axiosConfig";
import "./assets/tailwind.css";
import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react"; // Impor Suspense dan lazy
import { Loader2 } from "lucide-react";

import ScrollToTop from "./components/ScrollToTop";

// Layouts
import MainLayout from "./layouts/MainLayout";
import EmployerDashboardLayout from "./layouts/EmployerDashboardLayout";

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
  import("./pages/Employer/CompanyRegistrationPage")
);
const JobDetail = lazy(() => import("./pages/JobDetail"));

// pencari kerja
const JobSeekerRegistrationPage = lazy(() => import("./pages/JobSeeker/Auth/JobSeekerRegister"));

// perusahaan
const EmployerHome = lazy(() => import("./pages/Employer/EmployerHome"));
import EmployerLoginPage from "./pages/Employer/EmployerLoginPage";
import ProfilPerusahaanPage from "./pages/Employer/ProfilPerusahaanPage";
import ManageJobsPage from "./pages/Employer/ManageJobsPage";
import JobFormPage from './pages/Employer/JobFormPage';


import NotFoundPage from './pages/NotFoundPage';

// auth
const UnifiedLoginPage = lazy(() => import("./pages/UnifiedLoginPage"));

// satpam
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';


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
          {/* guess */}
          <Route path="/" element={<Index />} />
          <Route path="/cari-lowongan-wizard" element={<JobSearchWizard />} />
          <Route path="/lowongan" element={<JobSearchResultsPage />} />
          <Route path="/lowongan/:id" element={<JobDetail />} />
          <Route path="/EmployerHome" element={<EmployerHome />} />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login-perusahaan" element={<EmployerLoginPage />} />
          <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} />
          <Route path="/daftar-pencariKerja" element={<JobSeekerRegistrationPage />} />
        </Route>

        <Route path="/login" element={<UnifiedLoginPage />} />

        {/* Rute Dasbor Perusahaan */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/perusahaan" element={<EmployerDashboardLayout />}>
            <Route index element={<EmployerHome />} />
            <Route path="profil" element={<ProfilPerusahaanPage />} />
            <Route path="lowongan" element={<ManageJobsPage />} />
            <Route path="lowongan/baru" element={<JobFormPage />} />
            <Route path="lowongan/edit/:id" element={<JobFormPage />} />
          </Route>
        </Route>



        <Route path="*" element={<NotFoundPage />} />

        {/* Rute lain bisa ditambahkan di sini */}
      </Routes>
    </Suspense>
  );
}

export default App;
