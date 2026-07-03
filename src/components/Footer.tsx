import React from 'react';
import { ShieldCheck, Mail, MapPin, Clock, Phone } from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';
import { MessengerButtons } from './MessengerButtons';
import { TbResursLogoSvg } from './TbResursLogoSvg';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings = DEFAULT_SETTINGS }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <footer className="bg-slate-950 text-white py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-10">
        
        <div className="md:col-span-5">
          <div className="flex items-center mb-5">
            <img src={settings.logoUrl || "/assets/images/logo.png"} alt={settings.logoText || "ТБ-Ресурс"} className="h-11 w-auto object-contain max-w-[220px] bg-white/10 p-1.5 rounded-xl" />
          </div>
          <p className="text-xs text-slate-400 mb-6 max-w-sm leading-relaxed font-normal">
            {settings.footerDescription || "Специализированный завод резинотехнических изделий для сельского хозяйства. Прямые поставки вулканизированных матов для КРС из Республики Татарстан по всей России и странам СНГ."}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Гарантия 5 лет</span>
            </span>
            <span>•</span>
            <span>ГОСТ Р 16338</span>
          </div>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-headline font-bold text-lg text-white mb-3">Контакты завода</h4>
          <div className="space-y-3.5 text-sm">
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 font-headline text-2xl font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors">
              <Phone className="w-5 h-5 animate-pulse" />
              <span>{settings.phone}</span>
            </a>
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Связаться в мессенджерах:</span>
              <MessengerButtons phone={settings.phone} size="sm" layout="wrap" />
            </div>
            <p className="text-xs text-slate-400 font-normal flex items-center gap-2 pt-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{settings.emailForLeads}</span>
            </p>
            <p className="text-xs text-slate-400 font-normal flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="text-xs text-slate-400 font-normal flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Режим работы: {settings.workHours}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-headline font-bold text-lg text-white mb-4">Навигация</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li><a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="hover:text-white transition-colors cursor-pointer">Виды продукции</a></li>
            <li><a href="#applications" onClick={(e) => handleNavClick(e, 'applications')} className="hover:text-white transition-colors cursor-pointer">Зоны применения</a></li>
            <li><a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-white transition-colors cursor-pointer">Преимущества и гарантия</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white transition-colors cursor-pointer">О заводе</a></li>
            <li><a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-white transition-colors cursor-pointer">Частые вопросы</a></li>
            <li><a href="#contacts" onClick={(e) => handleNavClick(e, 'contacts')} className="hover:text-white transition-colors cursor-pointer">Запросить расчет КП</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} ООО «ТБ-Ресурс» (AgroRubber Industrial Manufacturing). Все права защищены.</p>
        <p>Официальный сайт производителя покрытий для КРС</p>
      </div>
    </footer>
  );
};
