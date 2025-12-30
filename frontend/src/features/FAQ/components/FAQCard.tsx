"use client";

import { useState } from "react";

interface FAQCardProps {
    question: string;
    answer: string;
}

export default function FAQCard({ question, answer }: FAQCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-sky-700 hover:bg-sky-800 text-white px-6 py-4 text-left transition-colors flex justify-between items-center"
            >
                <span className="font-medium">{question}</span>
                <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {isOpen && (
                <div className="bg-sky-900 text-white px-6 py-4">
                    <p className="leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}