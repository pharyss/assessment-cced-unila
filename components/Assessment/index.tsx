import SectionTitle from "../Common/SectionTitle";
import SingleAssessment from "./SingleAssessment";
import assessmentData from "./assessmentData";

const Assessment = () => {
  return (
    <section
      id="assessment"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Tes Asesmen"
          paragraph="Ikuti asesmen untuk mengenali karakteristik, emosi, gaya komunikasi, dan cara berpikirmu."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {assessmentData.map((assessment) => (
            <div key={assessment.id} className="w-full">
              <SingleAssessment assessment={assessment} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Assessment;
