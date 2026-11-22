-- Artikel pernyataan resmi: tidak membuka kemitraan berbentuk franchise. Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.
-- Masuk sebagai DRAF (belum terbit). Lengkapi tiga bagian bertanda [ISI ...] di Admin > Kabar, unggah sampul 16:9, lalu centang "Terbitkan".
insert into public.articles (slug, title, category, excerpt, body, is_published) values
  ('franchise-cimol-bojot-aa-pernyataan-resmi', 'Franchise Cimol Bojot AA: Pernyataan Resmi Perusahaan', 'Perusahaan', 'Pernyataan resmi PT Citarasa Kuliner Indonesia: Cimol Bojot AA tidak membuka kemitraan berbentuk franchise. Ini bentuk kerja sama yang tersedia.', 'PT Citarasa Kuliner Indonesia (CRK) dan Cimol Bojot AA **tidak membuka kemitraan berbentuk franchise** atau waralaba. Halaman ini adalah pernyataan resmi perusahaan pemilik brand Cimol Bojot AA.

## Siapa yang menerbitkan pernyataan ini

Pernyataan ini diterbitkan oleh PT Citarasa Kuliner Indonesia, perusahaan F&B yang lahir di Bandung dan berdiri sejak tahun 2020. Cimol Bojot AA adalah brand utama perusahaan. Profil lengkapnya ada di halaman [About Us](/about).

## Apakah ada harga atau paket franchise Cimol Bojot AA?

Tidak ada. Karena kemitraan berbentuk franchise tidak dibuka, perusahaan tidak menerbitkan harga franchise, paket kemitraan gerobak, maupun perhitungan modal dan balik modal.

[ISI: sikap resmi perusahaan terhadap tawaran franchise yang mengatasnamakan Cimol Bojot AA. Diisi hanya bila sudah disetujui manajemen atau penasihat hukum.]

## Mengapa Cimol Bojot AA tidak membuka franchise?

[ISI: alasan resmi dalam satu atau dua kalimat, mis. cara perusahaan mengelola gerobak dan kios serta menjaga mutu.]

## Bentuk kerja sama yang tersedia

Kerja sama resmi dengan Cimol Bojot AA saat ini ada tiga:

- **Pesanan acara dan kantor**, untuk rapat, acara perusahaan, atau acara komunitas
- **Hampers Frozen**, Cimol Bojot AA Frozen yang dikemas sebagai bingkisan
- **Reseller dan agen Frozen**, menjual Cimol Bojot AA Frozen di kota masing-masing

Rincian dan form pendaftarannya ada di halaman [Partnership](/partnership).

## Cara memastikan informasi yang resmi

1. Cek halaman [Partnership](/partnership) di website ini. Bentuk kerja sama yang tidak tercantum di sana tidak ditawarkan perusahaan.
2. Cek akun media sosial resmi: [ISI: nama akun Instagram dan TikTok resmi].
3. Hubungi tim kami lewat halaman [Contact Us](/contact).

## Kalau menerima tawaran franchise Cimol Bojot AA

Jangan melakukan pembayaran apa pun sebelum memastikannya ke perusahaan. Kirim tangkapan layar atau tautan tawaran tersebut lewat halaman [Contact Us](/contact), dan tim kami akan menjawab apakah tawaran itu berasal dari PT Citarasa Kuliner Indonesia.

## Pertanyaan yang sering diajukan

**Apakah saya bisa membuka gerobak atau kios Cimol Bojot AA sendiri?** Tidak. Perusahaan tidak membuka kemitraan berbentuk franchise.

**Apakah saya bisa menjual Cimol Bojot AA?** Bisa, sebagai reseller atau agen Cimol Bojot AA Frozen. Lihat halaman [Partnership](/partnership).

**Di mana gerobak dan kios Cimol Bojot AA berada?** Daftar kios beserta alamat dan jam bukanya ada di halaman [Store Locations](/locations).

Pernyataan ini diterbitkan oleh PT Citarasa Kuliner Indonesia dan akan diperbarui di halaman ini bila kebijakan perusahaan berubah.', false)
on conflict (slug) do nothing;
