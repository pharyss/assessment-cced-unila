const ContactAddress = () => {
  return (
    <div
      className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 flex h-full flex-col rounded-md bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
      data-wow-delay=".15s"
    >
      <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
        Alamat
      </h2>
      <p className="mb-6 text-base font-medium text-body-color">
        Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung <br />
        Jl. Prof. Dr. Sumantri Brojonegoro No.1, Gedong Meneng, Bandar Lampung, Lampung 35141
      </p>

      <div className="relative w-full pt-[66.66%] overflow-hidden rounded-md">
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0"
          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=CCED&t=&z=14&ie=UTF8&iwloc=B&output=embed"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactAddress;
