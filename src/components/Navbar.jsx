import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Sparkles, Zap, Flame, Crown, MapPin, LogOut, Package 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function NawaweebNavbar() {
  const navigate = useNavigate();
  // Pull reactive global state from AuthContext
  const { user, logout, isAuthenticated } = useAuth(); 
  
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // --- DYNAMIC DATA STATE ---
  const [dynamicDrops, setDynamicDrops] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  // --- CART COUNT STATE ---
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // --- FETCH MENU DATA FROM BACKEND ---
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch all active products
        const res = await api.get('/products');
        const allProducts = res.data.data?.products || [];

        // 1. New Drops: Get Top 5 Latest (assuming backend sorts by newest)
        const latestDrops = allProducts.slice(0, 5).map(p => p.title);
        setDynamicDrops(latestDrops);

        // 2. Collections: Extract Unique Collection Names
        const uniqueCollections = [...new Set(allProducts.map(p => p.collection))].filter(Boolean);
        setDynamicCollections(uniqueCollections);

      } catch (err) {
        console.error("Menu fetch failed:", err);
      }
    };
    fetchMenuData();
  }, []);
  
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);
  const logoY = useTransform(scrollY, [0, 100], [0, -3]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (open || profileOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open, profileOpen]);

  const handleLogoutAction = () => {
    logout(); // Uses the global logout function from Context
    setProfileOpen(false);
    navigate("/auth");
  };

  // --- NAVIGATION CONFIGURATION ---
  const NAV = [
    { 
      name: "New Drops", 
      icon: Sparkles, 
      badge: "New", 
      submenu: dynamicDrops.length > 0 ? dynamicDrops : ["Loading Artifacts..."] 
    },
    { 
      name: "Collections", 
      icon: Crown, 
      submenu: dynamicCollections.length > 0 ? dynamicCollections : ["General Release"] 
    },
    { 
      name: "Apparel", 
      submenu: [
        "Anime Tees", 
        "Divine Drip",   // Devote Tees
        "Festival Fits", // Festival Tees
        "Trendsetters",  // Trends Tees
        "Kimono Shirts"
      ] 
    },
    { 
      name: "The Clan", 
      icon: Flame, 
      badge: "Hot", 
      submenu: ["Our Story", "Contact"] 
    },
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

              <motion.button
                onClick={() => navigate("/")}
                style={{ scale: logoScale, y: logoY }} 
                className="flex flex-col group cursor-pointer bg-transparent border-none p-0"
              >
                <span className="text-2xl md:text-4xl font-clash font-black tracking-tighter text-primary leading-none">
                  NAWAWEEB
                </span>
                <span className="text-[10px] md:text-[12px] font-clash font-bold tracking-[0.4em] text-accent-dark uppercase block">
                  Anime × Chikankari
                </span>
              </motion.button>
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
                          {item.submenu.map((subItem) => (
                            <button
                              key={subItem}
                              onClick={() => {
                                // Special handling for Our Story and Contact
                                if (subItem === "Our Story") {
                                  navigate("/ourstory");
                                } else if (subItem === "Contact") {
                                  navigate("/contact");
                                } else {
                                  // Navigate to shop with filter
                                  navigate(`/shop?filter=${encodeURIComponent(subItem)}`);
                                }
                                setActiveMenu(null);
                              }}
                              className="w-full text-left block px-4 py-3 text-sm font-clash text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition uppercase"
                            >
                              {subItem}
                            </button>
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
              
              {/* Profile/Auth Trigger */}
              <button 
                onClick={() => isAuthenticated ? setProfileOpen(true) : navigate("/auth")}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isAuthenticated ? "bg-primary text-accent shadow-lg" : "hover:bg-primary/5 text-primary"
                }`}
              >
                <User size={20} />
              </button>

              <button className="hidden sm:flex p-2.5 rounded-full hover:bg-primary/5 text-primary relative">
                <Heart size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
              </button>

              {/* BUY NOW BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-clash font-bold shadow-xl shadow-primary/20 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <ShoppingBag size={18} className="relative z-10 group-hover:text-primary transition-colors" />
                <span className="relative z-10 hidden sm:inline group-hover:text-primary transition-colors">
                  Buy Now
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-[10px] font-black rounded-full flex items-center justify-center z-20 border border-primary">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* SYNDICATE PROFILE DRAWER */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setProfileOpen(false)} 
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 w-full max-w-sm h-full bg-white z-[210] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-dark">Syndicate Member</span>
                  <h2 className="text-2xl font-clash font-black text-primary uppercase italic">
                    {user?.name || "Artifact Hunter"}
                  </h2>
                </div>
                <button onClick={() => setProfileOpen(false)} className="p-2 hover:bg-primary/5 rounded-full transition">
                  <X size={24} className="text-primary" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {/* Admin Dashboard link only for admins */}
                {user?.role === "admin" && (
                  <button 
                    onClick={() => { navigate("/admin"); setProfileOpen(false); }} 
                    className="w-full flex items-center gap-4 p-5 bg-accent/10 rounded-2xl border border-accent/20 text-primary font-clash font-bold hover:bg-accent transition-all"
                  >
                    <Zap size={20} /> ARTISAN DASHBOARD
                  </button>
                )}
                
                <button 
                  onClick={() => navigate("/cart")}
                  className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-2xl text-primary font-clash font-bold hover:bg-primary hover:text-white transition-all group"
                >
                  <ShoppingBag size={20} className="group-hover:text-accent transition-colors" /> MY CART
                </button>
                <button 
                  onClick={() => { navigate("/wishlist"); setProfileOpen(false); }}
                  className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-2xl text-primary font-clash font-bold hover:bg-primary hover:text-white transition-all group"
                >
                  <Heart size={20} className="group-hover:text-accent transition-colors" /> WISHLIST
                </button>
                <button 
                  onClick={() => { navigate("/orders"); setProfileOpen(false); }}
                  className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-2xl text-primary font-clash font-bold hover:bg-primary hover:text-white transition-all group"
                >
                  <Package size={20} className="group-hover:text-accent transition-colors" /> ORDER HISTORY
                </button>
              </div>

              <button 
                onClick={handleLogoutAction}
                className="mt-auto flex items-center justify-center gap-3 p-5 text-red-500 font-clash font-bold uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
              >
                <LogOut size={20} /> Terminate Session
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE MENU DRAWER */}
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
              className="fixed left-0 top-0 w-full max-w-sm h-full bg-white z-60 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="relative flex items-center justify-between p-8 border-b border-primary/10">
                <h2 className="text-2xl font-clash font-black text-primary uppercase italic">Menu</h2>
                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-primary/5 transition">
                  <X size={24} className="text-primary" />
                </button>
              </div>

              <nav className="relative flex-1 p-8 space-y-4 overflow-y-auto">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={menuItemVariants}
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between p-4 text-xl font-clash font-bold text-primary hover:bg-primary/5 rounded-2xl transition group cursor-pointer">
                      <span className="flex items-center gap-4">
                        {item.icon && <item.icon size={20} className="text-accent-dark" />}
                        {item.name}
                      </span>
                      {item.submenu && <ChevronDown size={18} className="text-primary/30" />}
                    </div>
                    
                    {/* Mobile Submenu items */}
                    {item.submenu && (
                      <div className="pl-12 pr-4 space-y-2 mt-2 mb-4">
                        {item.submenu.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              // Special handling for Our Story and Contact
                              if (sub === "Our Story") {
                                navigate("/ourstory");
                              } else if (sub === "Contact") {
                                navigate("/contact");
                              } else {
                                navigate(`/shop?filter=${encodeURIComponent(sub)}`);
                              }
                              setOpen(false);
                            }}
                            className="block w-full text-left py-2 text-sm font-clash text-primary/60 hover:text-primary uppercase"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="relative p-8 border-t border-primary/10 bg-white/50 space-y-4">
                <div className="flex items-center gap-3 text-primary/60 text-sm font-clash font-medium uppercase tracking-widest">
                  <MapPin size={16} />
                  <span>Lucknow • India</span>
                </div>
                <button 
                   onClick={() => navigate("/cart")}
                   className="w-full py-4 bg-primary text-white rounded-2xl font-clash font-bold shadow-lg"
                >
                  View Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import { 
//   Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
//   Sparkles, Zap, Flame, Crown, MapPin, LogOut, Package 
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext"; // Ensure path is correct

// export default function NawaweebNavbar() {
//   const navigate = useNavigate();
//   // Pull reactive global state from AuthContext
//   const { user, logout, isAuthenticated } = useAuth(); 
  
//   const [open, setOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeMenu, setActiveMenu] = useState(null);
  
//   const { scrollY } = useScroll();
//   const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);
//   const logoY = useTransform(scrollY, [0, 100], [0, -3]);

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handler);
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = (open || profileOpen) ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [open, profileOpen]);

//   const handleLogoutAction = () => {
//     logout(); // Uses the global logout function from Context
//     setProfileOpen(false);
//     navigate("/auth");
//   };

//   const NAV = [
//     { name: "New Drops", icon: Sparkles, badge: "New", submenu: ["Hollow Purple Kimono", "Uchiha Threads", "One Pieace Fire"] },
//     { name: "Collections", icon: Crown, submenu: ["Street Shinobi", "Cyberpunk Chikankari"] },
//     { name: "Apparel", submenu: ["Oversize Tees", "Kimono Shirts"] },
//     { name: "The Clan", icon: Flame, badge: "Hot", submenu: ["Our Story", "Contact"] },
//   ];

//   const menuVariants = {
//     closed: { x: "-100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
//     open: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
//   };

//   const menuItemVariants = {
//     closed: { x: -20, opacity: 0 },
//     open: (i) => ({
//       x: 0,
//       opacity: 1,
//       transition: { delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }
//     })
//   };

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
//           scrolled
//             ? "backdrop-blur-xl bg-white/90 shadow-[0_8px_32px_rgba(45,73,64,0.12)] border-b border-primary/10"
//             : "bg-transparent"
//         }`}
//       >
//         <div className="container max-w-screen-2xl mx-auto px-6 sm:px-12 h-16 md:h-24">
//           <div className="flex items-center justify-between w-full h-full">
            
//             {/* LEFT: Mobile menu + Logo */}
//             <div className="flex items-center gap-6">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setOpen(true)}
//                 className="lg:hidden p-2.5 rounded-xl bg-primary text-accent shadow-lg"
//               >
//                 <Menu size={20} />
//               </motion.button>

//               <motion.a 
//                 href="/" 
//                 style={{ scale: logoScale, y: logoY }} 
//                 className="flex flex-col group cursor-pointer"
//               >
//                 <span className="text-2xl md:text-4xl font-clash font-black tracking-tighter text-primary leading-none">
//                   NAWAWEEB
//                 </span>
//                 <span className="text-[10px] md:text-[12px] font-clash font-bold tracking-[0.4em] text-accent-dark uppercase block">
//                   Anime × Chikankari
//                 </span>
//               </motion.a>
//             </div>

//             {/* CENTER: Desktop Nav */}
//             <nav className="hidden lg:flex items-center gap-2">
//               {NAV.map((item) => (
//                 <div
//                   key={item.name}
//                   className="relative"
//                   onMouseEnter={() => setActiveMenu(item.name)}
//                   onMouseLeave={() => setActiveMenu(null)}
//                 >
//                   <motion.a
//                     href="#"
//                     whileHover={{ y: -2 }}
//                     className="relative px-5 py-2 flex items-center gap-2 text-sm font-clash font-bold text-primary/80 hover:text-primary transition-colors group"
//                   >
//                     {item.name}
//                     {item.submenu && (
//                       <ChevronDown 
//                         size={14} 
//                         className={`transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180' : ''}`} 
//                       />
//                     )}
//                     {item.badge && (
//                       <span className="absolute -top-1 -right-1 bg-accent text-primary-dark text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-sm">
//                         {item.badge}
//                       </span>
//                     )}
//                   </motion.a>

//                   <AnimatePresence>
//                     {activeMenu === item.name && item.submenu && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                         className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/5 overflow-hidden"
//                       >
//                         <div className="p-2">
//                           {item.submenu.map((subItem) => (
//                             <a
//                               key={subItem}
//                               href="#"
//                               className="block px-4 py-3 text-sm font-clash text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition"
//                             >
//                               {subItem}
//                             </a>
//                           ))}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </nav>

//             {/* RIGHT: Action Icons */}
//             <div className="flex items-center gap-2 md:gap-4">
//               <button className="hidden md:flex p-2.5 rounded-full hover:bg-primary/5 text-primary transition-colors">
//                 <Search size={20} />
//               </button>
              
//               {/* Profile/Auth Trigger */}
//               <button 
//                 onClick={() => isAuthenticated ? setProfileOpen(true) : navigate("/auth")}
//                 className={`p-2.5 rounded-full transition-all duration-300 ${
//                   isAuthenticated ? "bg-primary text-accent shadow-lg" : "hover:bg-primary/5 text-primary"
//                 }`}
//               >
//                 <User size={20} />
//               </button>

//               <button className="hidden sm:flex p-2.5 rounded-full hover:bg-primary/5 text-primary relative">
//                 <Heart size={20} />
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
//               </button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="relative flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-clash font-bold shadow-xl shadow-primary/20 group overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//                 <ShoppingBag size={18} className="relative z-10 group-hover:text-primary transition-colors" />
//                 <span className="relative z-10 hidden sm:inline group-hover:text-primary transition-colors">Order via Email</span>
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </motion.header>

//       {/* SYNDICATE PROFILE DRAWER */}
//       <AnimatePresence>
//         {profileOpen && (
//           <>
//             <motion.div 
//               initial={{ opacity: 0 }} 
//               animate={{ opacity: 1 }} 
//               exit={{ opacity: 0 }} 
//               onClick={() => setProfileOpen(false)} 
//               className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-200" 
//             />
//             <motion.div 
//               initial={{ x: "100%" }} 
//               animate={{ x: 0 }} 
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="fixed right-0 top-0 w-full max-w-sm h-full bg-white z-210 shadow-2xl p-8 flex flex-col"
//             >
//               <div className="flex justify-between items-center mb-10">
//                 <div>
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-dark">Syndicate Member</span>
//                   <h2 className="text-2xl font-clash font-black text-primary uppercase italic">
//                     {user?.name || "Artifact Hunter"}
//                   </h2>
//                 </div>
//                 <button onClick={() => setProfileOpen(false)} className="p-2 hover:bg-primary/5 rounded-full transition">
//                   <X size={24} className="text-primary" />
//                 </button>
//               </div>

//               <div className="space-y-4 flex-1">
//                 {/* Admin Dashboard link only for admins */}
//                 {user?.role === "admin" && (
//                   <button 
//                     onClick={() => { navigate("/admin"); setProfileOpen(false); }} 
//                     className="w-full flex items-center gap-4 p-5 bg-accent/10 rounded-2xl border border-accent/20 text-primary font-clash font-bold hover:bg-accent transition-all"
//                   >
//                     <Zap size={20} /> ARTISAN DASHBOARD
//                   </button>
//                 )}
                
//                 <button className="w-full flex items-center gap-4 p-5 bg-bg-light rounded-2xl text-primary font-clash font-bold hover:bg-primary hover:text-white transition-all group">
//                   <ShoppingBag size={20} className="group-hover:text-accent transition-colors" /> MY CART
//                 </button>
//                 <button className="w-full flex items-center gap-4 p-5 bg-bg-light rounded-2xl text-primary font-clash font-bold hover:bg-primary hover:text-white transition-all group">
//                   <Heart size={20} className="group-hover:text-accent transition-colors" /> WISHLIST
//                 </button>
//                 <button className="w-full flex items-center gap-4 p-5 bg-bg-light rounded-2xl text-primary font-clash font-bold hover:bg-primary hover:text-white transition-all group">
//                   <Package size={20} className="group-hover:text-accent transition-colors" /> ORDER HISTORY
//                 </button>
//               </div>

//               <button 
//                 onClick={handleLogoutAction}
//                 className="mt-auto flex items-center justify-center gap-3 p-5 text-red-500 font-clash font-bold uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
//               >
//                 <LogOut size={20} /> Terminate Session
//               </button>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* MOBILE MENU DRAWER */}
//       <AnimatePresence>
//         {open && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setOpen(false)}
//               className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50"
//             />
//             <motion.div
//               variants={menuVariants}
//               initial="closed"
//               animate="open"
//               exit="closed"
//               className="fixed left-0 top-0 w-full max-w-sm h-full bg-bg-light z-60 shadow-2xl overflow-hidden flex flex-col"
//             >
//               <div className="relative flex items-center justify-between p-8 border-b border-primary/10">
//                 <h2 className="text-2xl font-clash font-black text-primary uppercase italic">Menu</h2>
//                 <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-primary/5 transition">
//                   <X size={24} className="text-primary" />
//                 </button>
//               </div>

//               <nav className="relative flex-1 p-8 space-y-4 overflow-y-auto">
//                 {NAV.map((item, i) => (
//                   <motion.a
//                     key={item.name}
//                     href="#"
//                     custom={i}
//                     variants={menuItemVariants}
//                     className="flex items-center justify-between p-4 text-xl font-clash font-bold text-primary hover:bg-primary/5 rounded-2xl transition group"
//                   >
//                     <span className="flex items-center gap-4">
//                        {item.icon && <item.icon size={20} className="text-accent-dark" />}
//                        {item.name}
//                     </span>
//                     <ChevronDown size={18} className="text-primary/30 group-hover:translate-x-1 transition" />
//                   </motion.a>
//                 ))}
//               </nav>

//               <div className="relative p-8 border-t border-primary/10 bg-white/50 space-y-4">
//                 <div className="flex items-center gap-3 text-primary/60 text-sm font-clash font-medium uppercase tracking-widest">
//                   <MapPin size={16} />
//                   <span>Lucknow • India</span>
//                 </div>
//                 <button className="w-full py-4 bg-primary text-white rounded-2xl font-clash font-bold shadow-lg">
//                   Track Order
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }