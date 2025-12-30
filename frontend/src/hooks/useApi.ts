import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, poster, putter, deleter } from '@/lib/axios';

// User Profile Hook
export function useProfile() {
    const { data, error, isLoading, mutate } = useSWR('/profile', fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 60000, // 1 minute
    });

    return {
        user: data?.user || data, // Handle nested user object
        isLoading,
        isError: error,
        mutate,
    };
}

// Gallery Photos Hook
export function usePhotos(page = 1, limit = 12) {
    const { data, error, isLoading, mutate } = useSWR(
        `/photos?page=${page}&limit=${limit}`, 
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    return {
        photos: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

// User Statistics Hook (for dashboards)
export function useUserStats() {
    const { data, error, isLoading } = useSWR('/user-stats', fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 300000, // Refresh every 5 minutes
    });

    console.log('User Stats Data:', data);

    return {
        stats: {
            totalUsers: data?.stats?.totalUsers || 0,
            totalGuru: data?.stats?.totalGuru || 0,
            totalSiswa: data?.stats?.totalSiswa || 0,
            totalGalleries: data?.stats?.totalGalleries || 0,
            userUploads: data?.stats?.userUploads || 0,
            userViews: data?.stats?.userViews || 0,
            totalProyeks: data?.stats?.totalProyeks || 0,
            todayActivities: 0,
            monthlyVisits: 0,
            favoritePhotos: 0,
            jumlahKarya: data?.stats?.jumlahKarya || 0
        },
        isLoading,
        isError: error,
    };
}

// Upload Photo Mutation Hook
export function useUploadPhoto() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/photos', 
        (url: string, { arg }: { arg: FormData }) => {
            return poster(url, arg);
        }
    );

    const uploadPhoto = async (photoData: FormData) => {
        try {
            const result = await trigger(photoData);
            // Revalidate photos list after successful upload
            mutate((key) => typeof key === 'string' && key.startsWith('/photos'));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        uploadPhoto,
        isUploading: isMutating,
        error,
    };
}

// Update Profile Mutation Hook
export function useUpdateProfile() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/profile',
        (url: string, { arg }: { arg: any }) => {
            return putter(url, arg);
        }
    );

    const updateProfile = async (profileData: any) => {
        try {
            const result = await trigger(profileData);
            // Revalidate profile data after successful update
            mutate('/profile');
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        updateProfile,
        isUpdating: isMutating,
        error,
    };
}

// Delete Photo Mutation Hook
export function useDeletePhoto() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/photos',
        (url: string, { arg }: { arg: { photoId: number } }) => {
            return deleter(`${url}/${arg.photoId}`);
        }
    );

    const deletePhoto = async (photoId: number) => {
        try {
            const result = await trigger({ photoId });
            // Revalidate photos list after successful deletion
            mutate((key) => typeof key === 'string' && key.startsWith('/photos'));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        deletePhoto,
        isDeleting: isMutating,
        error,
    };
}

// Users Management Hook (Admin only)
export function useUsers(page = 1, limit = 10) {
    const { data, error, isLoading, mutate } = useSWR(
        `/admin/users?page=${page}&limit=${limit}`,
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 30000, // Refresh every 30 seconds for admin
        }
    );

    return {
        users: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

// Create User Mutation Hook (Admin)
export function useCreateUser() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/admin/users',
        (url: string, { arg }: { arg: any }) => {
            return poster(url, arg);
        }
    );

    const createUser = async (userData: any) => {
        try {
            const result = await trigger(userData);
            // Revalidate users list
            mutate((key) => typeof key === 'string' && key.startsWith('/admin/users'));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        createUser,
        isCreating: isMutating,
        error,
    };
}