"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useJurusans } from "@/hooks/JurusanHooks";
import { useRegisterForm } from "./hooks";
import {
  RegisterHeader,
  FormField,
  SelectField,
  SubmitButton,
  LoginLink,
  ErrorAlert
} from "./components";

export function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isLoading, error, clearError } = useAuth();
  const { jurusans, isLoading: isLoadingJurusans } = useJurusans();
  const { formData, validationErrors, handleChange, validateForm, clearErrors } = useRegisterForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearErrors();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.nis,
        formData.password,
        "siswa",
        parseInt(formData.jurusan_id),
        formData.kelas
      );
      // Redirect is handled by AuthContext
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare jurusan options
  const jurusanOptions = jurusans?.map(jurusan => ({
    value: jurusan.id.toString(),
    label: jurusan.nama
  })) || [];

  // Prepare kelas options
  const kelasOptions = [
    { value: "10", label: "Kelas 10" },
    { value: "11", label: "Kelas 11" },
    { value: "12", label: "Kelas 12" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 pt-10 md:pt-25">
      <div className="max-w-md w-full space-y-8">
        <RegisterHeader />

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <ErrorAlert error={error} />

            <FormField
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              autoComplete="name"
              required
              validationErrors={validationErrors}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              autoComplete="email"
              required
              validationErrors={validationErrors}
            />

            <FormField
              label="NIS (Nomor Induk Siswa)"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              placeholder="Masukkan NIS"
              required
              validationErrors={validationErrors}
            />

            <SelectField
              label="Jurusan"
              name="jurusan_id"
              value={formData.jurusan_id}
              onChange={handleChange}
              options={jurusanOptions}
              placeholder="Pilih Jurusan"
              required
              validationErrors={validationErrors}
              isLoading={isLoadingJurusans}
              loadingText="Memuat jurusan..."
            />

            <SelectField
              label="Kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              options={kelasOptions}
              placeholder="Pilih Kelas"
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
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              autoComplete="new-password"
              required
              validationErrors={validationErrors}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              isLoading={isLoading}
            />

            <LoginLink />
          </form>
        </div>
      </div>
    </div>
  );
}