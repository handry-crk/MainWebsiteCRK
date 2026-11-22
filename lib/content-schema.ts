// Daftar teks dan gambar halaman yang bisa diubah dari Admin > Konten halaman.
// `def` = teks bawaan yang sudah layak tampil. `ph` = penanda untuk isi yang WAJIB datang dari klien.
export type ContentField = { key: string; label: string; type?: "text" | "textarea" | "image"; def?: string; ph?: string; hint?: string; max?: number };
export type ContentGroup = { page: string; note?: string; fields: ContentField[] };

const n = (count: number) => Array.from({ length: count }, (_, i) => i + 1);

export const contentSchema: ContentGroup[] = [
  {
    page: "Gambar",
    note: "Kosong = memakai gambar sementara dari poster. Logo dan maskot sebaiknya PNG tanpa latar.",
    fields: [
      { key: "img_logo", label: "Logo (header, papan menu)", type: "image" },
      { key: "img_mascot", label: "Maskot utama", type: "image" },
      { key: "img_mascot_small", label: "Maskot pose kedua", type: "image" },
      { key: "img_kiosk", label: "Foto atau render kios", type: "image", hint: "Tampil di hero Home, About Us, dan halaman menu" },
      { key: "img_about_story", label: "Foto untuk cerita brand (About Us)", type: "image", hint: "Kosong = maskot" },
    ],
  },
  {
    page: "Home",
    fields: [
      { key: "home_hero_sub", label: "Kalimat di bawah judul", type: "textarea", def: "CRK Group, rumahnya Cimol Bojot AA. Ada di 500+ titik gerobak dan kios di Bandung dan Jabodetabek." },
      { key: "home_burst_number", label: "Stiker bintang, angka", def: "500+", max: 5, hint: "Angka dan tanda + saja; huruf judul tidak punya semua simbol" },
      { key: "home_burst_label", label: "Stiker bintang, keterangan", def: "gerobak", max: 10 },
      { key: "home_why_title", label: "Judul bagian stiker", def: "Naik kelasnya di mana?", max: 30 },
      { key: "home_why_1_title", label: "Stiker 1, judul", def: "Rasanya sama di tiap titik" },
      { key: "home_why_1_text", label: "Stiker 1, penjelasan", def: "Satu resep, satu takaran. Di Braga atau di Bekasi." },
      { key: "home_why_2_title", label: "Stiker 2, judul", def: "Gerobak dan kiosnya rapi" },
      { key: "home_why_2_text", label: "Stiker 2, penjelasan", def: "Bersih, terang, gampang dikenali dari jauh." },
      { key: "home_why_3_text", label: "Label harga, kalimat", def: "Harganya tetap kaki lima. Mulai" },
      { key: "home_why_3_price", label: "Label harga, angka", def: "6.000", hint: "Dipakai juga di pita berjalan di atas menu" },
      { key: "home_quiz_title", label: "Kuis, judul", def: "Kamu tim cimol apa?", max: 30 },
      { key: "home_quiz_lead", label: "Kuis, penjelasan", def: "Jawab empat pertanyaan, nanti ketahuan cimol mana yang paling Kakak banget." },
      { key: "home_quiz_original", label: "Kuis, hasil tim original (Cimol Bojot)", def: "Setia sama yang original. Bumbunya nempel, nggak perlu macam-macam." },
      { key: "home_quiz_mozza", label: "Kuis, hasil tim mozza", def: "Yang penting kejunya narik." },
      { key: "home_quiz_kuah", label: "Kuis, hasil tim kuah keju", def: "Pencinta yang anget-anget. Cimol disiram kuah keju, beres." },
      { key: "home_quiz_mix", label: "Kuis, hasil tim mix", def: "Nggak bisa milih, jadi ambil dua rasa sekaligus." },
      { key: "home_quiz_baru", label: "Kuis, hasil tim menu baru (New Series)", def: "Paling kepo sama menu baru. Yang lain belum coba, Kakak udah duluan." },
      { key: "home_where_label", label: "Kalimat di atas daftar kota", def: "Kios Cimol Bojot AA ada di kota-kota ini." },
      { key: "home_cta_1_text", label: "Kartu kemitraan, penjelasan", def: "Acara kantor, hampers, sampai reseller Frozen." },
      { key: "home_cta_1_button", label: "Kartu kemitraan, tulisan tautan", def: "Lihat pilihan kerja sama", max: 30 },
      { key: "home_cta_2_text", label: "Kartu karier, penjelasan", def: "Dari crew gerobak dan kios sampai tim kantor." },
      { key: "home_cta_2_button", label: "Kartu karier, tulisan tautan", def: "Lihat lowongan", max: 30 },
    ],
  },
  {
    page: "About Us",
    fields: [
      { key: "about_intro", label: "Deskripsi singkat perusahaan", type: "textarea", def: "PT Citarasa Kuliner Indonesia adalah perusahaan F&B yang lahir di Bandung, berfokus pada penyajian jajanan lokal dengan citarasa yang otentik dan modern untuk melestarikan budaya lokal dengan cara baru." },
      { key: "about_story_1", label: "Sejarah, paragraf 1", type: "textarea", def: "PT Citarasa Kuliner Indonesia berdiri sejak tahun 2020, dipelopori pembukaan outlet berupa sebuah gerobak cimol di Kota Bandung." },
      { key: "about_story_2", label: "Sejarah, paragraf 2", type: "textarea", def: "Seiring berkembangnya perusahaan, brand utama PT Citarasa Kuliner Indonesia, yaitu Cimol Bojot AA, sangat digemari oleh kalangan muda Bandung sehingga terus bertumbuh membuka outlet gerobak di berbagai wilayah di Bandung Raya hingga Jabodetabek, dan menargetkan ekspansi ke berbagai kota di Indonesia mulai tahun 2027." },
      { key: "about_vision", label: "Visi", type: "textarea", ph: "[ISI: visi perusahaan]" },
      { key: "about_mission", label: "Misi", type: "textarea", ph: "[ISI: misi perusahaan]", hint: "Satu misi per baris" },
      { key: "about_milestone_1_year", label: "Perjalanan 1, tahun", def: "2020" },
      { key: "about_milestone_1_text", label: "Perjalanan 1, peristiwa", def: "Gerobak cimol pertama di Kota Bandung" },
      ...[2, 3, 4].flatMap((i): ContentField[] => [
        { key: `about_milestone_${i}_year`, label: `Perjalanan ${i}, tahun`, ph: "[ISI: tahun]" },
        { key: `about_milestone_${i}_text`, label: `Perjalanan ${i}, peristiwa`, ph: "[ISI: peristiwa]" },
      ]),
      { key: "about_value_1_title", label: "Core value 1, judul", def: "Growth Mindset" },
      { key: "about_value_1_text", label: "Core value 1, penjelasan", def: "Membuka diri untuk tumbuh menjadi versi terbaik" },
      { key: "about_value_2_title", label: "Core value 2, judul", def: "Ownership" },
      { key: "about_value_2_text", label: "Core value 2, penjelasan", def: "Menjalankan setiap pekerjaan dengan rasa memiliki" },
      { key: "about_value_3_title", label: "Core value 3, judul", def: "Leadership" },
      { key: "about_value_3_text", label: "Core value 3, penjelasan", def: "Bersiap sedia untuk memimpin dan dipimpin" },
      { key: "about_value_4_title", label: "Core value 4, judul", def: "Determination" },
      { key: "about_value_4_text", label: "Core value 4, penjelasan", def: "Memberikan usaha terbaik dalam mencapai setiap tujuan" },
      { key: "about_value_5_title", label: "Core value 5, judul", def: "Empowerment" },
      { key: "about_value_5_text", label: "Core value 5, penjelasan", def: "Melakukan pemberdayaan untuk saling menumbuhkan" },
      { key: "about_value_6_title", label: "Core value 6, judul", def: "Noble" },
      { key: "about_value_6_text", label: "Core value 6, penjelasan", def: "Menciptakan kebahagiaan melalui kepedulian dan kebaikan" },
      { key: "about_crew_count", label: "Jumlah mitra crew dan karyawan", ph: "[ISI]", hint: "Mis. 1.200+" },
    ],
  },
  {
    page: "Our Brands & Products",
    fields: [
      { key: "brands_intro", label: "Kalimat pembuka", type: "textarea", def: "Saat ini rumah kami diisi Cimol Bojot AA. Semua menu dan harganya ada di halaman ini." },
      { key: "brands_other", label: "Brand lain di bawah CRK Group", type: "textarea", ph: "[ISI: brand lain di bawah CRK Group, bila ada]", hint: "Kosong = bagian \"Brand lain\" disembunyikan setelah penanda dimatikan" },
    ],
  },
  {
    page: "Frozen",
    note: "Info produk untuk halaman /frozen. Produk dan tanya jawab diisi di menu Frozen. Isian yang kosong tidak ditampilkan di data untuk Google dan AI. Halaman baru ditautkan dan diindeks setelah minimal satu produk punya harga dan tautan beli.",
    fields: [
      { key: "frozen_sub", label: "Kalimat pembuka", type: "textarea", def: "Cimol mentah beku plus bumbu bojot, tinggal goreng di rumah." },
      { key: "frozen_pack", label: "Isi dan berat per pack", ph: "[ISI dari QC: berat gram dan kisaran jumlah butir per pack]" },
      { key: "frozen_seasoning", label: "Bumbu", ph: "[ISI dari QC: bumbu bojot terpisah atau tercampur]" },
      { key: "frozen_cooking", label: "Cara goreng", type: "textarea", ph: "[ISI dari QC: langkah goreng, suhu minyak, lama goreng, perlu thawing atau tidak]", hint: "Satu langkah per baris" },
      { key: "frozen_storage", label: "Cara simpan", type: "textarea", ph: "[ISI dari QC: cara simpan]" },
      { key: "frozen_shelf_life", label: "Masa simpan", ph: "[ISI dari QC: masa simpan di freezer dan di chiller]" },
      { key: "frozen_area", label: "Area kirim", def: "Seluruh Indonesia", hint: "Dipakai juga di data untuk Google" },
      { key: "frozen_method", label: "Metode kirim dan kemasan", type: "textarea", ph: "[ISI dari Ops: metode kirim dan cara kemas]" },
      { key: "frozen_cutoff", label: "Jam potong order", ph: "[ISI dari Ops: order sebelum jam berapa dikirim hari yang sama]" },
      { key: "frozen_halal_no", label: "Nomor sertifikat halal", hint: "Kosong = status halal tidak ditampilkan sama sekali" },
      { key: "frozen_permit_no", label: "Nomor izin edar (PIRT atau BPOM)", hint: "Kosong = tidak ditampilkan" },
    ],
  },
  {
    page: "Store Locations",
    fields: [
      { key: "locations_intro", label: "Kalimat pembuka", type: "textarea", def: "Pilih kota, ketik nama jalan, atau pakai lokasi Kakak." },
    ],
  },
  {
    page: "News & Updates",
    fields: [
      { key: "news_intro", label: "Kalimat pembuka", type: "textarea", def: "Kios baru, produk baru, promo, dan cerita dari dapur CRK Group." },
    ],
  },
  {
    page: "Partnership",
    fields: [
      { key: "partnership_intro", label: "Kalimat pembuka", type: "textarea", def: "Buat acara kantor, hampers, sampai reseller Frozen. Ngobrol aja dulu." },
      { key: "partnership_notice_title", label: "Pemberitahuan, judul", def: "Pemberitahuan resmi", max: 30 },
      { key: "partnership_notice", label: "Pemberitahuan, isi", type: "textarea", def: "PT Citarasa Kuliner Indonesia (CRK) dan Cimol Bojot AA tidak membuka kemitraan berbentuk franchise.", hint: "Tampil di bagian atas halaman Partnership dan di ringkasan untuk AI." },
      { key: "partner_type_1_text", label: "Pesanan acara dan kantor", type: "textarea", def: "Cimol buat rapat, ulang tahun kantor, atau acara komunitas.", hint: "Tambahkan minimal pesanan dan area layanan" },
      { key: "partner_type_2_text", label: "Hampers Frozen", type: "textarea", def: "Cimol Frozen dikemas jadi bingkisan.", hint: "Tambahkan pilihan paket dan waktu pesan" },
      { key: "partner_type_3_text", label: "Reseller dan agen Frozen", type: "textarea", def: "Jual Cimol Bojot AA Frozen di kota Kakak.", hint: "Tambahkan syarat dan skema" },
    ],
  },
  {
    page: "Contact Us",
    fields: [
      { key: "contact_intro", label: "Kalimat pembuka", type: "textarea", def: "Pertanyaan, keluhan, atau ajakan kerja sama. Paling cepat lewat WhatsApp." },
      { key: "contact_office_address", label: "Alamat kantor", type: "textarea", ph: "[ISI: alamat kantor]" },
      { key: "contact_office_hours", label: "Jam kerja dan email", ph: "[ISI: jam kerja dan email]" },
    ],
  },
  {
    page: "FAQ dan Member",
    note: "Pertanyaan dan jawaban FAQ diisi di menu FAQ. Pendaftar member terbaca di menu Member.",
    fields: [
      { key: "faq_intro", label: "FAQ, kalimat pembuka", def: "Jawaban singkat buat pertanyaan yang paling sering masuk." },
      { key: "member_intro", label: "Member, kalimat pembuka", type: "textarea", def: "Daftar pakai nomor WhatsApp. Kabar kios baru dan menu baru kami kirim langsung ke Kakak." },
      { key: "member_benefit", label: "Member, keuntungan", type: "textarea", ph: "[ISI: keuntungan member yang sudah disetujui, mis. program stamp atau voucher. Kosongkan bila belum ada.]", hint: "Jangan menjanjikan hadiah yang belum disetujui" },
      { key: "member_consent", label: "Member, kalimat persetujuan (di samping kotak centang)", type: "textarea", def: "Saya setuju dihubungi Cimol Bojot AA lewat WhatsApp untuk kabar dan promo. Saya bisa berhenti kapan saja dengan membalas STOP." },
    ],
  },
  {
    page: "Footer dan form",
    note: "Tampil di semua halaman.",
    fields: [
      { key: "footer_lead", label: "Kalimat di footer", def: "CRK Group. Street food naik kelas, dari Bandung." },
      { key: "footer_tape_count", label: "Pita footer, jumlah titik", def: "500+ titik gerobak", max: 28 },
      { key: "form_consent", label: "Kalimat di bawah form", def: "Data di form ini kami pakai untuk menghubungi Kakak soal kiriman ini.", hint: "Tampil di form Partnership, Contact Us, dan Member, diikuti tautan Kebijakan Privasi bila sudah diisi" },
    ],
  },
  {
    page: "Kebijakan Privasi",
    note: "Isi dari klien atau penasihat hukumnya. Fakta teknis website ini: form menyimpan nama, nomor WhatsApp, dan isi pesan di database; Google Analytics aktif bila ID-nya diisi di Pengaturan. Selama isi kebijakan kosong dan penanda dimatikan, halaman /privacy dan tautannya tidak tampil.",
    fields: [
      { key: "privacy_updated", label: "Berlaku sejak", ph: "[ISI: tanggal berlaku]", hint: "Mis. 1 Desember 2026" },
      { key: "privacy_body", label: "Isi kebijakan", type: "textarea", ph: "[ISI: isi kebijakan privasi. Data apa yang dikumpulkan, untuk apa, disimpan berapa lama, dibagikan ke siapa, dan cara meminta perbaikan atau penghapusan.]", hint: "Pisahkan paragraf dengan satu baris kosong" },
      { key: "privacy_contact", label: "Kontak soal data pribadi", ph: "[ISI: email atau nomor untuk permintaan soal data pribadi]" },
    ],
  },
  {
    page: "SEO",
    note: "Judul dan deskripsi yang tampil di hasil pencarian Google dan saat tautan dibagikan. Judul halaman selain Home otomatis diakhiri \" | CRK Group\". Sertakan nama brand dan kata yang dicari orang; jangan mengulang kata kunci.",
    fields: [
      { key: "seo_home_title", label: "Home, judul", def: "Cimol Bojot AA dari CRK Group | Jajanan Aci Khas Bandung", max: 60 },
      { key: "seo_home_desc", label: "Home, deskripsi", type: "textarea", def: "CRK Group, rumah dari Cimol Bojot AA. Jajanan kaki lima dari Bandung yang sekarang ada di 500+ titik gerobak dan kios di Bandung dan Jabodetabek.", max: 155 },
      { key: "seo_about_title", label: "About Us, judul", def: "Tentang Kami dan Cerita Cimol Bojot AA", max: 48 },
      { key: "seo_about_desc", label: "About Us, deskripsi", type: "textarea", def: "Profil PT Citarasa Kuliner Indonesia (CRK Group), perusahaan F&B dari Bandung di balik Cimol Bojot AA: sejarah sejak 2020 dan core value.", max: 155 },
      { key: "seo_brands_title", label: "Our Brands & Products, judul", def: "Menu dan Harga Cimol Bojot AA", max: 48 },
      { key: "seo_brands_desc", label: "Our Brands & Products, deskripsi", type: "textarea", def: "Menu dan harga Cimol Bojot AA: Cimol Bojot, Mozza, Beef, Ayam, Mix, Kuah Keju, New Series, dan Cimol Frozen. Harga Bandung dan Jabodetabek.", max: 155 },
      { key: "seo_locations_title", label: "Store Locations, judul", def: "Lokasi Kios Cimol Bojot AA Terdekat", max: 48 },
      { key: "seo_locations_desc", label: "Store Locations, deskripsi", type: "textarea", def: "Cari kios Cimol Bojot AA terdekat di Bandung, Cimahi, Bogor, Depok, Bekasi, dan Tangerang. Ada alamat, jam buka, dan petunjuk arah.", max: 155 },
      { key: "seo_frozen_title", label: "Frozen, judul", def: "Cimol Bojot AA Frozen, Cimol Beku Siap Goreng", max: 48 },
      { key: "seo_frozen_desc", label: "Frozen, deskripsi", type: "textarea", def: "Cimol Bojot AA Frozen: cimol mentah beku plus bumbu bojot. Varian, harga, cara goreng, cara simpan, area kirim, dan tautan beli di marketplace.", max: 155 },
      { key: "seo_faq_title", label: "FAQ, judul", def: "Pertanyaan Umum Cimol Bojot AA", max: 48 },
      { key: "seo_faq_desc", label: "FAQ, deskripsi", type: "textarea", def: "Jawaban untuk pertanyaan yang sering ditanyakan tentang Cimol Bojot AA: menu dan harga, lokasi kios, pesan antar, Cimol Frozen, dan kemitraan.", max: 155 },
      { key: "seo_member_title", label: "Member, judul", def: "Daftar Member Cimol Bojot AA", max: 48 },
      { key: "seo_member_desc", label: "Member, deskripsi", type: "textarea", def: "Daftar member Cimol Bojot AA dengan nomor WhatsApp untuk mendapat kabar kios baru dan menu baru.", max: 155 },
      { key: "seo_news_title", label: "News & Updates, judul", def: "Kabar Terbaru Cimol Bojot AA", max: 48 },
      { key: "seo_news_desc", label: "News & Updates, deskripsi", type: "textarea", def: "Kabar terbaru Cimol Bojot AA dan CRK Group: kios baru, produk baru, promo, dan berita perusahaan.", max: 155 },
      { key: "seo_partnership_title", label: "Partnership, judul", def: "Kemitraan dan Pesanan Acara Cimol Bojot AA", max: 48 },
      { key: "seo_partnership_desc", label: "Partnership, deskripsi", type: "textarea", def: "Kerja sama resmi dengan Cimol Bojot AA: pesanan acara, hampers Frozen, dan reseller Frozen. Cimol Bojot AA tidak membuka kemitraan berbentuk franchise.", max: 155 },
      { key: "seo_contact_title", label: "Contact Us, judul", def: "Kontak dan WhatsApp Cimol Bojot AA", max: 48 },
      { key: "seo_contact_desc", label: "Contact Us, deskripsi", type: "textarea", def: "Hubungi CRK Group dan Cimol Bojot AA lewat WhatsApp customer service, tim kemitraan, atau form pesan.", max: 155 },
    ],
  },
];

export const contentFields: Record<string, ContentField> = Object.fromEntries(contentSchema.flatMap((g) => g.fields.map((f) => [f.key, f])));

// Gambar disimpan sebagai "url|lebar|tinggi" supaya ukuran aslinya diketahui tanpa membuka filenya.
export type Img = { src: string; width: number; height: number };
export function parseImg(v: string | null | undefined): Img | null {
  if (!v) return null;
  const [src, w, h] = v.split("|");
  const width = Number(w), height = Number(h);
  return src && width > 0 && height > 0 ? { src, width, height } : null;
}
