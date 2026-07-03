import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';
import { Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MessengerButtons } from './MessengerButtons';

interface TopNavbarProps {
  onOpenLeadsDrawer?: () => void;
  onOpenLeadPopup?: () => void;
  settings?: SiteSettings;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenLeadsDrawer,
  onOpenLeadPopup,
  settings = DEFAULT_SETTINGS
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

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

  const navItems = [
    { id: 'products', label: 'Продукция' },
    { id: 'applications', label: 'Зоны фермы' },
    { id: 'features', label: 'Преимущества' },
    { id: 'about', label: 'О заводе' },
    { id: 'faq', label: 'Вопросы' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 nav-blur border-b border-slate-200 shadow-sm transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto h-[86px]">
        {/* Logo & Direct Manufacturer Badge */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.logoText || "ТБ-Ресурс"} className="h-10 w-auto object-contain max-w-[120px]" />
            ) : (
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                {(settings.logoText || "ТБ").slice(0, 2)}
              </div>
            )}
            <div>
              <span className="font-headline font-bold text-xl md:text-2xl text-emerald-600 block leading-none">
                {settings.logoText || "ТБ-Ресурс"}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {settings.logoSubtitle || "Завод в Татарстане"}
              </span>
            </div>
          </a>

          <nav className="hidden xl:flex gap-5 items-center text-sm font-medium ml-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-slate-700 hover:text-emerald-600 transition-all font-bold cursor-pointer py-1 relative group text-xs sm:text-sm"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>

        {/* Right Actions: Phone + Messengers + CTA */}
        <div className="flex items-center gap-3.5">
          {/* Phone & Messenger Buttons */}
          <div className="hidden md:flex flex-col items-end">
            <a 
              href={`tel:${cleanPhone}`} 
              className="flex items-center gap-1.5 font-headline text-base lg:text-lg font-extrabold text-slate-900 hover:text-emerald-600 transition-colors tracking-tight"
            >
              <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{settings.phone}</span>
            </a>
            <MessengerButtons phone={settings.phone} size="sm" showLabels={false} className="mt-1" />
          </div>

          <button
            onClick={() => {
              if (onOpenLeadPopup) {
                onOpenLeadPopup();
              } else {
                const el = document.getElementById("contacts");
                if (el) {
                  const headerOffset = 85;
                  const elementPosition = el.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }
            }}
            className="hidden sm:flex bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer items-center gap-2 border border-emerald-400/30"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Оставить заявку</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden bg-white border-t border-slate-200 overflow-hidden shadow-xl"
          >
            <div className="px-5 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-100">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="block px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/60 flex flex-col items-center text-center gap-3">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Прямой телефон и мессенджеры завода</span>
                <a 
                  href={`tel:${cleanPhone}`} 
                  className="flex items-center gap-2 font-headline text-2xl font-extrabold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  <Phone className="w-5 h-5 text-emerald-600 animate-bounce" />
                  <span>{settings.phone}</span>
                </a>
                <MessengerButtons phone={settings.phone} size="md" layout="wrap" className="justify-center" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

