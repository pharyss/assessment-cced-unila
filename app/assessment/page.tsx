<<<<<<< HEAD
=======
import SingleAssessment from "@/components/Assessment/SingleAssessment";
import assessmentData from "@/components/Assessment/assessmentData";
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tes Asesmen | CCED Universitas Lampung",
  description: "Ikuti asesmen untuk mengenali karakteristik, emosi, gaya komunikasi, dan cara berpikirmu",
  // other metadata
};

const Assessment = () => {
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

          <div
            className="wow fadeInUp -mx-4 flex flex-wrap"
            data-wow-delay=".15s"
          >
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <a
                    href="#0"
<<<<<<< HEAD
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-myunila hover:bg-opacity-100 hover:text-white"
=======
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
                  >
                    Sebelumnya
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
<<<<<<< HEAD
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-myunila hover:bg-opacity-100 hover:text-white"
=======
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
                  >
                    1
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
<<<<<<< HEAD
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-myunila hover:bg-opacity-100 hover:text-white"
=======
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
                  >
                    2
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
<<<<<<< HEAD
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-myunila hover:bg-opacity-100 hover:text-white"
=======
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
                  >
                    3
                  </a>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    ...
                  </span>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
<<<<<<< HEAD
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-myunila hover:bg-opacity-100 hover:text-white"
=======
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
                  >
                    12
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
<<<<<<< HEAD
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-myunila hover:bg-opacity-100 hover:text-white"
=======
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
                  >
                    Selanjutnya
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Assessment;
