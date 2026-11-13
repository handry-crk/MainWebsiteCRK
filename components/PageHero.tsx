import { breadcrumbLd } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { TornEdge } from "./TornEdge";

export function PageHero({ title, intro, crumb, path, seed = 5 }: { title: string; intro: string; crumb: string; path: string; seed?: number }) {
  return (
    <section className="phero sunburst">
      <JsonLd data={breadcrumbLd(crumb, path)} />
      <div className="wrap">
        <h1 className="display display--page">{title}</h1>
        <p className="phero__intro">{intro}</p>
      </div>
      <TornEdge color="var(--cream)" seed={seed} />
    </section>
  );
}
