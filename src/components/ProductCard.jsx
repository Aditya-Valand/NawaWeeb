import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Heart } from "lucide-react";
import api from "../api/axios";

// Append Cloudinary auto-optimization params if the URL is from Cloudinary
function optimizeImage(url) {
  if (!url) return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_600/");
  }
  return url;
}

// Read cached wishlist IDs from localStorage (written by Wishlist page)
function isInWishlistCache(productId) {
  try {
    const ids = JSON.parse(localStorage.getItem("wishlist_ids") || "[]");
    return ids.includes(productId);
  } catch {
    return false;
  }
}

function updateWishlistCache(productId, add) {
  try {
    const ids = JSON.parse(localStorage.getItem("wishlist_ids") || "[]");
    const next = add
      ? [...new Set([...ids, productId])]
      : ids.filter((id) => id !== productId);
    localStorage.setItem("wishlist_ids", JSON.stringify(next));
  } catch { /* storage quota — non-critical */ }
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [wishlisted, setWishlisted] = useState(() => isInWishlistCache(product.id));
  const [toggling, setToggling]     = useState(false);
  const [toast, setToast]           = useState(null); // { msg, type }

  // Stay in sync if Wishlist page updates the cache from another component
  useEffect(() => {
    const onStorage = () => setWishlisted(isInWishlistCache(product.id));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [product.id]);

  if (!product.is_active) return null;

  const totalStock = product.product_variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;
  const isSoldOut = totalStock === 0;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (toggling) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    // Optimistic update
    const wasWishlisted = wishlisted;
    setToggling(true);
    setWishlisted(!wasWishlisted);
    updateWishlistCache(product.id, !wasWishlisted);

    try {
      await api.post("/user/togglewish", { productId: product.id });
      showToast(wasWishlisted ? "Removed from wishlist" : "Added to wishlist", wasWishlisted ? "remove" : "success");
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      // Revert on error
      setWishlisted(wasWishlisted);
      updateWishlistCache(product.id, wasWishlisted);
      showToast("Could not update wishlist", "error");
    } finally {
      setToggling(false);
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
          src={optimizeImage(product.images?.[0])}
          alt={product.title}
          loading="lazy"
          onError={e => { e.currentTarget.style.display = "none"; }}
          className={`w-full h-full object-cover ${isSoldOut ? "grayscale opacity-70" : ""}`}
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
          <button
            onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="w-full py-2.5 bg-white/90 backdrop-blur text-primary rounded-xl font-clash font-bold text-xs uppercase shadow-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
          >
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

        {/* Inline toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`absolute bottom-14 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full text-[10px] font-clash font-bold uppercase whitespace-nowrap shadow-lg pointer-events-none ${
                toast.type === "error"
                  ? "bg-red-500 text-white"
                  : toast.type === "remove"
                  ? "bg-gray-700 text-white"
                  : "bg-primary text-accent"
              }`}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. MINIMAL DETAILS (Below Image) */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-clash font-bold text-primary leading-tight line-clamp-2 group-hover:text-primary/70 transition-colors">
            {product.title}
          </h3>
          <span className="text-sm font-clash font-black text-primary whitespace-nowrap">
            ₹{product.price?.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">
            {product.collection || "Clan Drop"}
          </p>
          {/* Heart — filled when wishlisted, always visible when wishlisted */}
          <button
            onClick={toggleWishlist}
            disabled={toggling}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`transition-all duration-200 disabled:cursor-not-allowed ${
              wishlisted
                ? "text-red-500 opacity-100"
                : "text-primary/20 hover:text-red-500 opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              size={14}
              fill={wishlisted ? "currentColor" : "none"}
              className={toggling ? "animate-pulse" : ""}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
