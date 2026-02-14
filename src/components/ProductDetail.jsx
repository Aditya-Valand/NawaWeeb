import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ShoppingCart, ArrowLeft, Heart, ShieldCheck, Truck, 
  ChevronLeft, ChevronRight, Plus, Minus, Star 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isHandmade, setIsHandmade] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);

  // Inside ProductDetail.jsx
const handleOrder = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    const pendingData = {
      productId: id,
      size: selectedSize,
      qty: quantity,
      isHandmade: isHandmade
    };
    localStorage.setItem("pendingArtifact", JSON.stringify(pendingData));
    sessionStorage.setItem("redirectAfterAuth", window.location.pathname);
    // Save current location so we can come back
    // sessionStorage.setItem("redirectAfterAuth", window.location.pathname);
    navigate("/auth");
    return;
  }

  // If token exists, proceed to checkout/email logic
  console.log("Proceeding to secure artifact...");
};
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.data.product);
      } catch (err) { console.error("Artifact lost", err); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-editor italic">Summoning...</div>;
  if (!product) return <div className="text-center py-20 uppercase font-clash font-black">Artifact not found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg-light pt-24 lg:pt-32 pb-12 px-4 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary/40 hover:text-primary mb-6 lg:mb-10 transition-colors uppercase font-clash font-bold text-[10px] tracking-widest">
          <ArrowLeft size={14} /> Back to Clan
        </button>

        {/* MAIN SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT: COMPACT SLIDER (Column 7/12) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square lg:aspect-4/5 rounded-4xl lg:rounded-[3.5rem] overflow-hidden bg-white border border-primary/5 shadow-xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={product.images[currentImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)} className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg"><ChevronLeft size={20}/></button>
                <button onClick={() => setCurrentImage((prev) => (prev + 1) % product.images.length)} className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg"><ChevronRight size={20}/></button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${currentImage === i ? 'border-primary scale-105' : 'border-transparent opacity-40'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: COMPACT DETAILS (Column 5/12 - STICKY) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6 lg:space-y-8">
            <header>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-accent text-primary text-[9px] font-clash font-black px-3 py-0.5 rounded-full uppercase tracking-tighter">
                  {product.animeTag}
                </span>
                <span className="flex items-center gap-1 text-[#FFD700] text-[9px] font-black uppercase tracking-widest">
                  <Star size={10} fill="currentColor"/> 30+ Hrs
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-clash font-black text-primary leading-none uppercase italic tracking-tighter">
                {product.title}
              </h1>
              <p className="font-editor text-md lg:text-lg text-primary/60 mt-4 leading-relaxed italic line-clamp-3 lg:line-clamp-none">
                {product.fullDescription}
              </p>
            </header>

            {/* SIZE & QUANTITY - SIDE BY SIDE */}
            <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/30">Size</h4>
                <div className="flex gap-2">
                  {["S", "M", "L", "XL"].map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`w-10 h-10 rounded-lg font-clash font-black text-xs transition-all border ${selectedSize === size ? 'bg-primary text-accent border-primary' : 'bg-white text-primary border-primary/10'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/30">Qty</h4>
                <div className="flex items-center bg-white border border-primary/10 rounded-xl h-10 px-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14}/></button>
                  <span className="w-8 text-center font-clash font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={14}/></button>
                </div>
              </div>
            </div>

            {/* PRICING SELECTOR - CLEANER UI */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Artisanal Handmade", price: product.priceHandmade, type: true, sub: "Lucknowi Embroidery" },
                { label: "Ready-made Gear", price: product.priceReady, type: false, sub: "Standard Finish" }
              ].map((tier) => (
                <button key={tier.label} onClick={() => setIsHandmade(tier.type)} className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${isHandmade === tier.type ? 'border-primary bg-white shadow-md' : 'border-primary/5 opacity-40'}`}>
                  <div>
                    <h4 className="font-clash font-bold text-primary text-sm uppercase">{tier.label}</h4>
                    <p className="text-[8px] text-primary/40 uppercase font-bold">{tier.sub}</p>
                  </div>
                  <span className="text-xl font-clash font-black text-primary">₹{tier.price}</span>
                </button>
              ))}
            </div>

            {/* FIXED ACTION BAR */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 py-5 bg-primary text-accent rounded-full font-clash font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all">
                <ShoppingCart size={18} /> Order via Email
              </button>
              <button className="p-5 border border-primary/10 rounded-full hover:bg-primary hover:text-accent transition-all">
                <Heart size={20} />
              </button>
            </div>

            <div className="pt-6 border-t border-primary/5 flex justify-between">
               <div className="flex items-center gap-2 text-primary/30 font-bold text-[8px] uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-accent-dark" /> Authentic
               </div>
               <div className="flex items-center gap-2 text-primary/30 font-bold text-[8px] uppercase tracking-widest">
                 <Truck size={14} className="text-accent-dark" /> Nationwide
               </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}