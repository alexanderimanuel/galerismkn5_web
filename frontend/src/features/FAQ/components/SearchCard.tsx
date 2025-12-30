"use client";

import { useState } from "react";

interface SearchCardProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export default function SearchCard({ 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory 
}: SearchCardProps) {
    const categories = ["Semua", "Umum", "Karya"];

    return (
        <div className="mb-6 space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2">
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium border-none outline-none appearance-none pr-8 cursor-pointer"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category} className="bg-white text-black">
                                {category}
                            </option>
                        ))}
                    </select>
                    <svg 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                
                <div className="flex-1 bg-slate-500 rounded-lg px-4 py-2">
                    <input
                        type="text"
                        placeholder="Cari"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-300 border-none outline-none"
                    />
                </div>
            </div>
        </div>
    );
}