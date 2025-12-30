"use client";

import { useAuth } from "@/context/AuthContext";
import { useMyProjeks } from "@/hooks/ProjekHooks";
import KaryaCard from "./components/KaryaCard";
import Link from "next/link";


export default function KaryaSiswa({ user, logout }: { user: any, logout: () => void }) {
    const { proyeks, isLoading, isError, mutate } = useMyProjeks();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 md:pt-15">
                <div className="w-full max-w-6xl px-4 md:px-8 md:py-8">
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Memuat karya siswa...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 md:pt-15">
                <div className="w-full max-w-6xl px-4 md:px-8 md:py-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="font-medium">Error:</p>
                        <p className="text-sm">Gagal memuat data karya siswa</p>
                        <button
                            onClick={() => mutate()}
                            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 md:pt-20">
            <div className="w-full max-w-6xl px-4 md:px-8 md:py-8">
                <div className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Karya Anda ({user?.name})</h1>
                    <div className="flex text-left items-start md:text-center md:items-center justify-around space-x-6 mt-2 md:mt-0">
                        <div className="text-sm text-left text-gray-600 md:mb-0">
                            Total: {proyeks.length} proyek
                        </div>
                        {/* Desktop Add Button */}
                        <Link
                            href="/karya/add"
                            className="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Karya
                        </Link>
                    </div>
                </div>

                {proyeks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <div className="flex flex-col items-center">
                            <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada proyek</h3>
                            <p className="text-gray-600 mb-4">Anda belum memiliki proyek yang dibuat.</p>
                            <Link
                                href="/karya/add"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Buat Proyek Baru
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {proyeks.map((proyek) => (
                            <KaryaCard key={proyek.id} proyek={proyek} />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Floating Add Button */}
            <Link
                href="/karya/add"
                className="md:hidden fixed bottom-25 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl z-50"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </Link>
        </div>
    );
}