import { Assessment } from "@/types/assessment";

const assessmentData: Assessment[] = [
  {
    id: "minat-bakat",
    title: "Tes Minat Bakat",
    paragraph:
      "Tes minat bakat membantu mahasiswa mengenali kecenderungan, potensi, dan bidang yang sesuai dengan dirinya.",
    rules:
      "Kenali potensi diri, karakter, serta arah karier yang sesuai dengan bakat dan minatmu. Kamu akan menjawab beberapa pertanyaan sederhana seputar kepribadian, cara berpikir, hingga gaya komunikasi. Dari hasil tersebut, kamu dapat mengetahui kelebihan dan kelemahan diri, kecenderungan bidang yang sesuai, dan rekomendasi  arah karier di masa depan.",
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
