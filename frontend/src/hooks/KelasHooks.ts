import useSWR from 'swr';
import { fetcher } from '@/lib/axios';
import { ApiResponse } from '@/types/proyek';

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: string;
    jurusan_id: number;
}

interface AvailableStudent {
    id: number;
    name: string;
    nis: string;
    kelas_id: number;
}

/**
 * Hook to fetch kelas by jurusan ID
 */
export function useKelasByJurusan(jurusanId?: number | null) {
    const shouldFetch = jurusanId && jurusanId > 0;
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? `/kelas/by-jurusan?jurusan_id=${jurusanId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    // console.log(`Fetched kelas data for jurusan ID ${jurusanId}:`, data);

    return {
        kelas: (data as ApiResponse<Kelas[]>)?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch available students by kelas ID for account claiming
 */
export function useAvailableStudents(kelasId?: number | null) {
    const shouldFetch = kelasId && kelasId > 0;
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? `/siswa/available?kelas_id=${kelasId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    // console.log(`Fetched available students for kelas ID ${kelasId}:`, data);

    return {
        students: (data as ApiResponse<AvailableStudent[]>)?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch all available kelas
 */
export function useAllKelas() {
    const { data, error, isLoading, mutate } = useSWR(
        '/kelas',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
        }
    );

    // console.log("Fetched all kelas data:", data);

    return {
        kelas: (data as ApiResponse<Kelas[]>)?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}