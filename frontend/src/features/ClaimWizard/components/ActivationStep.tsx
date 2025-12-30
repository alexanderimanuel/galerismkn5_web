import { ClaimFormData, ValidationErrors } from "../types";
import { FormField } from "@/features/Register/components/FormField";

interface ActivationStepProps {
  formData: ClaimFormData;
  validationErrors: ValidationErrors;
  onUpdate: (field: keyof ClaimFormData, value: any) => void;
}

export function ActivationStep({ formData, validationErrors, onUpdate }: ActivationStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate(name as keyof ClaimFormData, value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Aktivasi Akun</h3>
        <p className="mt-1 text-sm text-gray-600">
          Masukkan email dan password untuk mengaktifkan akun Anda
        </p>
      </div>

      {/* Student Confirmation */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-2">Konfirmasi Identitas</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div><span className="font-medium">Nama:</span> {formData.selectedName}</div>
          <div><span className="font-medium">NIS:</span> {formData.selectedNis}</div>
        </div>
      </div>

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Masukkan alamat email Anda"
        autoComplete="email"
        required
        validationErrors={validationErrors}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Masukkan password (min. 8 karakter)"
        autoComplete="new-password"
        required
        validationErrors={validationErrors}
      />

      <FormField
        label="Konfirmasi Password"
        name="password_confirmation"
        type="password"
        value={formData.password_confirmation}
        onChange={handleChange}
        placeholder="Ulangi password"
        autoComplete="new-password"
        required
        validationErrors={validationErrors}
      />

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
        <div className="flex">
          <svg className="w-4 h-4 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Catatan Penting:</p>
            <ul className="mt-1 list-disc list-inside">
              <li>Email akan digunakan untuk login ke sistem</li>
              <li>Password harus minimal 8 karakter</li>
              <li>Pastikan email yang dimasukkan valid dan dapat diakses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}