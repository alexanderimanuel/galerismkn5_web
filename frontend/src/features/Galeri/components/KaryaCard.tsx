interface KaryaCardProps {
  proyek: any;
  onClick: () => void;
}

export default function KaryaCard({ proyek, onClick }: KaryaCardProps) {
  const imageUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-200 overflow-hidden">
        {proyek.image_url ? (
          <img
            src={`${imageUrl}${proyek.image_url}`}
            alt={proyek.judul}
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
      <div className="bg-sky-800 text-white p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{proyek.judul}</h3>
        <p className="text-slate-300 text-sm mb-3 line-clamp-3">{proyek.deskripsi}</p>
        <button 
          className="bg-sky-700 hover:bg-sky-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Lihat
        </button>
      </div>
    </div>
  );
}