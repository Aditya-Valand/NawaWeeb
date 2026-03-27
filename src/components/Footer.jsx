import React from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Mail, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// WhatsApp SVG — lucide doesn't ship one
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-[#F0FDF4] pt-24 pb-12 px-6 overflow-hidden border-t border-emerald-100">
      {/* ANIME AURA BACKGROUND ELEMENTS */}
      <div className="absolute -bottom-24 -right-24 w-125 h-125 bg-emerald-200/30 blur-[120px] rounded-full z-0" />
      <div className="absolute top-12 -left-12 w-64 h-64 bg-accent/20 blur-[80px] rounded-full z-0" />

      {/* GIANT HOLLOW LOGO WATERMARK */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <span className="text-[12vw] font-clash font-black text-transparent stroke-emerald-900/5 stroke-2 leading-none uppercase">
          NAWAWEEB
        </span>
      </div>

      <div className="container max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

          {/* COLUMN 1: BRAND & SOCIALS */}
          <div className="space-y-6">
            <div className="flex flex-col cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-3xl font-clash font-black text-primary tracking-tighter italic">NAWAWEEB</span>
              <span className="text-[10px] font-clash font-bold tracking-[0.4em] text-accent-dark uppercase -mt-1">Anime × Chikankari</span>
            </div>
            <p className="font-editor text-primary/60 max-w-xs leading-relaxed">
              Threadwork of the Nawabs. <br />
              Soul of the Otaku. <br />
              <span className="text-emerald-500 font-bold">Lucknow ⇌ Tokyo</span>
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ y: -5 }}
                href="https://www.instagram.com/nawaweeb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-primary text-accent rounded-xl flex items-center justify-center shadow-lg"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-sm"
              >
                <WhatsAppIcon size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="https://www.youtube.com/@nawaweeb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 bg-[#FF0000] text-white rounded-xl flex items-center justify-center shadow-sm"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </div>

          {/* COLUMN 2: THE CLAN LINKS */}
          <div className="space-y-6">
            <h4 className="text-xs font-clash font-black text-primary tracking-widest uppercase flex items-center gap-2">
              <Zap size={14} className="text-accent-dark fill-accent-dark" /> The Clan
            </h4>
            <ul className="space-y-4 font-clash font-bold text-sm text-primary/70">
              <li>
                <button onClick={() => navigate("/")} className="hover:text-emerald-500 transition-colors flex items-center gap-2">
                  New Drops <span className="bg-emerald-100 text-[8px] px-2 py-0.5 rounded-full">HOT</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/ourstory")} className="hover:text-emerald-500 transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="hover:text-emerald-500 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/orders")} className="hover:text-emerald-500 transition-colors">
                  Clan Rewards
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT */}
          <div className="space-y-6">
            <h4 className="text-xs font-clash font-black text-primary tracking-widest uppercase">Support</h4>
            <ul className="space-y-4 font-clash font-bold text-sm text-primary/70">
              <li>
                <button onClick={() => navigate("/orders")} className="hover:text-emerald-500 transition-colors">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="hover:text-emerald-500 transition-colors">
                  Shipping Info
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="hover:text-emerald-500 transition-colors">
                  Order Help
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="hover:text-emerald-500 transition-colors">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
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

        {/* BOTTOM SECTION */}
        <div className="pt-12 border-t border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-clash font-bold text-primary/40 uppercase tracking-[0.3em]">
              © 2025 NAWAWEEB CLAN • ALL RIGHTS RESERVED
            </p>
          </div>

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
