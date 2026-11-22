"use client";
import Link from "next/link";
import { track } from "@/lib/track";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as LMap, CircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Outlet } from "@/data/seed";

type Row = Outlet & { d: number | null };

const km = (a: [number, number], b: [number, number]) => {
  const r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

// "08.00–22.00" → status buka/tutup menurut jam Jakarta. null bila jam tidak terbaca.
function openState(hours: string, nowMin: number): { open: boolean; text: string } | null {
  const m = hours.match(/(\d{1,2})[.:](\d{2})\s*[–-]\s*(\d{1,2})[.:](\d{2})/);
  if (!m) return null;
  const from = +m[1] * 60 + +m[2];
  let to = +m[3] * 60 + +m[4];
  if (to <= from) to += 1440;
  const now = nowMin < from && to > 1440 ? nowMin + 1440 : nowMin;
  const open = now >= from && now < to;
  return { open, text: open ? `Buka sampai ${m[3].padStart(2, "0")}.${m[4]}` : `Tutup, buka ${m[1].padStart(2, "0")}.${m[2]}` };
}
const jakartaMinutes = () => {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  return +p.find((x) => x.type === "hour")!.value * 60 + +p.find((x) => x.type === "minute")!.value;
};
const dist = (d: number) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`);
const mapsUrl = (o: Outlet) => o.gmaps || `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`;

export function OutletFinder({ outlets }: { outlets: Outlet[] }) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [only, setOnly] = useState<"" | "open" | "soon">("");
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [geoMsg, setGeoMsg] = useState("");
  const [geoErr, setGeoErr] = useState("");
  const [locating, setLocating] = useState(false);
  const [touch, setTouch] = useState(false);
  const [mapFree, setMapFree] = useState(false);
  const [now, setNow] = useState<number | null>(null); // diisi setelah tampil, supaya HTML server dan browser sama
  const mapEl = useRef<HTMLDivElement>(null);
  const listEl = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const markers = useRef<Record<string, CircleMarker>>({});
  const fromScroll = useRef(false);
  const me = useRef<CircleMarker | null>(null);

  useEffect(() => {
    setNow(jakartaMinutes());
    const v = new URLSearchParams(window.location.search).get("q");
    if (v) {
      const hit = outlets.find((o) => o.city.toLowerCase() === v.toLowerCase());
      if (hit) setCity(hit.city); else setQ(v);
    }
    const t = setInterval(() => setNow(jakartaMinutes()), 60000);
    return () => clearInterval(t);
  }, [outlets]);

  const cities = useMemo(() => {
    const c = new Map<string, number>();
    for (const o of outlets) c.set(o.city, (c.get(o.city) ?? 0) + 1);
    return [...c.entries()];
  }, [outlets]);
  const soonCount = useMemo(() => outlets.filter((o) => o.soon).length, [outlets]);

  const list: Row[] = useMemo(() => {
    const t = q.trim().toLowerCase();
    const f = outlets.filter((o) => {
      if (city && o.city !== city) return false;
      if (only === "soon" && !o.soon) return false;
      if (only === "open" && (o.soon || now == null || !openState(o.hours, now)?.open)) return false;
      return !t || `${o.name} ${o.city} ${o.address} ${o.landmark}`.toLowerCase().includes(t);
    });
    const rows = f.map((o) => ({ ...o, d: pos ? km(pos, [o.lat, o.lng]) : null }));
    return pos ? rows.sort((a, b) => a.d! - b.d!) : rows;
  }, [outlets, q, city, only, pos, now]);

  const grouped = !pos && !q.trim() && !city;

  // peta
  useEffect(() => {
    let dead = false;
    import("leaflet").then((L) => {
      if (dead || !mapEl.current || map.current) return;
      // Di layar sentuh, geser satu jari dipakai untuk scroll halaman, bukan menggeser peta.
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setTouch(coarse);
      const m = L.map(mapEl.current, { scrollWheelZoom: false, zoomControl: false, dragging: !coarse }).setView([-6.5, 107], 9);
      L.control.zoom({ position: "bottomright" }).addTo(m);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 18 }).addTo(m);
      for (const o of outlets) {
        markers.current[o.id] = L.circleMarker([o.lat, o.lng], { radius: 9, color: "#1e1a17", weight: 3, fillColor: o.soon ? "#fffaf1" : "#e9a227", fillOpacity: 1 })
          .addTo(m).bindTooltip(o.name, { direction: "top", offset: [0, -8] }).on("click", () => { fromScroll.current = false; setActive(o.id); });
      }
      map.current = m;
      m.fitBounds(outlets.map((o) => [o.lat, o.lng] as [number, number]), { padding: [36, 36] });
    });
    return () => { dead = true; map.current?.remove(); map.current = null; markers.current = {}; };
  }, [outlets]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const ids = new Set(list.map((o) => o.id));
    for (const [id, mk] of Object.entries(markers.current)) (ids.has(id) ? mk.addTo(m) : mk.remove());
    if (list.length && !active) m.fitBounds(list.map((o) => [o.lat, o.lng] as [number, number]), { padding: [36, 36], maxZoom: 13 });
  }, [list, active]);

  useEffect(() => {
    for (const [id, mk] of Object.entries(markers.current)) {
      const o = outlets.find((x) => x.id === id);
      const on = id === active;
      mk.setStyle({ radius: on ? 14 : 9, fillColor: on ? "#bf3229" : o?.soon ? "#fffaf1" : "#e9a227" });
      if (on) mk.bringToFront();
    }
    if (!active) return;
    const o = outlets.find((x) => x.id === active);
    if (o) map.current?.flyTo([o.lat, o.lng], Math.max(map.current.getZoom(), 14), { duration: 0.6 });
    if (!fromScroll.current) {
      const el = document.getElementById(`kios-${active}`), box = listEl.current;
      if (el && box) {
        if (box.scrollWidth > box.clientWidth + 8) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
        else box.scrollTo({ top: el.offsetTop - 56, behavior: "smooth" });
      }
    }
    fromScroll.current = false;
  }, [active, outlets]);

  // di HP daftar digeser ke samping; kartu yang di tengah jadi kios aktif
  const onListScroll = useCallback(() => {
    const box = listEl.current;
    if (!box || box.scrollWidth <= box.clientWidth + 8) return;
    const mid = box.scrollLeft + box.clientWidth / 2;
    let best: string | null = null, gap = Infinity;
    for (const el of box.querySelectorAll<HTMLElement>("[data-id]")) {
      const g = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (g < gap) { gap = g; best = el.dataset.id!; }
    }
    if (best && best !== active) { fromScroll.current = true; setActive(best); }
  }, [active]);
  useEffect(() => {
    const box = listEl.current;
    if (!box) return;
    let t: ReturnType<typeof setTimeout>;
    const h = () => { clearTimeout(t); t = setTimeout(onListScroll, 140); };
    box.addEventListener("scroll", h, { passive: true });
    return () => { box.removeEventListener("scroll", h); clearTimeout(t); };
  }, [onListScroll]);

  function locate() {
    setGeoErr("");
    if (!navigator.geolocation) return setGeoErr("Browser ini tidak mendukung lokasi. Pilih kota atau ketik nama jalan saja, Kak.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const here: [number, number] = [p.coords.latitude, p.coords.longitude];
        // saringan kota dan pencarian dilepas, supaya kios terdekat di kota mana pun ikut dihitung
        track("locate_me"); setLocating(false); setCity(""); setQ(""); setOnly(""); setPos(here);
        const nearest = [...outlets].sort((a, b) => km(here, [a.lat, a.lng]) - km(here, [b.lat, b.lng]))[0];
        fromScroll.current = false;
        setActive(nearest?.id ?? null);
        listEl.current?.scrollTo({ top: 0, left: 0 });
        document.querySelector(".finder__chips")?.scrollTo({ left: 0, behavior: "smooth" });
      },
      (e) => {
        setLocating(false);
        setGeoErr(e.code === 1
          ? "Izin lokasi ditolak, jadi daftar belum diurutkan. Izinkan akses lokasi untuk situs ini di browser (ikon gembok di kolom alamat), lalu tekan tombolnya lagi."
          : "Lokasi Kakak belum terbaca, jadi daftar belum diurutkan. Pastikan GPS menyala, lalu coba lagi.");
      },
      { timeout: 12000, maximumAge: 60000 },
    );
  }
  const reset = () => { setQ(""); setCity(""); setOnly(""); setPos(null); setActive(null); setGeoMsg(""); setGeoErr(""); };

  // titik "Kakak di sini" di peta
  useEffect(() => {
    const m = map.current;
    me.current?.remove();
    me.current = null;
    if (!m || !pos) return;
    let dead = false;
    import("leaflet").then((L) => {
      if (dead || !map.current) return;
      me.current = L.circleMarker(pos, { radius: 8, color: "#fffaf1", weight: 4, fillColor: "#1e1a17", fillOpacity: 1 }).addTo(map.current).bindTooltip("Kakak di sini", { permanent: true, direction: "top", offset: [0, -8] });
      const near = [...outlets].sort((a, b) => km(pos, [a.lat, a.lng]) - km(pos, [b.lat, b.lng])).slice(0, 3);
      map.current.fitBounds([pos, ...near.map((o) => [o.lat, o.lng] as [number, number])], { padding: [56, 56], maxZoom: 14 });
    });
    return () => { dead = true; };
  }, [pos, outlets]);
  const filtered = Boolean(q || city || only || pos);

  let lastCity = "";
  return (
    <div className="finder">
      <div className="finder__top">
        <div className="finder__search">
          <label htmlFor="cari" className="sr">Cari kios</label>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></svg>
          <input id="cari" type="search" value={q} onChange={(e) => { setQ(e.target.value); setActive(null); }} placeholder="Cari nama kios, jalan, atau kota" autoComplete="off" />
        </div>
        <button type="button" className={`btn btn--red finder__near${pos ? " is-on" : ""}`} onClick={locate} disabled={locating}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.1 7-12.3A7 7 0 0 0 5 9.7C5 14.9 12 22 12 22Z" /><circle cx="12" cy="9.6" r="2.6" /></svg>
          {locating ? "Mencari lokasi Kakak..." : pos ? "Perbarui lokasi saya" : "Kios terdekat dari saya"}
        </button>
      </div>

      <div className="finder__chips" role="group" aria-label="Saring kios">
        <button type="button" aria-pressed={!city} onClick={() => { setCity(""); setActive(null); }}>Semua <b>{outlets.length}</b></button>
        {cities.map(([c, n]) => (
          <button key={c} type="button" aria-pressed={city === c} onClick={() => { setCity(city === c ? "" : c); setActive(null); }}>{c} <b>{n}</b></button>
        ))}
        <span className="finder__sep" aria-hidden="true" />
        <button type="button" className="finder__flag" aria-pressed={only === "open"} onClick={() => { setOnly(only === "open" ? "" : "open"); setActive(null); }}>Buka sekarang</button>
        {soonCount > 0 && <button type="button" className="finder__flag" aria-pressed={only === "soon"} onClick={() => { setOnly(only === "soon" ? "" : "soon"); setActive(null); }}>Segera buka <b>{soonCount}</b></button>}
      </div>

      {geoErr && (
        <p className="finder__alert" role="alert">
          <span>{geoErr}</span>
          <button type="button" onClick={() => setGeoErr("")}>Tutup</button>
        </p>
      )}

      <div className="finder__panel">
        <div className="finder__side">
          <p className="finder__msg" role="status">
            <span>{geoMsg || (pos ? `${list.length} kios, dari yang paling dekat` : `${list.length} kios`)}</span>
            {filtered && <button type="button" className="tlink" onClick={reset}>Hapus saringan</button>}
          </p>
          <h2 className="sr">Daftar kios</h2>
          <div className="finder__list" ref={listEl}>
            {list.length === 0 && <p className="finder__empty">Belum ada kios yang cocok, Kak. Coba kota lain atau hapus saringan.</p>}
            {list.map((o, i) => {
              const head = grouped && o.city !== lastCity ? o.city : "";
              if (head) lastCity = o.city;
              const st = !o.soon && now != null ? openState(o.hours, now) : null;
              const on = active === o.id;
              return (
                <div key={o.id} className="finder__item">
                  {head && <h3 className="finder__city">{head}</h3>}
                  <article id={`kios-${o.id}`} data-id={o.id} className={`kios${on ? " is-active" : ""}${o.soon ? " is-soon" : ""}`}>
                    <button type="button" className="kios__head" aria-expanded={on} onClick={() => { fromScroll.current = false; setActive(on ? null : o.id); }}>
                      <span className="kios__name">{o.name}</span>
                      <span className="kios__meta">
                        {o.d != null && <b className="kios__dist">{dist(o.d)}</b>}
                        {o.soon ? <i className="kios__tag kios__tag--soon">Segera buka</i> : st ? <i className={`kios__tag${st.open ? " kios__tag--open" : ""}`}>{st.text}</i> : o.hours ? <i className="kios__tag">{o.hours}</i> : null}
                        {pos && i === 0 && <i className="kios__tag kios__tag--near">Paling dekat</i>}
                      </span>
                    </button>
                    <div className="kios__more">
                      <p>{o.address}</p>
                      {o.landmark && <p className="kios__note">Patokan: {o.landmark}</p>}
                      <p className="kios__note">{o.soon ? o.hours : o.hours ? `Jam buka ${o.hours}` : ""}</p>
                      <div className="kios__act">
                        <a className="btn btn--red btn--sm" href={mapsUrl(o)} target="_blank" rel="noopener">Petunjuk arah</a>
                        {o.gofood && <a className="btn btn--line btn--sm" href={o.gofood} target="_blank" rel="noopener">GoFood</a>}
                        {o.grabfood && <a className="btn btn--line btn--sm" href={o.grabfood} target="_blank" rel="noopener">GrabFood</a>}
                        {o.slug && <Link className="tlink kios__page" href={`/locations/${o.slug}`}>Halaman kios</Link>}
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
        <div className="finder__mapwrap">
          <div className="finder__map" ref={mapEl} aria-label="Peta kios" />
          {touch && (
            <button type="button" className="finder__lock" aria-pressed={mapFree}
              onClick={() => { const on = !mapFree; setMapFree(on); if (on) map.current?.dragging.enable(); else map.current?.dragging.disable(); }}>
              {mapFree ? "Kunci peta" : "Geser peta"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
