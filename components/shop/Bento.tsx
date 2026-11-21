import Image from "next/image";
import type { Product } from "@/data/seed";
import { prices } from "@/lib/price";

const from = (s: string) => (prices(s)[0] ?? 0).toLocaleString("id-ID");

// Grid menu berbentuk bento: menu andalan dapat kotak besar, sisanya kotak kecil.
export function Bento({ items }: { items: Product[] }) {
  return (
    <ul className="bento">
      {items.map((m, i) => (
        <li key={m.name} className={`bento__tile bento__tile--${i % 5}${m.best ? " is-best" : ""}${m.photo ? " has-photo" : ""}`}>
          {m.photo && <Image className="bento__photo" {...m.photo} alt="" sizes="(max-width: 900px) 90vw, 420px" />}
          <div className="bento__tags">
            {m.best && <span className="bento__badge bento__badge--best">Paling laku</span>}
            {m.badge && <span className="bento__badge">{m.badge}</span>}
            {m.spice && <span className="bento__badge bento__badge--spice">Bisa pilih pedas</span>}
          </div>
          <h3>{m.name}</h3>
          {m.note && <p>{m.note}</p>}
          <div className="bento__foot">
            <span className="bento__price"><small>{prices(m.bandung).length > 1 ? "mulai" : "harga"}</small>{from(m.bandung)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
