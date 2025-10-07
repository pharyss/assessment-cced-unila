import { notFound } from "next/navigation";
import assessmentData from "@/components/Assessment/assessmentData";
import AssessmentDetails from "@/components/Assessment/AssessmentDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asesmen Bidang Karir CCED Universitas Lampung",
    description: "Layanan Tes Asesmen CCED Universitas Lampung",
  // other metadata
};

interface Params {
    params: {
        id: string;
    };
}

const AssessmentPage = ({ params }: Params) => {
    const { id } = params;

    const assessment = assessmentData.find((a) => a.id === id);

    if (!assessment) {
        notFound();
    }

    return <AssessmentDetails assessment={assessment} />;
};

export default AssessmentPage;
