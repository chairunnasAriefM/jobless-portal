// src/components/searchResults/JobListings.jsx
import React from 'react';
import JobCard from './JobCard'; // Pastikan path JobCard benar
import { Filter as FilterIcon, Loader2 } from 'lucide-react';

const JobListings = ({ jobs, isLoading, sortBy, setSortBy, resetAllFilters }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">
          {/* Menampilkan loading atau jumlah hasil */}
          {isLoading ? 'Mencari...' : `${jobs.length} Lowongan Ditemukan`}
        </h2>
        <div className="flex items-center text-sm w-full sm:w-auto">
          <label htmlFor="sortBy" className="mr-2 text-slate-600 whitespace-nowrap">Urutkan:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white appearance-none text-sm"
          >
            <option value="relevance">Relevansi</option>
            <option value="date_desc">Tanggal (Terbaru)</option>
            <option value="date_asc">Tanggal (Terlama)</option>
          </select>
        </div>
      </div>

      {/* Menampilkan loader saat filter baru diterapkan */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* Menampilkan hasil atau pesan "tidak ditemukan" */}
      {!isLoading && jobs.length > 0 && (
        jobs.map(job => <JobCard key={job.lowongan_id} job={job} />)
      )}

      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <FilterIcon size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 text-lg">Oops! Tidak ada lowongan yang sesuai.</p>
          <p className="text-slate-500 text-sm mt-2">Coba ubah kata kunci atau filter pencarian Anda.</p>
          <button onClick={resetAllFilters} className="mt-4 py-2 px-4 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* TODO: Tambahkan Paginasi di sini jika diperlukan */}
    </div>
  );
};

export default JobListings;