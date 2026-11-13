-- Isi awal: menu dan harga (Price Structure 13 Okt 2026) + kunci pengaturan situs.
-- Jalankan setelah schema.sql. Hanya mengisi bila tabel produk masih kosong.

insert into public.products (category, category_note, name, note, price_bandung, price_jabodetabek, sort, is_bestseller)
select * from (values
  ('Cimol', 'Harga kecil / besar', 'Cimol Bojot', 'Yang original, bumbunya nempel', '6.000 / 12.000', '6.000 / 12.000', 10, true),
  ('Cimol', 'Harga kecil / besar', 'Cimol Mozza', 'Isi mozzarella, ditarik selagi panas', '10.000 / 20.000', '11.000 / 22.000', 20, true),
  ('Cimol', 'Harga kecil / besar', 'Cimol Beef', null, '10.000 / 20.000', '11.000 / 22.000', 30, false),
  ('Cimol', 'Harga kecil / besar', 'Cimol Ayam', null, '10.000 / 20.000', '11.000 / 22.000', 40, false),
  ('Mix', null, 'Mix Mozza Bojot', null, '16.000', '17.000', 50, false),
  ('Mix', null, 'Mix Ayam Bojot', null, '16.000', '17.000', 60, false),
  ('Mix', null, 'Mix Beef Bojot', null, '16.000', '17.000', 70, false),
  ('Mix', null, 'Mix Mozza Ayam', null, '20.000', '22.000', 80, false),
  ('Mix', null, 'Mix Mozza Beef', null, '20.000', '22.000', 90, false),
  ('Kuah Keju', null, 'Kuah Keju Mozza', 'Disiram kuah keju hangat', '15.000', '15.000', 100, true),
  ('Kuah Keju', null, 'Kuah Keju Beef', null, '15.000', '15.000', 110, false),
  ('Kuah Keju', null, 'Kuah Keju Ayam', null, '15.000', '15.000', 120, false),
  ('New Series', null, 'Beef Mentai', null, '15.000', '15.000', 130, false),
  ('New Series', null, 'Ayam Mentai', null, '15.000', '15.000', 140, false),
  ('New Series', null, 'Ayam Saus Takoyaki', null, '15.000', '15.000', 150, false),
  ('New Series', null, 'Ayam Kare Jepang', null, '15.000', '15.000', 160, false),
  ('New Series', null, 'Beef Kare Jepang', null, '15.000', '15.000', 170, false),
  ('New Series', null, 'Bojot Saus Misdasem', null, '10.000', '10.000', 180, false),
  ('New Series', null, 'Bojot Saus Kacang', null, '10.000', '10.000', 190, false),
  ('Minuman', null, 'Da Hong Pao', null, '18.000', '18.000', 200, false),
  ('Frozen', 'Per pack. Rasa: Asin Pedas, Ayam Bawang, Balado, Barbeque, Jagung Bakar', 'Cimol Frozen Mozza', null, '26.000', '26.000', 210, false),
  ('Frozen', 'Per pack. Rasa: Asin Pedas, Ayam Bawang, Balado, Barbeque, Jagung Bakar', 'Cimol Frozen Ayam', null, '25.000', '25.000', 220, false)
) as v where not exists (select 1 from public.products);

insert into public.site_settings (key, value) values
  ('whatsapp_cs', ''),
  ('whatsapp_partnership', ''),
  ('instagram', ''),
  ('tiktok', ''),
  ('gofood', ''),
  ('grabfood', ''),
  ('shopeefood', ''),
  ('tokopedia', ''),
  ('shopee', ''),
  ('tiktokshop', '')
on conflict (key) do nothing;
