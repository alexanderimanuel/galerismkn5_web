"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProjeks } from "@/hooks/ProjekHooks";
import { useJurusans } from "@/hooks/JurusanHooks";
import FilterDropdown from "./components/FilterDropdown";
import KaryaCard from "./components/KaryaCard";
import Pagination from "./components/Pagination";
import { MdHideImage } from "react-icons/md";

// Years data from 2015 to 2025
const YEARS = Array.from({ length: 11 }, (_, i) => 2015 + i);

// Kelas options
const KELAS_OPTIONS = ["X", "XI", "XII"];

function GaleriContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { jurusans, isLoading: isLoadingJurusans } = useJurusans();

    // Get URL parameters
    const urlJurusanId = searchParams.get('jurusan_id');
    const urlKelas = searchParams.get('kelas');
    const urlYear = searchParams.get('year');
    const urlSearch = searchParams.get('search');

    // Filter states - initialize from URL params if available
    const [selectedJurusan, setSelectedJurusan] = useState(urlJurusanId || "");
    const [selectedKelas, setSelectedKelas] = useState(urlKelas || "");
    const [selectedYear, setSelectedYear] = useState(urlYear || "");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(urlSearch || "");

    // Fetch projects with filters
    const { proyeks, pagination, isLoading, isError } = useProjeks({
        page: currentPage,
        limit: 9, // 3x3 grid
        jurusan_id: selectedJurusan ? parseInt(selectedJurusan) : undefined,
        search: searchQuery || undefined,
        year: selectedYear ? parseInt(selectedYear) : undefined,
        kelas: selectedKelas || undefined,
        status: 'dinilai' // Only show graded projects in gallery
    });

    // Filter options
    const jurusanOptions = jurusans.map(jurusan => ({
        value: jurusan.id.toString(),
        label: jurusan.nama
    }));

    const kelasOptions = KELAS_OPTIONS.map(kelas => ({
        value: kelas,
        label: `Kelas ${kelas}`
    }));

    const yearOptions = YEARS.map(year => ({
        value: year.toString(),
        label: `Tahun ${year}`
    }));

    // Reset page to 1 when any filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedJurusan, selectedKelas, selectedYear, searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleProjectClick = (proyekId: number) => {
        router.push(`/karya/${proyekId}`);
    };

    const handleReset = () => {
        setSelectedJurusan("");
        setSelectedKelas("");
        setSelectedYear("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-25">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri Karya Siswa</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Jelajahi berbagai karya kreatif dan inovatif dari siswa-siswa SMKN 5
                    </p>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col md:flex-row justify-center items-center mb-10 space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-full md:w-1/3">
                        <div className="relative w-full bg-gradient-to-r from-sky-50 to-sky-200 rounded-lg">
                            <input
                                type="text"
                                placeholder="Cari karya siswa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 pr-10 text-sky-900 border border-sky-600 shadow-[0px_0px_15px_rgba(14,165,233,0.2)] rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-sky-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center justify-center">
                        <FilterDropdown
                            label="Jurusan"
                            value={selectedJurusan}
                            onChange={setSelectedJurusan}
                            options={jurusanOptions}
                            placeholder="Semua Jurusan"
                        />
                        <FilterDropdown
                            label="Kelas"
                            value={selectedKelas}
                            onChange={setSelectedKelas}
                            options={kelasOptions}
                            placeholder="Semua Kelas"
                        />
                        <FilterDropdown
                            label="Tahun"
                            value={selectedYear}
                            onChange={setSelectedYear}
                            options={yearOptions}
                            placeholder="Semua Tahun"
                        />

                        {(selectedJurusan || selectedKelas || selectedYear || searchQuery) && (
                            <button
                                onClick={handleReset}
                                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
                            <p className="font-medium">Error memuat data</p>
                            <p className="text-sm">Gagal memuat galeri karya siswa</p>
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {!isLoading && !isError && (
                    <>
                        {proyeks.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
                                    <svg className="mx-auto h-20 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <MdHideImage className="mx-auto h-20 w-16 text-gray-400 mb-4" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada karya ditemukan</h3>
                                    <p className="text-gray-600">
                                        {searchQuery || selectedJurusan || selectedKelas || selectedYear
                                            ? "Coba ubah filter pencarian Anda"
                                            : "Belum ada karya yang tersedia untuk ditampilkan"
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {proyeks.map((proyek) => (
                                    <KaryaCard
                                        key={proyek.id}
                                        proyek={proyek}
                                        onClick={() => handleProjectClick(proyek.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <Pagination
                                currentPage={pagination.current_page || 1}
                                totalPages={pagination.last_page || 1}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-25">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        </div>
    );
}

export default function GaleriPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <GaleriContent />
        </Suspense>
    );
}