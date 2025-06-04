// src/components/searchResults/FilterModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, filters, setFilters, applyFilters, resetFilters }) => {
    if (!isOpen) return null;

    const handleInputChange = (group, value) => {
        setFilters(prev => ({ ...prev, [group]: value }));
    };

    // Definisikan atau terima sebagai props jika dinamis
    const industries = ["Semua", "Kuliner (F&B)", "Retail & Fashion", "Teknologi Informasi", "Pendidikan", "Jasa Keuangan & Akuntansi", "Properti & Real Estate", "Desain & Kreatif", "Manufaktur", "Kesehatan", "Pariwisata & Travel", "Riset & Analisis", "Lainnya"];
    const salaryRanges = ["Semua", "Kurang dari Rp 3jt", "Rp 3jt - Rp 5jt", "Rp 5jt - Rp 8jt", "Rp 8jt - Rp 12jt", "Lebih dari Rp 12jt", "Nego"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">Filter Tambahan</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="modalIndustry" className="block text-sm font-medium text-slate-700 mb-1">Industri</label>
                        <select
                            id="modalIndustry"
                            value={filters.industry || "Semua"}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white appearance-none">
                            {industries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="modalSalary" className="block text-sm font-medium text-slate-700 mb-1">Rentang Gaji</label>
                        <select
                            id="modalSalary"
                            value={filters.salaryRange || "Semua"}
                            onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white appearance-none">
                            {salaryRanges.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    {/* Tambahkan filter lain di sini jika perlu */}
                </div>

                <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                    <button onClick={resetFilters} className="py-2 px-4 text-sm font-medium text-slate-700 bg-slate-100 rounded-md border border-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400">
                        Reset
                    </button>
                    <button onClick={applyFilters} className="py-2 px-4 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600">
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

// Tambahkan keyframes animasi untuk modal di file CSS global (misal src/index.css)
/*
@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-modalShow {
  animation: modalShow 0.3s ease-out forwards;
}
*/

export default FilterModal;