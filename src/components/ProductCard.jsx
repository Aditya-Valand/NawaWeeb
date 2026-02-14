import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Zap, Heart, Info, AlertCircle } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  // const [isExpanded, setIsExpanded] = useState(false);
  // Track which version the user is looking at
  const [isHandmadeSelected, setIsHandmadeSelected] = useState(true);

  // 🛡️ Guard against hidden/inactive products
  if (!product.active) return null;

  return (
    <div className="relative">
      <motion.div
        layout
        onClick={() => navigate(`/product/${product._id}`)}
        className="group relative bg-white rounded-4xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-primary/5"
      >
        {/* VIBRANT BADGES */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className="bg-[#FFD700] text-black text-[10px] font-clash font-black px-3 py-1 rounded-full shadow-lg -rotate-2 group-hover:rotate-0 transition-transform">
            {product.animeTag}
          </span>
          {product.isLimited && (
            <span className="bg-primary text-accent text-[10px] font-clash font-bold px-3 py-1 rounded-full shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              LIMITED DROP
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-red-500 text-white text-[8px] font-clash font-bold px-2 py-0.5 rounded-full animate-pulse">
              ONLY {product.stock} LEFT
            </span>
          )}
        </div>

        {/* IMAGE CONTAINER */}
        <div className="aspect-3/4 overflow-hidden bg-gray-100 relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            /* Use the first image from the array defined in your schema */
            src={product.images?.[0]}
            alt={product.title}
            className={`w-full h-full object-cover ${product.stock === 0 ? 'grayscale opacity-50' : ''}`}
          />
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-clash font-black text-2xl uppercase tracking-tighter -rotate-12 border-4 border-white px-4 py-1">Sold Out</span>
            </div>
          )}

          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-primary hover:bg-white transition-colors">
            <Heart size={18} />
          </button>
        </div>

        {/* CONTENT BARKER */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-clash font-black text-primary leading-tight group-hover:text-primary-light transition-colors">
              {product.title}
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

      {/* EXPANDED OVERLAY */}
      
    </div>
  );
}