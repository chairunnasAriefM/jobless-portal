// src/components/searchWizard/SelectablePill.jsx
import React from 'react';
import { CheckSquare } from 'lucide-react';

const SelectablePill = ({ label, isSelected, onClick, className = "" }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400
                ${isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-700 border-slate-300 hover:border-orange-400 hover:text-orange-500'}
                ${className}`}
    >
        {isSelected && <CheckSquare size={16} className="inline mr-2" />}
        {label}
    </button>
);

export default SelectablePill;