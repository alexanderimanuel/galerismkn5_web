"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Layers, ChevronDown } from "lucide-react";

interface Project {
    id: number;
    judul: string;
    date: string;
    status: string;
}

interface StudentProjectTriggerProps {
    name: string;
    nis: string;
    projects: Project[];
    totalKarya: number;
}

export default function StudentProjectTrigger({ name, nis, projects, totalKarya }: StudentProjectTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Case A: Single Project - Direct Link
    if (projects.length === 1) {
        return (
            <Link
                href={`/karya/${projects[0].id}`}
                className="group flex items-center space-x-2 p-2 bg-emerald-50 rounded text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{name}</div>
                    <div className="text-xs text-emerald-600">NIS: {nis}</div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">
                        1 Karya
                    </span>
                    <ExternalLink className="w-3 h-3 text-emerald-600 group-hover:text-emerald-700" />
                </div>
            </Link>
        );
    }

    // Case B: Multiple Projects - Dropdown/Popup
    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center space-x-2 p-2 bg-emerald-50 rounded text-emerald-800 hover:bg-emerald-100 transition-colors w-full text-left"
            >
                <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{name}</div>
                    <div className="text-xs text-emerald-600">NIS: {nis}</div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">
                        {totalKarya} Karya
                    </span>
                    <ChevronDown 
                        className={`w-3 h-3 text-emerald-600 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`} 
                    />
                </div>
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                    <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                            Karya {name}:
                        </div>
                        {projects.map((project, index) => (
                            <Link
                                key={project.id}
                                href={`/karya/${project.id}`}
                                className="group flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                        {project.judul}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {project.date}
                                    </div>
                                </div>
                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-emerald-600 flex-shrink-0 ml-2" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}