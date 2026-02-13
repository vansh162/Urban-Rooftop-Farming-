import Hero from "../components/Hero.jsx";
import Navbar from "../components/Navbar.jsx";
import BookingSection from "../components/BookingSection.jsx";
import ShopSection from "../components/ShopSection.jsx";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <BookingSection />
        <ShopSection />
      </main>
    </div>
  );
}
