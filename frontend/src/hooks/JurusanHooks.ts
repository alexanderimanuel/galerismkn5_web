import useSWR from 'swr';
import { fetcher } from '@/lib/axios';
import { Jurusan, ApiResponse } from '@/types/proyek';

/**
 * Hook to fetch all jurusans
 */
export function useJurusans() {
    const { data, error, isLoading, mutate } = useSWR('/jurusans', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 300000, // 5 minutes - jurusans don't change often
    });

    return {
        jurusans: (data as ApiResponse<Jurusan[]>)?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}