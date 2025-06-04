// src/components/searchResults/JobListings.jsx
import React from 'react';
import JobCard from './JobCard'; // Atau path yang sesuai jika JobCard di folder searchResults
import { Filter as FilterIcon, Loader2 } from 'lucide-react';

const JobListings = ({ 
    jobs, 
    isLoading, 
    error, 
    sortBy, 
    setSortBy, 
    onApplySort, // Fungsi yang dipanggil saat sort berubah dan perlu apply filter
    resetAllFilters, // Fungsi untuk mereset filter dari pesan "tidak ada hasil"
}) => {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="mt-4 text-slate-600">Memuat data lowongan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FilterIcon size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600 text-lg">{error}</p>
        <p className="text-slate-500 text-sm mt-2">Mohon maaf atas ketidaknyamanannya.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">
          {jobs.length} Lowongan Ditemukan
        </h2>
        <div className="flex items-center text-sm w-full sm:w-auto">
          <label htmlFor="sortBy" className="mr-2 text-slate-600 whitespace-nowrap">Urutkan:</label>
          <select 
              id="sortBy" 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                if (onApplySort) onApplySort(); // Panggil onApplySort jika ada
              }}
              className="w-full sm:w-auto px-2 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white appearance-none text-xs">
            <option value="relevance">Relevansi</option>
            <option value="date_desc">Tanggal (Terbaru)</option>
            <option value="date_asc">Tanggal (Terlama)</option>
          </select>
        </div>
      </div>
      {jobs.length > 0 ? (
          jobs.map(job => <JobCard key={job.id} job={job} />)
      ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
              <FilterIcon size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 text-lg">Oops! Tidak ada lowongan yang sesuai.</p>
              <p className="text-slate-500 text-sm mt-2">Coba ubah kata kunci atau filter pencarian Anda.</p>
              {resetAllFilters && (
                <button onClick={resetAllFilters} className="mt-4 py-2 px-4 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">
                    Reset Semua Filter
                </button>
              )}
          </div>
      )}
      {/* TODO: Pagination */}
    </div>
  );
};

export default JobListings;