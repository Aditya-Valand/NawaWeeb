import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingBag, Ghost, RefreshCw, Loader2 } from "lucide-react";

function optimizeImage(url) {
  if (!url) return null;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_600/");
  }
  return url;
}

// Keep localStorage cache of wishlisted IDs in sync so ProductCard hearts update
function syncWishlistCache(items) {
  const ids = items.map(item => item.products?.id).filter(Boolean);
  try {
    localStorage.setItem("wishlist_ids", JSON.stringify(ids));
  } catch { /* storage quota — non-critical */ }
}

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [removingIds, setRemovingIds] = useState(new Set());

  const fetchWishlist = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      const res   = await api.get("/user/getwishlist");
      const items = res.data.wishlist || [];
      setWishlist(items);
      syncWishlistCache(items);
    } catch (err) {
      console.error("Wishlist fetch failed:", err);
      setError("Could not load your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeFromWishlist = async (productId) => {
    if (removingIds.has(productId)) return; // block double-click

    const snapshot    = [...wishlist];
    const prevCacheIds = JSON.parse(localStorage.getItem("wishlist_ids") || "[]");

    // Optimistic remove
    setRemovingIds(prev => new Set([...prev, productId]));
    const next = wishlist.filter(item => item.products?.id !== productId);
    setWishlist(next);
    syncWishlistCache(next);

    try {
      await api.post("/user/togglewish", { productId });
    } catch (err) {
      console.error("Wishlist remove failed:", err);
      // Full revert — UI and cache
      setWishlist(snapshot);
      try { localStorage.setItem("wishlist_ids", JSON.stringify(prevCacheIds)); } catch { /* ignore */ }
    } finally {
      setRemovingIds(prev => {
        const s = new Set(prev);
        s.delete(productId);
        return s;
      });
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="font-clash font-bold uppercase tracking-widest text-primary/40 text-sm">
          Syncing Soul...
        </p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Ghost size={80} strokeWidth={1} className="text-red-200" />
        <p className="font-clash font-bold text-lg uppercase text-gray-500">{error}</p>
        <button
          onClick={fetchWishlist}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-clash font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-black pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Saved Frequencies
            </span>
            <h1 className="text-5xl md:text-8xl font-clash font-black text-black leading-[0.85] uppercase tracking-tighter mt-2">
              Soul{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">
                Bound
              </span>
            </h1>
          </div>
          <p className="font-editor text-xl italic text-gray-400 mt-4 md:mt-0">
            {wishlist.length} {wishlist.length === 1 ? "Artifact" : "Artifacts"} Preserved
          </p>
        </div>

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Ghost size={100} strokeWidth={1} className="text-gray-200" />
            <h2 className="mt-8 font-clash font-black text-2xl uppercase text-gray-400">
              Your Spirit is Hollow
            </h2>
            <p className="font-editor italic text-gray-400 mt-2 mb-8 max-w-xs">
              No artifacts bonded yet. Go find your connections.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-10 py-4 bg-primary text-white rounded-full font-clash font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
            >
              Explore Artifacts
            </button>
          </motion.div>
        ) : (
          /* Grid — 2 cols on mobile (matches Shop), 4 on desktop */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-12">
            <AnimatePresence mode="popLayout">
              {wishlist.map((item) => {
                const product = item.products;

                // Guard: skip malformed rows from backend
                if (!product?.id) return null;

                const imgSrc    = optimizeImage(product.images?.[0]);
                const isRemoving = removingIds.has(product.id);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: isRemoving ? 0.5 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
                    className="group relative"
                  >
                    {/* Image card */}
                    <div
                      role="button"
                      tabIndex={isRemoving ? -1 : 0}
                      aria-label={`View ${product.title}`}
                      onClick={() => !isRemoving && navigate(`/product/${product.id}`)}
                      onKeyDown={e => e.key === "Enter" && !isRemoving && navigate(`/product/${product.id}`)}
                      className={`relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-black/5 shadow-sm group-hover:shadow-xl transition-all duration-300 ${isRemoving ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {/* Product image */}
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product.title}
                          loading="lazy"
                          onError={e => { e.currentTarget.style.display = "none"; }}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!product.is_active ? "grayscale" : ""}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <Heart size={40} className="text-gray-200" />
                        </div>
                      )}

                      {/* Discontinued overlay */}
                      {!product.is_active && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-clash font-black text-xs uppercase -rotate-12 border border-white px-2 py-1 rounded">
                            Discontinued
                          </span>
                        </div>
                      )}

                      {/* Hover CTA */}
                      {product.is_active && !isRemoving && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-clash font-bold text-xs uppercase shadow-lg hover:bg-accent transition-colors"
                            aria-label="View and buy"
                          >
                            <ShoppingBag size={14} /> View &amp; Buy
                          </button>
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={e => { e.stopPropagation(); removeFromWishlist(product.id); }}
                        disabled={isRemoving}
                        aria-label="Remove from wishlist"
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-black hover:bg-red-500 hover:text-white transition-colors z-20 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isRemoving
                          ? <Loader2 size={13} className="animate-spin" />
                          : <X size={13} />
                        }
                      </button>
                    </div>

                    {/* Info row */}
                    <div className="mt-3 flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-clash font-bold text-black uppercase leading-tight line-clamp-2">
                          {product.title}
                        </h3>
                        {!product.is_active && (
                          <span className="text-[9px] font-bold text-red-400 uppercase">
                            Inactive
                          </span>
                        )}
                      </div>
                      <span className="font-clash font-black text-sm whitespace-nowrap shrink-0">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
