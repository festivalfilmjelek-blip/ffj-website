# Festival Film Jelek — Website Starter

Website statis responsif untuk `festivalfilmjelek.com` dengan logo FFJ asli, konten terstruktur, dan konfigurasi awal Decap CMS.

## Preview lokal

Jalankan dari folder proyek:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`. Jangan membuka `index.html` lewat `file://` untuk pengujian konten, karena browser bisa memblokir fetch JSON lokal.

## Cara update sementara

Edit `content/site.json` untuk mengubah tahun, program, berita, arsip, submission, dan `heroImage`. Upload KV ke `assets/uploads/`, lalu isi `heroImage` misalnya `/assets/uploads/kv-ffj-2027.webp`.

## Deploy ke domain

1. Buat repositori GitHub dan upload seluruh isi folder ini.
2. Hubungkan repo ke Cloudflare Pages, build command kosong, output directory `/` (atau folder root proyek sesuai setup).
3. Setelah situs berjalan di alamat `*.pages.dev`, tambahkan custom domain `festivalfilmjelek.com` di Pages dan ikuti konfigurasi DNS yang ditampilkan. Domain harus dibeli terpisah dan tersedia.
4. Atur redirect `www` bila diinginkan.

## Admin CMS — PENTING

`/admin/` adalah **kerangka** Decap CMS, belum dapat dipakai login. Sebelum admin bisa digunakan:

1. Ganti `YOUR_GITHUB_USERNAME/YOUR_REPOSITORY` dalam `admin/config.yml`.
2. Konfigurasi autentikasi GitHub OAuth melalui penyedia autentikasi yang kompatibel dengan Decap CMS; hosting Cloudflare Pages saja **tidak otomatis menyediakan OAuth**.
3. Tentukan izin kolaborator GitHub dan uji workflow upload KV, publish, serta akses tim.
4. Jika ingin alur login paling sederhana untuk nonteknis, pertimbangkan CMS terkelola sebagai alternatif dan sesuaikan integrasinya.

**Keamanan:** Jangan taruh secret OAuth, token GitHub, atau password di file frontend. Perlu backend autentikasi aman. Data publik dari `site.json` bukan tempat menyimpan informasi rahasia.

## Status proyek

Sudah ada: homepage, desain responsif, toggle ID/EN untuk elemen utama, data program/arsip/berita, pengaturan submission, dukungan KV, dan skema CMS.

Belum ada: domain dibeli, deployment, autentikasi CMS, panel login yang aktif, tiket, sistem pendaftaran film internal, katalog film terperinci, dan konten final FFJ 2027. Beberapa deskripsi program adalah placeholder, bukan pengumuman resmi.
