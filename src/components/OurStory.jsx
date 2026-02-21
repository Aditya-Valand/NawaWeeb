import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/Rumi-darwaza.jpg";
import { Sparkles, Globe, Shield, Zap } from "lucide-react";

export default function OurStory() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const glowPulse = {
    initial: { opacity: 0.5 },
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 3.5, repeat: Infinity }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay: 0.2 }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-gray-900 to-gray-950 py-24 px-6 overflow-hidden relative min-h-screen">
      {/* Minimal Clean Background Elements */}
      <div className="absolute top-20 right-[-10%] w-96 h-96 bg-white/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 left-[-10%] w-96 h-96 bg-slate-400/5 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gray-400/3 blur-[100px] rounded-full" />

      <div className="max-w-5xl mx-auto space-y-32">
        
        {/* 01. THE ORIGIN */}
        <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-slate-300 font-clash font-black text-xl italic">01/</span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-slate-400 to-gray-300" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-clash font-black text-white uppercase italic  leading-none mb-8">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-gray-200 to-white">SYNDICATE</span> BORN IN LUCKNOW.
            </h2>
            <p className="font-editor text-gray-300 text-lg leading-relaxed italic">
              Nawaweeb didn't start in a boardroom. It started in the narrow, historic lanes of 
              <span className="text-white"> Lucknow</span>, where the echoes of Nawabi royalty meet the 
              meticulous rhythm of <span className="text-slate-200">Chikankari</span> needles. 
              We saw a heritage fading, and we decided to reforge it for the street.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(255, 255, 255, 0.15)" }}
            className="relative aspect-square rounded-[3rem] overflow-hidden border border-slate-500/50 shadow-2xl"
          >
            <img 
              src={img1}
              alt="Lucknow Heritage" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-800/20" />
          </motion.div>
        </motion.div>

        {/* 02. THE FUSION */}
        <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            {...slideInRight}
            className="order-2 lg:order-1 relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-gray-400/50 shadow-2xl"
          >
             <img 
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop" 
              alt="Tokyo Neon" 
              className="w-full h-full object-cover brightness-60"
            />
            <div className="absolute inset-0 flex items-center justify-center p-10 text-center bg-gradient-to-t from-slate-950 to-transparent">
               <motion.div
                 {...glowPulse}
                 className="absolute"
               >
                 <Zap size={80} className="text-white opacity-20" />
               </motion.div>
               <p className="text-white font-clash font-black text-3xl uppercase tracking-tighter italic relative z-10 leading-tight">
                 "Ancient Thread <br /> Meets <br /> Clean Edge"
               </p>
            </div>
          </motion.div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-300 font-clash font-black text-xl italic">02/</span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-gray-400 to-slate-300" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-clash font-black text-white uppercase italic  leading-none mb-8">
              TOKYO <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">MINIMALISM</span>.
            </h2>
            <p className="font-editor text-gray-300 text-lg leading-relaxed italic">
              We took the soul of Awadh and wrapped it in modern simplicity. Our designs are 
              <span className="text-slate-200"> timeless</span>—where classical embroidery speaks through 
              clean lines and minimalist oversized silhouettes. We don't make clothes; we craft 
              <span className="text-gray-100"> Masterpieces</span>.
            </p>
          </div>
        </motion.div>

        {/* 03. THE MISSION (Features) */}
        <motion.div 
          {...fadeUp}
          whileHover={{ boxShadow: "0 0 40px rgba(255, 255, 255, 0.1)" }}
          className="bg-gradient-to-br from-slate-800/30 via-gray-900/50 to-slate-900/40 rounded-[4rem] p-12 lg:p-20 border border-slate-500/30 backdrop-blur-sm shadow-2xl relative overflow-hidden"
        >
          <motion.div 
            animate={{ 
              borderColor: ["rgba(148, 163, 184, 0.4)", "rgba(209, 213, 219, 0.4)", "rgba(100, 116, 139, 0.4)"]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 rounded-[4rem] border border-slate-500/30 pointer-events-none"
          />
           <div className="text-center mb-16 relative z-10">
             <motion.h3 
               animate={{ 
                 backgroundPosition: ["0% center", "100% center", "0% center"]
               }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-4xl font-clash font-black uppercase tracking-tighter italic bg-gradient-to-r from-slate-300 via-gray-100 to-white text-transparent bg-clip-text"
             >
               The Artisan Code
             </motion.h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <motion.div 
                whileHover={{ scale: 1.06, y: -8 }}
                className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-slate-700/15 to-gray-700/15 border border-slate-500/30 hover:border-slate-400/60 transition"
              >
                <Globe className="mx-auto text-slate-300" size={32} />
                <h4 className="text-white font-clash font-bold uppercase tracking-widest text-sm">Global Heritage</h4>
                <p className="text-gray-300 text-xs font-editor italic">Bridging continents through the art of the needle.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.06, y: -8 }}
                className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-gray-700/15 to-slate-700/15 border border-gray-500/30 hover:border-gray-400/60 transition"
              >
                <Sparkles className="mx-auto text-gray-300" size={32} />
                <h4 className="text-white font-clash font-bold uppercase tracking-widest text-sm">30+ Hours Craft</h4>
                <p className="text-gray-300 text-xs font-editor italic">Every piece is hand-stitched by local artisans in Lucknow.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.06, y: -8 }}
                className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-slate-600/15 to-gray-600/15 border border-slate-400/30 hover:border-slate-300/60 transition"
              >
                <Shield className="mx-auto text-slate-200" size={32} />
                <h4 className="text-white font-clash font-bold uppercase tracking-widest text-sm">Clan Exclusive</h4>
                <p className="text-gray-300 text-xs font-editor italic">Limited drops. No restocks. Wear a legend or miss it.</p>
              </motion.div>
           </div>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div {...fadeUp} className="text-center pb-12">
           <h2 className="text-3xl font-clash font-black text-white/40 uppercase tracking-[0.5em] mb-8">
             THREADED SPIRIT • 伝統と未来
           </h2>
           <motion.button 
             whileHover={{ scale: 1.12, boxShadow: "0 0 40px rgba(255, 255, 255, 0.3)" }}
             whileTap={{ scale: 0.95 }}
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
             className="px-12 py-5 bg-gradient-to-r from-slate-200 via-gray-100 to-white text-slate-900 rounded-full font-clash font-black text-xl uppercase italic shadow-2xl hover:shadow-slate-300/50 transition-all"
           >
             Explore the Gear
           </motion.button>
        </motion.div>

      </div>
    </section>
  );
}