import React from 'react';
import { motion } from 'motion/react';

export const StatsCounter: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#E4EDFE] py-14 md:py-18 text-slate-900 relative overflow-hidden border-y border-[#c8dbfc]"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center lg:text-left relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-md"
        >
          <p className="font-headline text-5xl md:text-6xl text-emerald-600 font-bold leading-none mb-2">5</p>
          <p className="text-sm text-slate-600 font-medium leading-snug">лет официальной заводской гарантии на износостойкость</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-md"
        >
          <p className="font-headline text-5xl md:text-6xl text-slate-900 font-bold leading-none mb-2">2</p>
          <p className="text-sm text-slate-600 font-medium leading-snug">ключевых направления матов для КРС: стойломеста и зоны прохода</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-md"
        >
          <p className="font-headline text-5xl md:text-6xl text-emerald-600 font-bold leading-none mb-2">100%</p>
          <p className="text-sm text-slate-600 font-medium leading-snug">прямые заводские поставки без посредников и наценок</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-md"
        >
          <p className="font-headline text-5xl md:text-6xl text-slate-900 font-bold leading-none mb-2">РФ</p>
          <p className="text-sm text-slate-600 font-medium leading-snug">География оперативных поставок по всей России и СНГ</p>
        </motion.div>

      </div>
    </motion.section>
  );
};
