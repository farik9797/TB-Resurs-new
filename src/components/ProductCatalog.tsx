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
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-100">
            <Factory className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ассортимент завода</span>
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            {settings.catalogTitle}
          </h2>
          <p className="text-slate-600 mt-3 text-base md:text-lg">
            {settings.catalogSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50/80 rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-organic"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100 group cursor-pointer" onClick={() => setSelectedProductInspect(prod)}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-white font-mono text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs shadow-xs">
                    {prod.thickness}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-emerald-600 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-slate-100">
                    <Search className="w-3.5 h-3.5" />
                    <span>Детали рельефа</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="font-headline text-2xl font-bold text-slate-900 mb-2 leading-tight">
                    {prod.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-5 font-normal">
                    {prod.subtitle}
                  </p>

                  <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-slate-200 mb-6 text-xs shadow-2xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Протектор:</span>
                      <span className="font-bold text-slate-900 text-right">{prod.relief}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Крепление:</span>
                      <span className="font-bold text-slate-900 text-right">{prod.jointType}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {prod.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 flex gap-3">
                <button
                  onClick={() => onSelectProductForQuote(prod.title)}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Запросить КП
                </button>
                <button
                  onClick={() => setSelectedProductInspect(prod)}
                  className="px-4 h-12 border border-slate-200 hover:border-emerald-600 bg-white rounded-xl font-semibold text-xs text-slate-800 transition-colors shadow-2xs"
                  title="Подробные характеристики"
                >
                  Характеристики
                </button>
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
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-600 px-2.5 py-1 rounded shadow-xs">
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
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all"
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
