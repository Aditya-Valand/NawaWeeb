import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Zap, 
  Flame, 
  Crown,
  MapPin
} from "lucide-react";

export default function NawaweebNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);
  const logoY = useTransform(scrollY, [0, 100], [0, -3]);

  // Handle scroll detection for background blur
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  const NAV = [
    { name: "New Drops", icon: Sparkles, badge: "New", submenu: ["Hollow Purple Kimono", "Uchiha Threads", "Limited Edition"] },
    { name: "Collections", icon: Crown, submenu: ["Street Shinobi", "Ethereal Awadh", "Cyberpunk Chikankari"] },
    { name: "Apparel", submenu: ["Oversize Tees", "Kimono Shirts", "Hand-Embroidered"] },
    { name: "The Clan", icon: Flame, badge: "Hot", submenu: ["Our Story", "Chikankari Art", "Order via Email"] },
  ];

  const menuVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
    open: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }
    })
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-white/90 shadow-[0_8px_32px_rgba(45,73,64,0.12)] border-b border-primary/10"
            : "bg-transparent"
        }`}
      >
        <div className="container max-w-screen-2xl mx-auto px-6 sm:px-12 h-16 md:h-24">
          <div className="flex items-center justify-between w-full h-full">
            
            {/* LEFT: Mobile menu + Logo */}
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-primary text-accent shadow-lg"
              >
                <Menu size={20} />
              </motion.button>

              <motion.a 
                href="/" 
                style={{ scale: logoScale, y: logoY }} 
                className="flex flex-col group cursor-pointer"
              >
                <span className="text-2xl md:text-4xl font-clash font-black tracking-tighter text-primary leading-none">
                  NAWAWEEB
                </span>
                <span className="text-[10px] md:text-[12px] font-clash font-bold tracking-[0.4em] text-accent-dark uppercase block">
                  Anime × Chikankari
                </span>
              </motion.a>
            </div>

            {/* CENTER: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {NAV.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.name)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <motion.a
                    href="#"
                    whileHover={{ y: -2 }}
                    className="relative px-5 py-2 flex items-center gap-2 text-sm font-clash font-bold text-primary/80 hover:text-primary transition-colors group"
                  >
                    {item.name}
                    {item.submenu && (
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180' : ''}`} 
                      />
                    )}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-accent text-primary-dark text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <motion.span
                      className="absolute left-5 right-5 -bottom-1 h-0.5 bg-accent rounded-full"
                      initial={{ width: 0, opacity: 0 }}
                      whileHover={{ width: "auto", opacity: 1 }}
                    />
                  </motion.a>

                  <AnimatePresence>
                    {activeMenu === item.name && item.submenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/5 overflow-hidden"
                      >
                        <div className="p-2">
                          {item.submenu.map((subItem, i) => (
                            <motion.a
                              key={subItem}
                              href="#"
                              whileHover={{ x: 5, backgroundColor: "rgba(45,73,64,0.05)" }}
                              className="block px-4 py-3 text-sm font-clash text-primary/70 hover:text-primary rounded-xl transition"
                            >
                              {subItem}
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* RIGHT: Action Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button className="hidden md:flex p-2.5 rounded-full hover:bg-primary/5 text-primary transition-colors">
                <Search size={20} />
              </button>
              
              <button className="hidden sm:flex p-2.5 rounded-full hover:bg-primary/5 text-primary relative">
                <Heart size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-clash font-bold shadow-xl shadow-primary/20 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <ShoppingBag size={18} className="relative z-10 group-hover:text-primary transition-colors" />
                <span className="relative z-10 hidden sm:inline group-hover:text-primary transition-colors">Order via Email</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50"
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 w-full max-w-sm h-full bg-bg-light z-60 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Artistic Background Overlay for Drawer */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: `url('/src/assets/images/textures/pattern.png')`, backgroundSize: '200px' }} />
              </div>

              <div className="relative flex items-center justify-between p-8 border-b border-primary/10">
                <h2 className="text-2xl font-clash font-black text-primary">MENU</h2>
                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-primary/5 transition">
                  <X size={24} className="text-primary" />
                </button>
              </div>

              <nav className="relative flex-1 p-8 space-y-4 overflow-y-auto">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    custom={i}
                    variants={menuItemVariants}
                    className="flex items-center justify-between p-4 text-xl font-clash font-bold text-primary hover:bg-primary/5 rounded-2xl transition group"
                  >
                    <span className="flex items-center gap-4">
                       {item.icon && <item.icon size={20} className="text-accent-dark" />}
                       {item.name}
                    </span>
                    <ChevronDown size={18} className="text-primary/30 group-hover:translate-x-1 transition" />
                  </motion.a>
                ))}
              </nav>

              <div className="relative p-8 border-t border-primary/10 bg-white/50 space-y-4">
                <div className="flex items-center gap-3 text-primary/60 text-sm font-clash font-medium">
                  <MapPin size={16} />
                  <span>Lucknow, India — World Wide Shipping</span>
                </div>
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-clash font-bold shadow-lg">
                  Track Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}