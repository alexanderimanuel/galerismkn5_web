"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import AddKaryaSiswa from "@/features/KaryaSiswa/AddKaryaSiswa/page";

export default function Karya() {
    const { user, logout } = useAuth();

    return (
        <AuthLayout>
            <AddKaryaSiswa user={user} logout={logout} />
        </AuthLayout>
    );
}