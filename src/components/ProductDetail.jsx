import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart, ArrowLeft, Heart, ShieldCheck, Truck,
  ChevronLeft, ChevronRight, Plus, Minus, Star, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI State
  const [currentImage, setCurrentImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Selection State
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isHandmade, setIsHandmade] = useState(false);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = res.data.data.product;
        setProduct(productData);

        // Auto-select first available size
        if (productData.product_variants?.length > 0) {
          const available = productData.product_variants.find(v => v.stock_quantity > 0) || productData.product_variants[0];
          setSelectedVariant(available);
        }
      } catch (err) {
        console.error("Artifact lost", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrder = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const baseItemPrice = selectedVariant?.price || product.price;
    const actualPrice = isHandmade ? Math.round(baseItemPrice * 1.5) : baseItemPrice;

    const cartItem = {
      productId: product.id,
      variantId: selectedVariant?.id,
      title: product.title,
      image: product.images[0],
      size: selectedVariant?.size,
      qty: quantity,
      price: actualPrice,
      isHandmade: isHandmade
    };

    const token = localStorage.getItem("token");

    // For authenticated users, always use the server cart as the source of truth.
    // Using localStorage here causes stale data from old sessions to corrupt the sync.
    let existingCart;
    if (token) {
      try {
        const res = await axios.get("http://localhost:5000/api/user/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        existingCart = (res.data.success && Array.isArray(res.data.cart)) ? res.data.cart : [];
      } catch {
        existingCart = [];
      }
    } else {
      existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    }

    const existingIndex = existingCart.findIndex(
      i => i.productId === cartItem.productId &&
           i.variantId === cartItem.variantId &&
           i.isHandmade === cartItem.isHandmade
    );

    const updatedCart = existingIndex > -1
      ? existingCart.map((item, i) =>
          i === existingIndex ? { ...item, qty: item.qty + cartItem.qty } : item
        )
      : [...existingCart, cartItem];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (token) {
      await axios.post("http://localhost:5000/api/user/cart/sync", {
        localCart: updatedCart
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Sync failed", err));
    }

    navigate("/cart");
  };

  const toggleWishlist = async () => {
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
      alert("Wishlist updated!");
    } catch (err) {
      console.error("Wishlist error", err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-editor italic">Summoning...</div>;
  if (!product) return <div className="text-center py-20 uppercase font-clash font-black">Artifact not found</div>;

  // Pricing & Stock Logic
  const basePrice = selectedVariant?.price || product.price;
  const finalPrice = isHandmade ? Math.round(basePrice * 1.5) : basePrice;
  const currentStock = selectedVariant?.stock_quantity || 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#FAFAFA] pt-24 lg:pt-32 pb-12 px-4 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb Back Button */}
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-primary/40 hover:text-primary mb-8 transition-colors uppercase font-clash font-bold text-[10px] tracking-widest">
          <div className="p-1.5 rounded-full border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowLeft size={12} />
          </div>
          Back to Clan
        </button>

        {/* MAIN SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">

          {/* LEFT: AESTHETIC IMAGE CONTAINER (Col 6 - Balanced) */}
          <div className="lg:col-span-6 space-y-6">

            {/* The Frame */}
            <div className="relative aspect-[3/4] lg:h-[600px] w-full rounded-[2.5rem] bg-white border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden group">

              {/* Floating Image (Padding added for aesthetic) */}
              <div className="absolute inset-0 p-8 lg:p-12 flex items-center justify-center bg-gray-50/50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={product.images[currentImage]}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </AnimatePresence>
              </div>

              {/* Minimal Nav Arrows (Hidden by default, show on hover) */}
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button onClick={() => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)} className="pointer-events-auto p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-primary">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentImage((prev) => (prev + 1) % product.images.length)} className="pointer-events-auto p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-primary">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Floating Action (Share) */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Minimal Thumbnail Strip */}
            <div className="flex gap-4 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden transition-all duration-300 ${currentImage === i ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS PANEL (Col 6 - Balanced) */}
          <div className="lg:col-span-6 space-y-8 lg:pl-10">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                {product.collection && (
                  <span className="bg-primary/5 text-primary border border-primary/10 text-[10px] font-clash font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {product.collection}
                  </span>
                )}
                {product.is_limited_edition && (
                  <span className="flex items-center gap-1 text-accent-dark text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <Star size={10} fill="currentColor" /> Limited Drop
                  </span>
                )}
              </div>

              <h1 className="text-5xl lg:text-7xl font-clash font-black text-primary leading-[0.9] uppercase tracking-tighter">
                {product.title}
              </h1>

              <p className="font-editor text-lg text-primary/60 italic max-w-md leading-relaxed">
                "{product.description}"
              </p>
            </header>

            <div className="h-px w-full bg-primary/5"></div>

            {/* Configurator Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* SIZE SELECTOR */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants?.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock_quantity === 0}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-clash font-bold text-sm transition-all border-2 ${selectedVariant?.id === variant.id
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : variant.stock_quantity === 0
                          ? 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed decoration-slice'
                          : 'bg-white text-primary border-primary/5 hover:border-primary/30'
                        }`}
                    >
                      <span className={variant.stock_quantity === 0 ? "line-through" : ""}>{variant.size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Quantity</span>
                <div className="flex items-center w-fit bg-white border-2 border-primary/5 rounded-xl h-12 px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={currentStock === 0} className="w-8 h-full flex items-center justify-center hover:text-accent disabled:opacity-30"><Minus size={16} /></button>
                  <span className="w-8 text-center font-clash font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} disabled={currentStock === 0} className="w-8 h-full flex items-center justify-center hover:text-accent disabled:opacity-30"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            {/* EDITION SELECTOR */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Choose Edition</span>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsHandmade(false)}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${!isHandmade ? 'border-primary bg-primary/5' : 'border-primary/5 bg-white opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-clash font-bold text-xs uppercase">Ready-Made</span>
                    {basePrice && <span className="font-clash font-black text-sm">₹{basePrice}</span>}
                  </div>
                  <p className="text-[9px] font-bold text-primary/40 uppercase">Standard Finish</p>
                </button>

                <button
                  onClick={() => setIsHandmade(true)}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${isHandmade ? 'border-primary bg-primary/5' : 'border-primary/5 bg-white opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-clash font-bold text-xs uppercase text-accent-dark">Artisanal</span>
                    {basePrice && <span className="font-clash font-black text-sm">₹{Math.round(basePrice * 1.5)}</span>}
                  </div>
                  <p className="text-[9px] font-bold text-primary/40 uppercase">Lucknowi Handwork</p>
                </button>
              </div>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="pt-6 flex gap-4">
              <button
                onClick={handleOrder}
                disabled={currentStock === 0 || isAdding}
                className={`flex-1 h-16 rounded-full font-clash font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-2xl transition-all ${currentStock > 0 && !isAdding
                  ? 'bg-primary text-white hover:scale-[1.02] hover:shadow-primary/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <ShoppingCart size={18} className={currentStock > 0 && !isAdding ? "animate-bounce-slow" : ""} />
                {isAdding ? 'Adding...' : currentStock > 0 ? 'Secure Artifact' : 'Sold Out'}
              </button>

              <button
                onClick={toggleWishlist}
                className="h-16 w-16 flex items-center justify-center border-2 border-primary/10 rounded-full hover:bg-primary hover:text-white transition-all group"
              >
                <Heart size={24} className="group-hover:fill-current" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-primary/40 font-bold text-[9px] uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> Authenticated
              </div>
              <div className="w-1 h-1 rounded-full bg-primary/20"></div>
              <div className="flex items-center gap-2 text-primary/40 font-bold text-[9px] uppercase tracking-widest">
                <Truck size={14} className="text-blue-500" /> Free Shipping
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}