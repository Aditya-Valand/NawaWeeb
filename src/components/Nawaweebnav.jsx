"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, TrendingUp, Zap } from "lucide-react";

export default function NawaweebNav() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [cartCount] = useState(2);

  const { scrollY } = useScroll();
  const navBlur = useTransform(scrollY, [0, 100], [0, 12]);
  const navOpacity = useTransform(scrollY, [0, 100], [0.55, 0.95]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.92]);

  const NAV = [
    { name: "Trending", icon: TrendingUp, badge: "Hot", submenu: ["Top 10 Weekly","Hype Picks","Viral Fits"] },
    { name: "New Drops", icon: Sparkles, badge: "New", submenu: ["Latest","Pre-Orders","Exclusive"] },
    { name: "Men", submenu: ["Oversized","Streetwear","Tees","Hoodies"] },
    { name: "Women", submenu: ["Tops","Bottoms","Co-ords","Accessories"] },
    { name: "Collections", icon: Zap, submenu: ["Anime Collab","Y2K","Techwear","Minimalist"] }
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  const menuVariants = {
    closed: { x: "-100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type:"spring", stiffness:260,damping:26 }}
  };

  return (
    <>
      {/* Navbar */}
      <motion.header
        style={{
          backdropFilter: navBlur.to(b => `blur(${b}px)`),
          WebkitBackdropFilter: navBlur.to(b => `blur(${b}px)`),
          backgroundColor: navOpacity.to(o => `rgba(255,255,255,${o})`),
        }}
        className="fixed top-0 w-full z-50 border-b border-gray-200/60 shadow-sm"
      >
        <div className="max-w-337.5 mx-auto h-16 md:h-20 px-5 flex items-center justify-between">

          {/* Left — Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* mobile menu */}
            <motion.button 
              whileTap={{scale:.92}}
              onClick={()=>setOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-900 text-white"
            >
              <Menu size={20}/>
            </motion.button>

            {/* logo */}
            <motion.a 
              style={{scale:logoScale}} 
              href="#" 
              className="text-2xl md:text-[28px] font-black tracking-tight text-brand"
            >
              NawaWeeb
            </motion.a>
          </div>

          {/* Center — Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4">
            {NAV.map(item => (
              <div 
                key={item.name} 
                className="relative select-none"
                onMouseEnter={()=>setActive(item.name)}
                onMouseLeave={()=>setActive(null)}
              >
                <button className="flex items-center gap-1 text-[15px] font-semibold text-gray-700 hover:text-black transition">
                  {item.icon && <item.icon size={15}/>} {item.name}
                  {item.submenu && <ChevronDown size={14} className={`transition ${active===item.name?"rotate-180":""}`}/>}
                  {item.badge&&(
                    <span className="text-[10px] ms-1 px-1.5 py-0.5 rounded-full text-white bg-linear-to-r from-pink-500 to-purple-500 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* dropdown */}
                <AnimatePresence>
                  {active===item.name && item.submenu &&(
                    <motion.div 
                      initial={{opacity:0,y:10}}
                      animate={{opacity:1,y:0}}
                      exit={{opacity:0,y:10}}
                      className="absolute left-0 w-48 mt-2 bg-white backdrop-blur-xl rounded-xl shadow-xl border border-gray-200"
                    >
                      {item.submenu.map((sub,i)=>(
                        <motion.a 
                          whileHover={{x:6}} 
                          key={sub} 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm rounded-md"
                          href="#"
                        >
                          {sub}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <div className="hidden md:flex items-center">
              <AnimatePresence>
                {searchOpen&&(
                  <motion.input
                    initial={{width:0,opacity:0}}
                    animate={{width:200,opacity:1}}
                    exit={{width:0,opacity:0}}
                    placeholder="Search..."
                    className="px-4 py-2 mr-2 rounded-full bg-gray-100 border border-gray-300 text-sm outline-none"
                    autoFocus
                  />
                )}
              </AnimatePresence>

              <button 
                onClick={()=>setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <Search size={18}/>
              </button>
            </div>

            {/* User */}
            <button className="hidden sm:flex p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200">
              <User size={18}/>
            </button>

            {/* Wishlist */}
            <button className="hidden sm:flex p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200">
              <Heart size={18} className="text-red-500"/>
            </button>

            {/* Cart */}
            <button className="relative p-2.5 rounded-xl bg-gray-900 text-white">
              <ShoppingBag size={18}/>
              <span className="absolute -top-1 -right-1 bg-linear-to-r from-pink-500 to-purple-500 text-[10px] w-5 h-5 grid place-content-center rounded-full text-white font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
      {open&&(
        <>
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={()=>setOpen(false)}
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          />
          <motion.div
            variants={menuVariants}
            initial="closed" animate="open" exit="closed"
            className="fixed left-0 top-0 h-screen w-[80%] max-w-xs bg-white z-50 p-6 flex flex-col gap-3"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-black text-brand">Menu</h2>
              <button onClick={()=>setOpen(false)}><X size={24}/></button>
            </div>

            {NAV.map(item=>(
              <a key={item.name} className="p-3 rounded-lg hover:bg-gray-100 font-semibold text-[15px]" href="#">
                {item.name}
              </a>
            ))}

            <div className="mt-auto border-t pt-4">
              <a className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-lg"><User size={18}/> Account</a>
              <a className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-lg"><Heart size={18} className="text-red-500"/> Wishlist</a>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
}
