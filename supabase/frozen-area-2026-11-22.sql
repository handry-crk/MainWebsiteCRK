-- Frozen dikirim ke seluruh Indonesia (keputusan 22 Nov 2026). Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.
-- Hanya mengganti dua jawaban yang masih berupa penanda; jawaban yang sudah diubah di admin tidak disentuh.
update public.frozen_faqs set answer = 'Bisa. Cimol Bojot AA Frozen dikirim ke seluruh Indonesia lewat marketplace.'
where question = 'Bisa kirim ke luar Bandung?' and answer like '[ISI%';
update public.frozen_faqs set answer = '[ISI dari Ops: cara kemas untuk pengiriman antarkota dan anjuran saat paket diterima]'
where question = 'Sampai rumah masih beku?' and answer like '[ISI%';
