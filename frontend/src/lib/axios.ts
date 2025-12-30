import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    // HARDCODED FOR ANDROID DEBUGGING
    baseURL: 'http://localhost:8081/api',
    // baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60    seconds timeout
});

// Request Interceptor: Auto-attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors and token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle offline/connection refused specifically for build process
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.warn('Backend unavailable (offline mode), returning mock data');
            return Promise.resolve({ data: { data: [] } });
        }

        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth data
            Cookies.remove('token');
            Cookies.remove('user');

            // Only redirect if we're in the browser and not already on login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Enhanced error object for SWR
        const enhancedError = {
            ...error,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        };

        return Promise.reject(enhancedError);
    }
);

// SWR-compatible fetcher function
export const fetcher = async (url: string) => {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        // Only swallow errors during build time (Node.js environment)
        if (typeof window === 'undefined') {
            console.warn(`[Build Mock] Fetch failed for ${url}, returning empty data`);
            return { data: [] };
        }
        // In browser/app, throw the real error so we can debug it
        console.error("AXIOS FETCH ERROR:", error);
        throw error;
    }
};

// Helper function for POST requests with SWR mutation
export const poster = async (url: string, data: any, config?: any) => {
    // If data is FormData, let browser set Content-Type automatically
    const requestConfig = data instanceof FormData ? {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': undefined // Let browser set multipart boundary
        }
    } : config;

    const response = await axiosInstance.post(url, data, requestConfig);
    return response.data;
};

// Helper function for PUT requests with SWR mutation  
export const putter = async (url: string, data: any, config?: any) => {
    // If data is FormData, let browser set Content-Type automatically
    const requestConfig = data instanceof FormData ? {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': undefined // Let browser set multipart boundary
        }
    } : config;

    const response = await axiosInstance.put(url, data, requestConfig);
    return response.data;
};

// Helper function for DELETE requests with SWR mutation
export const deleter = async (url: string) => {
    const response = await axiosInstance.delete(url);
    return response.data;
};

export default axiosInstance;