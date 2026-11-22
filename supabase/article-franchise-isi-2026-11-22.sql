-- Mengisi dua bagian draf artikel pernyataan resmi franchise (draf sementara, menunggu persetujuan klien).
-- Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang: hanya mengganti penanda yang masih ada;
-- bagian yang sudah diubah di admin tidak disentuh.
update public.articles set body = replace(replace(replace(body,
  '[ISI: sikap resmi perusahaan terhadap tawaran franchise yang mengatasnamakan Cimol Bojot AA. Diisi hanya bila sudah disetujui manajemen atau penasihat hukum.]',
  'Setiap tawaran franchise atau waralaba yang mengatasnamakan Cimol Bojot AA bukan berasal dari PT Citarasa Kuliner Indonesia. Perusahaan tidak menunjuk agen, perantara, atau pihak ketiga mana pun untuk menawarkan atau menerima pembayaran atas kemitraan berbentuk franchise. Pendaftaran mitra crew gerobak hanya dibuka melalui situs rekrutmen resmi perusahaan di [people.citarasakuliner.com](https://people.citarasakuliner.com/).'),
  '[ISI: alasan resmi dalam satu atau dua kalimat, mis. cara perusahaan mengelola gerobak dan kios serta menjaga mutu.]',
  'Gerobak dan kios Cimol Bojot AA dimiliki dan dikelola oleh PT Citarasa Kuliner Indonesia, supaya resep, takaran bumbu, dan pelayanan tetap sama di setiap titik. Crew yang bertugas di gerobak adalah mitra perusahaan dengan skema bagi hasil dari penjualan harian. Ini adalah kerja sama operasional, bukan franchise: mitra crew tidak membeli hak usaha atau merek Cimol Bojot AA.'),
  '**Apakah saya bisa membuka gerobak atau kios Cimol Bojot AA sendiri?** Tidak. Perusahaan tidak membuka kemitraan berbentuk franchise.',
  '**Apakah saya bisa membuka gerobak atau kios Cimol Bojot AA sendiri?** Tidak. Perusahaan tidak membuka kemitraan berbentuk franchise. Yang dibuka adalah kesempatan menjadi mitra crew di gerobak milik perusahaan.')
where slug = 'franchise-cimol-bojot-aa-pernyataan-resmi';
