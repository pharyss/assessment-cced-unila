const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "100px",
}: {
  title: string;
<<<<<<< HEAD
  paragraph: React.ReactNode;
=======
  paragraph: string;
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`wow fadeInUp w-full ${center ? "mx-auto text-center" : ""}`}
        data-wow-delay=".1s"
        style={{ maxWidth: width, marginBottom: mb }}
      >
<<<<<<< HEAD
        <h2 className="mb-4 text-3xl font-bold !leading-tight text-myunila sm:text-4xl md:text-[45px]">
          {title}
        </h2>
        <div className="text-base !leading-relaxed text-body-color md:text-lg">
          {paragraph}
        </div>
=======
        <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
          {title}
        </h2>
        <p className="text-base !leading-relaxed text-body-color md:text-lg">
          {paragraph}
        </p>
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
      </div>
    </>
  );
};

export default SectionTitle;
