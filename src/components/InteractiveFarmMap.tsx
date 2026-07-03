import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FARM_ZONES } from '../data';
import { FarmZone } from '../types';
import { MapPin, Bed, Footprints, Milk, Users, MoveHorizontal, HeartHandshake, ArrowRight } from 'lucide-react';

interface InteractiveFarmMapProps {
  onSelectZoneForForm: (productName: string) => void;
}

export const InteractiveFarmMap: React.FC<InteractiveFarmMapProps> = ({
  onSelectZoneForForm
}) => {
  const [selectedZone, setSelectedZone] = useState<FarmZone>(FARM_ZONES[0]);

  const renderZoneIcon = (id: string, isSelected: boolean) => {
    const iconClass = `w-6 h-6 ${isSelected ? 'text-white' : 'text-emerald-600'}`;
    switch (id) {
      case 'stalls':
        return <Bed className={iconClass} />;
      case 'corridors':
        return <Footprints className={iconClass} />;
      case 'milking':
        return <Milk className={iconClass} />;
      case 'holding':
        return <Users className={iconClass} />;
      case 'crossings':
        return <MoveHorizontal className={iconClass} />;
      case 'calving':
        return <HeartHandshake className={iconClass} />;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  return (
    <motion.section
      id="applications"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-100">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Интерактивный подбор</span>
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Где применяются наши покрытия
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl text-base md:text-lg">
            Нажмите на интересующую зону животноводческого комплекса, чтобы узнать физиологический эффект и рекомендованные параметры мата.
          </p>
        </div>
      </div>

      {/* Interactive Grid & Detail View */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 6 Cards Grid selector */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          {FARM_ZONES.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <motion.button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-organic"
                    : "bg-slate-100/80 hover:bg-white border-slate-200 hover:border-emerald-600/50 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-emerald-600 border border-slate-200"
                  }`}>
                    {renderZoneIcon(zone.id, isSelected)}
                  </div>

                  {isSelected && (
                    <span className="text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Выбрано
                    </span>
                  )}
                </div>

                <h3 className="font-headline font-bold text-lg text-slate-900 mb-1.5">
                  {zone.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {zone.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Right: Interactive Detailed Inspector Box */}
        <div className="lg:col-span-5 sticky top-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600 shadow-organic-lg relative overflow-hidden"
            >
              {/* Background watermark */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-bl-full pointer-events-none -mr-6 -mt-6"></div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                <span>Физиологический разбор</span>
              </div>

              <h3 className="font-headline text-2xl font-bold text-slate-900 mb-3">
                {selectedZone.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {selectedZone.details}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-xs text-slate-500 font-medium">Решение завода:</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{selectedZone.recommendedProduct}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-xs text-slate-500 font-medium">Оптимальная толщина:</span>
                  <span className="text-sm font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {selectedZone.recommendedThickness}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Снижение травматизма:</span>
                  <span className="text-sm font-bold text-emerald-600">
                    до {selectedZone.injuryReductionPercent}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectZoneForForm(`${selectedZone.title} (${selectedZone.recommendedThickness})`)}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Запросить расчет для этой зоны</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </motion.section>
  );
};
