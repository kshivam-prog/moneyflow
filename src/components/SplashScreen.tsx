import React from 'react';
import { motion } from 'motion/react';
import { IndianRupee } from 'lucide-react';
import { clsx } from 'clsx';

interface SplashScreenProps {
  isDarkMode: boolean;
}

export function SplashScreen({ isDarkMode }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={clsx(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center",
        isDarkMode ? "bg-zinc-950 text-white" : "bg-emerald-600 text-white"
      )}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          duration: 1.5 
        }}
        className="w-28 h-28 bg-white/20 rounded-3xl shadow-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/30"
      >
        <IndianRupee size={56} className="text-white drop-shadow-md" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="text-4xl font-extrabold tracking-tight drop-shadow-sm"
      >
        MoneyFlow
      </motion.h1>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        className="mt-3 flex items-center gap-2"
      >
        <div className="w-12 h-[1px] bg-white/50" />
        <p className="text-white/90 font-medium tracking-widest uppercase text-xs">
          Smart Tracker
        </p>
        <div className="w-12 h-[1px] bg-white/50" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Initializing</span>
      </motion.div>
    </motion.div>
  );
}
