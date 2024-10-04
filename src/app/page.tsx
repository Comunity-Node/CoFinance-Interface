import AppsProject from "@/components/AppsProject";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SuportedNetwork from "@/components/SuportedNetwork";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AppsProject />
      <SuportedNetwork />
      <Footer />
    </main>
  );
}