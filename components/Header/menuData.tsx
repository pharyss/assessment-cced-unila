import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Beranda",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Tes Asesmen",
<<<<<<< HEAD
    path: "/assessment/talenta-mahasiswa",
    newTab: false,
  },
  {
    id: 3,
=======
    path: "/assessment",
    newTab: false,
  },
  {
    id: 33,
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
    title: "Statistik",
    path: "/statistics",
    newTab: false,
  },
  {
    id: 4,
    title: "Tentang Kami",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "Profil CCED",
        path: "/about-us/profile",
        newTab: false,
      },
      {
        id: 42,
        title: "Struktur Organisasi",
        path: "/about-us/organization",
        newTab: false,
      },
      {
        id: 43,
<<<<<<< HEAD
        title: "FAQ",
=======
        title: "FaQ",
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
        path: "/about-us/faq",
        newTab: false,
      },
      {
        id: 44,
        title: "Hubungi Kami",
        path: "/about-us/contact",
        newTab: false,
      },
    ],
  },

];
export default menuData;
