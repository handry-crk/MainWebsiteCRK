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
- Wajib: set `NEXT_PUBLIC_SITE_URL=https://domain-klien.com` di hosting **sebelum build**. Canonical, sitemap, robots, Open Graph, dan data terstruktur memakainya.
- Alamat sementara (staging): set `NEXT_PUBLIC_NOINDEX=1` supaya semua halaman diberi `noindex` dan sitemap dikosongkan. Kosongkan saat launch.
- Tiap halaman: title dan description berbahasa Indonesia yang memuat nama brand, canonical, Open Graph + gambar, satu H1. Diatur lewat `pageMeta()` di `lib/site.ts`.
- JSON-LD: Organization dan WebSite (semua halaman, `app/(site)/layout.tsx`), BreadcrumbList, Menu (`/brands`), ItemList berisi Restaurant per kios yang sudah buka (`/locations`), NewsArticle (`/news/[slug]`), FAQPage (`/partnership`, bila ada isinya).
- `/sitemap.xml`, `/robots.txt` (menutup `/admin`), `/llms.txt`, `/opengraph-image`, ikon situs (`app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`).
- Semua halaman publik di-prerender; isi (menu, harga, daftar kios) ada di HTML tanpa JavaScript.
- Slug kabar yang tidak ada dijawab 200 dengan tag `noindex` (bawaan Next.js saat streaming), bukan 404.

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

## Konten halaman dan foto
Setup sekali: jalankan `supabase/cms-2026-11-19.sql` di SQL Editor (tabel `page_content`, kolom foto, bucket `media`).

- **Admin > Konten halaman**: teks Home, About Us, Careers, Partnership, Contact Us, serta logo, maskot, dan foto kios. Daftar isiannya ada di `lib/content-schema.ts`; menambah isian baru cukup di file itu lalu dipakai di halaman lewat `c.t("kunci")`.
- Isian kosong memakai teks bawaan bila ada. Isian wajib yang kosong tampil sebagai `[ISI: ...]` selama **Pengaturan > Tampilkan penanda** menyala, dan disembunyikan bila dimatikan (matikan sebelum launch).
- **Unggah foto**: di Konten halaman (gambar halaman), Kabar (foto sampul), dan Menu dan harga (foto menu). Foto dikecilkan di browser ke maksimal 1600 px dan disimpan sebagai WebP di bucket `media`. File lama tidak dihapus otomatis saat diganti.

## Bento menu dan meter level pedas
- **Bento menu** di Home (`components/shop/Bento.tsx`): menu andalan dapat kotak besar, menampilkan harga Bandung.
- **Meter level pedas** (`SpiceMeter.tsx`): nama level dan reaksi maskot ada di `components/shop/levels.ts`. Hanya tampilan; tidak terhubung ke pemesanan.
- Website tidak punya keranjang atau pemesanan lewat WhatsApp (dihapus 21 Nov 2026 atas permintaan). Jalur pesan: tautan ojol dan marketplace di halaman menu, tautan per kios, dan halaman Frozen.

## Form
Form Careers, Partnership, dan Contact menyimpan ke tabel `submissions` dan muncul di Admin > Kotak masuk. Bila penyimpanan gagal dan nomor WhatsApp sudah diisi, pengunjung ditawari kirim lewat WhatsApp.

## Belum dikerjakan
GA4 dan event klik, halaman per outlet, notifikasi saat ada form masuk, fitur lupa kata sandi di admin, isi konten dan aset asli dari klien.

## Keamanan, form, dan pelacakan (19 Nov 2026)
- **Lupa kata sandi admin**: tombol di halaman masuk `/admin`. Supabase mengirim tautan ke email; tautannya kembali ke `/admin` untuk membuat kata sandi baru. Wajib: di Supabase > Authentication > URL Configuration, isi **Site URL** dengan domain website dan tambahkan `https://domain/admin` ke **Redirect URLs**. Email bawaan Supabase dibatasi beberapa kiriman per jam; untuk pemakaian rutin pasang SMTP sendiri.
- **Kiriman baru**: angka di menu Kotak masuk dan di judul tab browser, diperbarui tiap menit.
- **Anti-spam form**: jalankan `supabase/guard-2026-11-19.sql` sekali. Batas per jam: 5 per pengirim, 3 per nomor WhatsApp, 60 seluruh website. Di browser ada kolom jebakan dan jeda 3 detik.
- **Google Analytics 4**: isi Measurement ID di Admin > Pengaturan. Event: `whatsapp_click`, `directions_click`, `order_link_click`, `generate_lead`, `locate_me`.
- **Header keamanan** (CSP, HSTS, X-Frame-Options, dll.) diatur di `next.config.ts`. Bila menambah layanan pihak ketiga (peta lain, widget, font luar), tambahkan domainnya ke CSP.
- **Halaman galat**: `app/(site)/error.tsx` dan `app/global-error.tsx`.
- **Kebijakan Privasi** (`/privacy`): isinya dari Admin > Konten halaman. Selama kosong dan penanda dimatikan, halaman dan tautannya tidak tampil.

## Halaman per kios
- Alamat: `/locations/<nama-kios>` (mis. `/locations/kios-margonda`), dibuat otomatis dari nama kios di Admin > Outlet. Mengganti nama kios ikut mengganti alamat halamannya.
- Isi: alamat, patokan, jam buka, petunjuk arah, tautan ojol, kios lain di kota yang sama. Data terstruktur Restaurant hanya untuk kios yang sudah buka, tanpa jam buka dan koordinat sampai datanya pasti.
- Semua halaman kios masuk sitemap. Pakai alamat halaman ini sebagai tautan "Website" di Google Business Profile tiap kios.

## Halaman Frozen (`/frozen`)
- Jalankan `supabase/frozen-2026-11-19.sql` sekali (tabel `frozen_products` dan `frozen_faqs`, berisi 10 varian tanpa harga dan 8 pertanyaan). Sebelum dijalankan, halaman memakai isi awal yang sama dari kode.
- Isi di admin: **Frozen: produk** (harga, berat, foto, tautan listing per marketplace, stok), **Frozen: tanya jawab**, dan **Konten halaman > Frozen** (cara goreng, simpan, area kirim, jam potong order, nomor halal dan izin edar).
- Halaman baru ditautkan (footer, halaman menu), masuk sitemap dan `llms.txt`, serta boleh diindeks setelah minimal satu produk punya harga dan tautan beli. Sebelum itu `/frozen` bisa dibuka langsung tetapi diberi `noindex`.
- Penanda `[ISI: ...]` tidak pernah masuk JSON-LD maupun `llms.txt`. Tanpa harga atau tautan beli, produk tampil tanpa blok `offers`. Status halal hanya tampil bila nomornya diisi.
- JSON-LD: `Product` per produk, `FAQPage`, `BreadcrumbList`. Tautan beli diberi `utm_source=website&utm_medium=referral&utm_campaign=frozen`; klik tercatat di GA4 sebagai `order_link_click` dengan `platform` dan `item_name`.
- Belum dikerjakan: feed Google Merchant Center (tahap 2 di brief).
