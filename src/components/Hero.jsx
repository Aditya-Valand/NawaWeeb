import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Hexagon } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 lg:pt-32 overflow-hidden bg-bg-light">
      {/* Vertical Decorative Text - Hidden on small mobile, visible from MD up */}
      <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 hidden md:block">
        <span className="[writing-mode:vertical-lr] text-[8px] md:text-[10px] font-clash font-bold tracking-[1em] text-primary/10 uppercase">
          ナワウィーブ • 伝統とアニメ
        </span>
      </div>

      <div className="container max-w-screen-2xl mx-auto px-5 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* TOP CONTENT (Mobile) / LEFT CONTENT (Desktop) */}
        <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 md:mb-6">
              <span className="h-px w-6 md:w-8 bg-accent" />
              <span className="text-[9px] md:text-[10px] font-clash font-bold tracking-[0.3em] text-accent-dark uppercase">
                Drop 001 / Winter 2025
              </span>
            </div>

            <h1 className="relative mb-6 md:mb-8">
              <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-clash font-black text-primary leading-[0.85] tracking-tighter uppercase">
                THREADED
              </span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editor italic text-accent-dark -mt-2 md:-mt-4 lg:ml-24"
              >
                Spirit
              </motion.span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl font-editor text-primary/70 max-w-md mx-auto lg:mx-0 leading-relaxed mb-8 md:mb-10">
              Blending the royal heritage of <span className="text-primary font-bold">Lucknow</span> with the electric soul of <span className="text-primary font-bold">Tokyo</span>. 
              Every piece is a handcrafted legend.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-accent font-clash font-bold rounded-full shadow-2xl flex items-center justify-center gap-3 group"
              >
                Explore Gear
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <div className="flex items-center gap-4 px-6 border-t sm:border-t-0 sm:border-l border-primary/10 pt-4 sm:pt-0">
                <div className="text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start text-accent-dark">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <p className="text-[9px] font-clash font-bold text-primary/40 uppercase mt-1">
                    30+ Hours Per Piece
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM CONTENT (Mobile) / RIGHT CONTENT (Desktop) */}
        <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-[320px] sm:max-w-100 lg:max-w-112.5 aspect-4/5"
            style={{ perspective: "1000px" }}
          >
            {/* The Artifact Card */}
            <motion.div 
              whileHover={{ rotateY: -10, rotateX: 5 }}
              className="w-full h-full bg-white rounded-4xl md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(45,73,64,0.2)] border border-primary/5 overflow-hidden relative"
            >
              {/* Product Badge */}
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white flex items-center gap-2 shadow-sm">
                  <Hexagon size={14} className="text-accent-dark fill-accent-dark" />
                  <span className="text-[8px] md:text-[10px] font-clash font-bold text-primary uppercase tracking-widest">Clan Exclusive</span>
                </div>
              </div>

              {/* Card Image Placeholder */}
              <div className="w-full h-full bg-linear-to-b from-primary/5 to-white flex items-center justify-center">
                 <div className="text-center opacity-20">
                    <span className="block text-4xl md:text-6xl font-clash font-black">01</span>
                    <span className="text-[10px] font-clash font-bold tracking-[0.5em] uppercase">Limited</span>
                 </div>
              </div>

              {/* Price/Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white/80 backdrop-blur-lg border-t border-primary/5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-clash font-bold text-primary/40 uppercase mb-1">Kimono Series</p>
                    <h3 className="text-xl md:text-2xl font-clash font-black text-primary">Cursed energy</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl md:text-2xl font-clash font-black text-primary">₹2,499</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background elements (hidden on small mobile for performance) */}
            <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 border border-accent/20 rounded-full animate-pulse hidden sm:block" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}