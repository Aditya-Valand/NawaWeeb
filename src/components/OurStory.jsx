import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Globe, Shield, Zap } from "lucide-react";

export default function OurStory() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <section className="bg-primary py-24 px-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-[-10%] w-96 h-96 bg-accent/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 left-[-10%] w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto space-y-32">
        
        {/* 01. THE ORIGIN */}
        <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-accent font-clash font-black text-xl italic">01/</span>
              <div className="h-[1px] w-12 bg-accent/30" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-clash font-black text-white uppercase italic tracking-tighter leading-none mb-8">
              THE <span className="text-accent">SYNDICATE</span> BORN IN LUCKNOW.
            </h2>
            <p className="font-editor text-emerald-100/60 text-lg leading-relaxed italic">
              Nawaweeb didn't start in a boardroom. It started in the narrow, historic lanes of 
              <span className="text-white"> Lucknow</span>, where the echoes of Nawabi royalty meet the 
              meticulous rhythm of <span className="text-accent">Chikankari</span> needles. 
              We saw a heritage fading, and we decided to reforge it for the street.
            </p>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1590766944538-449e29548451?q=80&w=2070&auto=format&fit=crop" 
              alt="Lucknow Heritage" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </motion.div>

        {/* 02. THE FUSION */}
        <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10">
             <img 
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop" 
              alt="Tokyo Neon" 
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
               <Zap size={80} className="text-accent opacity-20 absolute" />
               <p className="text-white font-clash font-black text-3xl uppercase tracking-tighter italic">
                 "Ancient Thread <br /> Meets <br /> Cyberpunk Soul"
               </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-accent font-clash font-black text-xl italic">02/</span>
              <div className="h-[1px] w-12 bg-accent/30" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-clash font-black text-white uppercase italic tracking-tighter leading-none mb-8">
              TOKYO <span className="text-accent">PULSE</span>.
            </h2>
            <p className="font-editor text-emerald-100/60 text-lg leading-relaxed italic">
              We took the soul of Awadh and threw it into the neon-lit chaos of 
              <span className="text-white"> Tokyo</span>. Our designs are a glitch in the system—where 
              classical embroidery meets the silhouette of modern oversized streetwear. 
              We don't make clothes; we manifest <span className="text-accent">Artifacts</span>.
            </p>
          </div>
        </motion.div>

        {/* 03. THE MISSION (Features) */}
        <motion.div {...fadeUp} className="bg-white/5 rounded-[4rem] p-12 lg:p-20 border border-white/5 backdrop-blur-sm">
           <div className="text-center mb-16">
             <h3 className="text-4xl font-clash font-black text-accent uppercase tracking-tighter italic">The Artisan Code</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <Globe className="mx-auto text-accent" size={32} />
                <h4 className="text-white font-clash font-bold uppercase tracking-widest text-sm">Global Heritage</h4>
                <p className="text-emerald-100/40 text-xs font-editor italic">Bridging continents through the art of the needle.</p>
              </div>
              <div className="text-center space-y-4">
                <Sparkles className="mx-auto text-accent" size={32} />
                <h4 className="text-white font-clash font-bold uppercase tracking-widest text-sm">30+ Hours Craft</h4>
                <p className="text-emerald-100/40 text-xs font-editor italic">Every piece is hand-stitched by local artisans in Lucknow.</p>
              </div>
              <div className="text-center space-y-4">
                <Shield className="mx-auto text-accent" size={32} />
                <h4 className="text-white font-clash font-bold uppercase tracking-widest text-sm">Clan Exclusive</h4>
                <p className="text-emerald-100/40 text-xs font-editor italic">Limited drops. No restocks. Wear a legend or miss it.</p>
              </div>
           </div>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div {...fadeUp} className="text-center pb-12">
           <h2 className="text-3xl font-clash font-black text-white/20 uppercase tracking-[0.5em] mb-8">
             THREADED SPIRIT • 伝統と未来
           </h2>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
             className="px-12 py-5 bg-accent text-primary rounded-full font-clash font-black text-xl uppercase italic hover:scale-110 transition-transform shadow-2xl"
           >
             Explore the Gear
           </button>
        </motion.div>

      </div>
    </section>
  );
}