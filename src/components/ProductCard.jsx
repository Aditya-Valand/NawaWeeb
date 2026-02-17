import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Heart } from "lucide-react";
import axios from "axios";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product.is_active) return null;

  const totalStock = product.product_variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;
  const isSoldOut = totalStock === 0;

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent navigating to product page
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      await axios.post("http://localhost:5000/api/user/togglewish",
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optional: Add toast notification or local state update if needed
      // For now, we rely on the user checking the wishlist
      alert("Wishlist updated!");
    } catch (err) {
      console.error("Wishlist error", err);
    }
  };

  return (
    <motion.div
      layout
      className="group relative cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* 1. IMAGE CONTAINER (Standard 3:4 Aspect Ratio) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 border border-primary/5">

        {/* Main Image */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          src={product.images?.[0]}
          alt={product.title}
          className={`w-full h-full object-cover ${isSoldOut ? 'grayscale opacity-70' : ''}`}
        />

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_limited_edition && (
            <span className="bg-primary text-accent text-[8px] font-clash font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
              Limited
            </span>
          )}
          {totalStock <= 5 && !isSoldOut && (
            <span className="bg-red-500 text-white text-[8px] font-clash font-bold px-2 py-0.5 rounded-md animate-pulse">
              Low Stock
            </span>
          )}
        </div>

        {/* HOVER ACTION: Quick View (Slides up) */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <button className="w-full py-2.5 bg-white/90 backdrop-blur text-primary rounded-xl font-clash font-bold text-xs uppercase shadow-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
            <Zap size={14} /> Quick View
          </button>
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="text-white font-clash font-black text-xl uppercase -rotate-12 border-2 border-white px-3 py-1">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. MINIMAL DETAILS (Below Image) */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-clash font-bold text-primary leading-tight line-clamp-2 group-hover:text-primary/70 transition-colors">
            {product.title}
          </h3>
          <span className="text-sm font-clash font-black text-primary whitespace-nowrap">
            ₹{product.price}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">
            {product.collection || "Clan Drop"}
          </p>
          {/* Subtle Heart that appears on hover */}
          <button
            onClick={toggleWishlist}
            className="text-primary/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}