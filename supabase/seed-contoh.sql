-- OPSIONAL: data contoh untuk demo ke klien. Semua bertanda [CONTOH]; hapus sebelum launch:
--   delete from public.outlets where store_code like 'CONTOH-%';
--   delete from public.articles where slug like 'contoh-%';
--   delete from public.positions where title like '[CONTOH]%';

insert into public.outlets (store_code, name, city, address, landmark, hours, lat, lng) values
  ('CONTOH-BDG-1', '[CONTOH] Cimol Bojot AA – Braga', 'Bandung', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.9175, 107.6098),
  ('CONTOH-BDG-2', '[CONTOH] Cimol Bojot AA – Dago', 'Bandung', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.8849, 107.6136),
  ('CONTOH-BDG-3', '[CONTOH] Cimol Bojot AA – Buah Batu', 'Bandung', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.9476, 107.6335),
  ('CONTOH-JKT-1', '[CONTOH] Cimol Bojot AA – Tebet', 'Jakarta', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.2262, 106.8583),
  ('CONTOH-JKT-2', '[CONTOH] Cimol Bojot AA – Kemang', 'Jakarta', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.2607, 106.8137),
  ('CONTOH-JKT-3', '[CONTOH] Cimol Bojot AA – Kelapa Gading', 'Jakarta', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.1588, 106.9056),
  ('CONTOH-BKS-1', '[CONTOH] Cimol Bojot AA – Bekasi Barat', 'Bekasi', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.2383, 106.9756),
  ('CONTOH-BKS-2', '[CONTOH] Cimol Bojot AA – Harapan Indah', 'Bekasi', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.1859, 106.9767),
  ('CONTOH-DPK-1', '[CONTOH] Cimol Bojot AA – Margonda', 'Depok', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.3728, 106.8347),
  ('CONTOH-TNG-1', '[CONTOH] Cimol Bojot AA – Kelapa Dua', 'Tangerang', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.2441, 106.6147),
  ('CONTOH-TNG-2', '[CONTOH] Cimol Bojot AA – Bintaro', 'Tangerang', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.2767, 106.7186),
  ('CONTOH-BGR-1', '[CONTOH] Cimol Bojot AA – Pajajaran', 'Bogor', '[ISI: alamat lengkap]', '[ISI: patokan]', '[ISI: jam buka]', -6.6014, 106.806)
on conflict (store_code) do nothing;

insert into public.articles (slug, title, category, excerpt, body, is_published) values
  ('contoh-kios-kelapa-dua', '[CONTOH] Kios baru buka di Kelapa Dua, Tangerang', 'Outlet baru', '[ISI: ringkasan 1 kalimat]', '[ISI: isi artikel, ditulis tim CRK]', true),
  ('contoh-segera-hadir-malang', '[CONTOH] Cimol Bojot AA segera hadir di Kota Malang', 'Outlet baru', '[ISI: ringkasan 1 kalimat]', '[ISI: isi artikel, ditulis tim CRK]', true),
  ('contoh-new-series', '[CONTOH] Kenalan sama varian New Series', 'Produk', '[ISI: ringkasan 1 kalimat]', '[ISI: isi artikel, ditulis tim CRK]', true)
on conflict (slug) do nothing;

insert into public.positions (title, department, location, type, summary, requirements)
select * from (values
  ('[CONTOH] Crew Outlet', 'Operasional', '[ISI: kota]', 'Crew Outlet', '[ISI: ringkasan pekerjaan]', E'[ISI: syarat 1]\n[ISI: syarat 2]'),
  ('[CONTOH] Supervisor Area', 'Operasional', '[ISI: kota]', 'Full-time', '[ISI: ringkasan pekerjaan]', E'[ISI: syarat 1]\n[ISI: syarat 2]')
) as v where not exists (select 1 from public.positions);
