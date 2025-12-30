import { Star } from 'lucide-react';

interface PenilaianSectionProps {
  proyek: any;
}

export default function PenilaianSection({ proyek }: PenilaianSectionProps) {
  if (!proyek.penilaian) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Penilaian</h3>
      <div className="space-y-4">
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 ${
                    star <= (proyek.penilaian.bintang || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-lg font-semibold text-sky-600">
                ({proyek.penilaian.bintang || 0}/5)
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 w-20">Dinilai oleh:</span>
            <span className="text-sm text-gray-900">
              {proyek.penilaian.user_name || 'Guru tidak ditemukan'}
            </span>
          </div>
        </div>
        {proyek.penilaian.catatan && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-500 w-20">Catatan:</span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {proyek.penilaian.catatan}
            </p>
          </div>
        )}
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-700">
            <h2 className="text-sm font-medium text-gray-500">Dinilai pada :</h2>
            {new Date(proyek.penilaian.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}