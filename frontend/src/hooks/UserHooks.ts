import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, poster, putter, deleter } from '@/lib/axios';
import { 
    User, 
    CreateUserData, 
    UpdateUserData, 
    UserQueryParams, 
    UserStats,
    PaginatedResponse,
    ApiResponse 
} from '@/types/proyek';

// Build query string from params
function buildQueryString(params: UserQueryParams): string {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.role) searchParams.set('role', params.role);
    if (params.jurusan_id) searchParams.set('jurusan_id', params.jurusan_id.toString());
    if (params.kelas) searchParams.set('kelas', params.kelas);
    if (params.search) searchParams.set('search', params.search);
    
    return searchParams.toString();
}

// Hook for fetching users with pagination and filtering
export function useUsers(params: UserQueryParams = {}) {
    const queryString = buildQueryString(params);
    
    const { data, error, mutate, isValidating } = useSWR<PaginatedResponse<User>>(
        `/akuns${queryString ? `?${queryString}` : ''}`, 
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
        }
    );
    
    return {
        users: data?.data || [],
        pagination: data?.pagination,
        isLoading: !error && !data,
        isError: error,
        isValidating,
        mutate
    };
}

// Hook for fetching single user
export function useUser(id: number) {
    const { data, error, mutate } = useSWR<ApiResponse<User>>(
        id ? `/akuns/${id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    
    return {
        user: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}

// Hook for fetching user statistics
export function useUserStats() {
    const { data, error, mutate } = useSWR<ApiResponse<UserStats>>(
        '/akuns-stats',
        fetcher,
        {
            refreshInterval: 30000, // Refresh every 30 seconds
        }
    );
    
    return {
        stats: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}

// Custom hook for user operations using SWR mutations
export function useUserMutations() {
    // Create user mutation
    const { trigger: createTrigger, isMutating: isCreating, error: createError } = useSWRMutation(
        '/akuns',
        (url: string, { arg }: { arg: CreateUserData }) => poster(url, arg)
    );

    // Update user mutation  
    const { trigger: updateTrigger, isMutating: isUpdating, error: updateError } = useSWRMutation(
        '/akuns',
        (url: string, { arg }: { arg: { id: number; data: UpdateUserData } }) => 
            putter(`${url}/${arg.id}`, arg.data)
    );

    // Delete user mutation
    const { trigger: deleteTrigger, isMutating: isDeleting, error: deleteError } = useSWRMutation(
        '/akuns',
        (url: string, { arg }: { arg: { id: number } }) => deleter(`${url}/${arg.id}`)
    );

    const createUser = async (userData: CreateUserData) => {
        try {
            const result = await createTrigger(userData);
            return result;
        } catch (error) {
            throw error;
        }
    };

    const updateUser = async (id: number, userData: UpdateUserData) => {
        try {
            const result = await updateTrigger({ id, data: userData });
            return result;
        } catch (error) {
            throw error;
        }
    };

    const deleteUser = async (id: number) => {
        try {
            const result = await deleteTrigger({ id });
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        createUser,
        updateUser,
        deleteUser,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
    };
}