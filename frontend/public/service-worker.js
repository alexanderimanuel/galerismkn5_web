
const CACHE_NAME = 'galeri-smkn5-v1';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event - claim clients to control them immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Fetch event - currently just a pass-through, but required for PWA
self.addEventListener('fetch', (event) => {
    // Logic can be added here for offline caching
});
