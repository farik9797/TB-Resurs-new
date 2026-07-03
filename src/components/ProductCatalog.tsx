import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS_DATA, DEFAULT_SETTINGS } from '../data';
import { Product, SiteSettings } from '../types';
import { Factory, Search, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProductForQuote: (productName: string) => void;
  settings?: SiteSettings;
  products?: Product[];
}

const ProductCardImageSlider: React.FC<{
  product: Product;
  onInspect: () => void;
}> = ({ product, onInspect }) => {
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div 
      className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[250px] sm:min-h-[290px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-900 group cursor-pointer select-none"
      onClick={onInspect}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${product.title} - фото ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
        />
      </AnimatePresence>

      <div className="absolute top-3.5 left-3.5 bg-slate-900/85 text-white font-mono text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-xs shadow-sm z-10 border border-slate-700">
        {product.thickness}
      </div>

      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 shadow-md transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer"
            title="Предыдущее фото"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 shadow-md transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer"
            title="Следующее фото"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators / Dots */}
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 z-20 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-white/10">
            {images.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-emerald-400' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-3.5 right-3.5 bg-white/95 hover:bg-white text-emerald-600 font-extrabold text-[11px] sm:text-xs p-2 sm:px-3.5 sm:py-2 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-200 z-10 transition-transform group-hover:scale-105" title="Увеличить фото и чертеж">
        <Search className="w-4 h-4 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Увеличить фото и чертеж</span>
      </div>
    </div>
  );
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProductForQuote,
  settings = DEFAULT_SETTINGS,
  products
}) => {
  const [selectedProductInspect, setSelectedProductInspect] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const catalogList = products && products.length > 0 ? products : PRODUCTS_DATA;

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
          {catalogList.map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50/90 rounded-3xl border border-slate-200 overflow-hidden shadow-organic-lg grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left: Image Slider */}
              <ProductCardImageSlider
                product={prod}
                onInspect={() => {
                  setSelectedProductInspect(prod);
                  setModalImageIndex(0);
                }}
              />

              {/* Right: Content & Specs */}
              <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-start">
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

                <div className="pt-5 border-t border-slate-200/80 flex flex-col justify-start gap-4 items-stretch">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{prod.warranty}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-start gap-3 w-full">
                    <button
                      onClick={() => {
                        setSelectedProductInspect(prod);
                        setModalImageIndex(0);
                      }}
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
                  <div className="relative bg-slate-950 p-6 text-white flex flex-col justify-between min-h-[300px] md:min-h-full aspect-square md:aspect-auto overflow-hidden select-none">
                    {(() => {
                      const mImages = selectedProductInspect.images && selectedProductInspect.images.length > 0
                        ? selectedProductInspect.images
                        : [selectedProductInspect.imageUrl];
                      return (
                        <>
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={modalImageIndex}
                              src={mImages[modalImageIndex]}
                              alt={`${selectedProductInspect.title} - фото ${modalImageIndex + 1}`}
                              referrerPolicy="no-referrer"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.65 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </AnimatePresence>

                          {mImages.length > 1 && (
                            <>
                              <button
                                onClick={() => setModalImageIndex((prev) => (prev - 1 + mImages.length) % mImages.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 shadow-md transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setModalImageIndex((prev) => (prev + 1) % mImages.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 shadow-md transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
                                {mImages.map((_, idx) => (
                                  <span
                                    key={idx}
                                    onClick={() => setModalImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                                      modalImageIndex === idx ? 'w-5 bg-emerald-400' : 'bg-white/50 hover:bg-white'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                    <div className="relative z-10 flex justify-between items-center">
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
                      Рассчитать стоимость для этой продукции
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
