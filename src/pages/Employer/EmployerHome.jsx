// src/pages/Employer/EmployerHome.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertTriangle, ChevronDown } from "lucide-react";
import EmployerDashboard from "../../components/dashboard/perusahaan/EmployerDashboard";

const EmployerHome = () => {
  return (
    <div className="bg-slate-50 ">
      <EmployerDashboard />
    </div>
  );
};

export default EmployerHome;
