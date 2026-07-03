import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeadItem, SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data';
import { 
  X, RefreshCw, Building2, Download, FileSpreadsheet, 
  Settings, Phone, Mail, MapPin, Clock, Send, Image, 
  FileText, BarChart3, Globe, Code, Check, Save, Inbox, LayoutTemplate 
} from 'lucide-react';

interface AdminLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
  onSaveSettings?: (newSettings: SiteSettings) => void;
}

export const AdminLeadsDrawer: React.FC<AdminLeadsDrawerProps> = ({
  isOpen,
  onClose,
  settings = DEFAULT_SETTINGS,
  onSaveSettings
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts' | 'content' | 'seo'>('leads');
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<any>(null);

  // Form State for settings editor
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [leadsRes, healthRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/health")
      ]);
      if (leadsRes.ok) {
        const leadsJson = await leadsRes.json();
        if (leadsJson.success) setLeads(leadsJson.leads);
      }
      if (healthRes.ok) {
        const healthJson = await healthRes.json();
        setServerHealth(healthJson);
      }
    } catch (e) {
      console.warn("Could not fetch from Express API");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const csvHeader = "ID,Дата,Имя,Телефон,Хозяйство,Голов,Продукт,Комментарий,Статус\n";
    const csvRows = leads.map(l => {
      const escape = (str?: string | number) => `"${String(str || "").replace(/"/g, '""')}"`;
      return [
        escape(l.id),
        escape(new Date(l.createdAt).toLocaleString("ru-RU")),
        escape(l.name),
        escape(l.phone),
        escape(l.farmName),
        escape(l.cowsCount || ""),
        escape(l.selectedProduct),
        escape(l.comment),
        escape(l.status)
      ].join(",");
    }).join("\n");

    const blob = new Blob(["\uFEFF" + csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tb_resurs_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Save locally as immediate fallback/sync
      localStorage.setItem("tb_resurs_settings", JSON.stringify(formData));
      
      // Save to Express API server if running
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } catch (err) {
        // Backend offline or static hosting
      }

      if (onSaveSettings) {
        onSaveSettings(formData);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200"
          >
            {/* Drawer Header */}
            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-xs text-emerald-300 uppercase font-bold tracking-wider">
                    CMS & Панель управления ТБ-Ресурс
                  </span>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold mt-1">
                  Управление сайтом и заявки
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer self-end sm:self-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 text-xs sm:text-sm font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Заявки ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeTab === 'contacts'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Контакты и Почта</span>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutTemplate className="w-4 h-4" />
                <span>Тексты и Картинки</span>
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeTab === 'seo'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Метрика и SEO</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  {serverHealth && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                      <div>
                        <span className="text-slate-500 block font-medium">Сервер приема:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                          <span>В сети (Express API)</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Аптайм сервера:</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{Math.floor((serverHealth.uptime || 0)/60)} мин.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-headline font-bold text-lg text-slate-900">
                      Поступившие обращения ({leads.length})
                    </h4>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportCSV}
                        disabled={leads.length === 0}
                        title="Скачать базу заявок в формате Excel / CSV"
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>В Excel (CSV)</span>
                      </button>
                      <button
                        onClick={fetchLeads}
                        className="text-xs text-slate-600 hover:text-emerald-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Обновить</span>
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-12 text-slate-500">
                      <span className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
                      <p className="text-xs font-medium">Загрузка списка заявок...</p>
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-sm text-slate-600 font-medium">Пока нет новых заявок.</p>
                      <p className="text-xs text-slate-500 mt-1">Отправьте тестовую форму на сайте!</p>
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 hover:border-emerald-600 transition-colors shadow-2xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                              {lead.id}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-2 font-mono font-medium">
                              {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {lead.status === "new" ? "Новая" : "В обработке"}
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-slate-900 text-base">{lead.name}</h5>
                          <a href={`tel:${lead.phone}`} className="font-mono text-sm font-bold text-emerald-600 hover:underline">
                            {lead.phone}
                          </a>
                        </div>

                        {lead.farmName && (
                          <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{lead.farmName}</span>
                          </p>
                        )}

                        <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-900 shadow-2xs">
                          <span className="font-bold block text-slate-500 text-[11px] uppercase mb-1">Продукт:</span>
                          {lead.selectedProduct}
                          {lead.comment && <p className="mt-1.5 text-slate-600 italic border-t border-slate-100 pt-1.5">"{lead.comment}"</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'contacts' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs">
                    💡 Эти контактные данные отображаются в шапке сайта, подвале, формах связи и используются для приема новых обращений.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>E-mail для приема новых заявок и уведомлений</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.emailForLeads}
                      onChange={e => setFormData({ ...formData, emailForLeads: e.target.value })}
                      placeholder="leads@tb-resurs.ru"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Главный номер телефона</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 915 638-72-59"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Telegram бот / менеджер</span>
                      </label>
                      <input
                        type="text"
                        value={formData.telegramForLeads || ""}
                        onChange={e => setFormData({ ...formData, telegramForLeads: e.target.value })}
                        placeholder="@tbresurs_bot"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Адрес завода / склада</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Республика Татарстан, Кукморский р-н, ул. Заводская, 12"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Часы работы отдела продаж</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.workHours}
                      onChange={e => setFormData({ ...formData, workHours: e.target.value })}
                      placeholder="Пн-Пт с 08:00 до 17:00 (МСК)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Контакты обновлены!
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="ml-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Сохранение..." : "Сохранить контакты"}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'content' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 text-xs">
                    🎨 Редактируйте заголовки, подзаголовки и главное фоновое изображение лендинга. Изменения вступают в силу мгновенно.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Бейдж над главным заголовком (Hero Badge)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.heroBadge}
                      onChange={e => setFormData({ ...formData, heroBadge: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Главный заголовок сайта (H1)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.heroTitle}
                      onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Подзаголовок / Описание на главном экране</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.heroSubtitle}
                      onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-emerald-600" />
                      <span>URL главной фотографии (Hero Banner Image)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.heroImageUrl}
                      onChange={e => setFormData({ ...formData, heroImageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none font-mono"
                    />
                    {formData.heroImageUrl && (
                      <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={formData.heroImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Заголовок блока каталога продукции</span>
                    </label>
                    <input
                      type="text"
                      value={formData.catalogTitle}
                      onChange={e => setFormData({ ...formData, catalogTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Контент обновлен!
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="ml-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Сохранение..." : "Сохранить тексты"}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'seo' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs leading-relaxed">
                    📈 При указании ID Яндекс.Метрики и Google Analytics система автоматически встраивает официальный код отслеживания в <code>&lt;head&gt;</code> сайта.
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ID Яндекс.Метрики</span>
                      </label>
                      <input
                        type="text"
                        value={formData.yandexMetrikaId || ""}
                        onChange={e => setFormData({ ...formData, yandexMetrikaId: e.target.value })}
                        placeholder="Например: 98765432"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ID Google Analytics 4</span>
                      </label>
                      <input
                        type="text"
                        value={formData.googleAnalyticsId || ""}
                        onChange={e => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXX"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Google Search Console (Мета-тег)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.googleSearchConsole || ""}
                        onChange={e => setFormData({ ...formData, googleSearchConsole: e.target.value })}
                        placeholder="Код верификации google-site-verification"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Яндекс.Вебмастер (Мета-тег)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.yandexWebmaster || ""}
                        onChange={e => setFormData({ ...formData, yandexWebmaster: e.target.value })}
                        placeholder="Код верификации yandex-verification"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Пользовательские скрипты в &lt;head&gt; (Чат, Пиксель VK, Ройстат)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.customHeadScript || ""}
                      onChange={e => setFormData({ ...formData, customHeadScript: e.target.value })}
                      placeholder="<!-- Вставьте здесь HTML / JS скрипты -->"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Аналитика сохранена!
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="ml-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Сохранение..." : "Сохранить SEO и Метрику"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
              Все настройки автоматически синхронизируются с сервером и браузером.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
