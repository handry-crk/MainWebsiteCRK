import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { getContent } from "@/lib/api";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { logo } = await getContent();
  return (
    <>
      <a className="skip" href="#main">Langsung ke isi</a>
      <Header logo={logo} />
      <main id="main">{children}</main>
      <Footer />
      <Motion />
    </>
  );
}
