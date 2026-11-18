-- Website CRK Group: modul Konten halaman + unggah foto.
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.

-- 1) Teks dan gambar halaman yang bisa diubah dari admin.
create table if not exists public.page_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.page_content to anon, authenticated;
grant insert, update, delete on public.page_content to authenticated;
alter table public.page_content enable row level security;
drop policy if exists "publik baca konten" on public.page_content;
drop policy if exists "staf tambah konten" on public.page_content;
drop policy if exists "staf ubah konten" on public.page_content;
drop policy if exists "staf hapus konten" on public.page_content;
create policy "publik baca konten" on public.page_content for select using (true);
create policy "staf tambah konten" on public.page_content for insert with check (public.is_staff());
create policy "staf ubah konten" on public.page_content for update using (public.is_staff()) with check (public.is_staff());
create policy "staf hapus konten" on public.page_content for delete using (public.is_staff());

-- 2) Kolom foto untuk kabar dan menu.
alter table public.articles add column if not exists cover_url text;
alter table public.products add column if not exists photo_url text;

-- 3) Pengaturan: tampilkan penanda [ISI: ...] untuk teks yang belum diisi (1 = tampil, 0 = sembunyikan).
insert into public.site_settings (key, value) values ('show_placeholders', '1') on conflict (key) do nothing;

-- 4) Penyimpanan foto: siapa pun boleh melihat, hanya staf yang boleh mengunggah dan menghapus.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

drop policy if exists "media: publik lihat" on storage.objects;
drop policy if exists "media: staf unggah" on storage.objects;
drop policy if exists "media: staf ubah" on storage.objects;
drop policy if exists "media: staf hapus" on storage.objects;
create policy "media: publik lihat" on storage.objects for select using (bucket_id = 'media');
create policy "media: staf unggah" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
create policy "media: staf ubah" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff()) with check (bucket_id = 'media' and public.is_staff());
create policy "media: staf hapus" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff());
