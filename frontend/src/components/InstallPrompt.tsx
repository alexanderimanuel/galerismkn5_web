'use client';

import { useInstallPrompt } from '@/context/InstallContext';
import { Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const InstallPrompt = () => {
    const { isInstallable, triggerInstall } = useInstallPrompt();
    const [showPrompt, setShowPrompt] = useState(false);
    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        if (isInstallable && !isNative) {
            setShowPrompt(true);
        }
    }, [isInstallable, isNative]);

    const handleInstallClick = async () => {
        await triggerInstall();
        setShowPrompt(false);
    };

    if (!showPrompt || isNative) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-8 md:left-auto md:right-8 md:w-96 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Download className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 text-sm">Install Aplikasi</h3>
                        <p className="text-xs text-slate-500">Akses lebih cepat & hemat kuota</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPrompt(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
