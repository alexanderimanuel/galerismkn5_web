import { useState, useEffect } from "react";
import { User, CreateUserData, UpdateUserData, Jurusan } from "@/types/proyek";
import { useKelasByJurusan } from "@/hooks/KelasHooks";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  user?: User | null;
  jurusans: Jurusan[];
  isLoading?: boolean;
  error?: any;
}

const KELAS_OPTIONS = ["10", "11", "12"];

export default function UserModal({ isOpen, onClose, onSubmit, user, jurusans, isLoading, error }: UserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'siswa',
    nis_nip: '',
    jurusan_id: 0,
    kelas_id: 0
  });

  // Fetch kelas based on selected jurusan
  const { kelas, isLoading: kelasLoading, isError: kelasError } = useKelasByJurusan(formData.jurusan_id > 0 ? formData.jurusan_id : null);

  // Use error prop for backend errors and local state for frontend validation
  const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});
  const backendErrors = error?.errors || {};
  const errors = { ...frontendErrors, ...backendErrors };

  useEffect(() => {
    if (isOpen) {
      setFrontendErrors({}); // Clear frontend validation errors
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: '',
          role: user.role as 'guru' | 'siswa',
          nis_nip: user.nis_nip || '',
          jurusan_id: user.jurusan_id || 0,
          kelas_id: user.kelas_id || 0
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'siswa',
          nis_nip: '',
          jurusan_id: 0,
          kelas_id: 0
        });
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFrontendErrors({}); // Clear previous validation errors

    // Frontend validation
    const validationErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      validationErrors.name = 'Nama lengkap harus diisi';
    }
    
    if (!formData.email.trim()) {
      validationErrors.email = 'Email harus diisi';
    }
    
    if (!user && !formData.password.trim()) {
      validationErrors.password = 'Password harus diisi';
    }
    
    if (!formData.nis_nip.trim()) {
      validationErrors.nis_nip = `${formData.role === 'guru' ? 'NIP' : 'NIS'} harus diisi`;
    }
    
    if (!formData.jurusan_id || formData.jurusan_id === 0) {
      validationErrors.jurusan_id = 'Jurusan harus dipilih';
    }
    
    if (formData.role === 'siswa' && (!formData.kelas_id || formData.kelas_id === 0)) {
      validationErrors.kelas_id = 'Kelas harus dipilih';
    }

    // If there are validation errors, set them and don't submit
    if (Object.keys(validationErrors).length > 0) {
      setFrontendErrors(validationErrors);
      return; // Don't submit
    }

    try {
      const submitData = { ...formData };
      
      // Remove password if empty for update
      if (user && !submitData.password) {
        delete (submitData as any).password;
      }
      
      // Set kelas_id to undefined if role is guru
      if (submitData.role === 'guru') {
        submitData.kelas_id = undefined;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      // Error handling is done in paFrent component
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {user ? 'Edit Akun' : 'Tambah Akun Baru'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Error Message */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Terdapat kesalahan dalam form
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{Array.isArray(message) ? message.join(', ') : String(message)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (frontendErrors.name) {
                  setFrontendErrors({ ...frontendErrors, name: '' });
                }
              }}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password {!user && '*'}
              {user && <span className="text-gray-500 text-sm">(Kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan password"
              required={!user}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Peran *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'guru' | 'siswa' })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* NIS/NIP */}
          <div>
            <label htmlFor="nis_nip" className="block text-sm font-medium text-gray-700 mb-1">
              {formData.role === 'guru' ? 'NIP' : 'NIS'} *
            </label>
            <input
              type="text"
              id="nis_nip"
              value={formData.nis_nip}
              onChange={(e) => setFormData({ ...formData, nis_nip: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nis_nip ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`Masukkan ${formData.role === 'guru' ? 'NIP' : 'NIS'}`}
              required
            />
            {errors.nis_nip && <p className="mt-1 text-sm text-red-600">{errors.nis_nip}</p>}
          </div>

          {/* Jurusan */}
          <div>
            <label htmlFor="jurusan_id" className="block text-sm font-medium text-gray-700 mb-1">
              Jurusan *
            </label>
            <select
              id="jurusan_id"
              value={formData.jurusan_id}
              onChange={(e) => {
                const newJurusanId = parseInt(e.target.value);
                setFormData({ 
                  ...formData, 
                  jurusan_id: newJurusanId,
                  kelas_id: 0 // Reset kelas when jurusan changes
                });
                if (frontendErrors.jurusan_id) {
                  setFrontendErrors({ ...frontendErrors, jurusan_id: '' });
                }
              }}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.jurusan_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value={0}>Pilih Jurusan</option>
              {jurusans.map((jurusan) => (
                <option key={jurusan.id} value={jurusan.id}>
                  {jurusan.nama}
                </option>
              ))}
            </select>
            {errors.jurusan_id && <p className="mt-1 text-sm text-red-600">{errors.jurusan_id}</p>}
          </div>

          {/* Kelas (only for siswa) */}
          {formData.role === 'siswa' && (
            <div>
              <label htmlFor="kelas_id" className="block text-sm font-medium text-gray-700 mb-1">
                Kelas *
              </label>
              <select
                id="kelas_id"
                value={formData.kelas_id || 0}
                onChange={(e) => {
                  setFormData({ ...formData, kelas_id: parseInt(e.target.value) });
                  if (frontendErrors.kelas_id) {
                    setFrontendErrors({ ...frontendErrors, kelas_id: '' });
                  }
                }}
                className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.kelas_id ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={kelasLoading || formData.jurusan_id === 0}
              >
                <option value={0}>
                  {formData.jurusan_id === 0 
                    ? 'Pilih jurusan terlebih dahulu' 
                    : kelasLoading 
                      ? 'Memuat kelas...' 
                      : 'Pilih Kelas'
                  }
                </option>
                {kelas.map((kelasItem) => (
                  <option key={kelasItem.id} value={kelasItem.id}>
                    {kelasItem.nama_kelas}
                  </option>
                ))}
              </select>
              {errors.kelas_id && <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>}
              {formData.jurusan_id > 0 && kelas.length === 0 && !kelasLoading && (
                <p className="mt-1 text-sm text-yellow-600">Belum ada kelas untuk jurusan ini</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {user ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}