import { Assessment } from "@/types/assessment";

const assessmentData: Assessment[] = [
  {
    id: "minat-bakat",
    title: "Asesmen Bidang Karir",
    paragraph:
      "Tes ini membantu mahasiswa mengenali kecenderungan, potensi, dan bidang karir yang sesuai dengan dirinya.",
    rules: [
      "Tes ini membantu mahasiswa mengenali kecenderungan, potensi, dan bidang karir yang sesuai dengan dirinya.",
      "Jawablah setiap pertanyaan dengan jujur sesuai dengan kondisi dirimu.",
      "Baca pertanyaan dengan seksama sebelum memilih jawaban.",
      "Tidak ada jawaban benar atau salah, semua menggambarkan keunikanmu.",
      "Selesaikan seluruh pertanyaan agar hasil asesmen dapat ditampilkan.",
      "Gunakan perangkat dengan koneksi internet yang stabil saat mengerjakan.",
      "Simpan hasil asesmen sebagai referensi untuk pengembangan diri dan kariermu."
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
