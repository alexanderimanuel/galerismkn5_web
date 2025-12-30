"use client";

import { useProyek, useDeleteProyek } from "@/hooks/ProjekHooks";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { showDeleteConfirmation, showDeleteSuccess, showDeleteError } from "../components/DeleteConfirmation";
import {
    ProjectDetails,
    ProjectInfo,
    PenilaianSection,
    ActionsPanel,
    ReviewSection,
    RatingCard,
    GradingSection,
    SocialPanel
} from "./components";

export default function DetailKaryaSiswa({ user, logout }: { user: any; logout: () => void }) {
    const params = useParams();
    const router = useRouter();
    const proyekId = params.id as string;
    const { proyek, isLoading, isError, mutate } = useProyek(proyekId);
    const { deleteProyek, isDeleting } = useDeleteProyek();
    const [showReview, setShowReview] = useState(false);
    const imageUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

    const handleDelete = async () => {
        const confirmed = await showDeleteConfirmation({
            title: "Apakah Anda yakin?",
            text: "Proyek ini akan dihapus secara permanen!",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        });

        if (confirmed) {
            try {
                await deleteProyek(proyekId);
                await showDeleteSuccess("Proyek telah berhasil dihapus.");
                router.push('/karya'); // Redirect to karya list after deletion
            } catch (error) {
                console.error('Error deleting proyek:', error);
                await showDeleteError("Gagal menghapus proyek. Silakan coba lagi.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat detail proyek...</p>
                </div>
            </div>
        );
    }

    if (isError || !proyek) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center md:pt-20">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-medium">Error:</p>
                        <p className="text-sm">Proyek tidak ditemukan atau gagal memuat data</p>
                        <div className="mt-4 space-x-3">
                            <button
                                onClick={() => mutate()}
                                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Coba Lagi
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl bg-gray-50 pt-10 md:pt-25">
            {/* Header */}
            <div className="w-full px-4 sm:px-6 lg:px-8 md:py-2">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                    <div className="border-l h-6 border-gray-300"></div>
                    <h1 className="text-xl font-semibold text-gray-900">Detail Karya Siswa</h1>
                </div>
            </div>

            <div className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 md:py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <ProjectDetails proyek={proyek} imageUrl={imageUrl} />
                        {proyek.penilaian && (
                            <PenilaianSection proyek={proyek} />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <ProjectInfo proyek={proyek} />
                        {/* <RatingCard proyek={proyek} /> */}

                        {/* Grading Section - only for teachers */}
                        {(user?.role === 'guru' || user?.role === 'admin') && (
                            <GradingSection
                                proyek={proyek}
                                user={user}
                                onGradingComplete={() => mutate()}
                            />
                        )}

                        <SocialPanel proyek={proyek} />

                        <ActionsPanel
                            proyek={proyek}
                            user={user}
                            onDelete={handleDelete}
                            isDeleting={isDeleting}
                        />
                        {/* <ReviewSection 
                            proyek={proyek} 
                            showReview={showReview} 
                            setShowReview={setShowReview} 
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
