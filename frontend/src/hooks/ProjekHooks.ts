import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, poster, putter, deleter } from '@/lib/axios';
import {
    Proyek,
    CreateProjekData,
    UpdateProjekData,
    ProjekQueryParams,
    PaginatedResponse,
    ApiResponse,
    KaryaItem,
    proyekToKaryaItem,
} from '@/types/proyek';

// Helper function to build query string
function buildQueryString(params: ProjekQueryParams): string {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.jurusan_id) queryParams.append('jurusan_id', params.jurusan_id.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.kelas) queryParams.append('kelas', params.kelas);

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Hook to fetch all projects with optional filtering and pagination
 */
export function useProjeks(params: ProjekQueryParams = {}) {
    const queryString = buildQueryString(params);
    const { data, error, isLoading, mutate } = useSWR(
        `/proyeks${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    console.log("Fetched proyeks data with params", params, ":", data);

    return {
        proyeks: (data as PaginatedResponse<Proyek>)?.data || [],
        pagination: (data as PaginatedResponse<Proyek>)?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch best projects (5 stars) for homepage display
 */
export function useBestProjeks() {
    const { data, error, isLoading, mutate } = useSWR(
        '/proyeks/best',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
        }
    );

    const proyeks = (data as ApiResponse<Proyek[]>)?.data || [];
    const karyaItems: KaryaItem[] = proyeks.map(proyek => proyekToKaryaItem(proyek));

    return {
        proyeks,
        karyaItems,
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch projects as KaryaItems for gallery display
 */
export function useKaryaItems(params: ProjekQueryParams = {}) {
    const { proyeks, pagination, isLoading, isError, mutate } = useProjeks(params);

    const karyaItems: KaryaItem[] = proyeks.map(proyek => proyekToKaryaItem(proyek));

    return {
        karyaItems,
        pagination,
        isLoading,
        isError,
        mutate,
    };
}

/**
 * Hook to fetch the latest 5 projects for homepage/preview
 */
export function useLatestProjeks() {
    const { data, error, isLoading, mutate } = useSWR(
        '/proyeks/latest',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
        }
    );

    return {
        proyeks: (data as ApiResponse<Proyek[]>)?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch current user's projects
 */
export function useMyProjeks(params: Omit<ProjekQueryParams, 'jurusan_id'> = {}) {
    const queryString = buildQueryString(params);
    const { data, error, isLoading, mutate } = useSWR(
        `/my-proyeks${queryString}`,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 30000,
        }
    );

    console.log("Fetched my-proyeks data:", data);

    return {
        proyeks: (data as ApiResponse<Proyek[]>)?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch ungraded projects for teachers (projects needing assessment)
 */
export function useUngradedProjeks(params: Omit<ProjekQueryParams, 'jurusan_id' | 'status'> = {}) {
    const queryString = buildQueryString(params);
    const { data, error, isLoading, mutate } = useSWR(
        `/proyeks/ungraded${queryString}`,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    console.log("Fetched ungraded proyeks data:", data);

    return {
        proyeks: (data as PaginatedResponse<Proyek>)?.data || [],
        pagination: (data as PaginatedResponse<Proyek>)?.pagination,
        message: (data as PaginatedResponse<Proyek>)?.message || '',
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch a single project by ID
 */
export function useProyek(id: number | string) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/proyeks/${id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
        }
    );

    console.log(`Fetched proyek data for ID ${id}:`, data);

    return {
        proyek: (data as ApiResponse<Proyek>)?.data,
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to create a new project
 */
export function useCreateProyek() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/proyeks',
        (url: string, { arg }: { arg: CreateProjekData }) => {
            // Check if we have a file to upload
            if (arg.image) {
                const formData = new FormData();
                formData.append('judul', arg.judul);
                formData.append('deskripsi', arg.deskripsi);
                if (arg.tautan_proyek) formData.append('tautan_proyek', arg.tautan_proyek);
                formData.append('jurusan_id', arg.jurusan_id.toString());
                if (arg.status) formData.append('status', arg.status);
                formData.append('image', arg.image);

                console.log("Creating proyek with image upload:", formData);

                return poster(url, formData);
            } else {
                console.log("Creating proyek without image upload:", arg);
                return poster(url, arg);
            }
        }
    );

    const createProyek = async (proyekData: CreateProjekData) => {
        try {
            const result = await trigger(proyekData);
            console.log("Proyek created successfully:", result);
            // Revalidate projects lists after successful creation
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        createProyek,
        isCreating: isMutating,
        error,
    };
}

/**
 * Hook to update an existing project
 */
export function useUpdateProyek(id: number | string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/proyeks/${id}`,
        (url: string, { arg }: { arg: UpdateProjekData }) => {
            // Check if we have a file to upload
            if (arg.image instanceof File) {
                const formData = new FormData();
                
                // 1. TAMBAHKAN INI: Method Spoofing untuk Laravel
                formData.append('_method', 'PUT');

                // Append data lainnya
                if (arg.judul) formData.append('judul', arg.judul);
                if (arg.deskripsi) formData.append('deskripsi', arg.deskripsi);
                if (arg.tautan_proyek) formData.append('tautan_proyek', arg.tautan_proyek);
                if (arg.jurusan_id) formData.append('jurusan_id', arg.jurusan_id.toString());
                if (arg.status) formData.append('status', arg.status);
                
                formData.append('image', arg.image);

                console.log("Updating proyek with image upload (Spoofed PUT). FormData entries:");
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }

                // 2. GUNAKAN 'poster' (POST) BUKAN 'putter' (PUT)
                // PHP tidak bisa baca body multipart/form-data via PUT request.
                // Kita kirim POST fisik, tapi Laravel baca sebagai PUT karena ada field _method.
                return poster(url, formData);
            } else {
                // Jika tidak ada gambar, update JSON biasa via PUT aman dilakukan
                console.log("Updating proyek without image upload:", arg);
                return putter(url, arg);
            }
        }
    );

    const updateProyek = async (proyekData: UpdateProjekData) => {
        try {
            const result = await trigger(proyekData);
            console.log("Proyek updated successfully:", result);
            
            // Revalidate specific project and lists
            mutate(`/proyeks/${id}`);
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        updateProyek,
        isUpdating: isMutating,
        error,
    };
}

