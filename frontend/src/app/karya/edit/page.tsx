"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import EditKaryaSiswa from "@/features/KaryaSiswa/EditKaryaSiswa/page";

export default function Karya() {
    const { user, logout } = useAuth();

    return (
        <AuthLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <EditKaryaSiswa user={user} logout={logout} />
            </div>
        </AuthLayout>
    );
}