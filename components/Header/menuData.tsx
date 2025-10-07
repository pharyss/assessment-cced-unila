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
    path: "/assessment/talenta-mahasiswa",
    newTab: false,
  },
  {
    id: 33,
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
        title: "FaQ",
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
