// Satu tempat untuk semua aset & tautan brand. Ganti nilai di sini saat aset asli tersedia.
export const brand = {
  company: "CRK Group",
  legalName: "PT Citarasa Kuliner Indonesia",
  tagline: "Street food naik kelas",
  // Isi path file di /public/brand, mis. "/brand/logo-crk.svg". Kosong = placeholder berlabel.
  logo: "",
  mascot: "",
  whatsappCs: "", // [ISI: nomor WA CS, format 62xxxxxxxxxx]
  whatsappPartnership: "", // [ISI: nomor WA kemitraan]
  instagram: "", // [ISI]
  tiktok: "", // [ISI]
  order: { gofood: "", grabfood: "", shopeefood: "", tokopedia: "", shopee: "", tiktokshop: "" },
} as const;

export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/brands", label: "Our Brands & Products" },
  { href: "/locations", label: "Store Locations" },
  { href: "/careers", label: "Careers" },
  { href: "/news", label: "News & Updates" },
  { href: "/partnership", label: "Partnership" },
  { href: "/contact", label: "Contact Us" },
] as const;
