import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStub } from "@/components/PageStub";
import { brand } from "@/config/brand";

export default function NotFound() {
  return (
    <>
      <Header logo={brand.logo} />
      <main id="main"><PageStub title="Waduh, nyasar." note="Halamannya nggak ketemu. Cimolnya masih ada kok." /></main>
      <Footer />
    </>
  );
}
