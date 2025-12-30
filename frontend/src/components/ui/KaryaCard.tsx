"use client";

import type { KaryaItem } from '@/types/proyek';
import Link from "next/link";

interface KaryaCardProps {
    karya: KaryaItem;
}

// Color coding based on jurusan from JurusanSeeder
function getJurusanColors(jurusan: string) {
    const colorMap: Record<string, { bg: string; text: string }> = {
        // Rekayasa Perangkat Lunak - Blue theme (tech)
        'Rekayasa Perangkat Lunak': { bg: 'bg-blue-500', text: 'text-blue-100' },
        'RPL': { bg: 'bg-blue-500', text: 'text-blue-100' },
        
        // Teknik Komputer Jaringan - Green theme (network)
        'Teknik Komputer Jaringan': { bg: 'bg-green-500', text: 'text-green-100' },
        'TKJ': { bg: 'bg-green-500', text: 'text-green-100' },
        
        // Desain Komunikasi Visual - Purple theme (creative)
        'Desain Komunikasi Visual': { bg: 'bg-purple-500', text: 'text-purple-100' },
        'DKV': { bg: 'bg-purple-500', text: 'text-purple-100' },
        
        // Animasi - Pink theme (creative/motion)
        'Animasi': { bg: 'bg-pink-500', text: 'text-pink-100' },
        
        // Kriya Kayu - Amber theme (wood/craft)
        'Kriya Kayu': { bg: 'bg-amber-600', text: 'text-amber-100' },
        'KK': { bg: 'bg-amber-600', text: 'text-amber-100' },
        
        // Kriya Tekstil - Indigo theme (textile)
        'Kriya Tekstil': { bg: 'bg-indigo-500', text: 'text-indigo-100' },
        'KT': { bg: 'bg-indigo-500', text: 'text-indigo-100' },
        
        // Kriya Keramik - Orange theme (clay/ceramic)
        'Kriya Keramik': { bg: 'bg-orange-500', text: 'text-orange-100' },
        'KKR': { bg: 'bg-orange-500', text: 'text-orange-100' },
        
        // Tata Busana - Rose theme (fashion)
        'Tata Busana': { bg: 'bg-rose-500', text: 'text-rose-100' },
        'TB': { bg: 'bg-rose-500', text: 'text-rose-100' },
    };
    
    return colorMap[jurusan] || { bg: 'bg-gray-500', text: 'text-gray-100' };
}

export default function KaryaCard({ karya }: KaryaCardProps) {
    const imageUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const jurusanColors = getJurusanColors(karya.jurusan);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-2 h-full flex flex-col">
            {/* Image Section */}
            <div className="aspect-video bg-gray-200 overflow-hidden">
                {karya.imageUrl ? (
                    <img
                        src={`${imageUrl}${karya.imageUrl}`}
                        alt={karya.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="bg-sky-700 text-white p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{karya.title}</h3>

                <span className={`px-3 py-1 text-xs font-medium rounded-xl ${jurusanColors.bg} ${jurusanColors.text}`}>
                    {karya.jurusan}
                </span>
                <p className="text-sm text-blue-100 mb-4 mt-2 flex-1 leading-relaxed line-clamp-3">
                    {karya.description}
                </p>

                {/* View Button */}
                <Link href={`/karya/${karya.id}`} className="bg-sky-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full block text-center">
                    Lihat
                </Link>
            </div>
        </div>
    );
}