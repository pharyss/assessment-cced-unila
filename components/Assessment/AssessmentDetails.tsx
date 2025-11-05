import { Assessment } from "@/types/assessment";
import Image from "next/image";
import Link from "next/link";

const AssessmentDetails = ({ assessment }: { assessment: Assessment }) => {
if (!assessment) {
    return <p className="text-center py-10">Assessment tidak tersedia</p>;
    }

const { title, rules} = assessment;
    return (
        <>
            <div className="container">
                <section id="about" className="pt-16 md:pt-20 lg:pt-28">
                    <div className="border-b border-body-color/[.15] pb-16 pt-20 dark:border-white/[.15] md:pb-20 lg:pb-28">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-x-20 items-center justify-center">
                            <div className="w-full px-2 lg:w-1/2">
                                {/* text */}
                                <div
                                    className="wow fadeInUp mx-auto max-w-[700px] text-center sm:text-left xl:mx-0"
                                    data-wow-delay=".2s"
                                >
                                    <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                                        {title}
                                    </h1>
                                    <p className="dark:text-body-color-dark mb-8 text-base !leading-relaxed text-body-color sm:text-lg md:text-xl">
                                        {rules}
                                    </p>
                                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-start sm-items-start sm:space-x-4 sm:space-y-0">
                                        <Link
                                            href="/"
                                            className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                                        >
                                            Mulai Tes
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
                                        className="drop-shadow-three mx-auto max-w-full dark:hidden dark:drop-shadow-none lg:mr-0"
                                    />
                                    <Image
                                        src="/images/asesmen/detail-asesmen.png"
                                        alt="detail-asesmen"
                                        fill
                                        className="drop-shadow-three mx-auto hidden max-w-full dark:block dark:drop-shadow-none lg:mr-0"
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
