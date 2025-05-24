import Header from "@/app/components/layout/header";
import Footer from "@/app/components/layout/footer";
import Hero from "@/app/components/home/hero";
import HowItWorks from "@/app/components/home/howItworks";
import Categories from "@/app/components/home/categories";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";
import Testimonials from "@/app/components/home/Testimonials";
import CTASection from "@/app/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Categories />
        <FeaturedProducts />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}