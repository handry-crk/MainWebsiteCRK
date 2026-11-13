import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { Button } from "@/components/Button";
import { Starburst } from "@/components/Starburst";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

const colors = [
  ["--red", "Merah bata, warna dominan"],
  ["--red-deep", "Bayangan huruf, hover, footer"],
  ["--cream", "Panel, latar, isi huruf judul"],
  ["--mustard", "Hanya untuk starburst"],
  ["--ink", "Teks di atas krem"],
];

export default function Styleguide() {
  return (
    <div className="sg">
      <section className="sg__red">
        <div className="wrap">
          <h1 className="display">Styleguide</h1>
          <p className="sg__lead">Semua halaman memakai token dan komponen di bawah ini. Jangan menambah ukuran, warna, atau gaya di luar daftar.</p>
        </div>
      </section>
      <div className="wrap sg__body">
        <h2 className="h2">Warna</h2>
        <ul className="sg__colors">
          {colors.map(([v, d]) => (
            <li key={v}><i style={{ background: `var(${v})` }} /><b>{v}</b><span>{d}</span></li>
          ))}
        </ul>

        <h2 className="h2">Tipografi</h2>
        <div className="sg__type">
          <div className="sg__ondark"><p className="display">Display, Lilita One</p></div>
          <p className="h2">H2, Lilita One</p>
          <p className="sg__h3">H3, Plus Jakarta Sans 800</p>
          <p>Body, Plus Jakarta Sans 400. Kalimat pendek, sapaan Kak, fakta lebih dulu daripada kata sifat.</p>
          <p className="hand">Aksen tulisan tangan, satu kata per halaman</p>
        </div>

        <h2 className="h2">Tombol</h2>
        <div className="sg__ondark btns">
          <Button href="#">Krem di atas merah</Button>
        </div>
        <div className="btns sg__row">
          <Button href="#" variant="red">Merah di atas krem</Button>
          <Button href="#" variant="line">Sekunder</Button>
          <a className="tlink" href="#">Tautan teks</a>
        </div>

        <h2 className="h2">Starburst dan foto</h2>
        <div className="sg__ondark sg__flex">
          <Starburst>400+<small>outlet</small></Starburst>
          <BrandImage variant="cutout" ratio="1 / 1" alt="" label="Cutout: objek tanpa latar" className="sg__img" />
          <BrandImage variant="torn" ratio="4 / 5" alt="" label="Torn: foto sobekan kertas" className="sg__img" />
        </div>
      </div>
    </div>
  );
}
