// src/components/searchResults/FilterBar.jsx
import React from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({
  searchTerm, setSearchTerm, searchLocation, setSearchLocation,
  activeFilters, handleFilterChange, mainFilterOptions,
  onSearchSubmit, onOpenFilterModal, onApplyMainFilters,
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        <div className="lg:col-span-4">
          <label htmlFor="searchTerm" className="block text-xs font-medium text-slate-600 mb-1">Kata Kunci</label>
          <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18}/><input type="text" id="searchTerm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Posisi, Perusahaan" className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" /></div>
        </div>
        <div className="lg:col-span-3">
          <label htmlFor="searchLocation" className="block text-xs font-medium text-slate-600 mb-1">Lokasi</label>
          <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18}/><input type="text" id="searchLocation" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="Kota atau Provinsi" className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" /></div>
        </div>
        <div className="lg:col-span-2 sm:col-span-1">
          <button type="submit" className="w-full bg-orange-500 text-white py-2.5 px-4 rounded-md hover:bg-orange-600 transition duration-150 text-sm font-semibold flex items-center justify-center h-[42px]"><Search size={18} className="mr-0 sm:mr-2"/> <span className="hidden sm:inline">Cari</span></button>
        </div>
        <div className="lg:col-span-3 sm:col-span-1">
           <button type="button" onClick={onOpenFilterModal} className="w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-md hover:bg-slate-200 transition duration-150 text-sm font-semibold border border-slate-300 flex items-center justify-center h-[42px]"><SlidersHorizontal size={16} className="mr-0 sm:mr-2"/> <span className="hidden sm:inline">Filter Lainnya</span></button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-slate-200">
        {Object.entries(mainFilterOptions).map(([key, options]) => (
            <div key={key}>
                <label htmlFor={`filter-${key}`} className="block text-xs font-medium text-slate-600 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').replace('Level', ' Tingkat').replace('Type', ' Tipe').replace('location Tipe', 'Tipe Lokasi')}</label>
                <select id={`filter-${key}`} name={key} value={activeFilters[key]} onChange={(e) => handleFilterChange(key, e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm bg-white appearance-none">
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        ))}
      </div>
       <div className="mt-4 pt-4 border-t border-slate-200 text-right">
            <button type="button" onClick={onApplyMainFilters} className="py-2.5 px-5 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600">Terapkan Filter Bar</button>
        </div>
    </form>
  );
};
export default FilterBar;