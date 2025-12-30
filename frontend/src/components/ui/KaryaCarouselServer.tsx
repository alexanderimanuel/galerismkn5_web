import { Proyek, proyekToKaryaItem, KaryaItem } from '@/types/proyek';
import KaryaCarouselClient from '@/components/ui/KaryaCarouselClient';

// Server-side data fetching function
async function getFeaturedProjects(): Promise<KaryaItem[]> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Fetch featured projects from API
        const response = await fetch(`${apiUrl}/api/proyeks?status=dinilai&limit=6&page=1`, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch featured projects');
        }

        const data = await response.json();
        
        // Transform Proyek data to KaryaItem
        if (data.success && data.data) {
            const proyeks: Proyek[] = data.data;
            return proyeks.map(proyek => proyekToKaryaItem(proyek));
        }

        return [];
    } catch (error) {
        console.error('Error fetching featured projects:', error);
        return [];
    }
}

interface KaryaCarouselProps {
    className?: string;
}

export default async function KaryaCarousel({ className = "" }: KaryaCarouselProps) {
    const featuredProjects = await getFeaturedProjects();

    return (
        <KaryaCarouselClient 
            karyaItems={featuredProjects} 
            className={className}
        />
    );
}