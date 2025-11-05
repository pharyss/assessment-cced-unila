import FAQ from "@/components/Faq";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FaQ | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
<<<<<<< HEAD
=======
  // other metadata
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Frequently Asked Question"
<<<<<<< HEAD
        description="Tentang Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <FAQ className="bg-white dark:bg-gray-900" />
=======
        description="Tentang Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung."
      />

      <section className="py-[50px]">
        <div className="container">
            <FAQ />
        </div>
      </section>
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
    </>
  );
};

export default AboutPage;
