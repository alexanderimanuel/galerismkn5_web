import { useState } from 'react';

interface ReviewSectionProps {
  proyek: any;
  showReview: boolean;
  setShowReview: (show: boolean) => void;
}

export default function ReviewSection({ proyek, showReview, setShowReview }: ReviewSectionProps) {
  if (!proyek.penilaian) {
    return null;
  }

  return (
    <>
      {/* Toggle Review Button */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review</h3>
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          {showReview ? 'Sembunyikan Review' : 'Lihat Review'}
        </button>
      </div>

      {/* Review Content */}
      {showReview && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Detail</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {proyek.penilaian.guru?.name?.charAt(0) || 'G'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {proyek.penilaian.guru?.name || 'Guru'}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = proyek.penilaian!.bintang || 0;
                      return (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {proyek.penilaian.catatan || 'Tidak ada catatan dari guru.'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(proyek.penilaian.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}