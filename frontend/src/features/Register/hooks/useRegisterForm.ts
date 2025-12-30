import { useState } from "react";
import { RegisterFormData, ValidationErrors } from "../types";

export const useRegisterForm = (initialData: RegisterFormData = {
  name: "",
  email: "",
  nis: "",
  password: "",
  confirmPassword: "",
  jurusan_id: "",
  kelas: ""
}) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Nama wajib diisi";
    }

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.nis.trim()) {
      errors.nis = "NIS wajib diisi";
    } else if (!/^\d+$/.test(formData.nis)) {
      errors.nis = "NIS harus berupa angka";
    } else if (formData.nis.length < 5 || formData.nis.length > 20) {
      errors.nis = "NIS harus 5-20 digit";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      errors.password = "Password minimal 8 karakter";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    if (!formData.jurusan_id) {
      errors.jurusan_id = "Jurusan wajib dipilih";
    }

    if (!formData.kelas) {
      errors.kelas = "Kelas wajib dipilih";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  return {
    formData,
    validationErrors,
    handleChange,
    validateForm,
    clearErrors,
    setFormData,
    setValidationErrors
  };
};