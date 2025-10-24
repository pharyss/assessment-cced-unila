"use client";

const ContactForm = () => {
  return (
    <div
      className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 flex h-full flex-col rounded-md bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
      data-wow-delay=".15s"
    >
      <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
        Butuh Bantuan? Hubungi Kami
      </h2>
      <p className="mb-12 text-base font-medium text-body-color">
        Tim kami akan segera menghubungimu melalui email.
      </p>
      <form>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2">
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Nama
              </label>
              <input
                type="text"
                placeholder="Masukkan namamu"
                className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2">
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan emailmu"
                className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4">
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Pesan
              </label>
              <textarea
                rows={5}
                placeholder="Masukkan pesanmu"
                className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              ></textarea>
            </div>
          </div>
          <div className="w-full px-4">
            <button className="shadow-submit dark:shadow-submit-dark rounded-full bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
              Kirim Pesan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
