import Banner from "@/components/landing/banner";
import Benefits from "@/components/landing/benefits";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-grid-pattern bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
      <Banner />
      <Benefits />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
