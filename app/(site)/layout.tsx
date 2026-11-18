import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { CartProvider } from "@/components/shop/cart";
import { getContent, getSettings } from "@/lib/api";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [{ logo }, st] = await Promise.all([getContent(), getSettings()]);
  return (
    <CartProvider whatsapp={st.whatsappCs}>
      <a className="skip" href="#main">Langsung ke isi</a>
      <Header logo={logo} />
      <main id="main">{children}</main>
      <Footer />
      <Motion />
    </CartProvider>
  );
}
