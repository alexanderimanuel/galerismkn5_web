"use client";

import LandingPage from "@/features/LandingPage/page";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { user, logout, isLoading } = useAuth();

    return (
        <div className="flex w-full flex-col items-center justify-between py-8 px-4">
            <LandingPage user={user} logout={logout} isLoading={isLoading} />
        </div>
    );
}