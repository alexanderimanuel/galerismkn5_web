import { useRouter } from 'next/navigation';

interface ActionsPanelProps {
  proyek: any;
  user: any;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function ActionsPanel({ proyek, user, onDelete, isDeleting }: ActionsPanelProps) {
  const router = useRouter();

  if (!user || user.id !== proyek.user_id) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi</h3>
      <div className="space-y-3">
        <button
          onClick={() => router.push(`/karya/edit?id=${proyek.id}`)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Edit Proyek
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="w-full border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Menghapus...' : 'Hapus Proyek'}
        </button>
      </div>
    </div>
  );
}