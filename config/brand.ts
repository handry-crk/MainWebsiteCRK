// Satu tempat untuk semua aset & tautan brand. Ganti nilai di sini saat aset asli tersedia.
export const brand = {
  company: "CRK Group",
  legalName: "PT Citarasa Kuliner Indonesia",
  tagline: "Street food naik kelas",
  // ASET SEMENTARA: dipotong dari poster CBAA (resolusi rendah). Ganti file di /public/brand dengan aset asli.
  logo: { src: "/brand/logo.png", width: 315, height: 162 },
  mascot: { src: "/brand/mascot.png", width: 428, height: 426 },
  mascotSmall: { src: "/brand/mascot-small.png", width: 332, height: 302 },
  kiosk: { src: "/brand/kiosk.jpg", width: 604, height: 334 },
  whatsappCs: "", // [ISI: nomor WA CS, format 62xxxxxxxxxx]
  whatsappPartnership: "", // [ISI: nomor WA kemitraan]
  instagram: "https://www.instagram.com/cimolbojotaa", // akun resmi (dari klien, 22 Nov 2026); bisa ditimpa di Admin > Pengaturan
  tiktok: "https://www.tiktok.com/@cimolbojot.aa", // akun resmi (dari klien, 22 Nov 2026)
  // Logo resmi dari paket aset merek Instagram dan TikTok (diserahkan klien 22 Nov 2026), hanya diperkecil. Jangan diubah bentuk atau warnanya.
  iconInstagram: { src: "/brand/social/instagram.png", width: 112, height: 112 },
  iconTiktok: { src: "/brand/social/tiktok.png", width: 112, height: 112 },
  careersUrl: "https://people.citarasakuliner.com/",
  order: { gofood: "", grabfood: "", shopeefood: "", tokopedia: "", shopee: "", tiktokshop: "" },
} as const;

export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/brands", label: "Our Brands & Products" },
  { href: "/locations", label: "Store Locations" },
  { href: "https://people.citarasakuliner.com/", label: "Careers" }, // situs rekrutmen CRK; dibuka di tab baru
  { href: "/news", label: "News & Updates" },
  { href: "/partnership", label: "Partnership" },
  { href: "/contact", label: "Contact Us" },
] as const;

// Tautan tambahan di footer.
export const footerNav = [
  { href: "/faq", label: "FAQ" },
  { href: "/member", label: "Member" },
] as const;
