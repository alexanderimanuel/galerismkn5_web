"use client";

import { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans pb-16 md:pb-0">
            <Navbar />
            <main className="min-h-screen bg-white">
                {children}
            </main>
            <Footer />
        </div>
    );
}