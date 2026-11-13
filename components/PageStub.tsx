import { Button } from "./Button";

// Halaman yang belum dibangun. Dipakai sampai tiap halaman dikerjakan.
export function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <section className="stub sunburst">
      <div className="wrap">
        <h1 className="display">{title}</h1>
        <div className="panel stub__panel">
          <p>{note}</p>
          <Button href="/" variant="red">Balik ke Home</Button>
        </div>
      </div>
    </section>
  );
}
