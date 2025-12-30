"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import KaryaCard from "@/components/ui/KaryaCard";
import { useBestProjeks } from "@/hooks/ProjekHooks";
import { Spinner } from "@/components/ui/spinner";

// Carousel configuration
const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
};

const customStyles = `
    .react-multi-carousel-list {
        padding: 0 0px;
    }
    
    .react-multi-carousel-dot-list {
        display: none;
    }
    
    .react-multiple-carousel__arrow {
        background: #4F6C9C;
        color: white;
        border: none;
        margin: 0 0 70px 0;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        font-size: 18px;
        font-weight: bold;
        z-index: 10;
    }
    
    .react-multiple-carousel__arrow:hover {
        background: #3A5998;
    }
    
    .react-multiple-carousel__arrow--left {
        left: 0;
    }   
    
    .react-multiple-carousel__arrow--right {
        right: 0;
    }
`;

interface KaryaCarouselProps {
    className?: string;
}

export default function KaryaCarousel({ className = "" }: KaryaCarouselProps) {
    const { karyaItems, isLoading, isError } = useBestProjeks();

    if (isLoading) {
        return (
            <div className={`py-8 ${className}`}>
                <div className="mb-6">
                    <h2 className="inline-block w-full text-center bg-gradient-to-r from-sky-400 to-sky-800 text-white px-6 py-3 rounded-full text-lg font-semibold">
                        Karya Unggulan
                    </h2>
                </div>
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <Spinner className="mx-auto mb-4" />
                        <p className="text-gray-600">Loading karya unggulan...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={`py-8 ${className}`}>
                <div className="mb-6">
                    <h2 className="inline-block w-full text-center bg-gradient-to-r from-sky-400 to-sky-800 text-white px-6 py-3 rounded-full text-lg font-semibold">
                        Karya Unggulan
                    </h2>
                </div>
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <p className="text-gray-500">Failed to load featured projects</p>
                    </div>
                </div>
            </div>
        );
    }

    if (karyaItems.length === 0) {
        return (
            <div className={`py-8 ${className}`}>
                <div className="mb-6">
                    <h2 className="inline-block w-full text-center bg-gradient-to-r from-sky-400 to-sky-800 text-white px-6 py-3 rounded-full text-lg font-semibold">
                        Karya Unggulan
                    </h2>
                </div>
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-gray-500">No featured projects available yet</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={`py-8 ${className}`}>
            <style>{customStyles}</style>

            <div className="mb-6">
                <h2 className="inline-block w-full text-center bg-gradient-to-r from-sky-600 to-bluealt-200 text-white px-6 py-3 rounded-full text-lg font-semibold">
                    Karya Unggulan
                </h2>
            </div>

            <div className="relative">
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={false}
                    keyBoardControl={true}
                    customTransition="transform 300ms ease-in-out"
                    transitionDuration={300}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={[]}
                    itemClass="px-2"
                    showDots={false}
                    arrows={true}
                >
                    {karyaItems.map((karya) => (
                        <KaryaCard key={karya.id} karya={karya} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}