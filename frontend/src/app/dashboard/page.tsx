"use client";

import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/features/AdminDashboard/page";
import GuruDashboard from "@/features/GuruDashboard/page";
import SiswaDashboard from "@/features/SiswaDashboard/page";

export default function Dashboard() {
    const { user, logout } = useAuth();

    // Route to different dashboards based on user role
    if (user?.role === 'admin') {
        return <AdminDashboard user={user} logout={logout} />;
    } else if (user?.role === 'guru') {
        return <GuruDashboard user={user} logout={logout} />;
    } else if (user?.role === 'siswa') {
        return <SiswaDashboard user={user} logout={logout} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600">Invalid user role</p>
            </div>
        </div>
    );
}