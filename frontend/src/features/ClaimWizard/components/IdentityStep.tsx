import { useJurusans } from "@/hooks/JurusanHooks";
import { useKelasByJurusan, useAvailableStudents } from "@/hooks/KelasHooks";
import { ClaimFormData, ValidationErrors } from "../types";
import { SelectField } from "@/features/Register/components/SelectField";

interface IdentityStepProps {
  formData: ClaimFormData;
  validationErrors: ValidationErrors;
  onUpdate: (field: keyof ClaimFormData, value: any) => void;
}

export function IdentityStep({ formData, validationErrors, onUpdate }: IdentityStepProps) {
  const { jurusans, isLoading: isLoadingJurusans } = useJurusans();
  const { kelas, isLoading: isLoadingKelas } = useKelasByJurusan(formData.selectedJurusan);
  const { students, isLoading: isLoadingStudents } = useAvailableStudents(formData.selectedKelas);

  // Prepare options
  const jurusanOptions = jurusans?.map(jurusan => ({
    value: jurusan.id.toString(),
    label: jurusan.nama
  })) || [];

  const kelasOptions = kelas?.map(kelas => ({
    value: kelas.id.toString(),
    label: kelas.nama_kelas
  })) || [];

  const studentOptions = students?.map(student => ({
    value: student.nis,
    label: `${student.name} (NIS: ${student.nis})`
  })) || [];

  const handleJurusanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate('selectedJurusan', e.target.value ? parseInt(e.target.value) : null);
  };

  const handleKelasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate('selectedKelas', e.target.value ? parseInt(e.target.value) : null);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNis = e.target.value;
    const selectedStudent = students?.find(s => s.nis === selectedNis);
    
    onUpdate('selectedNis', selectedNis);
    onUpdate('selectedName', selectedStudent?.name || '');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Identitas Siswa</h3>
        <p className="mt-1 text-sm text-gray-600">
          Pilih jurusan, kelas, dan nama Anda untuk melanjutkan proses klaim akun
        </p>
      </div>

      <SelectField
        label="Jurusan"
        name="selectedJurusan"
        value={formData.selectedJurusan?.toString() || ''}
        onChange={handleJurusanChange}
        options={jurusanOptions}
        placeholder="Pilih Jurusan"
        required
        validationErrors={validationErrors}
        isLoading={isLoadingJurusans}
        loadingText="Memuat jurusan..."
      />

      <SelectField
        label="Kelas"
        name="selectedKelas"
        value={formData.selectedKelas?.toString() || ''}
        onChange={handleKelasChange}
        options={kelasOptions}
        placeholder={formData.selectedJurusan ? "Pilih Kelas" : "Pilih jurusan terlebih dahulu"}
        required
        validationErrors={validationErrors}
        isLoading={isLoadingKelas && formData.selectedJurusan !== null}
        loadingText="Memuat kelas..."
      />

      <SelectField
        label="Nama Siswa"
        name="selectedNis"
        value={formData.selectedNis}
        onChange={handleStudentChange}
        options={studentOptions}
        placeholder={formData.selectedKelas ? "Pilih Nama Anda" : "Pilih kelas terlebih dahulu"}
        required
        validationErrors={validationErrors}
        isLoading={isLoadingStudents && formData.selectedKelas !== null}
        loadingText="Memuat daftar siswa..."
      />

      {students?.length === 0 && formData.selectedKelas && !isLoadingStudents && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-medium">Tidak ada siswa yang tersedia untuk klaim akun di kelas ini.</p>
          <p className="mt-1">Semua siswa di kelas ini sudah memiliki akun aktif atau silahkan hubungi administrator.</p>
        </div>
      )}
    </div>
  );
}