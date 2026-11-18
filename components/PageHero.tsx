import { breadcrumbLd } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { TornEdge } from "./TornEdge";

// Hero halaman dalam, satu keluarga dengan hero Home: baris pertama di atas merah,
// baris berikutnya di atas panel krem, seluruh blok dimiringkan. `children` = gambar/stiker di sisi kanan.
export function PageHero({ lines, intro, crumb, path, seed = 5, compact = false, parent, children }: { lines: string[]; intro: string; crumb: string; path: string; parent?: { name: string; path: string }; seed?: number; compact?: boolean; children?: React.ReactNode }) {
  const [first, ...rest] = lines;
  return (
    <section className={`phero sunburst${compact ? " phero--compact" : ""}`}>
      <JsonLd data={breadcrumbLd(crumb, path, parent)} />
      <div className="wrap phero__in">
        <div className="phero__type">
          <h1 className="display phero__h1">
            <span className="hero__l1">{first} </span>
            {rest.length > 0 && (
              <span className="hero__paper">
                {rest.map((l) => <span key={l}>{l} </span>)}
              </span>
            )}
          </h1>
          <p className="phero__intro">{intro}</p>
        </div>
        {children && <div className="phero__art">{children}</div>}
      </div>
      <TornEdge color="var(--cream)" seed={seed} />
    </section>
  );
}
