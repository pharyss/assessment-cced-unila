import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tes Minat Bakat | CCED Universitas Lampung",
    description: "Tes Minat Bakat CCED Universitas Lampung",
  // other metadata
};

const TesResult = () => {
return (
    <>
    <div className="container">
    <section
    id="tes-result"
    className="my-40 pt-16 md:pt-20 lg:pt-28 flex items-center justify-between"
    >
    <h1 className="text-2xl font-bold">Hasil Tes</h1>

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
        Unduh Hasil
    </Link>
    </section>
    </div>
    
    </>
);
};

export default TesResult;
