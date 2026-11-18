-- Pembatas kiriman form (anti-spam). Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.
-- Batas per jam: 5 kiriman per pengirim (alamat jaringan), 3 per nomor WhatsApp, 60 untuk seluruh website.
-- Kiriman yang melewati batas ditolak; di website pengunjung diarahkan ke WhatsApp.

-- Sidik pengirim: hash satu arah dari alamat IP (bukan alamat IP-nya), hanya untuk menghitung batas.
alter table public.submissions add column if not exists src text;
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

create or replace function public.submissions_guard() returns trigger
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
    select count(*) into n from public.submissions where src = new.src and created_at > now() - interval '1 hour';
    if n >= 5 then raise exception 'Terlalu banyak kiriman dari pengirim ini. Coba lagi nanti.' using errcode = 'P0001'; end if;
  end if;
  select count(*) into n from public.submissions where whatsapp = new.whatsapp and created_at > now() - interval '1 hour';
  if n >= 3 then raise exception 'Terlalu banyak kiriman untuk nomor ini. Coba lagi nanti.' using errcode = 'P0001'; end if;
  select count(*) into n from public.submissions where created_at > now() - interval '1 hour';
  if n >= 60 then raise exception 'Form sedang penuh. Coba lagi nanti.' using errcode = 'P0001'; end if;
  return new;
end $$;

drop trigger if exists submissions_guard on public.submissions;
create trigger submissions_guard before insert on public.submissions
  for each row execute function public.submissions_guard();
