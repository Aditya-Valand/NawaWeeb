// import React from "react";
// import { motion } from "framer-motion";
// import { ArrowRight, Star, Hexagon } from "lucide-react";

// export default function Hero() {
//   return (
//     <section className="relative min-h-screen flex items-center pt-24 pb-12 lg:pt-32 overflow-hidden bg-bg-light">
//       {/* Vertical Decorative Text - Hidden on small mobile, visible from MD up */}
//       <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 hidden md:block">
//         <span className="[writing-mode:vertical-lr] text-[8px] md:text-[10px] font-clash font-bold tracking-[1em] text-primary/10 uppercase">
//           ナワウィーブ • 伝統とアニメ
//         </span>
//       </div>

//       <div className="container max-w-screen-2xl mx-auto px-5 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

//         {/* TOP CONTENT (Mobile) / LEFT CONTENT (Desktop) */}
//         <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 md:mb-6">
//               <span className="h-px w-6 md:w-8 bg-accent" />
//               <span className="text-[9px] md:text-[10px] font-clash font-bold tracking-[0.3em] text-accent-dark uppercase">
//                 Drop 001 / Winter 2025
//               </span>
//             </div>

//             <h1 className="relative mb-6 md:mb-8">
//               <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-clash font-black text-primary leading-[0.85] tracking-tighter uppercase">
//                 THREADED
//               </span>
//               <motion.span 
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4, duration: 0.8 }}
//                 className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editor italic text-accent-dark -mt-2 md:-mt-4 lg:ml-24"
//               >
//                 Spirit
//               </motion.span>
//             </h1>

//             <p className="text-base md:text-lg lg:text-xl font-editor text-primary/70 max-w-md mx-auto lg:mx-0 leading-relaxed mb-8 md:mb-10">
//               Blending the royal heritage of <span className="text-primary font-bold">Lucknow</span> with the electric soul of <span className="text-primary font-bold">Tokyo</span>. 
//               Every piece is a handcrafted legend.
//             </p>

//             <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
//               <motion.button 
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full sm:w-auto px-8 py-4 bg-primary text-accent font-clash font-bold rounded-full shadow-2xl flex items-center justify-center gap-3 group"
//               >
//                 Explore Gear
//                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//               </motion.button>

//               <div className="flex items-center gap-4 px-6 border-t sm:border-t-0 sm:border-l border-primary/10 pt-4 sm:pt-0">
//                 <div className="text-center sm:text-left">
//                   <div className="flex justify-center sm:justify-start text-accent-dark">
//                     {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
//                   </div>
//                   <p className="text-[9px] font-clash font-bold text-primary/40 uppercase mt-1">
//                     30+ Hours Per Piece
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* BOTTOM CONTENT (Mobile) / RIGHT CONTENT (Desktop) */}
//         <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1 }}
//             className="relative w-full max-w-[320px] sm:max-w-100 lg:max-w-112.5 aspect-4/5"
//             style={{ perspective: "1000px" }}
//           >
//             {/* The Artifact Card */}
//             <motion.div 
//               whileHover={{ rotateY: -10, rotateX: 5 }}
//               className="w-full h-full bg-white rounded-4xl md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(45,73,64,0.2)] border border-primary/5 overflow-hidden relative"
//             >
//               {/* Product Badge */}
//               <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
//                 <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white flex items-center gap-2 shadow-sm">
//                   <Hexagon size={14} className="text-accent-dark fill-accent-dark" />
//                   <span className="text-[8px] md:text-[10px] font-clash font-bold text-primary uppercase tracking-widest">Clan Exclusive</span>
//                 </div>
//               </div>

//               {/* Card Image Placeholder */}
//               <div className="w-full h-full bg-linear-to-b from-primary/5 to-white flex items-center justify-center">
//                  <div className="text-center opacity-20">
//                     <span className="block text-4xl md:text-6xl font-clash font-black">01</span>
//                     <span className="text-[10px] font-clash font-bold tracking-[0.5em] uppercase">Limited</span>
//                  </div>
//               </div>

//               {/* Price/Info Overlay */}
//               <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white/80 backdrop-blur-lg border-t border-primary/5">
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <p className="text-[9px] font-clash font-bold text-primary/40 uppercase mb-1">Kimono Series</p>
//                     <h3 className="text-xl md:text-2xl font-clash font-black text-primary">Cursed energy</h3>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xl md:text-2xl font-clash font-black text-primary">₹2,499</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Background elements (hidden on small mobile for performance) */}
//             <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 border border-accent/20 rounded-full animate-pulse hidden sm:block" />
//           </motion.div>
//         </div>

