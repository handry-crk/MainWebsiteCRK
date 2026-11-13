# Website CRK Group

Next.js (App Router) + TypeScript + Supabase. Tahap 3: 8 halaman publik, SEO, database, dan Admin Dashboard (`/admin`).

## Menjalankan
```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Peta file
| Lokasi | Isi |
|---|---|
| `app/globals.css` | Token (warna, font, spasi, skala huruf) dan semua gaya komponen |
| `app/page.tsx` | Home |
| `app/styleguide` | Referensi token dan komponen (tidak diindeks) |
| `components/` | Header, Footer, PageHero, Button, BrandImage, Starburst, TornEdge, OutletFinder (peta Leaflet), LeadForm, WaLink, JsonLd |
| `config/brand.ts` | Logo, maskot, nomor WA, tautan sosial dan order |
| `data/seed.ts` | Data contoh, bertanda `[CONTOH]` / `[ISI: ...]` |
| `lib/api.ts`, `lib/supabase.ts` | Lapisan data dan koneksi Supabase |
| `components/admin/` | Admin Dashboard |
| `supabase/` | SQL: `setup.sql` (wajib), `seed-contoh.sql` (opsional) |

## Memasukkan aset brand
1. Taruh file di `public/brand/`.
2. Logo dan maskot: isi path di `config/brand.ts`.
3. Foto: isi prop `src` pada `<BrandImage>` di halaman terkait. Selama `src` kosong, tampil kotak berlabel foto yang dibutuhkan.
4. Warna resmi: ubah di `:root` pada `app/globals.css`.

## Font
Headline memakai font resmi **CBAA Rounded ExtraBold** (`app/fonts/display.woff2`, dikonversi dari OTF kiriman klien). Teks isi (`body.woff2`, Plus Jakarta Sans) dan aksen tulisan tangan (`hand.woff2`, Caveat Brush) masih font sementara; timpa file-nya dengan WOFF2 resmi bila ada.

Catatan: CBAA Rounded tidak punya glyph en dash (–), jadi tanda itu di nama outlet tampil dengan font cadangan.

## SEO
- Wajib: set `NEXT_PUBLIC_SITE_URL=https://domain-klien.com` di hosting **sebelum build**. Canonical, sitemap, robots, dan Open Graph memakainya.
- Tiap halaman: title, description, canonical, Open Graph, satu H1. Diatur lewat `pageMeta()` di `lib/site.ts`.
- JSON-LD: Organization (semua halaman), BreadcrumbList, Menu (`/brands`), ItemList outlet (`/locations`), NewsArticle (`/news/[slug]`), FAQPage (`/partnership`).
- `/sitemap.xml`, `/robots.txt` (menutup `/admin` dan `/styleguide`), `/llms.txt`, `/opengraph-image`.
- Semua halaman publik di-prerender statis; isi (menu, harga, daftar outlet) ada di HTML.

## Database dan Admin (Supabase)
Environment variable (lihat `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`. Kode ini tidak memakai kunci rahasia Supabase.

Setup sekali:
1. Supabase Dashboard > SQL Editor: jalankan isi `supabase/setup.sql` (skema, aturan akses, menu dan harga awal). Opsional untuk demo: `supabase/seed-contoh.sql`.
2. Authentication > Users > Add user: buat akun admin pertama (email + kata sandi, centang auto confirm).
3. SQL Editor, ganti email lalu jalankan:
   `insert into public.profiles (id, full_name, role) select id, 'Nama Admin', 'admin' from auth.users where email = 'email-admin@klien.com';`
4. Authentication > Sign In / Providers: matikan pendaftaran publik (Allow new users to sign up). Tanpa baris di `profiles`, akun tetap tidak punya akses, tetapi lebih rapi bila ditutup.
5. Buka `/admin` dan masuk.

Aturan akses (RLS): publik hanya membaca konten terbit dan mengirim form; data form hanya terbaca staf; pengaturan dan pengguna hanya admin.

Halaman publik membaca database dan diperbarui otomatis sekitar tiap 1 menit. Bila tabel belum ada atau kosong: menu memakai harga bawaan (`data/seed.ts`), bagian lain tampil kosong.

Admin: Ringkasan, Kotak masuk (status, catatan, unduh CSV), Menu dan harga, Outlet (impor/unduh CSV, perbarui berdasarkan `store_code`), Kabar, Lowongan, FAQ kemitraan, Pengaturan (nomor WhatsApp dan tautan), Pengguna.

## Form
Form Careers, Partnership, dan Contact menyimpan ke tabel `submissions` dan muncul di Admin > Kotak masuk. Bila penyimpanan gagal dan nomor WhatsApp sudah diisi, pengunjung ditawari kirim lewat WhatsApp.

## Belum dikerjakan
GA4 dan event klik, halaman per outlet, unggah foto dari admin, notifikasi saat ada form masuk, data asli (outlet, lowongan, artikel, cerita brand).
