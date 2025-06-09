// src/pages/JobSearchResultsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown, Loader2, Filter as FilterIcon } from 'lucide-react';

// Impor API service kita
import { lowonganAPI } from '../services/lowonganAPI';

import FilterBar from '../components/searchResults/FilterBar';
import JobListings from '../components/searchResults/JobListings';
import ResultsSidebar from '../components/searchResults/ResultsSidebar';
import FilterModal from '../components/searchResults/FilterModal';

const JobSearchResultsPage = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // STATE MANAGEMENT
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk semua filter
    const [searchTerm, setSearchTerm] = useState(searchParams.get('kataKunci') || '');
    const [searchLocation, setSearchLocation] = useState(searchParams.get('lokasi') || '');
    const [activeFilters, setActiveFilters] = useState({
        jobType: searchParams.get('tipePekerjaan') || 'Semua',
        // Tambahkan filter lain dari URL jika ada
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const mainFilterOptions = {
        jobType: ['Semua', 'Penuh Waktu', 'Paruh Waktu', 'Kontrak', 'Magang', 'Lepas'],
        // ... filter options lainnya
    };

    // FUNGSI UTAMA UNTUK FETCH DATA
    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const currentFilters = {
            searchTerm,
            searchLocation,
            jobType: activeFilters.jobType,
            sortBy,
        };

        try {
            const data = await lowonganAPI.fetchLowongan(currentFilters);
            setJobs(data);
        } catch (err) {
            setError("Gagal memuat data lowongan. Periksa koneksi Anda.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, searchLocation, activeFilters, sortBy]);


    // EFFECT HOOKS
    // Effect ini berjalan hanya sekali saat halaman pertama kali dibuka,
    // untuk mengambil data berdasarkan parameter URL awal.
    useEffect(() => {
        fetchJobs();
    }, []); // <-- Dependency array kosong

    // Effect ini untuk menerapkan filter secara 'live' saat pengguna mengubahnya.
    // Menggunakan debounce untuk input teks agar tidak memanggil API di setiap ketikan.
    useEffect(() => {
        const handler = setTimeout(() => {
            // Update URL query params agar bisa di-bookmark/share
            setSearchParams({
                kataKunci: searchTerm,
                lokasi: searchLocation,
                tipePekerjaan: activeFilters.jobType,
            }, { replace: true });

            fetchJobs();
        }, 500); // Debounce 500ms

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, searchLocation, activeFilters, sortBy, fetchJobs, setSearchParams]);

    // HANDLER FUNGSI
    const handleFilterChange = (filterName, value) => {
        setActiveFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const resetAllFilters = () => {
        setSearchTerm('');
        setSearchLocation('');
        setActiveFilters({ jobType: 'Semua' });
        setSortBy('relevance');
        setIsFilterModalOpen(false);
    };

    // RENDER LOGIC
    if (isLoading && jobs.length === 0) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-slate-50 p-4">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                <p className="mt-4 text-slate-600">Memuat data lowongan...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <FilterIcon size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 py-6 sm:py-8 min-h-screen">
            <div className="container mx-auto px-4">
                <nav className="text-sm mb-4 text-slate-600" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex items-center">
                        <li className="flex items-center">
                            <Link to="/" className="hover:text-orange-500">Beranda</Link>
                            <ChevronDown size={14} className="mx-1 transform -rotate-90" />
                        </li>
                        <li className="flex items-center"><span className="text-slate-500">Hasil Pencarian</span></li>
                    </ol>
                </nav>

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchLocation={searchLocation}
                    setSearchLocation={setSearchLocation}
                    activeFilters={activeFilters}
                    handleFilterChange={handleFilterChange}
                    mainFilterOptions={mainFilterOptions}
                    onOpenFilterModal={() => setIsFilterModalOpen(true)}
                />

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6">
                    <div className="lg:w-2/3 xl:w-3/4">
                        <JobListings
                            jobs={jobs}
                            isLoading={isLoading}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            resetAllFilters={resetAllFilters}
                        />
                    </div>
                    <ResultsSidebar />
                </div>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={activeFilters}
                setFilters={setActiveFilters}
                resetFilters={resetAllFilters}
            />
        </div>
    );
};

export default JobSearchResultsPage;