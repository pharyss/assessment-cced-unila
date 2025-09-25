import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Struktur Organisasi"
        description="Tentang Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <section className="pb-[120px] pt-[50px]">
      <div className="container">
        <h2 className="mb-8 text-3xl font-bold leading-tight text-center text-black dark:text-white sm:text-4xl sm:leading-tight">
          Struktur Organisasi UPA CCED Universitas Lampung
        </h2>

        <div className="flex flex-col items-center space-y-6 p-6">

          {/* Kepala UPT */}
          <div className="rounded-lg border bg-blue-500 px-6 py-3 text-center font-semibold text-white shadow-md
                          dark:bg-blue-600 dark:border-blue-500">
            Kepala UPA Pengembangan Karier dan Kewirausahaan
          </div>

          {/* Fungsional Arsiparis */}
          <div className="rounded-lg border bg-blue-100 px-6 py-3 text-center text-sm text-black shadow-sm
                          dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700">
            Fungsional Arsiparis Muda
          </div>

          {/* Divisi Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-lg border bg-blue-50 px-4 py-3 text-center text-sm text-black shadow-sm
                            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              Kepala Divisi <i>Tracer Study</i> <br /> dan Jaminan Mutu
            </div>
            <div className="rounded-lg border bg-blue-50 px-4 py-3 text-center text-sm text-black shadow-sm
                            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              Kepala Divisi Pembinaan <br /> dan Konsultasi Karier
            </div>
            <div className="rounded-lg border bg-blue-50 px-4 py-3 text-center text-sm text-black shadow-sm
                            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              Kepala Divisi Kewirausahaan <br /> dan Inkubator Bisnis Mahasiswa
            </div>
            <div className="rounded-lg border bg-blue-50 px-4 py-3 text-center text-sm text-black shadow-sm
                            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              Kepala Divisi <i>Assessment Center</i> <br /> dan Layanan Psikologi
            </div>
            <div className="rounded-lg border bg-blue-50 px-4 py-3 text-center text-sm text-black shadow-sm
                            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              Kepala Divisi Kemitraan <br /> dan <i>Internship</i>
            </div>
          </div>

          {/* Pengelola Keuangan */}
          <div className="rounded-lg border bg-blue-100 px-6 py-3 text-center text-sm text-black shadow-sm
                          dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700">
            Pengelola Keuangan <br />
            Pengolah Data dan Informasi <br />
            Pengadministrasi Perkantoran <br />
            Pengadministrasi Umum
          </div>
        </div>


      </div>
      </section> 
    </>
  );
};

export default AboutPage;
