'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, Image as ImageIcon, Download } from 'lucide-react';
import { useInstallPrompt } from '@/context/InstallContext';
import { Capacitor } from '@capacitor/core';



const MobileNav = () => {
    const pathname = usePathname();
    const { isInstallable, triggerInstall } = useInstallPrompt();
    const isNative = Capacitor.isNativePlatform();

    const navItems = [
        {
            name: 'Beranda',
            href: '/',
            icon: Home,
        },
        {
            name: 'Galeri',
            href: '/karya',
            icon: ImageIcon,
        },
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            name: 'Akun',
            href: '/kelolaakun',
            icon: User,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                {isInstallable && !isNative && (
                    <button
                        onClick={triggerInstall}
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-slate-900"
                    >
                        <Download className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Install</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileNav;