/**
 * Hook to delete a project
 */
export function useDeleteProyek() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/proyeks',
        (url: string, { arg }: { arg: { proyekId: number | string } }) => {
            return deleter(`${url}/${arg.proyekId}`);
        }
    );

    const deleteProyek = async (proyekId: number | string) => {
        try {
            const result = await trigger({ proyekId });
            // Revalidate projects lists after successful deletion
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        deleteProyek,
        isDeleting: isMutating,
        error,
    };
}

/**
 * Hook to submit a project (change status to 'terkirim')
 */
export function useSubmitProyek(id: number | string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/proyeks/${id}`,
        (url: string) => {
            return putter(url, { status: 'terkirim' });
        }
    );

    const submitProyek = async () => {
        try {
            const result = await trigger();
            // Revalidate specific project and lists
            mutate(`/proyeks/${id}`);
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        submitProyek,
        isSubmitting: isMutating,
        error,
    };
}

/**
 * Hook for teachers to grade a project (change status to 'dinilai')
 */
export function useGradeProyek(id: number | string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/proyeks/${id}`,
        (url: string) => {
            return putter(url, { status: 'dinilai' });
        }
    );

    const gradeProyek = async () => {
        try {
            const result = await trigger();
            // Revalidate specific project and lists
            mutate(`/proyeks/${id}`);
            mutate((key) => typeof key === 'string' && key.startsWith('/proyeks'));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        gradeProyek,
        isGrading: isMutating,
        error,
    };
}

/**
 * Hook to get project statistics for dashboards
 */
export function useProjekStats() {
    const { data, error, isLoading } = useSWR('/proyeks/stats', fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 300000, // Refresh every 5 minutes
    });

    return {
        stats: data || {
            totalProjects: 0,
            submittedProjects: 0,
            gradedProjects: 0,
            myProjects: 0,
            recentProjects: [],
        },
        isLoading,
        isError: error,
    };
}