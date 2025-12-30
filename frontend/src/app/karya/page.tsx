"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import KaryaSiswa from "@/features/KaryaSiswa/page";

export default function Karya() {
    const { user, logout } = useAuth();

    return (
        <AuthLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <KaryaSiswa user={user} logout={logout} />
            </div>
        </AuthLayout>
    );
}