import React from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react'; // DIUBAH: Menambahkan ikon DollarSign

// Komponen FilterBar yang sudah disesuaikan dengan state 'filters'
const FilterBar = ({
  filters,
  setFilters,
  mainFilterOptions,
  onSearchSubmit,
}) => {

  // Satu handler untuk mengelola perubahan pada semua input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    // onSearchSubmit akan dipanggil saat tombol "Cari" ditekan
    <form onSubmit={onSearchSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-slate-200 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

        {/* Input Kata Kunci */}
        <div className="lg:col-span-3">
          <label htmlFor="searchTerm" className="block text-xs font-medium text-slate-600 mb-1">Kata Kunci</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Posisi, Perusahaan"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Input Lokasi */}
        <div className="lg:col-span-3">
          <label htmlFor="searchLocation" className="block text-xs font-medium text-slate-600 mb-1">Lokasi</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              id="searchLocation"
              name="searchLocation"
              value={filters.searchLocation}
              onChange={handleFilterChange}
              placeholder="Kota atau Provinsi"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Input Gaji Minimum */}
        <div className="lg:col-span-2">
          <label htmlFor="gajiMin" className="block text-xs font-medium text-slate-600 mb-1">Gaji Min.</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="number"
              id="gajiMin"
              name="gajiMin"
              value={filters.gajiMin || ''}
              onChange={handleFilterChange}
              placeholder="Contoh: 5000000"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              min="0"
            />
          </div>
        </div>

        {/* Input Gaji Maksimum */}
        <div className="lg:col-span-2">
          <label htmlFor="gajiMax" className="block text-xs font-medium text-slate-600 mb-1">Gaji Maks.</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="number"
              id="gajiMax"
              name="gajiMax"
              value={filters.gajiMax || ''}
              onChange={handleFilterChange}
              placeholder="Contoh: 10000000"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              min="0"
            />
          </div>
        </div>


        {/* Tombol Cari */}
        <div className="lg:col-span-2 sm:col-span-1">
          <button type="submit" className="w-full bg-orange-500 text-white py-2.5 px-4 rounded-md hover:bg-orange-600 transition duration-150 text-sm font-semibold flex items-center justify-center h-[42px]">
            <Search size={18} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Cari</span>
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
              value={filters[key]} // Mengambil nilai dari objek filters
              onChange={handleFilterChange}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm bg-white"
            >
              {options.map(opt => (
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
