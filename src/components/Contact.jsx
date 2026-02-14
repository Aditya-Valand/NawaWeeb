import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, Zap, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext"; //

export default function Contact() {
  const { user } = useAuth(); // Prefill info if logged in
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ⚔️ Integration Logic: Send to your /api/contact or EmailJS
    setTimeout(() => {
      alert("Message transmitted to the Syndicate! ⛩️");
      setLoading(false);
      setFormData({ ...formData, comment: "" });
    }, 1500);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-bg-light pt-32 pb-20 px-6 sm:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <span className="text-accent-dark font-clash font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
            The Communication Line
          </span>
          <h2 className="text-6xl md:text-8xl font-clash font-black text-primary uppercase italic tracking-tighter leading-none">
            Summon the <br /> <span className="text-accent-dark">Artisans</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Syndicate Intel (4/12) */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-6">
              <h4 className="text-primary font-clash font-black text-xl uppercase italic">Clan Base</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-primary/60 group">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-accent transition-all">
                    <MapPin size={20} />
                  </div>
                  <p className="font-editor text-sm italic">Hazratganj, Lucknow • Uttar Pradesh, IN</p>
                </div>
                <div className="flex items-center gap-4 text-primary/60 group">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-accent transition-all">
                    <Mail size={20} />
                  </div>
                  <p className="font-editor text-sm italic">syndicate@nawaweeb.com</p>
                </div>
                <div className="flex items-center gap-4 text-primary/60 group">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-accent transition-all">
                    <Phone size={20} />
                  </div>
                  <p className="font-editor text-sm italic">+91 99XXXXXX00</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary rounded-[3rem] text-white relative overflow-hidden">
               <Zap size={100} className="absolute bottom-[-20px] right-[-20px] text-accent/10 rotate-12" />
               <h4 className="font-clash font-black text-accent text-xl uppercase mb-4 italic">Support Priority</h4>
               <p className="font-editor text-emerald-100/60 text-sm italic leading-relaxed">
                 Clan members get 24-hour response priority for all artifact maintenance and custom drop requests.
               </p>
            </div>
          </div>

          {/* RIGHT: Contact Form (8/12) */}
          <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(45,73,64,0.08)] border border-emerald-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">Identify Yourself</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Full Name"
                    className="w-full p-5 bg-bg-light border-none rounded-2xl font-clash text-sm focus:ring-2 ring-accent transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">Digital Signal</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Email Address"
                    className="w-full p-5 bg-bg-light border-none rounded-2xl font-clash text-sm focus:ring-2 ring-accent transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">Direct Line (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full p-5 bg-bg-light border-none rounded-2xl font-clash text-sm focus:ring-2 ring-accent transition-all outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">The Mission / Feedback</label>
                <textarea 
                  rows="5" 
                  required 
                  placeholder="Drop your thoughts, custom orders, or collaborations..."
                  className="w-full p-5 bg-bg-light border-none rounded-2xl font-editor italic text-sm focus:ring-2 ring-accent transition-all outline-none"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-6 bg-primary text-accent rounded-full font-clash font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Send to Syndicate"}
                <Send size={24} />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-primary/5 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                <ShieldCheck size={16} className="text-accent-dark" /> SSL Secured Transmission
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                <Zap size={16} className="text-accent-dark" /> Artisan Response within 24h
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}