"use client"; // Batas galat harus Client Component

// Cadangan terakhir bila layout utama sendiri gagal. Halaman ini tidak memuat globals.css,
// jadi gayanya ditulis langsung dan fontnya memakai font sistem.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  const btn = { font: "700 16px system-ui, sans-serif", padding: "12px 20px", borderRadius: 999, border: "2px solid #1e1a17", cursor: "pointer", textDecoration: "none" } as const;
  return (
    <html lang="id">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#bf3229", color: "#1e1a17", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ background: "#f3ebdd", borderRadius: 24, padding: 32, margin: 16, maxWidth: 440 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>Waduh, macet.</h1>
          <p style={{ margin: "0 0 20px", lineHeight: 1.5 }}>Website gagal dimuat. Coba muat ulang, Kak.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" onClick={() => retry()} style={{ ...btn, background: "#bf3229", color: "#f3ebdd" }}>Coba lagi</button>
            <a href="/" style={{ ...btn, background: "transparent", color: "#1e1a17" }}>Balik ke Home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
