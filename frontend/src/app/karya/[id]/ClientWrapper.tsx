"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import GuestLayout from "@/components/layouts/GuestLayout";
import { useAuth } from "@/context/AuthContext";
import DetailKaryaSiswa from "@/features/KaryaSiswa/DetailKaryaSiswa/page";

export default function ClientWrapper() {
    const { user, logout } = useAuth();

    return (
        <GuestLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <DetailKaryaSiswa user={user} logout={logout} />
            </div>
        </GuestLayout>
    );
}
