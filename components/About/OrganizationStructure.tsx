"use client";

export default function OrganizationStructure() {
  return (
    <section className="pb-[120px] pt-[50px]">
      <div className="container">
        <h2 className="mb-8 text-3xl font-bold leading-tight text-center text-black dark:text-white sm:text-4xl sm:leading-tight">
          Struktur Organisasi {" "}
            <span className="text-myunila">UPA CCED Universitas Lampung</span>
        </h2>

        <div className="flex flex-col items-center space-y-6 p-6">
        
          <div className="rounded-lg border bg-myunila-500 px-6 py-3 text-center font-semibold text-white shadow-md dark:bg-myunila-600 dark:border-myunila-500">
            Kepala UPA Pengembangan Karier dan Kewirausahaan
          </div>

          <div className="rounded-lg border bg-myunila-100 px-6 py-3 text-center text-sm text-black shadow-sm dark:bg-myunila-700 dark:text-white dark:border-myunila-600">
            Fungsional Arsiparis Muda
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: "Kepala Divisi Tracer Study dan Jaminan Mutu", italic: true },
              { title: "Kepala Divisi Pembinaan dan Konsultasi Karier" },
              { title: "Kepala Divisi Kewirausahaan dan Inkubator Bisnis Mahasiswa" },
              { title: "Kepala Divisi Assessment Center dan Layanan Psikologi", italic: true },
              { title: "Kepala Divisi Kemitraan dan Internship", italic: true },
            ].map((divisi, index) => (
              <div
                key={index}
                className="rounded-lg border bg-myunila-50 px-4 py-3 text-center text-sm text-black shadow-sm dark:bg-myunila-800 dark:text-white dark:border-gray-700"
              >
                {divisi.title.split(" ").map((word, i) =>
                  divisi.italic && /Tracer|Assessment|Internship/i.test(word) ? (
                    <i key={i}>{word} </i>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-myunila-100 px-6 py-3 text-center text-sm text-black shadow-sm dark:bg-myunila-700 dark:text-white dark:border-myunila-600">
            Pengelola Keuangan <br />
            Pengolah Data dan Informasi <br />
            Pengadministrasi Perkantoran <br />
            Pengadministrasi Umum
          </div>
        </div>
      </div>
    </section>
  );
}
