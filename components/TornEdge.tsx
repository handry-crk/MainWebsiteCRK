// Tepi sobekan kertas di antara dua section. `color` = warna kertas yang "menimpa".
// Dua lapis: kertas, dan serat putih tipis di tepinya seperti kertas yang benar-benar disobek.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function edge(seed: number, lift: number) {
  const r = rng(seed);
  const pts: string[] = [];
  let x = 0, wander = 14 + r() * 8;
  while (x < 1200) {
    wander += (r() - 0.5) * 7;
    wander = Math.max(7, Math.min(26, wander));
    const tear = r() < 0.07 ? (r() - 0.5) * 16 : 0; // sesekali robekan lebih dalam
    pts.push(`${x.toFixed(1)},${(wander + (r() - 0.5) * 3.4 + tear - lift).toFixed(1)}`);
    x += 3 + r() * 9;
  }
  pts.push(`1200,${(wander - lift).toFixed(1)}`);
  return `0,40 ${pts.join(" ")} 1200,40`;
}

export function TornEdge({ color, seed = 7, flip = false }: { color: string; seed?: number; flip?: boolean }) {
  return (
    <svg className={`torn${flip ? " torn--flip" : ""}`} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={edge(seed, 3.2)} fill="#fffaf1" opacity="0.92" />
      <polygon points={edge(seed, 0)} fill={color} />
    </svg>
  );
}
