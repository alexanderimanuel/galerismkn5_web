export interface RegisterFormData {
  name: string;
  email: string;
  nis: string;
  password: string;
  confirmPassword: string;
  jurusan_id: string;
  kelas: string;
}

export type ValidationErrors = Record<string, string>;