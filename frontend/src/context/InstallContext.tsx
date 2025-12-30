'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface InstallContextType {
    isInstallable: boolean;
    triggerInstall: () => Promise<void>;
}

const InstallContext = createContext<InstallContextType | undefined>(undefined);

export function InstallProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            setIsInstallable(false);
        } else {
            // Always show button if not installed, we'll handle the click behavior
            setIsInstallable(true);
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        const installedHandler = () => {
            setIsInstallable(false);
            setDeferredPrompt(null);

            // Notify user to open the app
            import('sweetalert2').then((Swal) => {
                Swal.default.fire({
                    icon: 'success',
                    title: 'Berhasil Diinstall!',
                    text: 'Silakan buka aplikasi dari Home Screen / Desktop Anda untuk tampilan layar penuh.',
                    confirmButtonText: 'Oke',
                    confirmButtonColor: '#0ea5e9'
                });
            });
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', installedHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installedHandler);
        };
    }, []);

    const triggerInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setIsInstallable(false);
            }
        } else {
            // Fallback: Show manual instructions using SweetAlert
            const Swal = (await import('sweetalert2')).default;

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

            if (isIOS) {
                Swal.fire({
                    title: 'Install Aplikasi',
                    html: `
            <div class="text-left text-sm text-gray-600">
              <p class="mb-3">Untuk menginstall aplikasi di iOS:</p>
              <ol class="list-decimal pl-5 space-y-2">
                <li>Ketuk tombol <strong>Share</strong> <svg class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg> di bawah layar.</li>
                <li>Gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).</li>
                <li>Ketuk <strong>Add</strong> (Tambah).</li>
              </ol>
            </div>
          `,
                    confirmButtonText: 'Mengerti',
                    confirmButtonColor: '#0ea5e9'
                });
            } else {
                Swal.fire({
                    title: 'Install Aplikasi',
                    html: `
            <div class="text-left text-sm text-gray-600">
              <p class="mb-3">Untuk menginstall aplikasi:</p>
              <ol class="list-decimal pl-5 space-y-2">
                <li>Klik ikon titik tiga (menu) di pojok kanan atas browser.</li>
                <li>Pilih <strong>"Install App"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                <li>Ikuti petunjuk di layar.</li>
              </ol>
            </div>
          `,
                    confirmButtonText: 'Siap!',
                    confirmButtonColor: '#0ea5e9'
                });
            }
        }
    };

    return (
        <InstallContext.Provider value={{ isInstallable, triggerInstall }}>
            {children}
        </InstallContext.Provider>
    );
}

export function useInstallPrompt() {
    const context = useContext(InstallContext);
    if (context === undefined) {
        throw new Error('useInstallPrompt must be used within an InstallProvider');
    }
    return context;
}
