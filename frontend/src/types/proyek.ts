export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'guru' | 'siswa';
    nis_nip?: string;
    nis?: string;
    jurusan_id?: number;
    jurusan_name?: string;
    jurusan?: Jurusan;
    kelas_id?: number;
    kelas?: Kelas;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
}

export interface Jurusan {
    id: number;
    kode_jurusan: string;
    nama: string;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}

export interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: number;
    jurusan_id: number;
    jurusan?: Jurusan;
    created_at?: string;
    updated_at?: string;
}

export interface Penilaian {
    id: number;
    proyek_id: number;
    guru_id: number;
    nilai?: number; // Optional score 0-100
    bintang?: number; // Star rating 1-5
    catatan?: string;
    created_at: string;
    updated_at: string;
    guru?: User;
    user_name?: string;
}

// Form data types for creating/updating penilaian
export interface CreatePenilaianData {
    proyek_id: number;
    bintang: number; // Use stars instead of score
    catatan?: string;
}

export interface UpdatePenilaianData extends Partial<CreatePenilaianData> {}

// Grading permission check response
export interface GradingPermissionResponse {
    success: boolean;
    can_grade: boolean;
    same_jurusan: boolean;
    already_graded: boolean;
    is_admin: boolean;
    can_override: boolean;
    existing_grader: string | null;
    message: string;
}

export interface Proyek {
    id: number;
    user_id: number;
    jurusan_id: number;
    judul: string;
    deskripsi: string;
    tautan_proyek?: string;
    image_url?: string;
    status: 'terkirim' | 'dinilai';
    created_at: string;
    updated_at: string;
    user?: User;
    jurusan?: Jurusan;
    penilaian?: Penilaian;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: PaginationMeta;
}

// Form data types for creating/updating projects
export interface CreateProjekData {
    judul: string;
    deskripsi: string;
    tautan_proyek?: string;
    image_url?: string;
    image?: File;
    jurusan_id: number;
    status?: 'terkirim' | 'dinilai';
}

export interface UpdateProjekData extends Partial<CreateProjekData> {}

// Query params for filtering projects
export interface ProjekQueryParams {
    page?: number;
    limit?: number;
    status?: 'terkirim' | 'dinilai';
    jurusan_id?: number;
    search?: string;
    year?: number;
    kelas?: string;
}

// KaryaCard interface compatibility
export interface KaryaItem {
    id: number;
    imageUrl?: string;
    title: string;
    description: string;
    author: string;
    jurusan: string;
    createdAt: string;
    status?: 'terkirim' | 'dinilai';
}

// Helper function to transform Proyek to KaryaItem
export function proyekToKaryaItem(proyek: Proyek): KaryaItem {
    return {
        id: proyek.id,
        imageUrl: proyek.image_url,
        title: proyek.judul,
        description: proyek.deskripsi,
        author: proyek.user?.name || 'Unknown',
        jurusan: proyek.jurusan?.nama || 'Unknown',
        createdAt: proyek.created_at,
        status: proyek.status,
    };
}

// User/Account management types
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: 'guru' | 'siswa';
    nis_nip: string;
    jurusan_id: number;
    kelas_id?: number;
}

export interface UpdateUserData extends Partial<CreateUserData> {
    password?: string;
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    role?: 'guru' | 'siswa';
    jurusan_id?: number;
    kelas?: string;
    search?: string;
}

export interface UserStats {
    total_guru: number;
    total_siswa: number;
    by_jurusan: Record<string, Array<{role: string, count: number}>>;
}