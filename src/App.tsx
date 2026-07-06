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
import { FloatingContactHub } from './components/FloatingContactHub';
import { SiteSettings, Product } from './types';
import { DEFAULT_SETTINGS, PRODUCTS_DATA } from './data';
import { loadFromIDB } from './lib/idbStorage';

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
        if (!parsed.logoUrl) {
          parsed.logoUrl = "/assets/images/logo.png";
        }
        if (parsed.heroImageUrl?.includes("1516467508483")) {
          parsed.heroImageUrl = DEFAULT_SETTINGS.heroImageUrl;
        }
        if (parsed.phone?.includes("800") || parsed.phone?.includes("555")) {
          parsed.phone = DEFAULT_SETTINGS.phone;
          if (parsed.telegramForLeads?.includes("tbresurs_bot")) {
            parsed.telegramForLeads = DEFAULT_SETTINGS.telegramForLeads;
          }
        }
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  const syncProductSlides = (prods: Product[]): Product[] => {
    if (!Array.isArray(prods) || prods.length === 0) return PRODUCTS_DATA;
    const synced = prods.map(p => {
      if (p.id === "stalls-mat" || p.id === "corridor-mat") {
        const defProd = PRODUCTS_DATA.find(dp => dp.id === p.id);
        if (defProd) {
          return {
            ...p,
            imageUrl: defProd.imageUrl,
            images: defProd.images
          };
        }
      }
      return p;
    });
    const defaultOrder = PRODUCTS_DATA.map(p => p.id);
    return synced.sort((a, b) => {
      const idxA = defaultOrder.indexOf(a.id);
      const idxB = defaultOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB;
      }
      return 0;
    });
  };

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("tb_resurs_products_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return syncProductSlides(parsed);
      }
    } catch (e) {}
    return PRODUCTS_DATA;
  });

  // State to pass preselected product or calculation to Contact Form
  const [formComment, setFormComment] = useState<string>("");
  const [formCows, setFormCows] = useState<number | undefined>(undefined);
  const [formProduct, setFormProduct] = useState<string>("Плиты резиновые для стойломест");

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
      const idbSettings = await loadFromIDB<SiteSettings>("tb_resurs_settings");
      if (idbSettings && idbSettings.logoUrl) {
        setSettings(idbSettings);
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.settings) {
          const s = json.settings;
          if (s.heroImageUrl?.includes("1516467508483")) {
            s.heroImageUrl = DEFAULT_SETTINGS.heroImageUrl;
          }
          if (s.phone?.includes("800") || s.phone?.includes("555")) {
            s.phone = DEFAULT_SETTINGS.phone;
            if (s.telegramForLeads?.includes("tbresurs_bot")) {
              s.telegramForLeads = DEFAULT_SETTINGS.telegramForLeads;
            }
          }
          // Check if local storage or IndexedDB has custom saved changes (like customized logoUrl or phone)
          const localStr = localStorage.getItem("tb_resurs_settings");
          const localSettings = localStr ? JSON.parse(localStr) : null;
          const idbSettings = await loadFromIDB<SiteSettings>("tb_resurs_settings");
          
          const combined = {
            ...s,
            ...(localSettings || {}),
            ...(idbSettings || {})
          };
          if (!combined.logoUrl) {
            combined.logoUrl = "/assets/images/logo.png";
          }
          setSettings(combined);
          localStorage.setItem("tb_resurs_settings", JSON.stringify(combined));
        }
      }
    } catch (e) {
      // Backend offline or static host, rely on localStorage / IDB
    }
  };

  const fetchProducts = async () => {
    try {
      const idbProducts = await loadFromIDB<Product[]>("tb_resurs_products_v2");
      if (idbProducts && Array.isArray(idbProducts) && idbProducts.length > 0) {
        setProducts(syncProductSlides(idbProducts));
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.products) && json.products.length > 0) {
          const isOldFormat = json.products.some((p: any) => p.title?.includes("Маты для стойломест"));
          if (!isOldFormat) {
            const localStr = localStorage.getItem("tb_resurs_products_v2");
            const localProducts = localStr ? JSON.parse(localStr) : null;
            const idbProducts = await loadFromIDB<Product[]>("tb_resurs_products_v2");
            
            // Prefer IDB / localStorage if they exist
            const rawBest = (idbProducts && idbProducts.length > 0) 
              ? idbProducts 
              : ((localProducts && localProducts.length > 0) ? localProducts : json.products);

            const bestProducts = syncProductSlides(rawBest);
            setProducts(bestProducts);
            localStorage.setItem("tb_resurs_products_v2", JSON.stringify(bestProducts));
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLeadsCount();
    fetchSettings();
    fetchProducts();
  }, []);

  // Hide admin panel from search engine robots and indexing
  useEffect(() => {
    const isAdmin = currentRoute === '/admin-panel' || currentRoute.startsWith('/admin');
    let metaRobots = document.querySelector('meta[name="robots"]');
    let metaGoogle = document.querySelector('meta[name="googlebot"]');

    if (isAdmin) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');

      if (!metaGoogle) {
        metaGoogle = document.createElement('meta');
        metaGoogle.setAttribute('name', 'googlebot');
        document.head.appendChild(metaGoogle);
      }
      metaGoogle.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    } else {
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
      if (metaGoogle) {
        metaGoogle.remove();
      }
    }
  }, [currentRoute]);

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
        products={products}
        onSaveProducts={(newProducts) => setProducts(newProducts)}
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

        <ProductCatalog
          onSelectProductForQuote={handleSelectProductForQuote}
          settings={settings}
          products={products}
        />

        <InteractiveFarmMap
          onSelectZoneForForm={handleSelectZoneForForm}
          settings={settings}
        />

        <StatsCounter />

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

      {/* Floating Messenger & Phone Hub (Left) */}
      <FloatingContactHub
        phone={settings.phone}
        onOpenLeadForm={() => {
          setPopupProduct("Быстрый расчет с сайта");
          setIsLeadPopupOpen(true);
        }}
      />

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

