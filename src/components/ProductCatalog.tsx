import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS_DATA, DEFAULT_SETTINGS } from '../data';
import { Product, SiteSettings } from '../types';
import { Factory, Search, Check, X } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProductForQuote: (productName: string) => void;
  settings?: SiteSettings;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProductForQuote,
  settings = DEFAULT_SETTINGS
}) => {
  const [selectedProductInspect, setSelectedProductInspect] = useState<Product | null>(null);

  return (
    <motion.section
      id="products"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white py-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-100">
            <Factory className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ассортимент завода</span>
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {settings.catalogTitle}
          </h2>
          <p className="text-slate-600 mt-3 text-xs sm:text-sm md:text-base leading-relaxed">
            {settings.catalogSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-[1200px] w-full mx-auto">
          {PRODUCTS_DATA.map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50/90 rounded-3xl border border-slate-200 overflow-hidden shadow-organic-lg grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left: Image */}
              <div 
                className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[220px] sm:min-h-[260px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-100 group cursor-pointer"
                onClick={() => setSelectedProductInspect(prod)}
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                />
                <div className="absolute top-3.5 left-3.5 bg-slate-900/85 text-white font-mono text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-xs shadow-sm z-10 border border-slate-700">
                  {prod.thickness}
                </div>
                <div className="absolute bottom-3.5 right-3.5 bg-white/95 hover:bg-white text-emerald-600 font-extrabold text-[11px] sm:text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-200 z-10 transition-transform group-hover:scale-105">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Увеличить фото и чертеж</span>
                </div>
              </div>

              {/* Right: Content & Specs */}
              <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                    {prod.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-5 sm:mb-6 font-normal leading-relaxed">
                    {prod.description || prod.subtitle}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/90 mb-6 text-xs sm:text-sm shadow-2xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Протектор и рельеф:</span>
                      <span className="font-bold text-slate-900 leading-snug">{prod.relief}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:border-l sm:border-slate-100 sm:pl-4">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Тип соединения:</span>
                      <span className="font-bold text-slate-900 leading-snug">{prod.jointType}</span>
                    </div>
                  </div>

                  <ul className="grid sm:grid-cols-1 gap-2.5 mb-8">
                    {prod.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-snug">
                        <Check className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-slate-200/80 flex flex-wrap sm:flex-nowrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{prod.warranty}</span>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedProductInspect(prod)}
                      className="px-5 py-3.5 border border-slate-300 hover:border-emerald-600 bg-white rounded-xl font-bold text-xs sm:text-sm text-slate-800 transition-all shadow-2xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Характеристики</span>
                    </button>
                    <button
                      onClick={() => onSelectProductForQuote(prod.title)}
                      className="flex-1 sm:flex-initial px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Рассчитать стоимость</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Relief Inspector Modal */}
        <AnimatePresence>
          {selectedProductInspect && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative bg-slate-900 p-6 text-white flex flex-col justify-between aspect-square md:aspect-auto">
                    <img
                      src={selectedProductInspect.imageUrl}
                      alt={selectedProductInspect.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="relative z-10">
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-600 text-white px-2.5 py-1 rounded shadow-xs">
                        Технический паспорт
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-headline text-2xl font-bold mb-1">{selectedProductInspect.title}</h4>
                      <p className="text-xs text-emerald-300 font-mono">{selectedProductInspect.thickness}</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-xl font-bold text-slate-900">Характеристики</h3>
                      <button
                        onClick={() => setSelectedProductInspect(null)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {selectedProductInspect.description}
                    </p>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      {selectedProductInspect.specs.map((sp, i) => (
                        <div key={i} className="flex justify-between items-center text-xs border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                          <span className="text-slate-500 font-medium">{sp.label}:</span>
                          <span className="font-mono font-bold text-slate-900">{sp.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const title = selectedProductInspect.title;
                        setSelectedProductInspect(null);
                        onSelectProductForQuote(title);
                      }}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      Рассчитать стоимость для этого мата
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
