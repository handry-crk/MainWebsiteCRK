-- Website CRK Group: skema database.
-- Jalankan SEKALI di Supabase Dashboard > SQL Editor (project klien). Aman dijalankan ulang.

-- ---------- Pengguna internal ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.profiles where id = auth.uid()) $$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

-- ---------- Konten ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  category_note text,
  name text not null,
  note text,
  price_bandung text not null,
  price_jabodetabek text not null,
  sort integer not null default 0,
  is_bestseller boolean not null default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.outlets (
  id uuid primary key default gen_random_uuid(),
  store_code text unique not null,
  name text not null,
  city text not null,
  address text not null default '',
  landmark text not null default '',
  hours text not null default '',
  lat double precision not null,
  lng double precision not null,
  gofood_url text,
  grabfood_url text,
  shopeefood_url text,
  gmaps_url text,
  status text not null default 'buka' check (status in ('buka', 'segera', 'tutup')),
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  category text not null default 'Perusahaan',
  excerpt text not null default '',
  body text not null default '',
  published_at timestamptz not null default now(),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null default '',
  location text not null default '',
  type text not null default 'Full-time',
  summary text not null default '',
  requirements text not null default '',
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort integer not null default 0
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default ''
);

-- ---------- Data masuk dari form ----------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('application', 'partnership', 'contact')),
  name text not null,
  whatsapp text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai')),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists submissions_created_idx on public.submissions (created_at desc);
create index if not exists outlets_city_idx on public.outlets (city);

-- ---------- Hak akses dasar (RLS di bawah yang menentukan baris mana) ----------
grant usage on schema public to anon, authenticated;
grant select on public.products, public.outlets, public.articles, public.positions, public.faqs, public.site_settings to anon, authenticated;
grant insert on public.submissions to anon, authenticated;
grant insert, update, delete on public.products, public.outlets, public.articles, public.positions, public.faqs, public.site_settings to authenticated;
grant select, update, delete on public.submissions to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.outlets enable row level security;
alter table public.articles enable row level security;
alter table public.positions enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.submissions enable row level security;

-- Hapus policy lama supaya file ini bisa dijalankan ulang.
do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('profiles','products','outlets','articles','positions','faqs','site_settings','submissions')
  loop execute format('drop policy %I on public.%I', r.policyname, r.tablename); end loop;
end $$;

-- Publik: hanya konten yang terbit.
create policy "publik baca produk" on public.products for select using (is_available or public.is_staff());
create policy "publik baca outlet" on public.outlets for select using (status in ('buka', 'segera') or public.is_staff());
create policy "publik baca artikel" on public.articles for select using ((is_published and published_at <= now()) or public.is_staff());
create policy "publik baca lowongan" on public.positions for select using (is_open or public.is_staff());
create policy "publik baca faq" on public.faqs for select using (true);
create policy "publik baca pengaturan" on public.site_settings for select using (true);

-- Staf (admin dan editor): kelola konten.
create policy "staf tambah produk" on public.products for insert with check (public.is_staff());
create policy "staf ubah produk" on public.products for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus produk" on public.products for delete using (public.is_staff());
create policy "staf tambah outlet" on public.outlets for insert with check (public.is_staff());
create policy "staf ubah outlet" on public.outlets for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus outlet" on public.outlets for delete using (public.is_staff());
create policy "staf tambah artikel" on public.articles for insert with check (public.is_staff());
create policy "staf ubah artikel" on public.articles for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus artikel" on public.articles for delete using (public.is_staff());
create policy "staf tambah lowongan" on public.positions for insert with check (public.is_staff());
create policy "staf ubah lowongan" on public.positions for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus lowongan" on public.positions for delete using (public.is_staff());
create policy "staf tambah faq" on public.faqs for insert with check (public.is_staff());
create policy "staf ubah faq" on public.faqs for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus faq" on public.faqs for delete using (public.is_staff());

-- Pengaturan situs dan pengguna: hanya admin.
create policy "admin tambah pengaturan" on public.site_settings for insert with check (public.is_admin());
create policy "admin ubah pengaturan" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());
create policy "admin hapus pengaturan" on public.site_settings for delete using (public.is_admin());
create policy "baca profil sendiri atau admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admin tambah profil" on public.profiles for insert with check (public.is_admin());
create policy "admin ubah profil" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
create policy "admin hapus profil" on public.profiles for delete using (public.is_admin() and id <> auth.uid());

-- Form: siapa pun boleh MENGIRIM (dengan batas ukuran), hanya staf yang boleh MEMBACA.
create policy "publik kirim form" on public.submissions for insert with check (
  status = 'baru' and note is null
  and char_length(name) between 1 and 120
  and char_length(whatsapp) between 6 and 20
  and pg_column_size(payload) < 8000
);
create policy "staf baca form" on public.submissions for select using (public.is_staff());
create policy "staf ubah form" on public.submissions for update using (public.is_staff()) with check (public.is_staff());
create policy "admin hapus form" on public.submissions for delete using (public.is_admin());


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
