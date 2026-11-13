"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LMap, CircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Outlet } from "@/data/seed";

const km = (a: [number, number], b: [number, number]) => {
  const r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

export function OutletFinder({ outlets }: { outlets: Outlet[] }) {
  const [q, setQ] = useState("");
  // ?q= dari pencarian di Home dibaca setelah halaman tampil, supaya daftar outlet tetap ada di HTML statis.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("q");
    if (v) setQ(v);
  }, []);
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [geoMsg, setGeoMsg] = useState("");
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const markers = useRef<Record<string, CircleMarker>>({});
  const cities = useMemo(() => [...new Set(outlets.map((o) => o.city))], [outlets]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const f = outlets.filter((o) => !t || `${o.name} ${o.city} ${o.address} ${o.landmark}`.toLowerCase().includes(t));
    const withD = f.map((o) => ({ ...o, d: pos ? km(pos, [o.lat, o.lng]) : null }));
    return pos ? withD.sort((a, b) => a.d! - b.d!) : withD;
  }, [outlets, q, pos]);

  useEffect(() => {
    let dead = false;
    import("leaflet").then((L) => {
      if (dead || !mapEl.current || map.current) return;
      const m = L.map(mapEl.current, { scrollWheelZoom: false }).setView([-6.6, 107.2], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 18 }).addTo(m);
      outlets.forEach((o) => {
        markers.current[o.id] = L.circleMarker([o.lat, o.lng], { radius: 9, color: "#8f211c", weight: 3, fillColor: o.soon ? "#f3ebdd" : "#e9a227", fillOpacity: 1 })
          .addTo(m).bindTooltip(o.name).on("click", () => setActive(o.id));
      });
      map.current = m;
    });
    return () => { dead = true; map.current?.remove(); map.current = null; };
  }, [outlets]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const ids = new Set(list.map((o) => o.id));
    Object.entries(markers.current).forEach(([id, mk]) => (ids.has(id) ? mk.addTo(m) : mk.remove()));
    if (list.length) m.fitBounds(list.map((o) => [o.lat, o.lng] as [number, number]), { padding: [40, 40], maxZoom: 13 });
  }, [list]);

  useEffect(() => {
    if (!active) return;
    const o = outlets.find((x) => x.id === active);
    if (o) map.current?.setView([o.lat, o.lng], 15);
    document.getElementById(`outlet-${active}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active, outlets]);

  function locate() {
    if (!navigator.geolocation) return setGeoMsg("Browser ini tidak mendukung lokasi.");
    setGeoMsg("Mencari lokasi Kakak...");
    navigator.geolocation.getCurrentPosition(
      (p) => { setPos([p.coords.latitude, p.coords.longitude]); setGeoMsg("Diurutkan dari yang paling dekat."); },
      () => setGeoMsg("Lokasi tidak bisa diakses. Ketik nama kota saja, Kak."),
    );
  }

  return (
    <div className="finder">
      <div className="finder__bar">
        <div className="search">
          <label htmlFor="cari">Cari outlet</label>
          <div className="search__row">
            <input id="cari" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ketik kota, kecamatan, atau nama jalan" autoComplete="off" />
          </div>
        </div>
        <button type="button" className="btn btn--line" onClick={locate}>Pakai lokasi saya</button>
      </div>
      <ul className="cities" aria-label="Pilih kota">
        <li><button type="button" aria-pressed={!q} onClick={() => setQ("")}>Semua kota</button></li>
        {cities.map((c) => (
          <li key={c}><button type="button" aria-pressed={q.toLowerCase() === c.toLowerCase()} onClick={() => setQ(c)}>{c}</button></li>
        ))}
      </ul>
      <p className="finder__msg" role="status">{geoMsg || `${list.length} outlet ditemukan.`}</p>

      <div className="finder__grid">
        <ul className="outlets">
          {list.length === 0 && <li className="outlets__empty">Belum ada outlet di sekitar situ, Kak. Coba kota lain.</li>}
          {list.map((o) => (
            <li key={o.id} id={`outlet-${o.id}`} className={active === o.id ? "is-active" : ""}>
              <button type="button" className="outlets__name" onClick={() => setActive(o.id)}>{o.name}</button>
              {o.soon && <span className="outlets__soon">Segera buka</span>}
              <p>{o.address}</p>
              <p className="outlets__meta">{[o.landmark, o.hours, o.d != null ? `${o.d.toFixed(1)} km` : ""].filter(Boolean).join(" · ")}</p>
              <div className="btns">
                <a className="btn btn--red btn--sm" href={o.gmaps || `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`} target="_blank" rel="noopener">Petunjuk arah</a>
                {o.gofood && <a className="btn btn--line btn--sm" href={o.gofood} target="_blank" rel="noopener">GoFood</a>}
                {o.grabfood && <a className="btn btn--line btn--sm" href={o.grabfood} target="_blank" rel="noopener">GrabFood</a>}
              </div>
            </li>
          ))}
        </ul>
        <div className="finder__map" ref={mapEl} aria-label="Peta outlet" />
      </div>
    </div>
  );
}
