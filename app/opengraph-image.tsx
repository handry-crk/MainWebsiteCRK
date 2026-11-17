import { ImageResponse } from "next/og";

export const alt = "CRK Group, street food naik kelas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gambar pratinjau saat tautan dibagikan. Ganti dengan desain resmi (public/og.png) bila sudah ada.
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#bf3229", color: "#f3ebdd" }}>
        <div style={{ fontSize: 44, fontWeight: 700 }}>CRK Group</div>
        <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 1, marginTop: 24 }}>Jajanan pinggir jalan, naik kelas.</div>
        <div style={{ fontSize: 36, marginTop: 36 }}>Rumahnya Cimol Bojot AA. 500+ titik gerobak dan kios di Bandung dan Jabodetabek.</div>
      </div>
    ),
    size,
  );
}
