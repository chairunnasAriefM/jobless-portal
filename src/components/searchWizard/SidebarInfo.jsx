// src/components/searchWizard/SidebarInfo.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';

const SidebarInfo = ({ title, children, className = "" }) => (
    <div className={`w-full md:w-1/3 lg:w-1/4 p-6 bg-slate-50 rounded-lg shadow-md mt-6 md:mt-0 ${className}`}>
        <div className="flex items-center mb-3">
            <Sparkles size={20} className="text-orange-500 mr-2 flex-shrink-0" />
            <h4 className="font-semibold text-slate-700">{title}</h4>
        </div>
        <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            {children}
        </div>
    </div>
);

export default SidebarInfo;