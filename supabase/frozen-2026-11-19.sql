-- Halaman Frozen (/frozen): produk dan tanya jawab. Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.
-- Info produk (cara goreng, simpan, area kirim, izin) diisi di Admin > Konten halaman > Frozen, tanpa tabel baru.

create table if not exists public.frozen_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  variant text not null default '',
  flavor text not null default '',
  sku text not null default '',
  description text not null default '',
  pack_count integer not null default 1,
  pack_weight_g integer,
  pieces_per_pack text not null default '',
  price integer,
  photo_url text,
  shopee_url text,
  tokopedia_url text,
  tiktok_url text,
  is_available boolean not null default true,
  is_published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.frozen_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.frozen_products, public.frozen_faqs to anon, authenticated;
grant insert, update, delete on public.frozen_products, public.frozen_faqs to authenticated;
alter table public.frozen_products enable row level security;
alter table public.frozen_faqs enable row level security;

drop policy if exists "publik baca frozen" on public.frozen_products;
drop policy if exists "staf tambah frozen" on public.frozen_products;
drop policy if exists "staf ubah frozen" on public.frozen_products;
drop policy if exists "staf hapus frozen" on public.frozen_products;
create policy "publik baca frozen" on public.frozen_products for select using (is_published or public.is_staff());
create policy "staf tambah frozen" on public.frozen_products for insert with check (public.is_staff());
create policy "staf ubah frozen" on public.frozen_products for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus frozen" on public.frozen_products for delete using (public.is_staff());

drop policy if exists "publik baca faq frozen" on public.frozen_faqs;
drop policy if exists "staf tambah faq frozen" on public.frozen_faqs;
drop policy if exists "staf ubah faq frozen" on public.frozen_faqs;
drop policy if exists "staf hapus faq frozen" on public.frozen_faqs;
create policy "publik baca faq frozen" on public.frozen_faqs for select using (is_published or public.is_staff());
create policy "staf tambah faq frozen" on public.frozen_faqs for insert with check (public.is_staff());
create policy "staf ubah faq frozen" on public.frozen_faqs for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus faq frozen" on public.frozen_faqs for delete using (public.is_staff());

-- Isi awal: 10 varian (2 isi x 5 rasa) tanpa harga, berat, dan tautan; 8 pertanyaan. Hanya bila tabel masih kosong.
insert into public.frozen_products (name, variant, flavor, sort)
select * from (values
  ('Cimol Bojot AA Frozen Mozzarella Balado', 'Mozzarella', 'Balado', 11),
  ('Cimol Bojot AA Frozen Mozzarella Ayam Bawang', 'Mozzarella', 'Ayam Bawang', 12),
  ('Cimol Bojot AA Frozen Mozzarella Asin Pedas', 'Mozzarella', 'Asin Pedas', 13),
  ('Cimol Bojot AA Frozen Mozzarella Barbeque', 'Mozzarella', 'Barbeque', 14),
  ('Cimol Bojot AA Frozen Mozzarella Jagung Bakar', 'Mozzarella', 'Jagung Bakar', 15),
  ('Cimol Bojot AA Frozen Ayam Balado', 'Ayam', 'Balado', 21),
  ('Cimol Bojot AA Frozen Ayam Ayam Bawang', 'Ayam', 'Ayam Bawang', 22),
  ('Cimol Bojot AA Frozen Ayam Asin Pedas', 'Ayam', 'Asin Pedas', 23),
  ('Cimol Bojot AA Frozen Ayam Barbeque', 'Ayam', 'Barbeque', 24),
  ('Cimol Bojot AA Frozen Ayam Jagung Bakar', 'Ayam', 'Jagung Bakar', 25)
) as v(name, variant, flavor, sort)
where not exists (select 1 from public.frozen_products);

insert into public.frozen_faqs (question, answer, sort)
select * from (values
  ('Ini cimol matang atau mentah?', 'Mentah beku. Goreng dulu sebelum dimakan.', 1),
  ('Cara gorengnya gimana?', '[ISI dari QC: suhu minyak, lama goreng, perlu thawing atau tidak]', 2),
  ('Bumbunya sudah termasuk?', '[ISI dari QC: bumbu bojot ada di dalam pack, terpisah atau tercampur]', 3),
  ('Satu pack isinya berapa?', '[ISI dari QC: berat gram dan kisaran jumlah butir]', 4),
  ('Tahan berapa lama?', '[ISI dari QC: masa simpan di freezer dan di chiller]', 5),
  ('Bisa kirim ke luar Bandung?', '[ISI dari Ops: area kirim yang sudah teruji. Draf: Belum. Saat ini hanya instant/same-day area Bandung Raya supaya sampai masih beku.]', 6),
  ('Sampai rumah masih beku?', '[ISI dari Ops: cara kemas dan anjuran saat diterima. Draf: Dikemas dengan ice pack dan bubble foil. Langsung masukkan ke freezer saat diterima.]', 7),
  ('Sudah halal?', '[ISI dari QC: status dan nomor sertifikat halal. Jangan diisi sebelum sertifikat ada.]', 8)
) as v(question, answer, sort)
where not exists (select 1 from public.frozen_faqs);
