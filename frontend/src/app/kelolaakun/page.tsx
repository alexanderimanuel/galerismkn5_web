"use client";

import { useAuth } from "@/context/AuthContext";
import KelolaAkun from "@/features/KelolaAkun/page";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function Dashboard() {
    const { user, logout } = useAuth();

    if (user?.role === 'admin') {
        return (
            <AuthLayout>
                <KelolaAkun user={user} logout={logout} />
            </AuthLayout>
        );
    } 

    return (
        <AuthLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Pakai akun admin untuk mengakses halaman ini.</p>
                </div>
            </div>
        </AuthLayout>
    );
}