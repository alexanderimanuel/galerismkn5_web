import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SWRProvider from "@/providers/SWRProvider";
import ProgressProviders from '@/app/bprogress';
import MobileNav from "@/components/MobileNav";
import InstallPrompt from "@/components/InstallPrompt";
import type { Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Galeri SMKN 5",
  description: "Sistem Galeri Digital SMKN 5",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Galeri SMKN 5",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often desired for "app-like" feel, though accessibility concerns exist. For a school gallery app, maybe acceptable.
  // Actually, let's stick to standard practice unless requested.
  // But for PWA, interactive-widget is good.
  interactiveWidget: "resizes-content",
};


import { InstallProvider } from "@/context/InstallContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressProviders>
          <SWRProvider>
            <AuthProvider>
              <InstallProvider>
                {children}
                <MobileNav />
                <InstallPrompt />
                <ServiceWorkerRegister />
              </InstallProvider>
            </AuthProvider>
          </SWRProvider>
        </ProgressProviders>
      </body>
    </html>
  );
}
