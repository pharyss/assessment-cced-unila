import { Assessment } from "@/types/assessment";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { ArrowRight } from "lucide-react";

const AssessmentDetails = ({ assessment }: { assessment: Assessment }) => {
    if (!assessment) {
        return <p className="py-10 text-center">Assessment tidak tersedia</p>;
    }

    const { title, rules } = assessment;

    return (
        <>
        <div className="container">
            <section id="about" className="pt-16 md:pt-20 lg:pt-28">
            <div className="border-b border-body-color/[.15] pb-16 pt-20 dark:border-white/[.15] md:pb-20 lg:pb-28">
                <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-x-20">
                <div className="w-full px-2 lg:w-1/2">
                    <div
                    className="wow fadeInUp mx-auto max-w-[700px] text-center sm:text-left xl:mx-0"
                    data-wow-delay=".2s"
                    >
                    <h2 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                        {title}
                    </h2>

                    <div className="mb-4 flex items-center gap-2 text-primary">
                    <ClipboardList className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Petunjuk Pengisian Asesmen</h2>
                    </div>

                    <ul className="mb-8 list-inside list-disc space-y-2 text-base text-left text-body-color dark:text-body-color-dark">
                    {rules?.map((rule, index) => (
                        <li key={index}>{rule}</li>
                    ))}
                    </ul>

                    <div className="sm-items-start flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-start sm:space-x-4 sm:space-y-0">
                    <Link
                        href={`/assessment/${assessment.id}/start`}
                        className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                    >
                        Mulai Asesmen
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    </div>
                    </div>
                </div>

                <div className="w-full px-2 lg:w-1/3">
                    <div
                    className="wow fadeInUp relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0"
                    data-wow-delay=".2s"
                    >
                    <Image
                        src="/images/asesmen/detail-asesmen.png"
                        alt="detail-asesmen"
                        fill
                        className="mx-auto max-w-full drop-shadow-three dark:drop-shadow-none lg:mr-0"
                    />
                    </div>
                </div>
                </div>
            </div>
            </section>
        </div>
        </>
    );
};

export default AssessmentDetails;
