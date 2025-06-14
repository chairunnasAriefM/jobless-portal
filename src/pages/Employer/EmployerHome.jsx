// src/pages/Employer/EmployerHome.jsx
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
