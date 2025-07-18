// src/App.jsx

import "./api/axiosConfig";
import "./assets/tailwind.css";

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";

// Layouts
import MainLayout from "./layouts/MainLayout";
import EmployerDashboardLayout from "./layouts/EmployerDashboardLayout";
import JobSeekerDashboardLayout from "./layouts/JobSeekerDashboardLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

// Route Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import EmployerRoute from "./components/auth/EmployerRoute";
import JobSeekerRoute from "./components/auth/JobSeekerRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

// Loading Component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-slate-50">
    <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
  </div>
);

// General Pages
const Index = lazy(() => import("./pages/Index"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const JobSearchWizard = lazy(() => import("./pages/JobSearchWizard"));
const JobSearchResultsPage = lazy(() => import("./pages/JobSearchResultsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Authentication Pages
const UnifiedLoginPage = lazy(() => import("./pages/UnifiedLoginPage"));
const CompanyRegistrationPage = lazy(() => import("./pages/Employer/CompanyRegistrationPage"));
const JobSeekerRegister = lazy(() => import("./pages/JobSeeker/Auth/JobSeekerRegister"));
const AdminLoginPage = lazy(() => import("./pages/Admin/AdminLoginPage"));

// Job Seeker Dashboard
const JobSeekerHome = lazy(() => import("./pages/JobSeeker/Dashboard/JobSeekerHome"));
const JobSeekerProfilePage = lazy(() => import("./pages/JobSeeker/Dashboard/JobSeekerProfilePage"));
const MyApplicationsPage = lazy(() => import("./pages/JobSeeker/Dashboard/MyApplicationsPage"));
const JobSeekerApplicationDetailPage = lazy(() => import("./pages/JobSeeker/Dashboard/ApplicationDetailPage"));

// Employer Dashboard
const EmployerHome = lazy(() => import("./pages/Employer/EmployerHome"));
const ProfilPerusahaanPage = lazy(() => import("./pages/Employer/ProfilPerusahaanPage"));
const ManageJobsPage = lazy(() => import("./pages/Employer/ManageJobsPage"));
const JobFormPage = lazy(() => import("./pages/Employer/JobFormPage"));
const DetailLowongan = lazy(() => import("./pages/Employer/Lowongan/ShowLowonganPage"));
const ManageApplicantsPage = lazy(() => import("./pages/Employer/Lowongan/Lamaran/ManageApplicantsPage"));
const ApplicationDetailPage = lazy(() => import("./pages/Employer/Lowongan/Lamaran/ApplicationDetailPage"));

// Admin Dashboard
const AdminHome = lazy(() => import("./pages/Admin/AdminHome"));
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
        {/* Main Public Layout */}
        <Route element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="/cari-lowongan-wizard" element={<JobSearchWizard />} />
          <Route path="/lowongan" element={<JobSearchResultsPage />} />
          <Route path="/lowongan/:id" element={<JobDetail />} />
        </Route>

        {/* Public Only Pages */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<UnifiedLoginPage />} />
          <Route path="/daftar-perusahaan" element={<CompanyRegistrationPage />} />
          <Route path="/daftar-pencariKerja" element={<JobSeekerRegister />} />
          <Route path="/login-admin" element={<AdminLoginPage />} />
        </Route>

        {/* Job Seeker Dashboard */}
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

        {/* Employer Dashboard */}
        <Route element={<EmployerRoute />}>
          <Route path="/dashboard/perusahaan" element={<EmployerDashboardLayout />}>
            <Route index element={<EmployerHome />} />
            <Route path="profil" element={<ProfilPerusahaanPage />} />
            <Route path="lowongan" element={<ManageJobsPage />} />
            <Route path="lowongan/baru" element={<JobFormPage />} />
            <Route path="lowongan/edit/:id" element={<JobFormPage />} />
            <Route path="lowongan/detail/:id" element={<DetailLowongan />} />
            <Route path="lowongan/:lowonganId/pelamar" element={<ManageApplicantsPage />} />
            <Route path="lamaran-detail/:lamaranId" element={<ApplicationDetailPage />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
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

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
