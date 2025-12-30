"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUngradedProjeks } from "@/hooks/ProjekHooks";
import Navbar from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/spinner";
import {
    HiSearch,
    HiFilter,
    HiEye,
    HiStar,
    HiClock,
    HiChevronLeft,
    HiChevronRight,
    HiClipboardCheck,
    HiUser,
    HiPhotograph
} from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { Proyek } from "@/types/proyek";

export default function NilaiKaryaPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedKelas, setSelectedKelas] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch ungraded projects
    const {
        proyeks,
        pagination,
        message,
        isLoading,
        isError,
        mutate
    } = useUngradedProjeks({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        year: selectedYear ? parseInt(selectedYear) : undefined,
        kelas: selectedKelas || undefined,
    });

    // Redirect if not authenticated or not a teacher
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'guru')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle filter changes
    const handleFilterChange = (filterType: string, value: string) => {
        if (filterType === 'year') {
            setSelectedYear(value);
        } else if (filterType === 'kelas') {
            setSelectedKelas(value);
        }
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Generate year options for filter
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Generate kelas options
    const kelasOptions = ['10', '11', '12'];

    if (authLoading) {
        return <Spinner />;
    }

    if (!user || user.role !== 'guru') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-8 md:pt-24 pb-20 md:pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-sky-100 p-2 rounded-lg">
                                    <HiClipboardCheck className="w-6 h-6 text-sky-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Nilai Karya Siswa
                                    </h1>
                                    <p className="text-gray-600">
                                        Menilai karya siswa dari jurusan {user?.jurusan?.nama || 'Anda'}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <HiClock className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-800">
                                        {pagination?.total || 0} karya menunggu penilaian
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

                            {/* Search Bar */}
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari judul karya..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full text-gray-700 pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="px-4 py-2 border text-gray-700 border-gray-400 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option value="">Semua Tahun</option>
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedKelas}
                                    onChange={(e) => handleFilterChange('kelas', e.target.value)}
                                    className="px-4 py-2 border text-gray-700 border-gray-400 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasOptions.map(kelas => (
                                        <option key={kelas} value={kelas}>Kelas {kelas}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Spinner />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">
                                <HiClock className="w-12 h-12 mx-auto mb-2" />
                                <p>Gagal memuat data karya</p>
                            </div>
                            <button
                                onClick={() => mutate()}
                                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : proyeks.length === 0 ? (
                        <div className="text-center py-12">
                            <HiStar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Tidak ada karya yang perlu dinilai
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || selectedYear || selectedKelas
                                    ? "Coba ubah filter pencarian Anda"
                                    : "Semua karya dari jurusan Anda sudah dinilai"}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Projects Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {proyeks.map((proyek: Proyek) => (
                                    <ProjectCard key={proyek.id} proyek={proyek} onGraded={mutate} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <HiChevronLeft className="w-5 h-5 mr-1" />
                                        Previous
                                    </button>

                                    <span className="px-4 py-2 text-sm text-gray-700">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                                        disabled={currentPage === pagination.last_page}
                                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                        <HiChevronRight className="w-5 h-5 ml-1" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

// Project Card Component
function ProjectCard({ proyek, onGraded }: { proyek: Proyek; onGraded: () => void }) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Project Image */}
            <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {proyek.image_url ? (
                    <Image
                        src={proyek.image_url}
                        alt={proyek.judul}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <HiPhotograph className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded-full">
                        Menunggu Penilaian
                    </span>
                </div>
            </div>

            {/* Project Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {proyek.judul}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                        <HiUser className="w-4 h-4" />
                        <span>{proyek.user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <HiClock className="w-4 h-4" />
                        <span>Dikirim {formatDate(proyek.created_at)}</span>
                    </div>
                    {proyek.user?.kelas && (
                        <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 text-center text-xs font-bold">K</span>
                            <span>{proyek.user.kelas.nama_kelas}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={`/karya/${proyek.id}`}
                    className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center space-x-2"
                >
                    <HiEye className="w-4 h-4" />
                    <span>Lihat & Nilai</span>
                </Link>
            </div>
        </div>
    );
}