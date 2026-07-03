import React from 'react';
import { ShieldCheck, Mail, MapPin, Clock } from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings = DEFAULT_SETTINGS }) => {
  return (
    <footer className="bg-slate-950 text-white py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-10">
        
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/25">
              ТБ
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight">ТБ-Ресурс</span>
          </div>
          <p className="text-xs text-slate-400 mb-6 max-w-sm leading-relaxed font-normal">
            Специализированный завод резинотехнических изделий для сельского хозяйства. Прямые поставки вулканизированных матов для КРС из Республики Татарстан по всей России и странам СНГ.
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
          <h4 className="font-headline font-bold text-lg text-white mb-4">Контакты завода</h4>
          <div className="space-y-3 text-sm">
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="block font-headline text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              {settings.phone}
            </a>
            <p className="text-xs text-slate-400 font-normal flex items-center gap-2">
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
            <li><a href="#applications" className="hover:text-white transition-colors">Зоны применения</a></li>
            <li><a href="#products" className="hover:text-white transition-colors">Виды продукции</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Преимущества и гарантия</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">ГОСТ и сертификаты</a></li>
            <li><a href="#contacts" className="hover:text-white transition-colors">Запросить расчет КП</a></li>
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
