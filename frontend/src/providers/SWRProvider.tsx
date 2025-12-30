'use client';

import { SWRConfig } from 'swr';
import { fetcher } from '@/lib/axios';

interface SWRProviderProps {
    children: React.ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
    return (
        <SWRConfig
            value={{
                fetcher,
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
                dedupingInterval: 60000, // 1 minute
                errorRetryCount: 3,
                errorRetryInterval: 5000, // 5 seconds
                loadingTimeout: 10000, // 10 seconds
                onError: (error) => {
                    console.error('SWR Error:', error);
                    
                    // Handle specific error cases
                    if (error.status === 429) {
                        // Rate limiting - show user-friendly message
                        console.warn('Rate limit exceeded. Please slow down requests.');
                    } else if (error.status >= 500) {
                        // Server errors - could show toast notification
                        console.error('Server error occurred:', error.message);
                    }
                },
                onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                    // Don't retry on 404, 401, or 403
                    if (error.status === 404 || error.status === 401 || error.status === 403) {
                        return;
                    }

                    // Don't retry more than 3 times
                    if (retryCount >= 3) return;

                    // Retry after 5 seconds
                    setTimeout(() => revalidate({ retryCount }), 5000);
                },
                // Global fallback data
                fallback: {
                    '/profile': null,
                    '/user/stats': {
                        totalUsers: 0,
                        totalGuru: 0,
                        totalSiswa: 0,
                        totalGalleries: 0,
                        userUploads: 0,
                        userViews: 0,
                        todayActivities: 0,
                        monthlyVisits: 0,
                        favoritePhotos: 0
                    }
                }
            }}
        >
            {children}
        </SWRConfig>
    );
}