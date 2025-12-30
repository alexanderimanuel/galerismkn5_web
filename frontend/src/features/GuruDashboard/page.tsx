"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserStats } from "@/hooks/useApi";
import Link from "next/dist/client/link";

// Guru Dashboard Component
export default function GuruDashboard({ user, logout }: { user: any, logout: () => void }) {
    const { stats, isLoading: statsLoading, isError } = useUserStats();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 md:pt-15">

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-6 py-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                📚 Selamat Datang, {user.name}!
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Kelola & Nilai Galeri Siswa SMKN 5 Malang
                            </p>
                        </div>
                    </div>

                     <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Jurusan</label>
                                <p className="text-sm text-gray-900 mt-1">{user.jurusan?.nama || 'Jurusan tidak ditemukan'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Guru Stats */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Foto Diupload</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {statsLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                                                ) : (
                                                    stats.userUploads
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {statsLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                                                ) : (
                                                    stats.userViews
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Aktivitas Hari Ini</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {statsLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                                                ) : (
                                                    stats.todayActivities
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Guru Actions */}
                    <div className="bg-white shadow rounded-lg mt-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Tools Guru
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link 
                                    href={`/galeri?jurusan_id=${user.jurusan_id}`}
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Cek Galeri Siswa</p>
                                        <p className="text-xs text-gray-500">Lihat karya siswa jurusan Anda</p>
                                    </div>
                                </Link>
                                
                                <Link 
                                    href="/dashboard/stats"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Statistik & Monitoring</p>
                                        <p className="text-xs text-gray-500">Monitor pengumpulan karya siswa</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-10 p-8 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Keluar Akun
                    </button>
                </div>
            </div>
        </div>
    );
}