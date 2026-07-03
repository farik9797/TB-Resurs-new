import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { HeroSection } from './components/HeroSection';
import { TrustBar } from './components/TrustBar';
import { StatsCounter } from './components/StatsCounter';
import { InteractiveFarmMap } from './components/InteractiveFarmMap';
import { ProductCatalog } from './components/ProductCatalog';
import { BentoFeatures } from './components/BentoFeatures';
import { AboutAndDocs } from './components/AboutAndDocs';
import { FAQSection } from './components/FAQSection';
import { WorkProcess } from './components/WorkProcess';
import { ContactForm } from './components/ContactForm';
import { AdminLeadsDrawer } from './components/AdminLeadsDrawer';
import { AdminPanelPage } from './components/AdminPanelPage';
import { LeadPopupModal } from './components/LeadPopupModal';
import { Footer } from './components/Footer';
import { SiteSettings } from './types';
import { DEFAULT_SETTINGS } from './data';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  const [leadsCount, setLeadsCount] = useState<number>(1);
  const [isLeadsDrawerOpen, setIsLeadsDrawerOpen] = useState<boolean>(false);
  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState<boolean>(false);
  const [popupProduct, setPopupProduct] = useState<string>("Консультация и подбор покрытия");

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  
  // Settings state (hydrated from localStorage or API)
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem("tb_resurs_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.heroImageUrl?.includes("1516467508483")) {
          parsed.heroImageUrl = DEFAULT_SETTINGS.heroImageUrl;
        }
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  // State to pass preselected product or calculation to Contact Form
  const [formComment, setFormComment] = useState<string>("");
  const [formCows, setFormCows] = useState<number | undefined>(undefined);
  const [formProduct, setFormProduct] = useState<string>("Маты для стойломест «Комфорт-Плюс»");

  const fetchLeadsCount = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.leads) {
          setLeadsCount(json.leads.length);
        }
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.settings) {
          const s = json.settings;
          if (s.heroImageUrl?.includes("1516467508483")) {
            s.heroImageUrl = DEFAULT_SETTINGS.heroImageUrl;
          }
          setSettings(s);
          localStorage.setItem("tb_resurs_settings", JSON.stringify(s));
        }
      }
    } catch (e) {
      // Backend offline or static host, rely on localStorage
    }
  };

  useEffect(() => {
    fetchLeadsCount();
    fetchSettings();
  }, []);

  // Dynamically inject SEO codes and update document title whenever settings change
  useEffect(() => {
    if (settings.heroTitle) {
      document.title = `${settings.heroTitle} | Официальный сайт`;
    }

    // Google Search Console meta tag
    if (settings.googleSearchConsole) {
      let metaGsc = document.querySelector('meta[name="google-site-verification"]');
      if (!metaGsc) {
        metaGsc = document.createElement('meta');
        metaGsc.setAttribute('name', 'google-site-verification');
        document.head.appendChild(metaGsc);
      }
      metaGsc.setAttribute('content', settings.googleSearchConsole);
    }

    // Yandex Webmaster meta tag
    if (settings.yandexWebmaster) {
      let metaYw = document.querySelector('meta[name="yandex-verification"]');
      if (!metaYw) {
        metaYw = document.createElement('meta');
        metaYw.setAttribute('name', 'yandex-verification');
        document.head.appendChild(metaYw);
      }
      metaYw.setAttribute('content', settings.yandexWebmaster);
    }

    // Yandex Metrika injection
    if (settings.yandexMetrikaId) {
      const ymScriptId = 'ym-tracker-script';
      if (!document.getElementById(ymScriptId)) {
        const s = document.createElement('script');
        s.id = ymScriptId;
        s.type = 'text/javascript';
        s.async = true;
        s.innerHTML = `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${settings.yandexMetrikaId}, "init", {
               clickmap:true,
               trackLinks:true,
               accurateTrackBounce:true,
               webvisor:true
          });
        `;
        document.head.appendChild(s);
      }
    }

    // Custom head script injection
    if (settings.customHeadScript && settings.customHeadScript.trim()) {
      const customScriptId = 'custom-head-script';
      let oldEl = document.getElementById(customScriptId);
      if (oldEl) oldEl.remove();
      const div = document.createElement('div');
      div.id = customScriptId;
      div.innerHTML = settings.customHeadScript;
      document.body.appendChild(div);
    }
  }, [settings]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleSelectZoneForForm = (zoneName: string) => {
    setFormProduct(zoneName);
    setFormComment(`Интересует покрытие для зоны: ${zoneName}. Прошу рассчитать КП и параметры монтажа.`);
    setPopupProduct(zoneName);
    setIsLeadPopupOpen(true);
  };

  const handleSelectProductForQuote = (productName: string) => {
    setFormProduct(productName);
    setFormComment(`Запрос цены и наличия на складскую позицию: ${productName}.`);
    setPopupProduct(productName);
    setIsLeadPopupOpen(true);
  };

  if (currentRoute === '/admin-panel' || currentRoute.startsWith('/admin')) {
    return (
      <AdminPanelPage
        onBackToSite={() => {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <TopNavbar
        onOpenLeadsDrawer={() => setIsLeadsDrawerOpen(true)}
        onOpenLeadPopup={() => {
          setPopupProduct("Консультация и расчет цены");
          setIsLeadPopupOpen(true);
        }}
        settings={settings}
      />

      <main>
        <HeroSection
          onScrollToProducts={() => scrollToSection("products")}
          onScrollToForm={() => {
            setPopupProduct("Консультация по матам ГОСТ Р");
            setIsLeadPopupOpen(true);
          }}
          settings={settings}
        />

        <TrustBar />

        <InteractiveFarmMap
          onSelectZoneForForm={handleSelectZoneForForm}
          settings={settings}
        />

        <StatsCounter />

        <ProductCatalog
          onSelectProductForQuote={handleSelectProductForQuote}
          settings={settings}
        />

        <BentoFeatures />

        <AboutAndDocs settings={settings} />

        <FAQSection settings={settings} />

        <WorkProcess />

        <ContactForm
          initialComment={formComment}
          initialCows={formCows}
          initialProduct={formProduct}
          onLeadSubmitted={fetchLeadsCount}
          settings={settings}
        />
      </main>

      <Footer settings={settings} />

      {/* Floating Action Button for lead generation */}
      <button
        onClick={() => {
          setPopupProduct("Быстрый расчет с сайта");
          setIsLeadPopupOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border-2 border-white/20 cursor-pointer"
        title="Быстрый расчет цены"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
        <span className="text-sm">Оставить заявку</span>
      </button>

      <LeadPopupModal
        isOpen={isLeadPopupOpen}
        onClose={() => setIsLeadPopupOpen(false)}
        onLeadSubmitted={() => {
          fetchLeadsCount();
        }}
        initialProduct={popupProduct}
        settings={settings}
      />

      <AdminLeadsDrawer
        isOpen={isLeadsDrawerOpen}
        onClose={() => setIsLeadsDrawerOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}

