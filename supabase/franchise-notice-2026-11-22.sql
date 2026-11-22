-- Pemberitahuan resmi: tidak membuka kemitraan berbentuk franchise. Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.
-- Menambah satu pertanyaan di FAQ umum dan satu di FAQ kemitraan (halaman Partnership), bila belum ada.
insert into public.faqs (topic, question, answer, sort)
select t.topic, 'Apakah Cimol Bojot AA membuka franchise?', 'Tidak. PT Citarasa Kuliner Indonesia (CRK) dan Cimol Bojot AA tidak membuka kemitraan berbentuk franchise. Bentuk kerja sama yang tersedia ada di halaman Partnership.', t.sort
from (values ('umum', 7), ('kemitraan', 0)) as t(topic, sort)
where not exists (select 1 from public.faqs f where f.topic = t.topic and f.question = 'Apakah Cimol Bojot AA membuka franchise?');
