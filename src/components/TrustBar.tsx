import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Truck, FileText } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-slate-100/80 py-10 border-y border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">Сделано в РФ</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Собственный завод в Татарстане</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">Гарантия 5 лет</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">На весь ассортимент матов</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">Доставка РФ и СНГ</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Любой объем от 10 кв.м.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">Протоколы испытаний</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Сертификаты и ГОСТ Р</p>
          </div>
        </div>

      </div>
    </motion.section>
  );
};
