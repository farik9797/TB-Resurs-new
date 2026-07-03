import React from 'react';
import { motion } from 'motion/react';
import { Building2, Factory, ArrowRight, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';

interface HeroSectionProps {
  onScrollToProducts?: () => void;
  onScrollToForm: () => void;
  settings?: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToProducts,
  onScrollToForm,
  settings = DEFAULT_SETTINGS
}) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="pt-[130px] md:pt-[150px] pb-12 lg:pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="py-1.5 px-3.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold tracking-wide uppercase border border-slate-200 shadow-2xs flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{settings.heroBadge || "Прямой производитель — Татарстан"}</span>
            </span>
            <span className="py-1.5 px-3 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {settings.guaranteeText || "Гарантия 5 лет по договору"}
            </span>
          </div>

          <h1
            className="font-headline font-bold mb-5 sm:mb-6 text-slate-900 text-2xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.18] sm:leading-[1.12] tracking-tight"
          >
            {settings.heroTitle.split(/<br\s*\/?>/i).map((line, index, arr) => (
              <React.Fragment key={index}>
                {line}
                {index < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-7 sm:mb-8 max-w-2xl leading-relaxed font-normal">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <button
              onClick={onScrollToForm}
              className="h-12 sm:h-[56px] px-6 sm:px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-emerald-400/40"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>Оставить заявку на расчет</span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            <button
              onClick={onScrollToProducts}
              className="h-12 sm:h-[56px] px-5 sm:px-7 border-2 border-slate-200 hover:border-emerald-600 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Factory className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
              <span>Каталог матов и цены</span>
            </button>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div>
              <div className="font-headline text-2xl sm:text-3xl font-bold text-emerald-600 mb-0.5">88%</div>
              <div className="text-xs text-slate-500 leading-snug font-medium">Снижение травм скакательных суставов</div>
            </div>
            <div>
              <div className="font-headline text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">+12%</div>
              <div className="text-xs text-slate-500 leading-snug font-medium">Прирост суточного надоя молока</div>
            </div>
            <div>
              <div className="font-headline text-2xl sm:text-3xl font-bold text-emerald-500 mb-0.5">до 15 лет</div>
              <div className="text-xs text-slate-500 leading-snug font-medium">Реальный срок службы покрытий</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column Interactive Visual Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          <div className="rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3.5] border border-slate-200 shadow-sleek-emerald relative group bg-slate-100">
            <img
              src={settings.heroImageUrl}
              alt="Производство резиновых матов для животноводческих комплексов ТБ-Ресурс в Татарстане"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            
            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-600 px-3 py-1 rounded-lg shadow-sm">
                Завод в Кукморе
              </span>
              <p className="text-xs mt-2 opacity-90 font-medium leading-relaxed">
                Первичное сырье высокой плотности с уникальным амортизирующим протектором
              </p>
            </div>
          </div>

          {/* Floating Interactive Badge 1: Eco & Quality */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-4 -left-3 sm:-left-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-organic flex items-center gap-3 z-10"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-emerald-600 leading-none">100%</p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Экологично по ГОСТ</p>
            </div>
          </motion.div>

          {/* Floating Interactive Badge 2: Relief simulation */}
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, delay: 1, ease: "easeInOut" }}
            className="absolute -bottom-5 -right-3 sm:-right-6 bg-[#E4EDFE] text-slate-900 p-4 rounded-2xl border border-slate-300 shadow-organic max-w-[210px] z-10"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-black">Амортизация</span>
            </div>
            <p className="text-xs font-semibold leading-snug text-black">
              Шиповое дно 8мм работает как пастбищная почва
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
