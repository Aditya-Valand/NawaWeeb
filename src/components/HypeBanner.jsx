import React from "react";
import { motion } from "framer-motion";

export default function HypeBanner() {
  const scrollText = "LIMITED DROP • HAND-EMBROIDERED • OTAKU CLAN • LUCKNOW TO TOKYO • 100% ARTISANAL • ";

  return (
    <div className="relative w-full overflow-hidden bg-primary py-4 md:py-6 border-y-2 border-accent/20">
      {/* VIBRANT GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 via-transparent to-emerald-500/20 pointer-events-none" />
      
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        className="flex whitespace-nowrap"
      >
        <span className="text-3xl md:text-5xl font-clash font-black text-accent uppercase tracking-tighter flex items-center gap-8">
          {[...Array(10)].map((_, i) => (
            <span key={i} className={i % 2 === 0 ? "text-accent" : "text-transparent stroke-accent stroke-1"}>
              {scrollText}
            </span>
          ))}
        </span>
      </motion.div>
    </div>
  );
}