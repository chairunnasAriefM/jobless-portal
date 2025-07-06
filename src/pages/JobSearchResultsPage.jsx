// src/pages/JobSearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Loader2, Filter as FilterIcon } from 'lucide-react';
import { lowonganAPI } from '../services/lowonganAPI';
import FilterBar from '../components/searchResults/FilterBar';
import JobListings from '../components/searchResults/JobListings';
import ResultsSidebar from '../components/searchResults/ResultsSidebar';
import FilterModal from '../components/searchResults/FilterModal';

const ITEMS_PER_PAGE = 5; // Kita set jumlah item per halaman di sini

const JobSearchResultsPage = () => {

    const mainFilterOptions = {
        jobType: [
            { id: 0, name: 'Semua' },
            { id: 1, name: 'Penuh Waktu' },
            { id: 2, name: 'Paruh Waktu' },
            { id: 3, name: 'Kontrak' },
            { id: 4, name: 'Magang' },
            { id: 5, name: 'Lepas' },
        ],
    };
    const [searchParams, setSearchParams] = useSearchParams();

    // STATE MANAGEMENT
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State untuk pagination
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

    // State untuk semua filter digabung menjadi satu objek agar lebih mudah dikelola
    const [filters, setFilters] = useState({
        searchTerm: searchParams.get('kataKunci') || '',
        searchLocation: searchParams.get('lokasi') || '',
        jobType: searchParams.get('tipePekerjaan') || '0',
        gajiMin: searchParams.get('gajiMin') || '',
        gajiMax: searchParams.get('gajiMax') || '',
        sortBy: 'relevance',
    });


    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // FUNGSI UTAMA UNTUK MENGAMBIL DATA
    // Fungsi ini sekarang dipanggil secara eksplisit oleh event handler (tombol cari / paginasi)
    const runSearch = async (pageToFetch) => {
        setIsLoading(true);
        setError(null);

        // Update URL dengan filter dan halaman saat ini
        setSearchParams({
            kataKunci: filters.searchTerm,
            lokasi: filters.searchLocation,
            tipePekerjaan: filters.jobType,
            gajiMin: filters.gajiMin,
            gajiMax: filters.gajiMax,
            page: pageToFetch,
        }, { replace: true });

        try {

            const { data, count, error: apiError } = await lowonganAPI.searchLowongan(filters, pageToFetch);

            if (apiError) throw apiError;

            setJobs(data || []);
            setTotalCount(count || 0);
            setCurrentPage(pageToFetch);


        } catch (err) {
            setError("Gagal memuat data lowongan. Silakan coba lagi.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Effect ini hanya untuk menjalankan pencarian pertama kali saat halaman dibuka
    useEffect(() => {
        runSearch(currentPage);
    }, []); // <-- Dependency array kosong agar hanya berjalan sekali

    // HANDLER FUNGSI
    const handleFilterChange = (filterGroupName, value) => {
        setFilters(prev => ({ ...prev, [filterGroupName]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Saat tombol cari ditekan, selalu mulai dari halaman 1
        runSearch(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        // Saat pindah halaman, jalankan pencarian untuk halaman baru
        runSearch(newPage);
    }

    const resetAllFilters = () => {
        const newFilters = {
            searchTerm: '',
            searchLocation: '',
            jobType: '0',
            sortBy: 'relevance',
        };
        setFilters(newFilters);
        // Setelah mereset, langsung jalankan pencarian dengan filter kosong
        runSearch(1);
    };

    return (
        <div className="bg-slate-50 pt-20 py-6 sm:py-8 min-h-screen">
            <div className="container mx-auto px-4">
                <nav className="text-sm mb-4 text-slate-600">
                    {/* ... breadcrumb ... */}
                </nav>

                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    mainFilterOptions={mainFilterOptions}
                    onSearchSubmit={handleSearchSubmit}
                    onOpenFilterModal={() => setIsFilterModalOpen(true)}
                />

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6">
                    <div className="lg:w-2/3 xl:w-3/4">
                        {error ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <FilterIcon size={48} className="mx-auto text-red-400 mb-4" />
                                <p className="text-red-600 text-lg">{error}</p>
                            </div>
                        ) : (
                            <JobListings
                                jobs={jobs}
                                isLoading={isLoading}
                                totalCount={totalCount}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                resetAllFilters={resetAllFilters}
                            />
                        )}
                    </div>
                    <ResultsSidebar />
                </div>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFilterChange={handleFilterChange} // Menggunakan onFilterChange
                applyFilters={() => {
                    runSearch(1);
                    setIsFilterModalOpen(false);
                }}
                resetFilters={resetAllFilters}
            />
        </div>
    );
};

export default JobSearchResultsPage;