"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <div className="relative w-full h-120 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/fotosmkn5landing.png"
                    alt="SMKN 5 Malang Building"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-bluealt-200/30"></div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Selamat Datang!
                </h1>
                <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                    Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!
                </p>
            </div>
        </div>
    );
}