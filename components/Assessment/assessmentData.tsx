import { Assessment } from "@/types/assessment";

const assessmentData: Assessment[] = [
  {
    id: "talenta",
    title: "Asesmen Talenta Mahasiswa",
    paragraph:
      "Tes ini membantu mahasiswa mengenali kecenderungan, potensi, dan bidang karir yang sesuai dengan dirinya.",
    rules: [
      "Asesmen Talenta Mahasiswa terdiri dari 2 bagian utama:",
      "Asesmen 1 – Bidang Karier Ideal (40 pertanyaan)",
      "Asesmen 2 – Pola Perilaku (36 pertanyaan)",
      "Setiap bagian memiliki instruksi dan cara pengerjaan masing-masing, jadi pastikan kamu membacanya dengan cermat sebelum memulai.",
      "Setelah menyelesaikan semua bagian asesmen, kamu bisa langsung melihat dan mengunduh hasilnya sebagai panduan pengembangan diri dan kariermu.",
      "Selamat mengerjakan!"
    ],
    image: "/images/asesmen/asesmen-01.jpg",
    author: {
      name: "CCED Universitas Lampung",
      image: "/images/asesmen/author-01.png",
      designation: "Tes Potensi",
    },
    tags: ["New"],
    publishDate: "2025",
  },
];

export default assessmentData;
