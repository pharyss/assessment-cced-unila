import { notFound } from "next/navigation";
import assessmentData from "@/components/Assessment/assessmentData";
import AssessmentDetails from "@/components/Assessment/AssessmentDetails";

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
