// Daftar teks dan gambar halaman yang bisa diubah dari Admin > Konten halaman.
// `def` = teks bawaan yang sudah layak tampil. `ph` = penanda untuk isi yang WAJIB datang dari klien.
export type ContentField = { key: string; label: string; type?: "text" | "textarea" | "image"; def?: string; ph?: string; hint?: string };
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
      { key: "home_why_1_title", label: "Stiker 1, judul", def: "Rasanya sama di tiap titik" },
      { key: "home_why_1_text", label: "Stiker 1, penjelasan", def: "Satu resep, satu takaran. Di Braga atau di Bekasi." },
      { key: "home_why_2_title", label: "Stiker 2, judul", def: "Gerobak dan kiosnya rapi" },
      { key: "home_why_2_text", label: "Stiker 2, penjelasan", def: "Bersih, terang, gampang dikenali dari jauh." },
      { key: "home_why_3_text", label: "Label harga, kalimat", def: "Harganya tetap kaki lima. Mulai" },
      { key: "home_why_3_price", label: "Label harga, angka", def: "6.000" },
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
