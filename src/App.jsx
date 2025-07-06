// src/App.jsx

import "./api/axiosConfig";
import "./assets/tailwind.css";
import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

import ScrollToTop from "./components/ScrollToTop";

// Layouts
import MainLayout from "./layouts/MainLayout";
import EmployerDashboardLayout from "./layouts/EmployerDashboardLayout";
import JobSeekerDashboardLayout from "./layouts/JobSeekerDashboardLayout";

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
const JobSeekerRegister = lazy(() => import("./pages/JobSeeker/Auth/JobSeekerRegister"));
const JobSeekerHome = lazy(() => import("./pages/JobSeeker/Dashboard/JobSeekerHome"));
const JobSeekerProfilePage = lazy(() => import("./pages/JobSeeker/Dashboard/JobSeekerProfilePage"));
// const JobSeekerLowonganPage = lazy(() => import("./pages/JobSeeker/Dashboard/JobSeekerLowongan"));
const MyApplicationsPage = lazy(() => import("./pages/JobSeeker/Dashboard/MyApplicationsPage"));
const JobSeekerApplicationDetailPage = lazy(() => import("./pages/JobSeeker/Dashboard/ApplicationDetailPage"));

// perusahaan
const EmployerHome = lazy(() => import("./pages/Employer/EmployerHome"));
import EmployerLoginPage from "./pages/Employer/EmployerLoginPage";
import ProfilPerusahaanPage from "./pages/Employer/ProfilPerusahaanPage";
import ManageJobsPage from "./pages/Employer/ManageJobsPage";
import JobFormPage from './pages/Employer/JobFormPage';
const DetailLowongan = lazy(() => import("./pages/Employer/Lowongan/ShowLowonganPage"));
const ApplicationDetailPage = lazy(() => import("./pages/Employer/Lowongan/Lamaran/ApplicationDetailPage"));
const ManageApplicantsPage = lazy(() => import("./pages/Employer/Lowongan/Lamaran/ManageApplicantsPage"));

import NotFoundPage from './pages/NotFoundPage';

// auth
const UnifiedLoginPage = lazy(() => import("./pages/UnifiedLoginPage"));

// satpam
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import EmployerRoute from './components/auth/EmployerRoute';
import JobSeekerRoute from './components/auth/JobSeekerRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';

// Admin Dashboard
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import AdminHome from "./pages/Admin/AdminHome"
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
const Pengguna = lazy(() => import("./pages/Admin/Pengguna/Pengguna"));
const CreatePengguna = lazy(() => import("./pages/Admin/Pengguna/CreatePengguna"));
const EditPengguna = lazy(() => import("./pages/Admin/Pengguna/EditPengguna"));
const ManageLowonganPage = lazy(() => import("./pages/Admin/Lowongan/LowonganPage"));
const EditLowongan = lazy(() => import("./pages/Admin/Lowongan/EditLowongan"));
const ShowLowonganPage = lazy(() => import("./pages/Admin/Lowongan/ShowLowonganPage"));
const ManageKeahlianPage = lazy(() => import("./pages/Admin/Keahlian/KeahlianPage"));


function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/cari-lowongan-wizard" element={<JobSearchWizard />} />
          <Route path="/lowongan" element={<JobSearchResultsPage />} />
          <Route path="/lowongan/:id" element={<JobDetail />} />
          <Route path="/EmployerHome" element={<EmployerHome />} />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login-perusahaan" element={<EmployerLoginPage />} />
          <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} />
          <Route path="/daftar-pencariKerja" element={<JobSeekerRegister />} />
          <Route path="/login-admin" element={<AdminLoginPage />} />
        </Route>

        <Route path="/login" element={<UnifiedLoginPage />} />

        {/* Rute Dasbor Perusahaan */}
        <Route element={<EmployerRoute />}>
          <Route path="/dashboard/perusahaan" element={<EmployerDashboardLayout />}>
            <Route index element={<EmployerHome />} />
            <Route path="profil" element={<ProfilPerusahaanPage />} />
            <Route path="lowongan" element={<ManageJobsPage />} />
            <Route path="lowongan/detail/:id" element={<DetailLowongan />} />
            <Route path="lowongan/baru" element={<JobFormPage />} />
            <Route path="lowongan/edit/:id" element={<JobFormPage />} />
            <Route path="lowongan/:lowonganId/pelamar" element={<ManageApplicantsPage />} />
            <Route path="lamaran-detail/:lamaranId" element={<ApplicationDetailPage />} />
          </Route>
        </Route>

        <Route element={<JobSeekerRoute />}>
          <Route path="/dashboard/pencari-kerja" element={<JobSeekerDashboardLayout />}>
            <Route index element={<JobSeekerHome />} />
            <Route path="edit-profil" element={<JobSeekerProfilePage />} />
            <Route path="profil" element={<JobSeekerProfilePage />} />
            <Route path="lowongan" element={<JobSearchResultsPage />} />
            <Route path="history-lamaran" element={<MyApplicationsPage />} />
            <Route path="lamaran-detail/:id" element={<JobSeekerApplicationDetailPage />} />
          </Route>
        </Route>



        <Route path="*" element={<NotFoundPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="users" element={<Pengguna />} />
            <Route path="users/new" element={<CreatePengguna />} />
            <Route path="users/edit/:id" element={<EditPengguna />} />
            <Route path="lowongan" element={<ManageLowonganPage />} />
            <Route path="lowongan/edit/:id" element={<EditLowongan />} />
            <Route path="lowongan/show/:id" element={<ShowLowonganPage />} />
            <Route path="keahlian" element={<ManageKeahlianPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
