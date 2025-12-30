"use client";

import { useState } from "react";
import SearchCard from "./components/SearchCard";
import FAQCard from "./components/FAQCard";
import KaryaCarousel from "@/components/ui/KaryaCarousel";

const faqData = [
    {
        id: 1,
        question: "Apa itu website Galeri Project Akhir SMKN 5 Malang?",
        answer: "Website ini adalah platform resmi sekolah untuk mengumpulkan, menampilkan, dan menilai project akhir siswa dari berbagai jurusan di SMKN 5 Malang. Siswa dapat mengunggah project melalui tautan eksternal, dan guru dapat melakukan review serta memberikan penilaian.",
        category: "umum"
    },
    {
        id: 2,
        question: "Bagaimana cara siswa mengunggah project?",
        answer: "Siswa harus login terlebih dahulu, kemudian masuk ke dashboard siswa dan klik “Unggah Project Baru”. Isi judul, deskripsi, jurusan, dan tautan eksternal (Google Drive, YouTube, GitHub, Figma), lalu simpan.",
        category: "karya"
    },
    {
        id: 3,
        question: "Apakah saya bisa upload file langsung ke website?",
        answer: "Tidak. Sistem hanya menerima tautan eksternal untuk menghemat kapasitas server. Pastikan tautan diset ke “public” atau “anyone with the link can view”.",
        category: "karya"
    },
    {
        id: 4,
        question: "Bagaimana sistem penilaian project bekerja?",
        answer: "Guru dapat melihat project siswa dengan login dan masuk pada dashboard guru, lalu memberikan nilai menggunakan rentang bintang 1–5. Nilai ini akan langsung muncul di dashboard siswa.",
        category: "karya"
    },
    {
        id: 5,
        question: "Apakah pengguna umum harus login untuk melihat project?",
        answer: "Tidak. Pengguna umum bebas melihat daftar project melalui halaman galeri tanpa harus login tetapi memiliki keterbatasan akses hanya melihat project saja.",
        category: "umum"
    }
];

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");

    const filteredFAQ = faqData.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === "Semua" || 
                              item.category === selectedCategory.toLowerCase();
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl md:pt-30">
            <h1 className="text-3xl text-sky-700 font-bold text-center mb-8">Tanya Jawab</h1>
            <SearchCard 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            
            <div className="space-y-4">
                {filteredFAQ.length > 0 ? (
                    filteredFAQ.map((faq) => (
                        <FAQCard 
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Hasil pencarian tidak tersedia</p>
                    </div>
                )}
            </div>
        </div>
    );
}