import React from "react";
import { motion } from "framer-motion";
import { Zap, Star, ArrowUpRight } from "lucide-react";

export default function VibrantDrop() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#F0FDF4]"> 
      {/* VIBRANT LIGHT GRADIENT BLOBS */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-200/40 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-accent/30 blur-[100px] rounded-full -z-10" />

      <div className="container max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* IMAGE BLOCK WITH GLOW */}
          <div className="relative w-full lg:w-1/2">
            <motion.div 
              whileHover={{ y: -10 }}
              className="relative aspect-square rounded-[3rem] bg-white p-4 shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-50 to-transparent" />
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80" 
                alt="Feature Drop" 
                className="w-full h-full object-cover rounded-[2.5rem]"
              />
              
              {/* STICKER BADGE - NEON MINT */}
              <div className="absolute top-8 right-8 bg-[#22D3EE] text-black font-clash font-black text-xs px-4 py-2 rounded-full shadow-lg -rotate-12">
                FASTEST SELLER ⚡
              </div>
            </motion.div>
          </div>

          {/* CONTENT BLOCK */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
              <Zap size={14} className="text-emerald-600 fill-emerald-600" />
              <span className="text-[10px] font-clash font-bold text-emerald-700 tracking-widest uppercase">
                Limited Artisanal Release
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl font-clash font-black text-primary leading-none uppercase tracking-tighter">
              AURA <br />
              <span className="text-transparent stroke-primary stroke-1">STITCHED</span>
            </h2>

            <p className="text-xl font-editor italic text-primary/70">
              "When the Hidden Leaf meets the threads of Awadh."
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-emerald-100 rounded-3xl">
                <p className="text-3xl font-clash font-black text-primary">40k+</p>
                <p className="text-[10px] font-clash font-bold text-primary/40 uppercase tracking-widest">Hand Stitches</p>
              </div>
              <div className="p-6 bg-white border border-emerald-100 rounded-3xl">
                <p className="text-3xl font-clash font-black text-primary">001</p>
                <p className="text-[10px] font-clash font-bold text-primary/40 uppercase tracking-widest">Edition Type</p>
              </div>
            </div>

            <motion.button 
              whileHover={{ x: 10 }}
              className="group flex items-center gap-4 text-2xl font-clash font-black text-primary uppercase"
            >
              Get Yours via Email 
              <span className="w-12 h-12 bg-primary text-accent rounded-full flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
                <ArrowUpRight size={24} />
              </span>
            </motion.button>
          </div>

        </div>
      </div>
    </section>
  );
}