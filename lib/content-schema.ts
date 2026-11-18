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
      { key: "home_spice_title", label: "Meter pedas, judul", def: "Seberapa berani, Kak?", max: 30 },
      { key: "home_spice_lead", label: "Meter pedas, penjelasan", def: "Geser meternya. Level ini jadi pilihan awal saat menu pedas masuk keranjang." },
      { key: "home_where_label", label: "Kalimat di atas daftar kota", def: "Kios Cimol Bojot AA ada di kota-kota ini." },
      { key: "home_cta_1_text", label: "Kartu kemitraan, penjelasan", def: "Acara kantor, hampers, reseller Frozen, sampai buka titik baru." },
      { key: "home_cta_1_button", label: "Kartu kemitraan, tulisan tautan", def: "Lihat pilihan kerja sama", max: 30 },
      { key: "home_cta_2_text", label: "Kartu karier, penjelasan", def: "Dari crew gerobak dan kios sampai tim kantor." },
      { key: "home_cta_2_button", label: "Kartu karier, tulisan tautan", def: "Lihat lowongan", max: 30 },
    ],
  },
  {
    page: "About Us",
    fields: [
      { key: "about_intro", label: "Kalimat pembuka", type: "textarea", def: "CRK Group adalah perusahaan di balik Cimol Bojot AA. Kami mengerjakan jajanan kaki lima dengan cara kerja brand besar." },
      { key: "about_story_1", label: "Cerita brand, paragraf 1", type: "textarea", ph: "[ISI: cerita asli brand, paragraf 1. Siapa yang memulai, kapan, dan di mana gerobak pertamanya.]" },
      { key: "about_story_2", label: "Cerita brand, paragraf 2", type: "textarea", ph: "[ISI: cerita asli brand, paragraf 2. Kenapa cimol, dan apa yang berubah sejak hari pertama.]" },
      ...n(4).flatMap((i): ContentField[] => [
        { key: `about_milestone_${i}_year`, label: `Perjalanan ${i}, tahun`, ph: "[ISI: tahun]" },
        { key: `about_milestone_${i}_text`, label: `Perjalanan ${i}, peristiwa`, ph: "[ISI: peristiwa]", hint: i === 1 ? "Mis. Gerobak pertama" : undefined },
      ]),
      ...n(3).flatMap((i): ContentField[] => [
        { key: `about_value_${i}_title`, label: `Nilai ${i}, judul`, ph: `[ISI: nilai ${i}]` },
        { key: `about_value_${i}_text`, label: `Nilai ${i}, penjelasan`, ph: "[ISI: penjelasan satu kalimat]" },
      ]),
      { key: "about_crew_count", label: "Jumlah crew dan karyawan", ph: "[ISI]", hint: "Mis. 1.200+" },
    ],
  },
  {
    page: "Careers",
    fields: n(3).flatMap((i): ContentField[] => [
      { key: `careers_reason_${i}_title`, label: `Alasan ${i}, judul`, ph: `[ISI: alasan ${i}]` },
      { key: `careers_reason_${i}_text`, label: `Alasan ${i}, penjelasan`, ph: "[ISI: penjelasan satu kalimat]" },
    ]),
  },
  {
    page: "Partnership",
    fields: [
      { key: "partner_type_1_text", label: "Pesanan acara dan kantor", type: "textarea", def: "Cimol buat rapat, ulang tahun kantor, atau acara komunitas.", hint: "Tambahkan minimal pesanan dan area layanan" },
      { key: "partner_type_2_text", label: "Hampers Frozen", type: "textarea", def: "Cimol Frozen dikemas jadi bingkisan.", hint: "Tambahkan pilihan paket dan waktu pesan" },
      { key: "partner_type_3_text", label: "Reseller dan agen Frozen", type: "textarea", def: "Jual Cimol Bojot AA Frozen di kota Kakak.", hint: "Tambahkan syarat dan skema" },
      { key: "partner_type_4_text", label: "Kemitraan titik outlet", type: "textarea", def: "Buka titik Cimol Bojot AA bareng kami.", hint: "Tambahkan skema kemitraan" },
    ],
  },
  {
    page: "Footer dan keranjang",
    note: "Tampil di semua halaman.",
    fields: [
      { key: "footer_lead", label: "Kalimat di footer", def: "CRK Group. Street food naik kelas, dari Bandung." },
      { key: "footer_tape_count", label: "Pita footer, jumlah titik", def: "500+ titik gerobak", max: 28 },
      { key: "cart_hint", label: "Catatan harga di keranjang", type: "textarea", def: "Harga bisa beda sedikit di tiap gerobak dan kios. Tim kami mengonfirmasi total dan cara ambil atau kirim lewat WhatsApp." },
    ],
  },
  {
    page: "SEO",
    note: "Judul dan deskripsi yang tampil di hasil pencarian Google dan saat tautan dibagikan. Judul halaman selain Home otomatis diakhiri \" | CRK Group\". Sertakan nama brand dan kata yang dicari orang; jangan mengulang kata kunci.",
    fields: [
      { key: "seo_home_title", label: "Home, judul", def: "Cimol Bojot AA dari CRK Group | Jajanan Aci Khas Bandung", max: 60 },
      { key: "seo_home_desc", label: "Home, deskripsi", type: "textarea", def: "CRK Group, rumah dari Cimol Bojot AA. Jajanan kaki lima dari Bandung yang sekarang ada di 500+ titik gerobak dan kios di Bandung dan Jabodetabek.", max: 155 },
      { key: "seo_about_title", label: "About Us, judul", def: "Tentang Kami dan Cerita Cimol Bojot AA", max: 48 },
      { key: "seo_about_desc", label: "About Us, deskripsi", type: "textarea", def: "Cerita CRK Group, perusahaan di balik Cimol Bojot AA: dari gerobak di Bandung sampai 500+ titik gerobak dan kios di Bandung dan Jabodetabek.", max: 155 },
      { key: "seo_brands_title", label: "Our Brands & Products, judul", def: "Menu dan Harga Cimol Bojot AA", max: 48 },
      { key: "seo_brands_desc", label: "Our Brands & Products, deskripsi", type: "textarea", def: "Menu dan harga Cimol Bojot AA: Cimol Bojot, Mozza, Beef, Ayam, Mix, Kuah Keju, New Series, dan Cimol Frozen. Harga Bandung dan Jabodetabek.", max: 155 },
      { key: "seo_locations_title", label: "Store Locations, judul", def: "Lokasi Kios Cimol Bojot AA Terdekat", max: 48 },
      { key: "seo_locations_desc", label: "Store Locations, deskripsi", type: "textarea", def: "Cari kios Cimol Bojot AA terdekat di Bandung, Cimahi, Bogor, Depok, Bekasi, dan Tangerang. Ada alamat, jam buka, dan petunjuk arah.", max: 155 },
      { key: "seo_careers_title", label: "Careers, judul", def: "Lowongan Kerja Cimol Bojot AA", max: 48 },
      { key: "seo_careers_desc", label: "Careers, deskripsi", type: "textarea", def: "Lowongan kerja di CRK Group dan Cimol Bojot AA, dari crew gerobak dan kios sampai tim kantor di Bandung dan Jabodetabek.", max: 155 },
      { key: "seo_news_title", label: "News & Updates, judul", def: "Kabar Terbaru Cimol Bojot AA", max: 48 },
      { key: "seo_news_desc", label: "News & Updates, deskripsi", type: "textarea", def: "Kabar terbaru Cimol Bojot AA dan CRK Group: kios baru, produk baru, promo, dan berita perusahaan.", max: 155 },
      { key: "seo_partnership_title", label: "Partnership, judul", def: "Kemitraan dan Pesanan Acara Cimol Bojot AA", max: 48 },
      { key: "seo_partnership_desc", label: "Partnership, deskripsi", type: "textarea", def: "Kerja sama dengan CRK Group dan Cimol Bojot AA: pesanan acara dan kantor, hampers Frozen, reseller dan agen Frozen, serta kemitraan titik outlet.", max: 155 },
      { key: "seo_contact_title", label: "Contact Us, judul", def: "Kontak dan WhatsApp Cimol Bojot AA", max: 48 },
      { key: "seo_contact_desc", label: "Contact Us, deskripsi", type: "textarea", def: "Hubungi CRK Group dan Cimol Bojot AA lewat WhatsApp customer service, tim kemitraan, atau form pesan.", max: 155 },
    ],
  },
  {
    page: "Contact Us",
    fields: [
      { key: "contact_office_address", label: "Alamat kantor", type: "textarea", ph: "[ISI: alamat kantor]" },
      { key: "contact_office_hours", label: "Jam kerja dan email", ph: "[ISI: jam kerja dan email]" },
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
