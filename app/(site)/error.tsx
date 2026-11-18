"use client"; // Batas galat harus Client Component
import { useEffect } from "react";

// Tampil bila sebuah halaman gagal dimuat. Header dan footer tetap ada.
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="stub sunburst">
      <div className="wrap">
        <h1 className="display">Waduh, macet.</h1>
        <div className="panel stub__panel">
          <p>Halamannya gagal dimuat. Coba muat ulang, Kak. Kalau masih macet, balik dulu ke Home.</p>
          <div className="stub__acts">
            <button type="button" className="btn btn--red" onClick={() => retry()}>Coba lagi</button>
            <a className="btn btn--line" href="/">Balik ke Home</a>
          </div>
        </div>
      </div>
    </section>
  );
}
