import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Hero from "./Hero";
import HypeBanner from "./HypeBanner";
import ProductCard from "./ProductCard";
import VibrantDrop from "./VibrantDrop";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter");

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = res.data.data.products || [];
        const activeItems = allProducts.filter(p => p.is_active);
        setProducts(activeItems);
        setFilteredProducts(activeItems);
      } catch (err) {
        console.error("Failed to summon artifacts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

  useEffect(() => {
    if (!activeFilter) {
      setFilteredProducts(products);
      return;
    }
    const lowerFilter = activeFilter.toLowerCase();
    const filtered = products.filter(p =>
      p.collection?.toLowerCase() === lowerFilter ||
      p.tags?.some(tag => tag.toLowerCase() === lowerFilter) ||
      p.title?.toLowerCase().includes(lowerFilter)
    );
    setFilteredProducts(filtered);
  }, [activeFilter, products]);

  return (
    <>
      <Hero />
      <HypeBanner />
      <section className="py-12 px-4 sm:px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <span className="text-accent-dark font-clash font-bold text-[10px] tracking-widest uppercase">
              {activeFilter ? `Filter: ${activeFilter}` : "Fresh Stock"}
            </span>
            <h2 className="text-3xl md:text-5xl font-clash font-black text-primary uppercase leading-none">
              The <span className="text-accent-dark">Drops</span>
            </h2>
          </div>
          <p className="font-editor italic text-primary/60 text-sm max-w-xs text-right hidden md:block">
            Scroll for legendary artifacts.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-editor italic">Unrolling the scrolls...</div>
        ) : (
          /* 👇 UPDATED GRID: 2 cols on mobile, 4 on desktop (Compact & Dense) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400 font-clash">
                No artifacts found.
              </div>
            )}
          </div>
        )}
      </section>
      <VibrantDrop />
    </>
  );
}