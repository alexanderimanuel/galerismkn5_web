import { useState } from "react";
import { ClaimFormData, ValidationErrors } from "../types";
import axios from "@/lib/axios";
import { ClaimResponse } from "../types";

const initialFormData: ClaimFormData = {
  selectedJurusan: null,
  selectedKelas: null,
  selectedNis: "",
  selectedName: "",
  email: "",
  password: "",
  password_confirmation: ""
};

export const useClaimWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClaimFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const updateFormData = (field: keyof ClaimFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user changes input
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Clear dependent fields when changing selection
    if (field === 'selectedJurusan') {
      setFormData(prev => ({
        ...prev,
        selectedJurusan: value,
        selectedKelas: null,
        selectedNis: "",
        selectedName: ""
      }));
    } else if (field === 'selectedKelas') {
      setFormData(prev => ({
        ...prev,
        selectedKelas: value,
        selectedNis: "",
        selectedName: ""
      }));
    }
  };

  const validateStep1 = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.selectedJurusan) {
      errors.selectedJurusan = "Jurusan wajib dipilih";
    }

    if (!formData.selectedKelas) {
      errors.selectedKelas = "Kelas wajib dipilih";
    }

    if (!formData.selectedNis) {
      errors.selectedNis = "Siswa wajib dipilih";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      errors.password = "Password minimal 8 karakter";
    }

    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "Konfirmasi password tidak cocok";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitClaim = async (): Promise<ClaimResponse | null> => {
    if (!validateStep2()) {
      return null;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const response = await axios.post<ClaimResponse>('/auth/claim', {
        nis: formData.selectedNis,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        setGeneralError("Akun sudah diklaim. Silahkan hubungi administrator jika membutuhkan bantuan.");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors || {};
        setValidationErrors(errors);
        setGeneralError("Terdapat kesalahan pada data yang diinput.");
      } else if (error.response?.status === 404) {
        setGeneralError("NIS tidak ditemukan. Silahkan periksa kembali data Anda.");
      } else {
        setGeneralError("Terjadi kesalahan. Silahkan coba lagi.");
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearErrors = () => {
    setValidationErrors({});
    setGeneralError(null);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return !!(formData.selectedJurusan && formData.selectedKelas && formData.selectedNis);
    }
    return true;
  };

  return {
    currentStep,
    formData,
    validationErrors,
    isSubmitting,
    generalError,
    updateFormData,
    nextStep,
    prevStep,
    submitClaim,
    clearErrors,
    canProceed
  };
};