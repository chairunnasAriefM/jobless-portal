// src/components/searchResults/FilterBar.jsx
import React from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal } from 'lucide-react';

// PERBAIKAN 1: Terima props 'filters' dan 'setFilters'
const FilterBar = ({
  filters,
  setFilters,
  mainFilterOptions,
  onSearchSubmit,
  onOpenFilterModal,
}) => {

  // PERBAIKAN 2: Buat satu handler untuk semua perubahan input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    // onSearchSubmit akan dipanggil saat tombol "Cari" ditekan
    <form onSubmit={onSearchSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

        {/* PERBAIKAN 3: Sesuaikan input Kata Kunci */}
        <div className="lg:col-span-4">
          <label htmlFor="searchTerm" className="block text-xs font-medium text-slate-600 mb-1">Kata Kunci</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              id="searchTerm"
              name="searchTerm" // Tambahkan 'name' agar sesuai dengan state
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Posisi, Perusahaan"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
        </div>

        {/* PERBAIKAN 4: Sesuaikan input Lokasi */}
        <div className="lg:col-span-3">
          <label htmlFor="searchLocation" className="block text-xs font-medium text-slate-600 mb-1">Lokasi</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              id="searchLocation"
              name="searchLocation" // Tambahkan 'name'
              value={filters.searchLocation}
              onChange={handleFilterChange}
              placeholder="Kota atau Provinsi"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Tombol Cari sekarang bertipe 'submit' */}
        <div className="lg:col-span-2 sm:col-span-1">
          <button type="submit" className="w-full bg-orange-500 text-white py-2.5 px-4 rounded-md hover:bg-orange-600 transition duration-150 text-sm font-semibold flex items-center justify-center h-[42px]">
            <Search size={18} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Cari</span>
          </button>
        </div>

        <div className="lg:col-span-3 sm:col-span-1">
          <button type="button" onClick={onOpenFilterModal} className="w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-md hover:bg-slate-200 transition duration-150 text-sm font-semibold border border-slate-300 flex items-center justify-center h-[42px]">
            <SlidersHorizontal size={16} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Filter Lainnya</span>
          </button>
        </div>
      </div>

      {/* Dropdown filter di bawah */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-slate-200">
        {Object.entries(mainFilterOptions).map(([key, options]) => (
          <div key={key}>
            <label htmlFor={`filter-${key}`} className="block text-xs font-medium text-slate-600 mb-1 capitalize">
              {key === 'jobType' ? 'Tipe Pekerjaan' : key}
            </label>
            <select
              id={`filter-${key}`}
              name={key}
              value={filters[key]} // Ini sudah benar
              onChange={handleFilterChange} // Ini sudah benar
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm bg-white"
            >
              {/* ====== PERUBAHAN LOGIKA DI SINI ====== */}
              {options.map(opt => (
                // value sekarang menggunakan opt.id
                // teks yang tampil menggunakan opt.name
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </form>
  );
};

export default FilterBar;