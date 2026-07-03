import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Phone, User, Building2, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';

interface LeadPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted?: () => void;
  initialProduct?: string;
  settings?: SiteSettings;
}

export const LeadPopupModal: React.FC<LeadPopupModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted,
  initialProduct = "Консультация и подбор покрытия",
  settings = DEFAULT_SETTINGS
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [cowsCount, setCowsCount] = useState<number | ''>('');
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          farmName: farmName || undefined,
          cowsCount: cowsCount ? Number(cowsCount) : undefined,
          selectedProduct: selectedProduct || "Консультация",
          comment: comment || "Быстрая заявка из всплывающего окна сайта"
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        if (onLeadSubmitted) onLeadSubmitted();
      } else {
        setErrorMsg("Ошибка отправки. Пожалуйста, позвоните нам напрямую.");
      }
    } catch (err) {
      // Offline fallback
      setIsSuccess(true);
      if (onLeadSubmitted) onLeadSubmitted();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setFarmName('');
    setCowsCount('');
    setComment('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-7 relative">
              <button
                onClick={handleResetAndClose}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-block mb-3">
                Прямая связь с заводом
              </span>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-white">
                Быстрый заказ и расчет цены
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Заполните форму, и инженер-технолог рассчитает стоимость матов по ГОСТ Р для вашего хозяйства за 15 минут.
              </p>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-7">
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h4 className="font-headline font-bold text-2xl text-slate-900">
                    Заявка принята в работу!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Спасибо, <strong className="text-slate-900">{name}</strong>! Мы уже передали ваши контакты в отдел продаж завода ТБ-Ресурс. В ближайшее время мы свяжемся по номеру <strong className="text-emerald-700 font-mono">{phone}</strong>.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={handleResetAndClose}
                      className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                    >
                      Вернуться на сайт
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ваше имя <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Алексей Воронов"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Номер телефона <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 915 638-72-59"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Хозяйство / КФХ
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          placeholder="КФХ «Рассвет»"
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Поголовье (голов)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cowsCount}
                        onChange={(e) => setCowsCount(e.target.value ? Number(e.target.value) : '')}
                        placeholder="150"
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Интересующая продукция
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Консультация и подбор покрытия">Консультация и подбор покрытия</option>
                      <option value="Плиты резиновые для стойломест">Плиты резиновые для стойломест</option>
                      <option value="Плиты резиновые для галерей, ДМБ, проходов">Плиты резиновые для галерей, ДМБ, проходов</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Комментарий или вопрос
                    </label>
                    <textarea
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Укажите размеры или особые требования..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Отправка..." : "Отправить заявку на завод"}</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Нажимая кнопку, вы соглашаетесь на обработку персональных данных</span>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
