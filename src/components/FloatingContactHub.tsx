import React, { useState } from 'react';
import { Phone, MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MessengerButtons } from './MessengerButtons';

interface FloatingContactHubProps {
  phone: string;
  onOpenLeadForm: () => void;
}

export const FloatingContactHub: React.FC<FloatingContactHubProps> = ({
  phone,
  onOpenLeadForm
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-700 w-[290px] sm:w-[320px]"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="font-headline font-bold text-sm text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Связь с отделом продаж
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] text-slate-400 block mb-1">Прямой звонок инженеру:</span>
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 p-3 rounded-2xl font-headline text-lg font-extrabold text-emerald-300 transition-all"
              >
                <Phone className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span>{phone}</span>
              </a>
            </div>

            <div className="mb-4">
              <span className="text-[11px] text-slate-400 block mb-2">Быстрый чат в мессенджерах:</span>
              <MessengerButtons phone={phone} size="md" layout="col" />
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenLeadForm();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Запросить расчет в 1 клик</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-slate-900/50 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border-2 border-emerald-500/40 cursor-pointer"
          title="Связаться в мессенджерах"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-extrabold">Мессенджеры & Звонок</span>
        </button>
      </div>
    </div>
  );
};
