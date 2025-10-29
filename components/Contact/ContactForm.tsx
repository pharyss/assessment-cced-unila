"use client";

const ContactForm = () => {
  return (
    <div
      className="
        wow fadeInUp shadow-three dark:bg-gray-900 mb-12 flex h-full flex-col 
        rounded-lg bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px] 
        transition-colors duration-300
      "
      data-wow-delay=".15s"
    >
      <h2 className="mb-3 text-2xl font-bold text-myunila dark:text-myunila-400 md:text-3xl lg:text-2xl xl:text-3xl">
        Butuh Bantuan? Hubungi Kami
      </h2>
      <p className="mb-12 text-base font-medium text-gray-700 dark:text-gray-300">
        Tim kami akan segera menghubungimu melalui email.
      </p>

      <form className="w-full">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2">
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-gray-200">
                Nama
              </label>
              <input
                type="text"
                placeholder="Masukkan namamu"
                className="
                  w-full rounded-md border border-gray-200 bg-gray-50 
                  px-6 py-3 text-base text-gray-800 placeholder-gray-400
                  outline-none transition-all duration-300 
                  hover:border-myunila focus:border-myunila
                  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 
                  dark:placeholder-gray-500 dark:hover:border-myunila-400 
                  dark:focus:border-myunila-400
                "
              />
            </div>
          </div>

          <div className="w-full px-4 md:w-1/2">
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan emailmu"
                className="
                  w-full rounded-md border border-gray-200 bg-gray-50 
                  px-6 py-3 text-base text-gray-800 placeholder-gray-400
                  outline-none transition-all duration-300 
                  hover:border-myunila focus:border-myunila
                  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 
                  dark:placeholder-gray-500 dark:hover:border-myunila-400 
                  dark:focus:border-myunila-400
                "
              />
            </div>
          </div>

          <div className="w-full px-4">
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-gray-200">
                Pesan
              </label>
              <textarea
                rows={5}
                placeholder="Masukkan pesanmu"
                className="
                  w-full resize-none rounded-md border border-gray-200 bg-gray-50 
                  px-6 py-3 text-base text-gray-800 placeholder-gray-400
                  outline-none transition-all duration-300 
                  hover:border-myunila focus:border-myunila
                  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 
                  dark:placeholder-gray-500 dark:hover:border-myunila-400 
                  dark:focus:border-myunila-400
                "
              ></textarea>
            </div>
          </div>

          <div className="w-full px-4">
            <button
              type="submit"
              className="
                flex items-center justify-center w-full sm:w-auto
                rounded-full bg-myunila px-9 py-4 text-base font-medium text-white 
                shadow-submit dark:shadow-submit-dark duration-300 
                hover:bg-myunila-700 focus:ring-4 focus:ring-myunila/30
              "
            >
              Kirim Pesan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
