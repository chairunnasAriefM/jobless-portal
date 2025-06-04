// src/pages/JobSearchResultsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Loader2, Filter as FilterIcon } from 'lucide-react';

import FilterBar from '../components/searchResults/FilterBar';
import JobListings from '../components/searchResults/JobListings';
import ResultsSidebar from '../components/searchResults/ResultsSidebar';
import FilterModal from '../components/searchResults/FilterModal';
// JobCard diimpor di dalam JobListings.jsx

const JobSearchResultsPage = () => {
    const locationHook = useLocation();

    const [allJobs, setAllJobs] = useState([]);
    const [displayedJobs, setDisplayedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        locationType: 'Semua', jobType: 'Semua', experienceLevel: 'Semua',
        educationLevel: 'Semua', industry: 'Semua', salaryRange: 'Semua',
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const mainFilterOptions = {
        locationType: ['Semua', '100% Remote', 'Hybrid Remote', 'Kerja di Kantor'], // Sesuaikan dengan nilai data
        jobType: ['Semua', 'Full-Time', 'Part-Time', 'Kontrak', 'Magang', 'Freelance'],
        experienceLevel: ['Semua', "Lulusan Baru / < 1 Thn", "1 - 3 Thn", "3 - 5 Thn", "5+ Tahun"],
        educationLevel: ['Semua', "SMA/SMK Sederajat", "Diploma (D1-D3)", "Sarjana (S1)", "Magister (S2)", "Lainnya"],
    };

    const applyAllFilters = useCallback(() => {
        let filtered = [...allJobs];
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(job => (job.title && job.title.toLowerCase().includes(term)) || (job.company && job.company.toLowerCase().includes(term)) || (job.shortDescription && job.shortDescription.toLowerCase().includes(term)));
        }
        if (searchLocation.trim()) {
            const loc = searchLocation.toLowerCase();
            filtered = filtered.filter(job => job.location && job.location.toLowerCase().includes(loc));
        }
        Object.keys(activeFilters).forEach(key => {
            const filterValue = activeFilters[key];
            if (filterValue && filterValue !== 'Semua') {
                switch (key) {
                    case 'locationType':
                        let targetLocationType = filterValue;
                        if (filterValue === '100% Remote') targetLocationType = 'Remote';
                        else if (filterValue === 'Hybrid Remote') targetLocationType = 'Hybrid';
                        else if (filterValue === 'Kerja di Kantor') targetLocationType = 'Kantor';
                        filtered = filtered.filter(job => job.locationType === targetLocationType);
                        break;
                    case 'jobType': filtered = filtered.filter(job => job.type === filterValue); break;
                    case 'experienceLevel': filtered = filtered.filter(job => job.experienceLevel === filterValue); break;
                    case 'educationLevel': filtered = filtered.filter(job => job.educationLevel === filterValue); break;
                    case 'industry': filtered = filtered.filter(job => job.industry === filterValue); break;
                    case 'salaryRange': /* Implementasi logika filter gaji di sini */ break;
                    default: break;
                }
            }
        });
        // Sort logic (placeholder)
        if (sortBy === 'date_desc') { /* sort by new Date(job.actualDate) desc */ }
        else if (sortBy === 'date_asc') { /* sort by new Date(job.actualDate) asc */ }
        setDisplayedJobs(filtered);
    }, [allJobs, searchTerm, searchLocation, activeFilters, sortBy]);

    useEffect(() => {
        const fetchJobsAndSetInitialFilters = async () => {
            setIsLoading(true); setError(null); let fetchedJobs = [];
            try {
                const response = await axios.get('/mockJobs.json'); // Pastikan path ini benar
                fetchedJobs = response.data; setAllJobs(fetchedJobs);
            } catch (err) { setError("Gagal memuat data lowongan."); setIsLoading(false); return; }

            const queryParams = new URLSearchParams(locationHook.search);
            const initialSearchTerm = queryParams.get('kataKunci') || '';
            const initialSearchLocation = queryParams.get('lokasi') || '';
            const newActiveFilters = { ...activeFilters }; // Salin state filter saat ini

            let wizardLocationType = queryParams.get('tipeLokasi');
            if (wizardLocationType) {
                if (wizardLocationType === 'remote_full') newActiveFilters.locationType = '100% Remote';
                else if (wizardLocationType === 'hybrid') newActiveFilters.locationType = 'Hybrid Remote';
                else if (wizardLocationType === 'office') newActiveFilters.locationType = 'Kerja di Kantor';
                else newActiveFilters.locationType = wizardLocationType; // fallback jika ada nilai lain
            }
            if (queryParams.get('pengalaman')) newActiveFilters.experienceLevel = queryParams.get('pengalaman');
            if (queryParams.get('pendidikan')) newActiveFilters.educationLevel = queryParams.get('pendidikan');
            const categoriesFromQuery = queryParams.getAll('kategori');
            if (categoriesFromQuery.length > 0) newActiveFilters.industry = categoriesFromQuery[0];
            // Map salary from query to salaryRange if needed

            setSearchTerm(initialSearchTerm);
            setSearchLocation(initialSearchLocation);
            setActiveFilters(newActiveFilters);
            // Tidak memanggil applyAllFilters di sini karena akan di-trigger oleh useEffect kedua
            // Langsung filter data yang baru di-fetch dengan filter awal dari URL
            let initiallyFiltered = [...fetchedJobs];
            if (initialSearchTerm.trim()) { /* ... filter by initialSearchTerm ... */
                const term = initialSearchTerm.toLowerCase();
                initiallyFiltered = initiallyFiltered.filter(job => (job.title && job.title.toLowerCase().includes(term)) || (job.company && job.company.toLowerCase().includes(term)));
            }
            if (initialSearchLocation.trim()) { /* ... filter by initialSearchLocation ... */
                const loc = initialSearchLocation.toLowerCase();
                initiallyFiltered = initiallyFiltered.filter(job => job.location && job.location.toLowerCase().includes(loc));
            }
            Object.keys(newActiveFilters).forEach(key => {
                const filterValue = newActiveFilters[key];
                if (filterValue && filterValue !== 'Semua') {
                    // Salin logika switch dari applyAllFilters di sini untuk memfilter 'initiallyFiltered'
                    switch (key) {
                        case 'locationType':
                            let targetLocationType = filterValue;
                            if (filterValue === '100% Remote') targetLocationType = 'Remote';
                            else if (filterValue === 'Hybrid Remote') targetLocationType = 'Hybrid';
                            else if (filterValue === 'Kerja di Kantor') targetLocationType = 'Kantor';
                            initiallyFiltered = initiallyFiltered.filter(job => job.locationType === targetLocationType);
                            break;
                        case 'jobType': initiallyFiltered = initiallyFiltered.filter(job => job.type === filterValue); break;
                        case 'experienceLevel': initiallyFiltered = initiallyFiltered.filter(job => job.experienceLevel === filterValue); break;
                        case 'educationLevel': initiallyFiltered = initiallyFiltered.filter(job => job.educationLevel === filterValue); break;
                        case 'industry': initiallyFiltered = initiallyFiltered.filter(job => job.industry === filterValue); break;
                        // ...etc
                    }
                }
            });
            setDisplayedJobs(initiallyFiltered);
            setIsLoading(false);
        };
        fetchJobsAndSetInitialFilters();
    }, [locationHook.search]);

    useEffect(() => {
        if (!isLoading && allJobs.length > 0) {
            applyAllFilters();
        }
    }, [searchTerm, searchLocation, activeFilters, sortBy, isLoading, allJobs, applyAllFilters]);


    const handleSearchFormSubmit = (e) => { e.preventDefault(); applyAllFilters(); };
    const handleFilterChange = (filterName, value) => setActiveFilters(prev => ({ ...prev, [filterName]: value }));
    const resetAllFilters = () => {
        setSearchTerm(''); setSearchLocation('');
        setActiveFilters({ locationType: 'Semua', jobType: 'Semua', experienceLevel: 'Semua', educationLevel: 'Semua', industry: 'Semua', salaryRange: 'Semua' });
        setSortBy('relevance'); setIsFilterModalOpen(false);
    };
    const handleApplyModalFilters = () => { applyAllFilters(); setIsFilterModalOpen(false); };

    if (isLoading && displayedJobs.length === 0) { // Hanya tampilkan loading awal jika belum ada data sama sekali
        return (<div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-slate-50 p-4"><Loader2 className="h-12 w-12 animate-spin text-orange-500" /><p className="mt-4 text-slate-600">Memuat data lowongan...</p></div>);
    }
    if (error) {
        return (<div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-slate-50 p-4 text-center"><FilterIcon size={48} className="mx-auto text-red-500 mb-4" /><p className="text-red-600 text-lg">{error}</p><p className="text-slate-500 text-sm mt-2">Mohon maaf atas ketidaknyamanannya.</p></div>);
    }

    return (
        <div className="bg-slate-50 py-6 sm:py-8 min-h-screen">
            <div className="container mx-auto px-4">
                <nav className="text-sm mb-4 text-slate-600" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex items-center"><li className="flex items-center"><Link to="/" className="hover:text-orange-500">Beranda</Link><ChevronDown size={14} className="mx-1 transform -rotate-90" /></li><li className="flex items-center"><span className="text-slate-500">Hasil Pencarian</span></li></ol>
                </nav>
                <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchLocation={searchLocation} setSearchLocation={setSearchLocation} activeFilters={activeFilters} handleFilterChange={handleFilterChange} mainFilterOptions={mainFilterOptions} onSearchSubmit={handleSearchFormSubmit} onOpenFilterModal={() => setIsFilterModalOpen(true)} onApplyMainFilters={applyAllFilters} />
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6">
                    <div className="lg:w-2/3 xl:w-3/4"> {/* Konten utama sedikit lebih lebar */}
                        <JobListings jobs={displayedJobs} isLoading={isLoading && displayedJobs.length > 0} /* Hanya loading jika sudah ada jobs sblmnya */ error={null} /* Error sudah ditangani di atas */ sortBy={sortBy} setSortBy={setSortBy} onApplySort={applyAllFilters} resetAllFilters={resetAllFilters} />
                    </div>
                    <ResultsSidebar />
                </div>
            </div>
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} filters={activeFilters} setFilters={setActiveFilters} applyFilters={handleApplyModalFilters} resetFilters={resetAllFilters} />
        </div>
    );
};
export default JobSearchResultsPage;