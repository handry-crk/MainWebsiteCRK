-- Mengisi draf artikel pernyataan resmi franchise (versi 2: mitra crew tidak membayar apa pun; daftar lewat situs rekrutmen atau walk-in interview).
-- Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang, dan aman dijalankan baik versi 1 file ini sudah pernah dijalankan maupun belum.
-- Bagian yang sudah diubah sendiri di admin tidak disentuh.

-- 1) Penanda yang masih ada diganti isi lengkap.
update public.articles set body = replace(replace(body,
  '[ISI: sikap resmi perusahaan terhadap tawaran franchise yang mengatasnamakan Cimol Bojot AA. Diisi hanya bila sudah disetujui manajemen atau penasihat hukum.]',
  'Setiap tawaran franchise atau waralaba yang mengatasnamakan Cimol Bojot AA bukan berasal dari PT Citarasa Kuliner Indonesia. Perusahaan tidak menunjuk agen, perantara, atau pihak ketiga mana pun untuk menawarkan atau menerima pembayaran atas kemitraan berbentuk franchise. Pendaftaran mitra crew gerobak hanya dibuka melalui situs rekrutmen resmi perusahaan di [people.citarasakuliner.com](https://people.citarasakuliner.com/) atau walk-in interview yang diadakan perusahaan, dan tidak dipungut biaya apa pun.'),
  '[ISI: alasan resmi dalam satu atau dua kalimat, mis. cara perusahaan mengelola gerobak dan kios serta menjaga mutu.]',
  'Gerobak dan kios Cimol Bojot AA dimiliki dan dikelola oleh PT Citarasa Kuliner Indonesia, supaya resep, takaran bumbu, dan pelayanan tetap sama di setiap titik. Crew yang bertugas di gerobak adalah mitra perusahaan dengan skema bagi hasil dari penjualan harian. Ini adalah kerja sama operasional, bukan franchise: mitra crew tidak membeli hak usaha atau merek Cimol Bojot AA, dan tidak membayar biaya apa pun untuk bergabung.')
where slug = 'franchise-cimol-bojot-aa-pernyataan-resmi';

-- 2) Isi versi 1 (bila sudah terpasang) diperbarui ke versi 2.
update public.articles set body = replace(replace(body,
  'Pendaftaran mitra crew gerobak hanya dibuka melalui situs rekrutmen resmi perusahaan di [people.citarasakuliner.com](https://people.citarasakuliner.com/).',
  'Pendaftaran mitra crew gerobak hanya dibuka melalui situs rekrutmen resmi perusahaan di [people.citarasakuliner.com](https://people.citarasakuliner.com/) atau walk-in interview yang diadakan perusahaan, dan tidak dipungut biaya apa pun.'),
  'Ini adalah kerja sama operasional, bukan franchise: mitra crew tidak membeli hak usaha atau merek Cimol Bojot AA.',
  'Ini adalah kerja sama operasional, bukan franchise: mitra crew tidak membeli hak usaha atau merek Cimol Bojot AA, dan tidak membayar biaya apa pun untuk bergabung.')
where slug = 'franchise-cimol-bojot-aa-pernyataan-resmi'
  and body not like '%tidak dipungut biaya apa pun%';

-- 3) Tambahan kalimat pada pertanyaan singkat, bila belum ada.
update public.articles set body = replace(body, '**Apakah saya bisa membuka gerobak atau kios Cimol Bojot AA sendiri?** Tidak. Perusahaan tidak membuka kemitraan berbentuk franchise.', '**Apakah saya bisa membuka gerobak atau kios Cimol Bojot AA sendiri?** Tidak. Perusahaan tidak membuka kemitraan berbentuk franchise. Yang dibuka adalah kesempatan menjadi mitra crew di gerobak milik perusahaan.')
where slug = 'franchise-cimol-bojot-aa-pernyataan-resmi'
  and body not like '%mitra crew di gerobak milik perusahaan%';

-- 4) Akun media sosial resmi.
update public.articles set body = replace(body, '[ISI: nama akun Instagram dan TikTok resmi]', '[Instagram @cimolbojotaa](https://www.instagram.com/cimolbojotaa) dan [TikTok @cimolbojot.aa](https://www.tiktok.com/@cimolbojot.aa)')
where slug = 'franchise-cimol-bojot-aa-pernyataan-resmi';
