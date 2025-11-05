import Breadcrumb from "@/components/Common/Breadcrumb";
<<<<<<< HEAD
import Contact from "@/components/Contact/ContactForm";
=======
import Contact from "@/components/Contact";
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik | CCED Universitas Lampung",
  description: "Statistik hasil asesmen CCED Universitas Lampung",
  // other metadata
};

const Statistik = () => {
  return (
    <>
      <Breadcrumb
        pageName="Statistik"
        description="Statistik hasil asesmen dan karakteristik mahasiswa Universitas Lampung."
      />
    
    <div className="container">
    <section
      id="statistics"
      className="pt-16 my-20 md:pt-20 lg:pt-28 flex items-center justify-between"
      >
      <h1 className="text-2xl font-bold">Statistik</h1>
    </section>
    </div>
      
    </>
  );
};

export default Statistik;
