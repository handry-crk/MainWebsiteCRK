import type { NextConfig } from "next";

// Foto yang diunggah dari admin disimpan di Supabase Storage; izinkan next/image mengoptimalkannya.
const supabaseHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname; } catch { return ""; }
})();
const sb = supabaseHost ? `https://${supabaseHost}` : "";
const dev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: hanya sumber yang memang dipakai website ini.
// - 'unsafe-inline' pada script: Next.js menyisipkan skrip inline untuk halaman statis; nonce akan memaksa semua halaman jadi dinamis.
// - OpenStreetMap: ubin peta. Supabase: data, login admin, foto. Google: Analytics 4 (aktif bila ID diisi di admin).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://*.tile.openstreetmap.org ${sb} https://www.google-analytics.com https://www.googletagmanager.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${sb} ${sb.replace("https://", "wss://")} https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${dev ? " ws:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ").replace(/ {2,}/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    remotePatterns: supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : [],
  },
  // Careers dipindah ke situs rekrutmen CRK. Tautan lama /careers tetap berfungsi.
  async redirects() {
    return [{ source: "/careers", destination: "https://people.citarasakuliner.com/", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
