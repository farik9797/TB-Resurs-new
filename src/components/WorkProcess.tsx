import React from 'react';
import { motion } from 'motion/react';
import { WORK_STEPS } from '../data';
import { Handshake } from 'lucide-react';

export const WorkProcess: React.FC = () => {
  return (
    <motion.section
      id="process"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-slate-100/80 py-20 px-4 md:px-8 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-100">
            <Handshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Прозрачное партнерство</span>
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Как мы работаем с хозяйствами
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORK_STEPS.map((st, idx) => (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between group hover:border-emerald-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-headline text-xl font-bold flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  {st.step}
                </div>
                <span className="font-mono text-xs text-slate-400 font-bold">Этап 0{st.step}</span>
              </div>

              <div>
                <h3 className="font-headline text-xl font-bold text-slate-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
