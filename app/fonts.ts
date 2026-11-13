import localFont from "next/font/local";

// Ganti font: timpa file di app/fonts/ (display.woff2, body.woff2, hand.woff2) dengan font resmi brand.
// next/font otomatis preload dan menyesuaikan ukuran font cadangan supaya layout tidak bergeser.
export const display = localFont({ src: "./fonts/display.woff2", weight: "100 900", variable: "--font-display", display: "swap", fallback: ["Arial Black", "sans-serif"] });
export const body = localFont({ src: "./fonts/body.woff2", weight: "200 800", variable: "--font-body", display: "swap", fallback: ["system-ui", "sans-serif"] });
export const hand = localFont({ src: "./fonts/hand.woff2", weight: "400", variable: "--font-hand", display: "swap", preload: false, fallback: ["cursive"] });
