import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "./Hero";
import HypeBanner from "./HypeBanner";
import ProductCard from "./ProductCard";
import VibrantDrop from "./VibrantDrop";

export default function Shop() {
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        // Only show active products to the public
        setLiveProducts(res.data.data.products);
      } catch (err) {
        console.error("Failed to summon artifacts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

  return (
    <>
      <Hero />
      <HypeBanner />
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

        {loading ? (
          <div className="text-center py-20 font-editor italic">Unrolling the scrolls...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </section>
      <VibrantDrop />
    </>
  );
}