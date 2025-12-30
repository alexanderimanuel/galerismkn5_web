interface ProjectInfoProps {
  proyek: any;
}

export default function ProjectInfo({ proyek }: ProjectInfoProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Proyek</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Oleh</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">{proyek.user?.name || 'Pengguna tidak ditemukan'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Jurusan</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">{proyek.jurusan?.nama || 'Jurusan tidak ditemukan'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Kelas</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">{proyek.user?.kelas?.nama_kelas || 'Kelas tidak ditemukan'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Email</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">{proyek.user?.email || '-'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">NIS/NIP</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">{proyek.user?.nis_nip || '-'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Tanggal Dibuat</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">
            {new Date(proyek.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Terakhir Diupdate</label>
          <p className="text-sm text-gray-900 dark:text-slate-200 mt-1">
            {new Date(proyek.updated_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}