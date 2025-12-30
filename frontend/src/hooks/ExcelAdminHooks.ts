import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, poster } from '@/lib/axios';
import { ApiResponse } from '@/types/proyek';

// Types for Excel import operations
export interface ImportStats {
    total_siswa: number;
    active_siswa: number;
    inactive_siswa: number;
    recent_imports_7_days: number;
    import_guidelines: {
        required_columns: string[];
        supported_formats: string[];
        max_file_size: string;
        notes: string[];
    };
}

export interface ImportResult {
    imported_rows: number;
    total_rows: number;
    error_rows: number;
    errors: any[];
    message: string;
}

// Hook for fetching import status/statistics
export function useImportStatus() {
    const { data, error, mutate, isValidating } = useSWR<ApiResponse<ImportStats>>(
        '/admin/students/import/status',
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 30000, // Refresh every 30 seconds
        }
    );

    return {
        stats: data?.data,
        isLoading: !error && !data,
        isError: error,
        isValidating,
        mutate
    };
}

// Custom hook for Excel import operations using SWR mutations
export function useExcelMutations() {
    // Import students mutation
    const { 
        trigger: importTrigger, 
        isMutating: isImporting, 
        error: importError 
    } = useSWRMutation(
        '/admin/import-students',
        (url: string, { arg }: { arg: FormData }) => poster(url, arg)
    );

    // Download template mutation (using standard fetch since it returns a blob)
    const { 
        trigger: downloadTrigger, 
        isMutating: isDownloading, 
        error: downloadError 
    } = useSWRMutation(
        '/download-template',
        async (url: string) => {
            // Use the configured axios instance for proper auth and base URL handling
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${url}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        // Add authorization header if token exists
                        ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        })
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Template download failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        }
    );

    const importStudents = async (file: File): Promise<ImportResult> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await importTrigger(formData);
            
            if (!result.success) {
                throw new Error(result.message || 'Import failed');
            }

            return result.data as ImportResult;
        } catch (error: any) {
            // Enhanced error handling for different response types
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please login again.');
            } else if (error.response?.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else if (error.response?.status === 422) {
                const validationErrors = error.response?.data?.errors || {};
                const errorMessages = Object.values(validationErrors).flat();
                throw new Error(`Validation error: ${errorMessages.join(', ')}`);
            } else if (error.message?.includes('non-JSON')) {
                throw new Error('Server returned invalid response format');
            } else {
                throw new Error(error.message || 'Failed to import Excel file');
            }
        }
    };

    const downloadTemplate = async (): Promise<void> => {
        try {
            const blob = await downloadTrigger();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template_import_siswa.xlsx';
            document.body.appendChild(a);
            a.click();

            console.log('link: ', a.href);
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            throw new Error(error.message || 'Failed to download template');
        }
    };

    return {
        importStudents,
        downloadTemplate,
        isImporting,
        isDownloading,
        importError,
        downloadError,
    };
}

// Combined hook for Excel admin operations
export function useExcelAdmin() {
    const { stats, isLoading: isLoadingStats, isError: statsError, mutate: mutateStats } = useImportStatus();
    const { 
        importStudents, 
        downloadTemplate, 
        isImporting, 
        isDownloading, 
        importError, 
        downloadError 
    } = useExcelMutations();

    return {
        // Import status
        stats,
        isLoadingStats,
        statsError,
        mutateStats,
        
        // Import operations
        importStudents,
        downloadTemplate,
        isImporting,
        isDownloading,
        importError,
        downloadError,
    };
}