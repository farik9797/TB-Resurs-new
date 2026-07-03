import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_DATA } from '../data';
import { FaqItem } from '../types';
import { HelpCircle, ChevronDown, Wrench, ShieldCheck, Sparkles, MessageCircleQuestion } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>("все");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaq = selectedCategory === "все"
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (cat: FaqItem["category"]) => {
    switch (cat) {
      case "монтаж":
        return <Wrench className="w-3.5 h-3.5 text-emerald-600" />;
      case "эксплуатация":
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
      case "долговечность":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white py-20 px-4 md:px-8 border-t border-slate-200 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-100">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>База знаний ТБ-Ресурс</span>
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Часто задаваемые вопросы
          </h2>
          <p className="text-slate-600 text-base mt-4 leading-relaxed font-normal">
            Ответы главного технолога завода на ключевые вопросы по укладке, уходу и сроку службы вулканизированных покрытий.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {[
            { id: "все", label: "Все вопросы" },
            { id: "монтаж", label: "Укладка и монтаж" },
            { id: "эксплуатация", label: "Уход и гигиена" },
            { id: "долговечность", label: "Гарантия и износ" }
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaq.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07, ease: "easeOut" }}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-emerald-50/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                    : "bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </span>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                        Категория: {item.category}
                      </span>
                      <h3 className="font-headline font-bold text-base sm:text-lg text-slate-900 leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-emerald-600 text-white rotate-180" : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-0 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-emerald-200/50 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-12 p-6 bg-slate-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <MessageCircleQuestion className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg">Не нашли ответ на свой вопрос?</h4>
              <p className="text-xs text-slate-300 mt-0.5">Свяжитесь напрямую с главным инженером завода для индивидуальной консультации</p>
            </div>
          </div>
          <a
            href="tel:+79156387259"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all whitespace-nowrap"
          >
            Задать вопрос инженеру
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};
