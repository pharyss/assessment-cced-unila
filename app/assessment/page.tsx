import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleAssessment from "@/components/Assessment/SingleAssessment";
import type { Assessment } from "@/types/assessment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tes Asesmen | CCED Universitas Lampung",
  description:
    "Ikuti asesmen untuk mengenali karakteristik, emosi, gaya komunikasi, dan cara berpikirmu",
};

const assessmentData: Assessment[] = [
  {
    id: "talenta-mahasiswa",
    title: "Asesmen Talenta Mahasiswa",
    paragraph:
      "Asesmen ini membantumu memahami minat karier, pola perilaku, dan kekuatan talenta untuk pengembangan diri yang lebih terarah.",
    rules: [
      "Siapkan waktu 20–30 menit di tempat yang tenang.",
      "Jawab sesuai kondisi dan pengalamanmu saat ini.",
      "Tidak ada jawaban benar atau salah — yang penting jujur.",
    ],
    image: "/images/assessment/assessment-01.jpg",
    author: {
      name: "CCED Universitas Lampung",
      image: "/images/assessment/author-01.png",
      designation: "Center for Career & Entrepreneurship Development",
    },
    tags: ["Karier", "Talenta", "Perilaku"],
    publishDate: "2025-01-01",
  },
];

export default function Assessment() {
  return (
    <>
      <Breadcrumb
        pageName="Tes Asesmen"
        description="Ikuti asesmen untuk mengenali karakteristik dan potensi dirimu"
      />

      <section className="pb-[50px] pt-[50px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-start">
            {assessmentData.map((assessment) => (
              <div
                key={assessment.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleAssessment assessment={assessment} />
              </div>
            ))}
          </div>

          {/* Pagination placeholder (non-functional) */}
          <div
            className="wow fadeInUp -mx-4 flex flex-wrap"
            data-wow-delay=".15s"
          >
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    Sebelumnya
                  </span>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-myunila px-4 text-sm text-white">
                    1
                  </span>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    2
                  </span>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    3
                  </span>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    ...
                  </span>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    12
                  </span>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    Selanjutnya
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
