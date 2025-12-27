import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Zap, Heart, Info } from "lucide-react";

export default function ProductCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <motion.div
        layout
        onClick={() => setIsExpanded(true)}
        className="group relative bg-white rounded-4xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-primary/5"
      >
        {/* VIBRANT GEN-Z BADGE (Bewakoof Style) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className="bg-[#FFD700] text-black text-[10px] font-clash font-black px-3 py-1 rounded-full shadow-lg -rotate-2 group-hover:rotate-0 transition-transform">
            {product.animeTag}
          </span>
          {product.isLimited && (
            <span className="bg-primary text-accent text-[10px] font-clash font-bold px-3 py-1 rounded-full shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              LIMITED DROP
            </span>
          )}
        </div>

        {/* IMAGE CONTAINER */}
        <div className="aspect-3/4 overflow-hidden bg-gray-100 relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Wishlist Button */}
          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-primary hover:bg-white transition-colors">
            <Heart size={18} />
          </button>
        </div>

        {/* CONTENT BARKER */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-clash font-black text-primary leading-tight group-hover:text-primary-light transition-colors">
              {product.name}
            </h3>
            <span className="text-xl font-clash font-black text-primary">
              ₹{product.priceReady}
            </span>
          </div>
          <p className="text-xs font-editor text-primary/60 mb-4 line-clamp-1 italic">
            {product.description}
          </p>
          
          <button className="w-full py-3 bg-primary/5 group-hover:bg-primary group-hover:text-accent border border-primary/10 rounded-xl font-clash font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Zap size={16} /> Quick View
          </button>
        </div>
      </motion.div>

      {/* EXPANDED PRODUCT DETAILS OVERLAY */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-xl"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              layoutId={product.id}
              className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/50 hover:bg-white rounded-full transition-colors"
              >
                <X size={24} className="text-primary" />
              </button>

              {/* Left Side: Product Image */}
              <div className="h-full min-h-100 bg-gray-100">
                <img src={product.image} className="w-full h-full object-cover" alt="" />
              </div>

              {/* Right Side: Details & Pricing Logic */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-accent-dark font-clash font-bold text-xs tracking-widest uppercase mb-2">
                  {product.series} Collection
                </span>
                <h2 className="text-4xl md:text-5xl font-clash font-black text-primary mb-4 leading-none uppercase">
                  {product.name}
                </h2>
                <p className="font-editor text-lg text-primary/70 mb-8 italic">
                  {product.fullDescription}
                </p>

                {/* PRICING SELECTION (Handmade vs Ready) */}
                <div className="space-y-4 mb-8">
                  <div className="p-4 border-2 border-primary/10 rounded-2xl hover:border-primary transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-clash font-bold text-primary">Artisanal Handmade</p>
                        <p className="text-[10px] text-primary/40 uppercase">Hand-stitched (30+ hours)</p>
                      </div>
                      <p className="text-2xl font-clash font-black text-primary group-hover:text-primary-light transition-colors">₹{product.priceHandmade}</p>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-primary/10 rounded-2xl hover:border-primary transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-clash font-bold text-primary">Ready-made Gear</p>
                        <p className="text-[10px] text-primary/40 uppercase">Machine Finished</p>
                      </div>
                      <p className="text-2xl font-clash font-black text-primary">₹{product.priceReady}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-5 bg-primary text-accent rounded-full font-clash font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all">
                  <ShoppingCart size={20} /> Order via Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}