'use client';

import { useState, useEffect } from 'react';
import { Share2, Heart, Copy, Check } from 'lucide-react';
import Swal from 'sweetalert2';

interface SocialPanelProps {
    proyek: {
        id: number | string;
        judul: string;
        deskripsi: string;
    };
}

export default function SocialPanel({ proyek }: SocialPanelProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // Check initial favorite state
        const favorites = JSON.parse(localStorage.getItem('favorite_projects') || '[]');
        setIsFavorite(favorites.includes(String(proyek.id)));
    }, [proyek.id]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorite_projects') || '[]');
        const projectId = String(proyek.id);

        let newFavorites;
        if (favorites.includes(projectId)) {
            newFavorites = favorites.filter((id: string) => id !== projectId);
            setIsFavorite(false);
        } else {
            newFavorites = [...favorites, projectId];
            setIsFavorite(true);

            // Optional: visual feedback
            const heartIcon = document.getElementById('heart-icon');
            heartIcon?.classList.add('animate-ping');
            setTimeout(() => heartIcon?.classList.remove('animate-ping'), 300);
        }

        localStorage.setItem('favorite_projects', JSON.stringify(newFavorites));
    };

    const handleShare = async () => {
        const shareData = {
            title: proyek.judul,
            text: `Lihat karya: ${proyek.judul}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copy link
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);

                Swal.fire({
                    icon: 'success',
                    title: 'Link Disalin!',
                    text: 'Link karya berhasil disalin ke clipboard.',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaksi</h3>
            <div className="flex gap-3">
                <button
                    onClick={toggleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 border ${isFavorite
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <Heart
                        id="heart-icon"
                        className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
                    />
                    <span className="font-medium text-sm">
                        {isFavorite ? 'Disukai' : 'Suka'}
                    </span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                >
                    {isCopied ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <Share2 className="w-5 h-5" />
                    )}
                    <span className="font-medium text-sm">
                        {isCopied ? 'Tersalin' : 'Bagikan'}
                    </span>
                </button>
            </div>
        </div>
    );
}
