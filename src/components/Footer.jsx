import React from "react";
import { motion } from "framer-motion";
import { Instagram, Send, Mail, Zap, Github, Twitter, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#F0FDF4] pt-24 pb-12 px-6 overflow-hidden border-t border-emerald-100">
      {/* ANIME AURA BACKGROUND ELEMENTS */}
      <div className="absolute -bottom-24 -right-24 w-125 h-125 bg-emerald-200/30 blur-[120px] rounded-full z-0" />
      <div className="absolute top-12 -left-12 w-64 h-64 bg-accent/20 blur-[80px] rounded-full z-0" />

      {/* GIANT HOLLOW LOGO WATERMARK (Gen-Z Streetwear Style) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <span className="text-[12vw] font-clash font-black text-transparent stroke-emerald-900/5 stroke-2 leading-none uppercase">
          NAWAWEEB
        </span>
      </div>

      <div className="container max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* COLUMN 1: BRAND LOGO & CULT VIBE */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-3xl font-clash font-black text-primary tracking-tighter italic">NAWAWEEB</span>
              <span className="text-[10px] font-clash font-bold tracking-[0.4em] text-accent-dark uppercase -mt-1">Anime × Chikankari</span>
            </div>
            <p className="font-editor text-primary/60 max-w-xs leading-relaxed">
              Threadwork of the Nawabs. <br />
              Soul of the Otaku. <br />
              <span className="text-emerald-500 font-bold">Lucknow ⇌ Tokyo</span>
            </p>
            <div className="flex gap-4">
              <motion.a whileHover={{ y: -5 }} href="#" className="w-10 h-10 bg-primary text-accent rounded-xl flex items-center justify-center shadow-lg"><Instagram size={20} /></motion.a>
              <motion.a whileHover={{ y: -5 }} href="#" className="w-10 h-10 bg-white border border-emerald-100 text-primary rounded-xl flex items-center justify-center shadow-sm"><Twitter size={20} /></motion.a>
              <motion.a whileHover={{ y: -5 }} href="#" className="w-10 h-10 bg-white border border-emerald-100 text-primary rounded-xl flex items-center justify-center shadow-sm"><Send size={20} /></motion.a>
            </div>
          </div>

          {/* COLUMN 2: THE CLAN LINKS */}
          <div className="space-y-6">
            <h4 className="text-xs font-clash font-black text-primary tracking-widest uppercase flex items-center gap-2">
              <Zap size={14} className="text-accent-dark fill-accent-dark" /> The Clan
            </h4>
            <ul className="space-y-4 font-clash font-bold text-sm text-primary/70">
              <li><a href="#" className="hover:text-emerald-500 transition-colors flex items-center gap-2">New Drops <span className="bg-emerald-100 text-[8px] px-2 py-0.5 rounded-full">HOT</span></a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Our Artisans</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Clan Rewards</a></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT */}
          <div className="space-y-6">
            <h4 className="text-xs font-clash font-black text-primary tracking-widest uppercase">Support</h4>
            <ul className="space-y-4 font-clash font-bold text-sm text-primary/70">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Track Gear</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Shipping Ops</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Email Order Help</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* COLUMN 4: CRAZY NEWSLETTER / GEN-Z MISSION */}
          <div className="space-y-6">
             <div className="p-6 bg-white rounded-4xl border border-emerald-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 bg-accent text-primary rounded-bl-2xl">
                   <Mail size={16} />
                </div>
                <h4 className="text-lg font-clash font-black text-primary leading-tight mb-4">JOIN THE <br /> SYNDICATE</h4>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="E-mail here..." 
                    className="w-full bg-bg-light border border-emerald-50 rounded-xl px-4 py-3 text-xs font-clash focus:outline-none focus:border-emerald-400"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-accent px-3 py-1.5 rounded-lg text-[10px] font-clash font-bold hover:scale-105 transition-transform">
                    ENTER
                  </button>
                </div>
                <p className="text-[9px] font-clash font-bold text-primary/30 mt-4 uppercase tracking-tighter italic">
                  *No spam. Only limited artifacts.
                </p>
             </div>
          </div>

        </div>

        {/* BOTTOM SECTION: CRAZY ANIME SIGN-OFF */}
        <div className="pt-12 border-t border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-clash font-bold text-primary/40 uppercase tracking-[0.3em]">
              © 2025 NAWAWEEB CLAN • ALL RIGHTS RESERVED
            </p>
          </div>

          {/* JAPANESE VERTICAL TEXT & FINAL BOSS QUOTE */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-clash font-black text-primary uppercase leading-tight">
                "MY DOMAIN IS MY CANVAS"
              </p>
              <p className="text-[8px] font-editor italic text-accent-dark tracking-widest uppercase mt-1">
                Lucknowi Threadcraft Syndicate
              </p>
            </div>
            <div className="flex flex-col text-[12px] font-bold text-emerald-900/20 leading-tight">
              <span>ナ</span>
              <span>ワ</span>
              <span>ウ</span>
              <span>ィ</span>
              <span>ー</span>
              <span>ブ</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}