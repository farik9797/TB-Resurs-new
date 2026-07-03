import React from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';
import { Phone } from 'lucide-react';

interface TopNavbarProps {
  onOpenLeadsDrawer?: () => void;
  settings?: SiteSettings;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenLeadsDrawer,
  settings = DEFAULT_SETTINGS
}) => {
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const tgLink = settings.telegramForLeads?.startsWith('@')
    ? `https://t.me/${settings.telegramForLeads.slice(1)}`
    : settings.telegramForLeads?.startsWith('http')
    ? settings.telegramForLeads
    : `https://t.me/${cleanPhone}`;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 nav-blur border-b border-slate-200 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto h-[80px]">
        {/* Logo & Direct Manufacturer Badge */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
              ТБ
            </div>
            <div>
              <span className="font-headline font-bold text-xl md:text-2xl text-emerald-600 block leading-none">
                ТБ-Ресурс
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Завод в Татарстане
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex gap-6 items-center text-sm font-medium ml-4">
            <a href="#applications" className="text-slate-600 hover:text-emerald-600 transition-colors font-semibold">Зоны фермы</a>
            <a href="#products" className="text-slate-600 hover:text-emerald-600 transition-colors font-semibold">Продукция</a>
            <a href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors font-semibold">Преимущества</a>
            <a href="#about" className="text-slate-600 hover:text-emerald-600 transition-colors font-semibold">ГОСТ</a>
            <a href="#faq" className="text-slate-600 hover:text-emerald-600 transition-colors font-semibold">Вопросы</a>
            <a href="#contacts" className="text-slate-600 hover:text-emerald-600 transition-colors font-semibold">Контакты</a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Contact & CTA */}
          <div className="hidden md:flex flex-col items-end">
            <a href={`tel:${cleanPhone}`} className="font-headline text-sm lg:text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors">
              {settings.phone}
            </a>
            <div className="flex gap-2">
              <a href={tgLink} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-600 font-semibold hover:underline">Telegram</a>
              <span className="text-slate-300">|</span>
              <a href={`https://wa.me/${cleanPhone.replace('+', '')}`} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-600 font-semibold hover:underline">WhatsApp</a>
            </div>
          </div>

          <a
            href="#contacts"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            Рассчитать цену
          </a>
        </div>
      </div>
    </header>
  );
};

