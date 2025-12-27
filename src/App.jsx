import React from "react";
import NawaweebNavbar from "./components/Navbar"; // Adjust path if needed
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import { products } from "./data/products";
import HypeBanner from "./components/HypeBanner";
import VibrantDrop from "./components/VibrantDrop";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-bg-light">
      
      {/* Navbar Integration */}
      <NawaweebNavbar />
        <Hero/>
        <HypeBanner/>
        <section className="py-20 px-6 sm:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-accent-dark font-clash font-bold text-xs tracking-widest uppercase">
              Now Trending
            </span>
            <h2 className="text-5xl md:text-6xl font-clash font-black text-primary uppercase">
              The Clan <span className="text-accent-dark">Drops</span>
            </h2>
          </div>
          <p className="font-editor italic text-primary/60 max-w-xs text-right">
            Artisanal craftsmanship meets legendary anime spirits.
          </p>
        </div>

        {/* GRID MAPPING: This is what fixes the blank screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
          <VibrantDrop/>
      {/* Main Content Area to Test Scroll Effects */}
      <Footer/>
    </div>
  );
}

export default App;