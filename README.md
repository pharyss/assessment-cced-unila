<<<<<<< HEAD
# 🎓 Website Asesmen Talenta Mahasiswa Universitas Lampung

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38bdf8?style=for-the-badge&logo=tailwind-css)
![pnpm](https://img.shields.io/badge/pnpm-9.0.0-f69220?style=for-the-badge&logo=pnpm)

**Platform asesmen online untuk membantu mahasiswa Universitas Lampung mengenali potensi diri dan merencanakan masa depan**

[Fitur](#-fitur) • [Instalasi](#-instalasi) • [Penggunaan](#-penggunaan) • [Dokumentasi](#-dokumentasi)

</div>

---

## 📋 Deskripsi

Website ini dikembangkan untuk mendukung layanan asesmen karakteristik, minat, dan bakat mahasiswa Universitas Lampung yang dikelola oleh **Center for Career & Entrepreneurship Development (CCED)**. 

Melalui platform ini, mahasiswa dapat:
- ✅ Mengikuti asesmen talenta secara online
- ✅ Memperoleh hasil berupa karakteristik pribadi (MBTI)
- ✅ Mengetahui gaya berpikir (Thinking Style)
- ✅ Memahami gaya komunikasi (Communication Style)
- ✅ Mengenali pola perilaku (Psychological Well-being)
- ✅ Mendapatkan rekomendasi bidang karier
- ✅ Mengunduh hasil asesmen dalam format PDF

Hasil asesmen dirancang untuk membantu mahasiswa mengenali potensi diri, menentukan arah pengembangan, serta mendukung perencanaan karier dan masa depan yang lebih terarah.

---

## 🚀 Tech Stack

### Core Framework
- **Next.js** 15.5.6 (App Router)
- **React** 19.2.0
- **TypeScript** 5.9.3 (Strict Mode)
- **Node.js** 24.x (recommended)

### UI & Styling
- **Tailwind CSS** 3.4.18
- **HeroUI** 2.8.5
- **Framer Motion** 12.23.24
- **Lucide React** 0.544.0 (Icons)

### Data Fetching & State Management
- **TanStack Query** 5.x (React Query)
- **API Client** with TypeScript

### Assessment Tools
- **jsPDF** 3.0.3 (PDF Generation)
- **React Select** 5.10.2
- **React Hot Toast** 2.6.0

### Development Tools
- **ESLint** 9.39.1
- **Prettier** 3.6.2
- **PostCSS** & **Autoprefixer**

---

## 🔄 Data Fetching with TanStack Query

This project uses **TanStack Query** (React Query) for efficient data fetching and state management.

### Features
- ✅ Automatic caching and background refetching
- ✅ Built-in loading and error states
- ✅ Type-safe API client
- ✅ Request deduplication
- ✅ Optimistic updates support

### Quick Example

```typescript
import { useTest } from "@/lib/hooks/useTests";

function TestComponent() {
  const { data, isLoading, isError } = useTest(1);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading test</div>;
  
  return <div>{data?.data?.name}</div>;
}
```

### Documentation
- 📖 [Complete TanStack Query Guide](./docs/TANSTACK_QUERY.md)
- 📝 [Implementation Summary](./TANSTACK_QUERY_IMPLEMENTATION.md)
- 🔗 [API Schema](http://localhost:3000/docs/json)

---

## ✨ Fitur

### 1. 🧑‍🎓 Asesmen Talenta Mahasiswa
- **Form Identitas** - Input data mahasiswa (nama, NPM, email, fakultas, prodi)
- **Asesmen Minat Karier** - Mengidentifikasi bidang karier yang sesuai (Praktisi, Akademisi, Kreatif, Wirausaha)
- **Tes MBTI** - Menentukan tipe kepribadian (16 tipe MBTI)
- **Asesmen Pola Perilaku** - Mengukur 6 dimensi Psychological Well-being:
  - Penerimaan Diri (Self Acceptance)
  - Kemandirian (Autonomy)
  - Tujuan Hidup (Purpose in Life)
  - Hubungan Positif (Positive Relationships)
  - Pengelolaan Lingkungan (Environmental Mastery)
  - Pertumbuhan Pribadi (Personal Growth)

### 2. 📊 Hasil Asesmen
- **Laporan Komprehensif** yang mencakup:
  - Tipe MBTI dan deskripsi lengkap
  - Gaya berpikir (Analytical, Practical, Creative, Empathetic)
  - Gaya komunikasi (Assertive, Supportive, Analytical, Expressive)
  - Gaya bekerja (Structured Solo, Structured Team, Flexible Solo, Flexible Team)
  - Grafik dimensi perilaku
  - Rekomendasi bidang karier
  - Kesesuaian minat dengan kepribadian
- **Download PDF** - Ekspor hasil asesmen

### 3. 🎨 User Interface
- **Responsive Design** - Optimal di desktop, tablet, dan mobile
- **Dark Mode** - Tema gelap untuk kenyamanan mata
- **Progress Tracking** - Indikator progres asesmen
- **Smooth Animations** - Transisi halus dengan Framer Motion
- **Toast Notifications** - Feedback real-time untuk user actions

### 4. 💾 Data Persistence
- **LocalStorage** - Menyimpan progres asesmen
- **Session Management** - Melanjutkan asesmen yang terputus
- **Auto-save** - Jawaban tersimpan otomatis

---

## 📦 Prerequisites

Pastikan sistem Anda memiliki:

- **Node.js** 18.x atau lebih tinggi (disarankan v24.x)
- **pnpm** 9.x (akan diinstall otomatis via Corepack)
- **Git** untuk version control

---

## 🛠️ Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/your-org/assessment-cced-unila.git
cd assessment-cced-unila
```

### 2. Install Dependencies

**PENTING:** Project ini menggunakan **pnpm** sebagai package manager. Jangan gunakan npm atau yarn.

```bash
# Corepack akan otomatis menginstall pnpm versi yang tepat
pnpm install
```

### 3. Environment Variables (Opsional)

Jika diperlukan, buat file `.env.local`:

```env
# Contoh konfigurasi (sesuaikan dengan kebutuhan)
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
pnpm dev
```

Buka browser dan akses: **http://localhost:3000**

---

## 🎯 Penggunaan

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code (jika ada script)
pnpm format
```

### Build untuk Production

```bash
# 1. Build aplikasi
pnpm build

# 2. Test build secara lokal
pnpm start

# 3. Deploy (sesuai platform hosting)
```

---

## 📁 Struktur Project

```
assessment-cced-unila/
├── app/                          # Next.js App Router
│   ├── assessment/               # Halaman asesmen
│   │   └── talenta-mahasiswa/    # Modul asesmen talenta
│   │       ├── start/            # Form identitas
│   │       ├── career-path/      # Asesmen minat karier
│   │       ├── behavior-pattern/ # Asesmen pola perilaku
│   │       └── result/           # Halaman hasil
│   ├── about-us/                 # Halaman tentang kami
│   ├── auth/                     # Autentikasi SSO
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── global.css                # Global styles
├── components/                   # React components
│   ├── Assessment/               # Komponen asesmen
│   │   ├── useAssessmentFlow.tsx # Flow management hook
│   │   └── useAssessmentLogic.ts # Business logic hook
│   ├── Header/                   # Navigation header
│   ├── Footer/                   # Footer
│   └── ...                       # Komponen lainnya
├── data/                         # Data JSON
│   ├── BehaviorPattern.json      # Data soal pola perilaku
│   ├── CareerPath.json           # Data soal minat karier
│   ├── ReportText.json           # Template teks hasil
│   └── StudyPrograms.ts          # Data fakultas & prodi
├── types/                        # TypeScript types
├── lib/                          # Utility functions
├── public/                       # Static assets
│   ├── images/                   # Gambar
│   └── ...
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── next.config.js                # Next.js config
├── pnpm-lock.yaml                # Lock file (pnpm)
├── FIXES_APPLIED.md              # Dokumentasi fixes
└── README.md                     # This file
```

---

## ⚙️ Konfigurasi

### TypeScript

Project menggunakan **strict mode** untuk type safety maksimal:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "esnext",
    "jsx": "preserve"
  }
}
```

### Tailwind CSS

Konfigurasi warna custom untuk branding Unila:

```js
colors: {
  myunila: "#085EA8",       // Warna utama Unila
  "myunila-50": "#e6f2fb",  // Warna sekunder
  // ... dst
}
```

### ESLint

Menggunakan konfigurasi Next.js + strict rules:

```json
{
  "extends": "next/core-web-vitals"
}
```

---

## 🔧 Troubleshooting

### Issue: `Cannot find module 'pnpm'`

**Solusi:**
```bash
corepack enable
corepack prepare pnpm@9.0.0 --activate
pnpm install
```

### Issue: Port 3000 sudah digunakan

**Solusi:**
```bash
# Gunakan port lain
pnpm dev -p 3001
```

### Issue: Build error setelah pull changes

**Solusi:**
```bash
# Hapus cache dan reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

### Issue: TypeScript errors setelah update

**Solusi:**
```bash
# Restart TypeScript server di IDE
# VS Code: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Atau rebuild
pnpm build
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone** repository
2. **Create branch** untuk fitur/fix Anda:
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. **Commit changes** dengan pesan yang jelas:
   ```bash
   git commit -m "feat: menambahkan fitur X"
   ```
4. **Push** ke branch Anda:
   ```bash
   git push origin feature/nama-fitur
   ```
5. **Create Pull Request** dengan deskripsi lengkap

### Commit Message Convention

Gunakan conventional commits:

```
feat: menambahkan fitur baru
fix: memperbaiki bug
docs: update dokumentasi
style: perubahan styling/formatting
refactor: refactoring code
test: menambahkan test
chore: update dependencies/config
```

### Code Style

- **Format code** dengan Prettier sebelum commit
- **Follow TypeScript best practices** (strict mode)
- **Gunakan meaningful variable names**
- **Add comments** untuk logika kompleks
- **Keep components small** dan reusable

---

## 📝 Dokumentasi Tambahan

- **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** - Dokumentasi lengkap tentang semua fixes yang telah diterapkan
- **[Next.js Docs](https://nextjs.org/docs)** - Official Next.js documentation
- **[React Docs](https://react.dev)** - Official React documentation
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Tailwind CSS documentation

---

## 📊 Browser Support

| Browser | Supported Version |
|---------|------------------|
| Chrome  | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari  | Latest 2 versions |
| Edge    | Latest 2 versions |

---

## 📞 Kontak & Support

**Center for Career & Entrepreneurship Development (CCED)**  
Universitas Lampung

- 📍 **Alamat:** Gedung Rektorat Lama Lantai 1, Jl. Prof. Dr. Sumantri Brojonegoro No. 1, Universitas Lampung
- 📞 **Telepon:** +62 857-6951-0880
- 📧 **Email:** pjk@kpa.unila.ac.id
- 🌐 **Website:** [cced.unila.ac.id](https://cced.unila.ac.id)
- 📱 **Instagram:** [@cced_unila](https://instagram.com/cced_unila)
- 🎥 **YouTube:** [@cced_unila](https://youtube.com/@cced_unila)

---

## 📄 License

**Copyright © 2025 CCED Universitas Lampung**

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.

---

## 🙏 Acknowledgments

Dikembangkan dengan ❤️ oleh tim CCED Universitas Lampung untuk mendukung pengembangan talenta dan karier mahasiswa.

**Special Thanks:**
- Universitas Lampung
- CCED Unila Team
- Seluruh mahasiswa yang berpartisipasi dalam pengembangan sistem ini

---

<div align="center">

**Made with ❤️ for Universitas Lampung Students**

⭐ Star this repo if you find it helpful!

</div>
=======
# Website Layanan Asesmen UPA CCED Universitas Lampung

Website ini dikembangkan untuk mendukung layanan asesmen karakteristik, minat, dan bakat mahasiswa Universitas Lampung. Melalui platform ini, mahasiswa dapat mengikuti asesmen secara online dan memperoleh hasil berupa karakteristik pribadi, tipe emosi, gaya komunikasi, serta gaya berpikir. Hasil asesmen dirancang untuk membantu mahasiswa mengenali potensi diri, menentukan arah pengembangan, serta mendukung perencanaan karier dan masa depan yang lebih terarah.
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
