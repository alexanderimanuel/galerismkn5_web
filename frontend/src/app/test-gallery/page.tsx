"use client";

import { useKaryaItems } from '@/hooks/ProjekHooks';
import KaryaCard from '@/components/ui/KaryaCard';

export default function GalleryPage() {
    const { karyaItems, pagination, isLoading, isError } = useKaryaItems({
        page: 1,
        limit: 12,
        status: 'dinilai' // Only show graded projects in gallery
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading gallery...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
                    <p className="text-gray-600">Failed to load gallery projects</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (karyaItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
                    <p className="text-gray-500">No graded projects available in the gallery</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Gallery Karya Siswa</h1>
                <p className="text-gray-600">Showcasing outstanding student projects</p>
                {pagination && (
                    <p className="text-sm text-gray-500 mt-2">
                        Showing {pagination.from}-{pagination.to} of {pagination.total} projects
                    </p>
                )}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {karyaItems.map((karya) => (
                    <div key={karya.id} className="h-full">
                        <KaryaCard karya={karya} />
                        
                        {/* Additional project info */}
                        <div className="mt-2 px-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className="font-medium">{karya.author}</span>
                                <span>{karya.jurusan}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {new Date(karya.createdAt).toLocaleDateString('id-ID')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1 rounded text-sm ${
                                page === pagination.current_page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => {
                                // In a real implementation, you'd update the page state here
                                console.log(`Navigate to page ${page}`);
                            }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}