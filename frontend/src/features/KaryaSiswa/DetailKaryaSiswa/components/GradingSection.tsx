import { useState, useEffect } from 'react';
import { Star, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useGradingPermission, usePenilaianMutations } from '@/hooks/PenilaianHooks';
import type { Proyek, User } from '@/types/proyek';

interface GradingSectionProps {
  proyek: Proyek;
  user: User;
  can_override?: boolean;
  existing_grader?: string;
  onGradingComplete?: () => void;
}

export default function GradingSection({ proyek, user, can_override, existing_grader, onGradingComplete }: GradingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stars, setStars] = useState(proyek.penilaian?.bintang || 0);
  const [comment, setComment] = useState(proyek.penilaian?.catatan || '');
  const [showForm, setShowForm] = useState(false);

  const { permission, isLoading: checkingPermission, mutate: recheckPermission } = useGradingPermission(proyek.id);
  const { createPenilaian, updatePenilaian, isCreating, isUpdating } = usePenilaianMutations();

  const isTeacher = user?.role === 'guru';
  const isAdmin = user?.role === 'admin';
  const isAlreadyGraded = !!proyek.penilaian;
  const canGrade = permission?.can_grade;
  const sameJurusan = permission?.same_jurusan;
  const canOverride = permission?.can_override;
  const existingGrader = permission?.existing_grader;
  const isCurrentUserGrader = proyek.penilaian?.guru_id === user?.id;
  const isMutating = isCreating || isUpdating;

  console.log('GradingSection Permission:', permission);

  useEffect(() => {
    if (proyek.penilaian) {
      setStars(proyek.penilaian.bintang || 0);
      setComment(proyek.penilaian.catatan || '');
    }
  }, [proyek.penilaian]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stars < 1 || stars > 5) {
      alert('Rating harus antara 1-5 bintang');
      return;
    }

    try {
      if (isAlreadyGraded && (isCurrentUserGrader || (isAdmin && canOverride))) {
        // Update existing grading or admin override
        if (isCurrentUserGrader) {
          await updatePenilaian(proyek.penilaian!.id, {
            bintang: stars,
            catatan: comment
          });
          alert('Penilaian berhasil diperbarui!');
        } else {
          // Admin override - create new grading (backend will handle deletion)
          await createPenilaian({
            proyek_id: proyek.id,
            bintang: stars,
            catatan: comment
          });
          alert('Penilaian berhasil di-override!');
        }
      } else {
        // Create new grading
        await createPenilaian({
          proyek_id: proyek.id,
          bintang: stars,
          catatan: comment
        });
        alert('Penilaian berhasil disimpan!');
      }
      
      setShowForm(false);
      recheckPermission();
      onGradingComplete?.();
    } catch (error: any) {
      console.error('Error submitting grading:', error);
      alert(error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan penilaian');
    }
  };

  if (!isTeacher && !isAdmin) {
    return null;
  }

  if (checkingPermission) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Memeriksa akses penilaian...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {isAlreadyGraded ? 'Penilaian Proyek' : 'Beri Penilaian'}
            </h3>
          </div>
          
          {!sameJurusan && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Beda Jurusan</span>
            </div>
          )}
          
          {isAlreadyGraded && sameJurusan && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Sudah Dinilai</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Permission Message */}
        {!sameJurusan && !isAdmin && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-1">
                  Tidak dapat menilai proyek dari jurusan lain
                </h4>
                <p className="text-sm text-amber-700">
                  Anda hanya dapat menilai proyek dari siswa di jurusan yang sama. 
                  Proyek ini dari jurusan <strong>{proyek.jurusan?.nama}</strong>, 
                  sedangkan Anda dari jurusan <strong>{user.jurusan?.nama}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Override Warning */}
        {isAdmin && canOverride && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-1">
                  Override Penilaian Existing
                </h4>
                <p className="text-sm text-orange-700">
                  Sebagai admin, Anda dapat meng-override penilaian yang sudah ada dari <strong>{existingGrader}</strong>. 
                  Penilaian lama akan digantikan dengan penilaian baru Anda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Already Graded Display */}
        {isAlreadyGraded && (
          <div className="mb-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-blue-900">Penilaian Saat Ini</h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= (proyek.penilaian!.bintang || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-blue-700">
                    ({proyek.penilaian!.bintang || 0}/5)
                  </span>
                </div>
              </div>
              
              {proyek.penilaian!.catatan && (
                <div className="mt-3">
                  <p className="text-sm text-blue-800">
                    <strong>Catatan:</strong> {proyek.penilaian!.catatan}
                  </p>
                </div>
              )}
              
              <div className="mt-3 text-xs text-blue-700">
                Dinilai oleh: {proyek.penilaian!.guru?.name || proyek.penilaian!.user_name} • {' '}
                {new Date(proyek.penilaian!.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Edit/Update Button for Current Grader or Admin Override */}
            {(isCurrentUserGrader || (isAdmin && canOverride)) && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                >
                  {showForm ? 'Batal Edit' : (isAdmin && !isCurrentUserGrader ? 'Override Penilaian' : 'Edit Penilaian')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grading Form */}
        {((!isAlreadyGraded && canGrade) || (isAlreadyGraded && (isCurrentUserGrader || (isAdmin && canOverride)) && showForm)) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rating (1-5 Bintang)
              </label>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStars(star)}
                    disabled={isMutating}
                    className={`p-1 rounded transition-colors ${
                      isMutating ? 'cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= stars
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {stars > 0 ? `${stars}/5 bintang` : 'Pilih rating'}
                </span>
              </div>
              {stars === 0 && (
                <p className="text-sm text-red-500">Rating wajib dipilih</p>
              )}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (opsional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Berikan catatan atau saran untuk siswa..."
                disabled={isMutating}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 karakter</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isMutating}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMutating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isAlreadyGraded ? 'Memperbarui...' : 'Menyimpan...'}
                  </div>
                ) : (
                  isAlreadyGraded 
                    ? (isAdmin && !isCurrentUserGrader ? 'Override Penilaian' : 'Perbarui Penilaian')
                    : 'Simpan Penilaian'
                )}
              </button>
              
              {showForm && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setStars(proyek.penilaian?.bintang || 0);
                    setComment(proyek.penilaian?.catatan || '');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isMutating}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        )}

        {/* No Permission Message */}
        {!isAlreadyGraded && !canGrade && sameJurusan && !isAdmin && (
          <div className="text-center py-6 text-gray-500">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Proyek ini sudah dinilai oleh guru lain</p>
          </div>
        )}
      </div>
    </div>
  );
}