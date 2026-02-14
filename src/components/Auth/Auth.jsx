import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Ensure this path is correct

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Destructure the login function from your global state
  const { login } = useAuth(); 

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
  e.preventDefault();

  try {
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    const response = await axios.post(url, payload);

    if (response.data.status === "success") {
      // 🛡️ Log in via Context to update the whole app state
      // Ensure we pass the actual user object (res.data.data.user or similar)
      const userData = response.data.data?.user || { 
        name: response.data.userName || name, 
        role: response.data.role || "user" 
      };
      
      login(userData, response.data.token);

      // Handle Redirects
      const savedRedirect = sessionStorage.getItem("redirectAfterAuth");

      if (savedRedirect) {
        sessionStorage.removeItem("redirectAfterAuth");
        navigate(savedRedirect); 
      } else {
        navigate(userData.role === "admin" ? "/admin" : "/"); 
      }
    }
  } catch (err) {
    // This will now catch the 500 error and show the message from your backend
    alert(err.response?.data?.message || "Syndicate authentication failed.");
  }
};  

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4 lg:p-0">
      <div className="w-full max-w-6xl h-[85vh] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(45,73,64,0.1)] overflow-hidden flex flex-col lg:flex-row border border-emerald-100">
        
        {/* LEFT SIDE: THE VIBE */}
        <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-500/20 to-transparent" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/20 blur-[100px] rounded-full"
          />

          <div className="relative z-10 text-center">
            <h2 className="text-6xl font-clash font-black text-accent leading-none mb-6 uppercase">
              Join the <br /> Syndicate
            </h2>
            <p className="font-editor italic text-emerald-100/70 text-xl max-w-xs mx-auto">
              "Threads of heritage, pulse of the future."
            </p>
          </div>

          <div className="absolute right-8 bottom-12 [writing-mode:vertical-lr] text-accent/30 font-clash font-bold tracking-[1em] text-[10px] uppercase">
              ナワウィーブ • 伝統
          </div>
        </div>

        {/* RIGHT SIDE: THE FORM */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10">
                <h3 className="text-4xl font-clash font-black text-primary uppercase leading-none">
                  {isLogin ? "Welcome Back" : "Clan Registry"}
                </h3>
                <p className="text-primary/40 font-editor italic mt-2">
                  {isLogin ? "Access your domain expansion." : "Begin your artisanal journey."}
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-light border-none rounded-2xl py-4 pl-12 pr-4 font-clash text-sm focus:ring-2 ring-accent outline-none"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-bg-light border-none rounded-2xl py-4 pl-12 pr-4 font-clash text-sm focus:ring-2 ring-accent outline-none" 
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-bg-light border-none rounded-2xl py-4 pl-12 pr-4 font-clash text-sm focus:ring-2 ring-accent outline-none" 
                  />
                </div>

                <button className="w-full py-5 bg-primary text-accent rounded-full font-clash font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all mt-8 group">
                  {isLogin ? "Sign In" : "Join the Clan"}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-clash font-bold text-primary/40 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {isLogin ? "Need an invite? Register" : "Already in the syndicate? Login"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 right-10 text-emerald-50">
            <Zap size={120} strokeWidth={0.5} />
          </div>
        </div>
      </div>
    </div>
  );
}