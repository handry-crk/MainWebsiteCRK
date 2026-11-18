-- Website CRK Group: kolom menu untuk bento, level pedas, dan keranjang.
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
alter table public.products add column if not exists badge text;
alter table public.products add column if not exists has_spice boolean not null default false;