//       </div>
//     </section>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Hexagon, Zap, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Hero() {
  const navigate = useNavigate();
  const [heroProduct, setHeroProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the latest "Drop" from backend
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/hero");
        if (res.data.success && res.data.product) {
          setHeroProduct(res.data.product);
        }
      } catch (err) {
        console.error("Failed to load hero artifact", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 lg:pt-32 overflow-hidden bg-[#FAFAFA]">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 hidden md:block">
        <span className="[writing-mode:vertical-lr] text-[8px] md:text-[10px] font-clash font-bold tracking-[1em] text-primary/10 uppercase">
          ナワウィーブ • 伝統とアニメ
        </span>
      </div>

      <div className="container max-w-screen-2xl mx-auto px-5 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

        {/* LEFT CONTENT: Typography & Story */}
        <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tagline */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <span className="h-px w-8 bg-accent" />
              <span className="text-[10px] font-clash font-black tracking-[0.3em] text-accent-dark uppercase">
                {heroProduct ? "Latest Drop Live" : "Winter 2025 Collection"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="relative mb-8">
              <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-clash font-black text-primary leading-[0.85] tracking-tighter uppercase">
                THREADED
              </span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editor italic text-accent-dark -mt-2 md:-mt-4 lg:ml-24"
              >
                Spirit
              </motion.span>
            </h1>

            <p className="text-lg lg:text-xl font-editor text-primary/70 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10">
              Where the electric soul of <span className="text-primary font-bold">Tokyo</span> meets the royal threads of <span className="text-primary font-bold">Lucknow</span>.
              Wear the legend.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/shop")}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group font-clash font-bold tracking-wider uppercase text-sm"
              >
                View Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="flex items-center gap-4 px-6 border-l border-primary/10">
                <div className="text-left">
                  <div className="flex text-[#FFD700] mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                  <p className="text-[9px] font-clash font-bold text-primary/40 uppercase tracking-wider">
                    Handcrafted Quality
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT CONTENT: Dynamic Product Card */}
        <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 perspective-[1000px]">
          <motion.div
            initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[360px] lg:max-w-[420px] aspect-[4/5]"
          >
            {loading ? (
              // Loading Skeleton
              <div className="w-full h-full bg-gray-200 rounded-[2.5rem] animate-pulse" />
            ) : heroProduct ? (
              // REAL PRODUCT CARD
              <motion.div
                whileHover={{ y: -10, rotateX: 5 }}
                onClick={() => navigate(`/product/${heroProduct.id}`)}
                className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-primary/5 overflow-hidden relative cursor-pointer group"
              >
                {/* Image */}
                <img
                  src={heroProduct.images?.[0]}
                  alt={heroProduct.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Badge (Top Left) */}
                <div className="absolute top-8 left-8 z-20">
                  <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white flex items-center gap-2 shadow-sm">
                    <Hexagon size={14} className="text-accent-dark fill-accent-dark animate-spin-slow" />
                    <span className="text-[10px] font-clash font-black text-primary uppercase tracking-widest">
                      {heroProduct.is_limited_edition ? "Limited Drop" : "Featured"}
                    </span>
                  </div>
                </div>

                {/* Live Stock Indicator (Top Right) */}
                {heroProduct.stock < 10 && (
                  <div className="absolute top-8 right-8 z-20">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                )}

                {/* Glassmorphism Details Panel (Bottom) */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg group-hover:bg-white/90 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] font-clash font-bold text-primary/50 uppercase tracking-widest mb-1">
                          {heroProduct.collection || "New Arrival"}
                        </p>
                        <h3 className="text-xl font-clash font-black text-primary leading-none uppercase">
                          {heroProduct.title}
                        </h3>
                      </div>
                      <div className="bg-primary text-white px-3 py-1 rounded-lg">
                        <span className="text-sm font-clash font-bold">₹{heroProduct.price}</span>
                      </div>
                    </div>

                    {/* Hover Call To Action */}
                    <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-2 pt-2 text-primary text-xs font-bold uppercase tracking-wider">
                        <ShoppingBag size={14} /> Tap to Secure
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Fallback if no product found
              <div className="w-full h-full bg-gray-100 rounded-[2.5rem] flex items-center justify-center">
                <p className="font-clash text-primary/30 uppercase">No Drops Active</p>
              </div>
            )}

            {/* Background Blob */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}