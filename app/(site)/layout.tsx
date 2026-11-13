import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a className="skip" href="#main">Langsung ke isi</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
