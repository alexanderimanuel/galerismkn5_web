"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // 1. Unregister old 'sw.js' if it exists (cleanup)
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    if (registration.active?.scriptURL.includes('sw.js')) {
                        console.log("Unregistering old sw.js");
                        registration.unregister();
                    }
                }
            });

            // 2. Register new 'service-worker.js'
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {
                    console.log("New Service Worker registered with scope:", registration.scope);

                    // Force update if one is waiting
                    if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
    }, []);

    return null;
}
