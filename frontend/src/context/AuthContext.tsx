"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from 'js-cookie';
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Jurusan } from "@/types/proyek";
import { Kelas } from "@/types/proyek";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'guru' | 'siswa';
    nis_nip?: string;
    jurusan_id?: number;
    jurusan_name?: string;
    jurusan?: Jurusan;
    kelas_id?: number;
    kelas?: Kelas;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, nis: string, password: string, role: string, jurusan_id: number, kelas?: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Helper to clear error
    const clearError = () => setError(null);

    // Check for existing token on app load
    useEffect(() => {
        const storedToken = Cookies.get("token");
        const storedUser = Cookies.get("user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                const userData = JSON.parse(storedUser);
                
                // Check if user data is nested under 'user' property
                const actualUserData = userData.user || userData;
                
                // Add helper methods to user object
                const userWithMethods = {
                    ...actualUserData,
                    isGuru: () => actualUserData.role === 'guru',
                    isSiswa: () => actualUserData.role === 'siswa'
                };
                
                setUser(userWithMethods);
                
                // Verify token is still valid by fetching fresh user data
                axios.get("/user")
                    .then((res) => {
                        // Extract user data - handle both nested and direct formats
                        const freshUserData = res.data.user || res.data;
                        const freshUser = {
                            ...freshUserData,
                            isGuru: () => freshUserData.role === 'guru',
                            isSiswa: () => freshUserData.role === 'siswa'
                        };
                        setUser(freshUser);
                        Cookies.set("user", JSON.stringify(freshUserData), { expires: 7 });
                    })
                    .catch(() => {
                        // Token is invalid, clear everything
                        Cookies.remove("token");
                        Cookies.remove("user");
                        setToken(null);
                        setUser(null);
                    })
                    .finally(() => setIsLoading(false));
            } catch (error) {
                // Invalid stored user data, clear everything
                Cookies.remove("token");
                Cookies.remove("user");
                setToken(null);
                setUser(null);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.post("/login", { email, password });
            
            const { access_token, user: userData } = response.data;

            // Add helper methods to user object
            const userWithMethods = {
                ...userData,
                isGuru: () => userData.role === 'guru',
                isSiswa: () => userData.role === 'siswa'
            };

            // Save to Cookie (Expires in 7 days)
            Cookies.set("token", access_token, { expires: 7 });
            Cookies.set("user", JSON.stringify(userData), { expires: 7 });
            
            setToken(access_token);
            setUser(userWithMethods);
            
            router.push("/dashboard"); // Redirect after login
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, nis: string, password: string, role: string, jurusan_id: number, kelas?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const requestData: any = {
                name,
                email,
                nis_nip: nis,
                password,
                password_confirmation: password,
                role,
                jurusan_id
            };

            // Add kelas only for siswa role
            if (role === 'siswa' && kelas) {
                requestData.kelas = kelas;
            }

            const response = await axios.post("/register", requestData);

            const { access_token, user: userData } = response.data;

            // Add helper methods to user object
            const userWithMethods = {
                ...userData,
                isGuru: () => userData.role === 'guru',
                isSiswa: () => userData.role === 'siswa'
            };

            // Save to Cookie (Expires in 7 days)
            Cookies.set("token", access_token, { expires: 7 });
            Cookies.set("user", JSON.stringify(userData), { expires: 7 });
            
            setToken(access_token);
            setUser(userWithMethods);
            
            router.push("/dashboard"); // Redirect after registration
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            
            // Attempt to logout on server (best effort)
            if (token) {
                try {
                    await axios.post("/logout");
                } catch {
                    // Continue logout even if server request fails
                }
            }
        } finally {
            // Clear local state regardless of server response
            Cookies.remove("token");
            Cookies.remove("user");
            setToken(null);
            setUser(null);
            setIsLoading(false);
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            register, 
            logout, 
            isLoading, 
            error, 
            clearError,
            setUser,
            setToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};