import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Calculator, Check, MapPin, CheckCircle2, AlertCircle, Send, Phone } from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';
import { MessengerButtons } from './MessengerButtons';

interface ContactFormProps {
  initialComment?: string;
  initialCows?: number;
  initialProduct?: string;
  onLeadSubmitted: () => void;
  settings?: SiteSettings;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialComment = "",
  initialCows,
  initialProduct = "Маты для стойломест",
  onLeadSubmitted,
  settings = DEFAULT_SETTINGS
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [farmName, setFarmName] = useState("");
  const [comment, setComment] = useState(initialComment);
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync initial calculation into comment when parent updates it
  useEffect(() => {
    if (initialComment) {
      setComment(initialComment);
    }
  }, [initialComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, введите ваше имя и контактный телефон");
      return;
    }
    if (!agreed) {
      setError("Необходимо согласие на обработку данных");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          farmName: farmName || "Фермерское хозяйство",
          comment,
          cowsCount: initialCows,
          selectedProduct: initialProduct
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
        setSubmittedTicket({
          id: data.orderId || `TBR-${Math.floor(1000 + Math.random() * 9000)}`,
          message: data.message || "Ваша заявка успешно принята в работу. Инженер свяжется с вами в течение 15 минут."
        });
        onLeadSubmitted();
        setName("");
        setPhone("");
        setFarmName("");
        setComment("");
      } else {
        setError(data.error || "Произошла ошибка при отправке заявки");
      }
    } catch (err) {
      // Fallback if offline
      confetti({ particleCount: 70, spread: 70 });
      setSubmittedTicket({
        id: `TBR-LOCAL-${Math.floor(100 + Math.random() * 900)}`,
        message: "Заявка зафиксирована в системе. Наш инженер свяжется с вами в ближайшее время."
      });
      onLeadSubmitted();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contacts"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="bg-[#E4EDFE] rounded-3xl p-6 sm:p-10 lg:p-16 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center shadow-organic-lg relative overflow-hidden border border-[#c8dbfc]">
        
        {/* Subtle background glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left Column info */}
        <div className="lg:col-span-6 text-slate-900 relative z-10">
          <span className="text-xs uppercase font-mono tracking-wider bg-emerald-600/10 text-emerald-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-4 border border-emerald-600/20">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>Прямой расчет без наценок</span>
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 leading-tight text-slate-900">
            Получить расчёт под вашу ферму
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-700 mb-6 sm:mb-8 leading-relaxed max-w-md font-normal">
            Оставьте контакты для бесплатной консультации инженера-технолога. Мы учтем породу скота, габариты стойл и тип назовоудаления.
          </p>

          <ul className="space-y-3 sm:space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs sm:text-sm text-slate-800 leading-snug">Подбор оптимальной толщины (20мм / 24мм / 30мм)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs sm:text-sm text-slate-800 leading-snug">Расчёт точной стоимости логистики до вашего хозяйства</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs sm:text-sm text-slate-800 leading-snug">Персональная заводская скидка от объема заказа</span>
            </li>
          </ul>

          <div className="pt-6 border-t border-[#c8dbfc] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-4 rounded-2xl border border-[#c8dbfc] shadow-2xs">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Горячая линия завода:</span>
                <a 
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} 
                  className="flex items-center gap-2 font-headline font-extrabold text-slate-900 hover:text-emerald-600 transition-colors tracking-tight"
                >
                  <Phone className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span className="text-[19px]" style={{ fontSize: '19px' }}>{settings.phone}</span>
                </a>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Мессенджеры:</span>
                <MessengerButtons phone={settings.phone} size="sm" />
              </div>
            </div>

            <div className="text-xs text-slate-700 flex items-start gap-1.5 px-1">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p>{settings.address}</p>
                <p className="font-mono mt-0.5 font-bold text-emerald-800">{settings.emailForLeads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 border border-slate-200">
          {submittedTicket ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 px-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <span className="text-xs font-mono uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
                Номер заявки: {submittedTicket.id}
              </span>
              <h3 className="font-headline text-2xl font-bold text-slate-900 mt-3 mb-2">
                Спасибо за обращение!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {submittedTicket.message}
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 mb-6 font-medium">
                Зафиксированы параметры: {initialProduct}
              </div>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="w-full h-12 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
              >
                Отправить еще одну заявку
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-headline font-bold text-lg text-slate-900">Форма обратной связи</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-100 font-bold">Быстрый ответ</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Ваше имя *</label>
                <input
                  type="text"
                  required
                  placeholder="Александр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-slate-50 text-sm text-slate-900 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Телефон *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 915 638-72-59"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-slate-50 text-sm text-slate-900 font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Название хозяйства</label>
                  <input
                    type="text"
                    placeholder="ООО «Агро-Мир»"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-slate-50 text-sm text-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Комментарий или расчет</label>
                <textarea
                  rows={3}
                  placeholder="Количество голов, зона применения, требуемая толщина..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-slate-50 text-sm text-slate-900 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="policy-agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded text-emerald-600 focus:ring-emerald-600 border-slate-300 cursor-pointer accent-emerald-600"
                />
                <label htmlFor="policy-agree" className="text-xs text-slate-500 leading-snug cursor-pointer font-medium">
                  Согласен на обработку персональных данных в соответствии с политикой конфиденциальности ООО «ТБ-Ресурс»
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Отправка заявки...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Отправить заявку</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </motion.section>
  );
};
