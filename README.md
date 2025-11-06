# Website Asesmen Talenta Mahasiswa Universitas Lampung


Website ini dikembangkan untuk mendukung layanan asesmen karakteristik, minat, dan bakat mahasiswa Universitas Lampung. Melalui platform ini, mahasiswa dapat mengikuti asesmen secara online dan memperoleh hasil berupa karakteristik pribadi, tipe emosi, gaya komunikasi, serta gaya berpikir. Hasil asesmen dirancang untuk membantu mahasiswa mengenali potensi diri, menentukan arah pengembangan, serta mendukung perencanaan karier dan masa depan yang lebih terarah.

## Persyaratan Lingkungan
- Node.js: versi >= 18.18.0 (disarankan 20.x)
- Manajer paket: npm (bukan yarn/pnpm)

## Manajer Paket
Proyek ini menggunakan npm sebagai manajer paket utama. Skrip preinstall akan menghentikan instalasi jika dijalankan dengan yarn/pnpm. Pastikan Anda menggunakan perintah npm saat menginstal dependensi.

## Instalasi
Jalankan perintah berikut untuk menginstal dependensi:
```
npm install
```

Untuk lingkungan CI yang mengandalkan lockfile:
```
npm ci
```

## Menjalankan Secara Lokal (Development)
```
npm run dev
```

## Build Produksi dan Menjalankan Server
```
npm run build
npm start
```

## Linting
```
npm run lint
```

## Catatan
- Versi Node yang disarankan: 20.x (sesuai basis image Docker dan kompatibel dengan konfigurasi proyek).
- Proyek ini telah dikonfigurasi untuk menggunakan npm secara konsisten (tersedia package-lock.json).
- Dockerfile proyek juga menggunakan npm (ci/install) saat build.
