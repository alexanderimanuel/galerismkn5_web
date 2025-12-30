import Link from "next/link";
import { Proyek } from "@/types/proyek";

interface KaryaCardProps {
    proyek: Proyek;
}

export default function KaryaCard({ proyek }: KaryaCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {proyek.judul}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        proyek.status === 'terkirim'
                            ? 'bg-gray-100 text-gray-800'
                            : proyek.status === 'dinilai'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {proyek.status}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {proyek.deskripsi}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
                        </svg>
                        Jurusan: {proyek.jurusan?.nama || 'Belum ditentukan'}
                    </div>
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(proyek.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                <div className="mt-4 flex space-x-2">
                    <Link
                        href={`/karya/${proyek.id}`}
                        className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Lihat Detail
                    </Link>
                    {proyek.status === 'terkirim' && (
                        <Link href={`/karya/edit?id=${proyek.id}`} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Edit
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}