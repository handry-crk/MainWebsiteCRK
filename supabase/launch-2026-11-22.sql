-- FAQ umum dan pendaftaran member (MBR-WEB). Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.

-- ---------- 1) FAQ: satu tabel untuk halaman FAQ (umum) dan Partnership (kemitraan) ----------
alter table public.faqs add column if not exists topic text not null default 'kemitraan';
alter table public.faqs drop constraint if exists faqs_topic_check;
alter table public.faqs add constraint faqs_topic_check check (topic in ('umum', 'kemitraan'));

-- Isi awal FAQ umum, hanya bila belum ada satu pun. Jawaban bertanda [ISI ...] menunggu isi dari klien.
insert into public.faqs (topic, question, answer, sort)
select 'umum', v.question, v.answer, v.sort from (values
  ('Cimol Bojot AA itu apa?', '[ISI: satu atau dua kalimat resmi tentang Cimol Bojot AA dan arti "bojot"]', 1),
  ('Cimol Bojot AA yang asli yang mana?', '[ISI: cara mengenali gerobak dan kios resmi Cimol Bojot AA, serta akun media sosial resminya]', 2),
  ('Menu dan harganya berapa?', 'Menu dan harga terbaru untuk Bandung dan Jabodetabek ada di halaman Our Brands & Products. Harga bisa beda sedikit di tiap gerobak dan kios.', 3),
  ('Kios terdekat di mana?', 'Buka halaman Store Locations, pilih kota atau pakai lokasi Kakak. Di sana ada alamat, jam buka, dan petunjuk arah tiap kios.', 4),
  ('Bisa pesan antar?', '[ISI: aplikasi pesan antar yang tersedia dan cara mencarinya]', 5),
  ('Apakah Cimol Bojot AA halal?', '[ISI dari QC: status dan nomor sertifikat halal. Jangan diisi sebelum sertifikat ada.]', 6),
  ('Ada Cimol Bojot AA Frozen?', 'Ada. Varian, cara goreng, dan tautan belinya ada di halaman Cimol Frozen.', 7),
  ('Bagaimana cara jadi reseller atau pesan untuk acara?', 'Pilihan kerja sama dan form pendaftarannya ada di halaman Partnership.', 8),
  ('Saya mau melamar kerja, ke mana?', 'Lowongan dan pendaftaran ada di situs rekrutmen CRK Group: people.citarasakuliner.com.', 9),
  ('Mau kirim kritik atau saran, ke mana?', 'Lewat form atau WhatsApp di halaman Contact Us.', 10)
) as v(question, answer, sort)
where not exists (select 1 from public.faqs where topic = 'umum');

-- ---------- 2) Member: pendaftar dari website (kode sumber MBR-WEB) ----------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null unique,
  city text not null default '',
  source text not null default 'MBR-WEB',
  consent boolean not null default false,
  consent_text text not null default '',
  src text,
  created_at timestamptz not null default now()
);
create index if not exists members_created_at_idx on public.members (created_at desc);

revoke all on public.members from anon;
grant insert on public.members to anon, authenticated;
grant select, update, delete on public.members to authenticated;
alter table public.members enable row level security;

drop policy if exists "publik daftar member" on public.members;
drop policy if exists "staf baca member" on public.members;
drop policy if exists "staf ubah member" on public.members;
drop policy if exists "admin hapus member" on public.members;
-- Siapa pun boleh MENDAFTAR (wajib setuju, nomor berformat 62...), hanya staf yang boleh MEMBACA.
create policy "publik daftar member" on public.members for insert with check (
  consent = true
  and source = 'MBR-WEB'
  and char_length(name) between 1 and 80
  and whatsapp ~ '^62[0-9]{8,13}$'
  and char_length(city) <= 60
  and char_length(consent_text) <= 400
);
create policy "staf baca member" on public.members for select using (public.is_staff());
create policy "staf ubah member" on public.members for update using (public.is_staff()) with check (public.is_staff());
create policy "admin hapus member" on public.members for delete using (public.is_admin());

-- Pembatas pendaftaran per jam: 5 per pengirim (hash alamat jaringan), 300 untuk seluruh website.
create or replace function public.members_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  ip text := '';
  n int;
begin
  if public.is_staff() then return new; end if;
  begin
    ip := trim(split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1));
  exception when others then ip := '';
  end;
  new.src := case when ip <> '' then md5(ip || ':crk') else null end;
  if new.src is not null then
    select count(*) into n from public.members where src = new.src and created_at > now() - interval '1 hour';
    if n >= 5 then raise exception 'Terlalu banyak pendaftaran dari pengirim ini. Coba lagi nanti.' using errcode = 'P0001'; end if;
  end if;
  select count(*) into n from public.members where created_at > now() - interval '1 hour';
  if n >= 300 then raise exception 'Pendaftaran sedang penuh. Coba lagi nanti.' using errcode = 'P0001'; end if;
  return new;
end $$;

drop trigger if exists members_guard on public.members;
create trigger members_guard before insert on public.members
  for each row execute function public.members_guard();
