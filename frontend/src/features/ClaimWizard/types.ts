export interface ClaimFormData {
  selectedJurusan: number | null;
  selectedKelas: number | null;
  selectedNis: string;
  selectedName: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type ValidationErrors = Record<string, string>;

export interface Student {
  id: number;
  name: string;
  nis: string;
  kelas_id: number;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

export interface ClaimResponse {
  success: boolean;
  token: string;
  user: any;
  token_type: string;
  message: string;
}