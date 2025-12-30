interface ProjectDetailsProps {
  proyek: any;
  imageUrl: string;
}

export default function ProjectDetails({ proyek, imageUrl }: ProjectDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{proyek.judul}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${proyek.status === 'terkirim'
              ? 'bg-blue-100 text-blue-800'
              : proyek.status === 'dinilai'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
              {proyek.status === 'terkirim' ? 'Terkirim' :
                proyek.status === 'dinilai' ? 'Dinilai' : proyek.status}
            </span>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deskripsi</h3>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {proyek.deskripsi}
            </p>
          </div>

          {proyek.tautan_proyek && (
            <div className="mt-6 pt-6 border-t dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tautan Proyek</h3>
              <a
                href={proyek.tautan_proyek}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {proyek.tautan_proyek}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Project Image */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800 p-6">
        {proyek.image_url ? (
          <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <img
              src={`${imageUrl}${proyek.image_url}`}
              alt={proyek.judul}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Tidak ada gambar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}