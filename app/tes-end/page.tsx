import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tes Minat Bakat | CCED Universitas Lampung",
    description: "Tes Minat Bakat CCED Universitas Lampung",
  // other metadata
};

const TesEnd = () => {
return (
    <>
    <div className="container">
    <section
    id="tes-end"
    className="my-40 pt-16 md:pt-20 lg:pt-28 flex items-center justify-between"
    >
    <h1 className="text-2xl font-bold">Tes Telah Selesai</h1>

    <Link
        href="/"
        className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-white duration-300 hover:bg-primary/80"
    >
        Beranda
    </Link>

    <Link
        href="/tes-result"
        className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-white duration-300 hover:bg-primary/80"
    >
        Lihat Hasil
    </Link>
    </section>
    </div>
    
    </>
);
};

export default TesEnd;
