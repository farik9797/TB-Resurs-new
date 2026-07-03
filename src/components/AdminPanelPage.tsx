import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeadItem, SiteSettings, AdminUser, Product, MediaItem } from '../types';
import { DEFAULT_SETTINGS, PRODUCTS_DATA, DEFAULT_MEDIA_LIBRARY } from '../data';
import { AdminProductsEditor } from './AdminProductsEditor';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { MediaGallery, type MediaGalleryProps } from './MediaGallery';
export { MediaGallery, type MediaGalleryProps };
import { saveMediaToIDB, loadMediaFromIDB, saveToIDB, loadFromIDB } from '../lib/idbStorage';
import { 
  Lock, User, Key, LogIn, LogOut, ArrowLeft, RefreshCw, Building2, 
  FileSpreadsheet, Phone, Mail, MapPin, Clock, Send, Image, FileText, 
  BarChart3, Globe, Code, Check, Save, Inbox, LayoutTemplate, Users, UserPlus, Trash2, ShieldAlert, Package, HardDrive
} from 'lucide-react';

interface AdminPanelPageProps {
  onBackToSite: () => void;
  settings?: SiteSettings;
  onSaveSettings?: (newSettings: SiteSettings) => void;
  products?: Product[];
  onSaveProducts?: (newProducts: Product[]) => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  onBackToSite,
  settings = DEFAULT_SETTINGS,
  onSaveSettings,
  products = PRODUCTS_DATA,
  onSaveProducts
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem("tb_resurs_auth_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Login form state
  const [loginInput, setLoginInput] = useState("admin");
  const [passwordInput, setPasswordInput] = useState("admin");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'media' | 'contacts' | 'branding' | 'content' | 'seo' | 'users'>('leads');
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem("tb_resurs_media");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_MEDIA_LIBRARY;
  });
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [serverHealth, setServerHealth] = useState<any>(null);

  // Products state
  const [productsList, setProductsList] = useState<Product[]>(products);

  // Settings editor state
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoPicker, setShowLogoPicker] = useState(false);

  // Add user form state
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"superadmin" | "manager">("manager");
  const [userAddError, setUserAddError] = useState("");
  const [userAddSuccess, setUserAddSuccess] = useState(false);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  useEffect(() => {
    if (products && products.length > 0) setProductsList(products);
  }, [products]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginInput, password: passwordInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("tb_resurs_auth_user", JSON.stringify(data.user));
      } else {
        // Fallback if running purely static without server auth endpoint
        if (loginInput === "admin" && passwordInput === "admin") {
          const fallbackUser: AdminUser = {
            id: "usr-1",
            login: "admin",
            name: "Главный Администратор",
            role: "superadmin",
            createdAt: new Date().toISOString()
          };
          setCurrentUser(fallbackUser);
          localStorage.setItem("tb_resurs_auth_user", JSON.stringify(fallbackUser));
        } else {
          setLoginError(data.message || "Неверный логин или пароль");
        }
      }
    } catch (err) {
      if (loginInput === "admin" && passwordInput === "admin") {
        const fallbackUser: AdminUser = {
          id: "usr-1",
          login: "admin",
          name: "Главный Администратор",
          role: "superadmin",
          createdAt: new Date().toISOString()
        };
        setCurrentUser(fallbackUser);
        localStorage.setItem("tb_resurs_auth_user", JSON.stringify(fallbackUser));
      } else {
        setLoginError("Ошибка подключения или неверные данные");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("tb_resurs_auth_user");
  };

  const fetchData = async () => {
    setLoadingLeads(true);
    try {
      const [leadsRes, healthRes, usersRes, mediaRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/health"),
        fetch("/api/users"),
        fetch("/api/media")
      ]);
      if (leadsRes.ok) {
        const leadsJson = await leadsRes.json();
        if (leadsJson.success) setLeads(leadsJson.leads);
      }
      if (healthRes.ok) {
        const healthJson = await healthRes.json();
        setServerHealth(healthJson);
      }
      if (usersRes.ok) {
        const usersJson = await usersRes.json();
        if (usersJson.success) setUsersList(usersJson.users);
      }
      const idbMedia = await loadMediaFromIDB();
      if (mediaRes.ok) {
        const mediaJson = await mediaRes.json();
        const serverList = (mediaJson.success && Array.isArray(mediaJson.media)) ? mediaJson.media : [];
        const combined = idbMedia && idbMedia.length >= serverList.length ? idbMedia : (serverList.length > 0 ? serverList : (idbMedia || mediaList));
        setMediaList(combined);
      } else if (idbMedia && idbMedia.length > 0) {
        setMediaList(idbMedia);
      }
    } catch (e) {
      // Local fallback for users
      if (usersList.length === 0) {
        setUsersList([
          {
            id: "usr-1",
            login: "admin",
            name: "Главный Администратор",
            role: "superadmin",
            createdAt: new Date().toISOString()
          }
        ]);
      }
      loadMediaFromIDB().then(idb => {
        if (idb && idb.length > 0) setMediaList(idb);
      });
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleSaveMedia = async (updatedList: MediaItem[]) => {
    setMediaList(updatedList);
    try {
      localStorage.setItem("tb_resurs_media", JSON.stringify(updatedList));
    } catch (e) {}
    try {
      await saveMediaToIDB(updatedList);
    } catch (e) {}
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media: updatedList })
      });
    } catch (e) {}
  };

  useEffect(() => {
    document.title = "Панель управления | ТБ-Ресурс (Закрытый доступ)";
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');

    loadMediaFromIDB().then(idb => {
      if (idb && idb.length > mediaList.length) {
        setMediaList(idb);
      }
    });
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

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
      localStorage.setItem("tb_resurs_settings", JSON.stringify(formData));
      try { await saveToIDB("tb_resurs_settings", formData); } catch (e) {}
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } catch (err) {}

      if (onSaveSettings) onSaveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProductsCatalog = async (updatedList: Product[]) => {
    setProductsList(updatedList);
    try {
      localStorage.setItem("tb_resurs_products_v2", JSON.stringify(updatedList));
      try { await saveToIDB("tb_resurs_products_v2", updatedList); } catch (e) {}
      try {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: updatedList })
        });
      } catch (err) {}
      if (onSaveProducts) onSaveProducts(updatedList);
    } catch (e) {}
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserAddError("");
    setUserAddSuccess(false);

    if (!newLogin || !newPassword || !newName) {
      setUserAddError("Заполните все поля");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: newLogin, password: newPassword, name: newName, role: newRole })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUsersList(data.users || [...usersList, data.user]);
        setNewLogin("");
        setNewPassword("");
        setNewName("");
        setUserAddSuccess(true);
        setTimeout(() => setUserAddSuccess(false), 4000);
      } else {
        setUserAddError(data.message || "Ошибка добавления пользователя");
      }
    } catch (e) {
      // Offline fallback
      const localNewUser: AdminUser = {
        id: `usr-${Date.now()}`,
        login: newLogin,
        name: newName,
        role: newRole,
        createdAt: new Date().toISOString()
      };
      setUsersList([...usersList, localNewUser]);
      setNewLogin("");
      setNewPassword("");
      setNewName("");
      setUserAddSuccess(true);
      setTimeout(() => setUserAddSuccess(false), 4000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (usersList.length <= 1) {
      alert("Нельзя удалить единственного администратора");
      return;
    }
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.users);
      } else {
        setUsersList(usersList.filter(u => u.id !== userId));
      }
    } catch (e) {
      setUsersList(usersList.filter(u => u.id !== userId));
    }
  };

  // If not logged in, render Login screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
        <div className="absolute top-6 left-6">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors cursor-pointer bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на сайт</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-white">Вход в панель управления</h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Система администрирования завода «ТБ-Ресурс»
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Логин</span>
              </label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={e => setLoginInput(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Пароль</span>
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoggingIn ? "Вход..." : "Войти в систему"}</span>
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              По умолчанию: логин <strong className="text-emerald-400 font-mono">admin</strong>, пароль <strong className="text-emerald-400 font-mono">admin</strong>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Admin Topbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 md:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              title="Перейти на сайт"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">На сайт</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold tracking-widest">
                  CMS & CRM «ТБ-Ресурс»
                </span>
              </div>
              <h1 className="font-headline text-lg sm:text-xl font-bold text-white mt-0.5">
                Панель управления сайтом
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{currentUser.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
                {currentUser.role === "superadmin" ? "Администратор" : "Менеджер"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs sm:text-sm font-bold mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Заявки ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Товары и слайды ({productsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Медиатека ({mediaList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Контакты и Почта</span>
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Логотип и Бренд</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Тексты и Картинки</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'seo'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Метрика и SEO</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Пользователи</span>
          </button>
        </div>

        {/* Tab content area */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {serverHealth && (
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 grid sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></div>
                    <div>
                      <span className="text-slate-400 block">Статус сервера приема заявок:</span>
                      <span className="font-bold text-emerald-400 text-sm">В сети (Express API)</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Аптайм сервера:</span>
                    <span className="font-bold text-white text-sm">{Math.floor((serverHealth.uptime || 0)/60)} мин.</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-headline font-bold text-xl text-white">
                  Поступившие обращения от клиентов ({leads.length})
                </h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleExportCSV}
                    disabled={leads.length === 0}
                    className="flex-1 sm:flex-none text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Скачать в Excel (CSV)</span>
                  </button>
                  <button
                    onClick={fetchData}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Обновить список"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingLeads ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>

              {loadingLeads ? (
                <div className="text-center py-20 text-slate-400">
                  <span className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
                  <p className="text-sm font-medium">Загрузка списка заявок...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-base text-slate-300 font-medium">Пока нет новых обращений.</p>
                  <p className="text-xs text-slate-500 mt-1">Отправьте тестовую форму с сайта для проверки работы!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                              {lead.id}
                            </span>
                            <span className="text-xs text-slate-400 ml-3 font-mono">
                              {new Date(lead.createdAt).toLocaleString("ru-RU", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {lead.status === "new" ? "Новая" : "В работе"}
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline mt-3">
                          <h4 className="font-bold text-white text-lg">{lead.name}</h4>
                          <a href={`tel:${lead.phone}`} className="font-mono text-base font-bold text-emerald-400 hover:underline">
                            {lead.phone}
                          </a>
                        </div>

                        {lead.farmName && (
                          <p className="text-xs text-slate-300 font-medium flex items-center gap-2 mt-1">
                            <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{lead.farmName}</span>
                          </p>
                        )}
                      </div>

                      <div className="text-xs bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-slate-200 mt-3">
                        <span className="font-bold block text-slate-400 text-[10px] uppercase tracking-wider mb-1">Заинтересован в продукте:</span>
                        <div className="font-bold text-emerald-300 text-sm">{lead.selectedProduct}</div>
                        {lead.cowsCount && <div className="text-slate-400 mt-1">Поголовье: <strong className="text-white">{lead.cowsCount} голов</strong></div>}
                        {lead.comment && <p className="mt-2 text-slate-300 italic border-t border-slate-800 pt-2">"{lead.comment}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <AdminProductsEditor
              products={productsList}
              onSaveProducts={handleSaveProductsCatalog}
              mediaList={mediaList}
              onSaveMedia={handleSaveMedia}
            />
          )}

          {activeTab === 'media' && (
            <MediaGallery
              mediaList={mediaList}
              onSaveMedia={handleSaveMedia}
            />
          )}

          {activeTab === 'contacts' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs sm:text-sm">
                💡 Контактные данные автоматически отображаются в шапке сайта, подвале, формах связи и используются для приема новых заявок.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>E-mail для приема заявок и уведомлений</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.emailForLeads}
                  onChange={e => setFormData({ ...formData, emailForLeads: e.target.value })}
                  placeholder="info@tb-resurs.ru"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Горячая линия завода</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 915 638-72-59"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Telegram для консультаций</span>
                  </label>
                  <input
                    type="text"
                    value={formData.telegramForLeads || ""}
                    onChange={e => setFormData({ ...formData, telegramForLeads: e.target.value })}
                    placeholder="@tbresurs_bot"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Фактический адрес завода</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Республика Татарстан, Кукморский р-н, ул. Заводская, 12"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Режим работы отдела продаж</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.workHours}
                  onChange={e => setFormData({ ...formData, workHours: e.target.value })}
                  placeholder="Пн-Пт с 08:00 до 17:00 (МСК)"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                {saveSuccess && (
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Контакты сохранены!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="ml-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Сохранение..." : "Сохранить контакты"}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'branding' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs sm:text-sm">
                🖼️ Настройте логотип и название компании. Если URL картинки логотипа указан, он отобразится в шапке и подвале сайта.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Image className="w-4 h-4 text-emerald-400" />
                  <span>URL логотипа (SVG / PNG / JPG / WebP)</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={formData.logoUrl || ""}
                    onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://... или выберите из Медиатеки"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLogoPicker(true)}
                    className="px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>Из Медиатеки</span>
                  </button>
                </div>
                {formData.logoUrl && (
                  <div className="mt-3 p-4 rounded-2xl border border-slate-800 bg-slate-900 flex items-center gap-4">
                    <img src={formData.logoUrl} alt="Logo Preview" className="h-12 w-auto object-contain bg-white/10 p-1 rounded-lg" />
                    <span className="text-xs text-slate-400">Предпросмотр логотипа</span>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Текст логотипа / Название</span>
                  </label>
                  <input
                    type="text"
                    value={formData.logoText || ""}
                    onChange={e => setFormData({ ...formData, logoText: e.target.value })}
                    placeholder="ТБ-Ресурс"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Подзаголовок под логотипом</span>
                  </label>
                  <input
                    type="text"
                    value={formData.logoSubtitle || ""}
                    onChange={e => setFormData({ ...formData, logoSubtitle: e.target.value })}
                    placeholder="Завод в Татарстане"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                {saveSuccess && (
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Логотип и бренд сохранены!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="ml-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Сохранение..." : "Сохранить брендинг"}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'content' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-xs sm:text-sm">
                🎨 Редактирование всех разделов сайта: заголовки, подзаголовки, описания и фоновые изображения.
              </div>

              {/* Секция 1: Главный экран */}
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Главный экран (Hero Section)
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Бейдж над заголовком</label>
                  <input
                    type="text"
                    value={formData.heroBadge}
                    onChange={e => setFormData({ ...formData, heroBadge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Главный заголовок (H1)</label>
                  <textarea
                    rows={2}
                    value={formData.heroTitle}
                    onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Подзаголовок / Описание</label>
                  <textarea
                    rows={2}
                    value={formData.heroSubtitle}
                    onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Текст гарантии</label>
                    <input
                      type="text"
                      value={formData.guaranteeText || ""}
                      onChange={e => setFormData({ ...formData, guaranteeText: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">URL главной фотографии</label>
                    <input
                      type="url"
                      value={formData.heroImageUrl}
                      onChange={e => setFormData({ ...formData, heroImageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Секция 2: Каталог продукции */}
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Каталог продукции (Products Section)
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Заголовок каталога</label>
                    <input
                      type="text"
                      value={formData.catalogTitle}
                      onChange={e => setFormData({ ...formData, catalogTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Подзаголовок каталога</label>
                    <input
                      type="text"
                      value={formData.catalogSubtitle}
                      onChange={e => setFormData({ ...formData, catalogSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Секция 3: Интерактивная карта и Калькулятор */}
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Интерактивная карта фермы и Калькулятор
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Заголовок карты фермы</label>
                    <input
                      type="text"
                      value={formData.mapTitle || ""}
                      onChange={e => setFormData({ ...formData, mapTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Подзаголовок карты фермы</label>
                    <input
                      type="text"
                      value={formData.mapSubtitle || ""}
                      onChange={e => setFormData({ ...formData, mapSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Заголовок калькулятора</label>
                    <input
                      type="text"
                      value={formData.calcTitle || ""}
                      onChange={e => setFormData({ ...formData, calcTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Подзаголовок калькулятора</label>
                    <input
                      type="text"
                      value={formData.calcSubtitle || ""}
                      onChange={e => setFormData({ ...formData, calcSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Секция 4: О заводе, Вопросы и Подвал */}
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  О заводе, FAQ и Подвал
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Заголовок «О заводе»</label>
                    <input
                      type="text"
                      value={formData.aboutTitle || ""}
                      onChange={e => setFormData({ ...formData, aboutTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Заголовок блока FAQ</label>
                    <input
                      type="text"
                      value={formData.faqTitle || ""}
                      onChange={e => setFormData({ ...formData, faqTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Описание компании в подвале</label>
                  <textarea
                    rows={2}
                    value={formData.footerDescription || ""}
                    onChange={e => setFormData({ ...formData, footerDescription: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                {saveSuccess && (
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Все тексты сайта успешно сохранены!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="ml-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Сохранение..." : "Сохранить изменения сайта"}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'seo' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs sm:text-sm leading-relaxed">
                📈 При указании ID Яндекс.Метрики и Google Analytics система автоматически встраивает официальные скрипты отслеживания на все страницы сайта.
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>ID Яндекс.Метрики</span>
                  </label>
                  <input
                    type="text"
                    value={formData.yandexMetrikaId || ""}
                    onChange={e => setFormData({ ...formData, yandexMetrikaId: e.target.value })}
                    placeholder="Например: 98765432"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>ID Google Analytics 4</span>
                  </label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId || ""}
                    onChange={e => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXX"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Верификация Google Search Console</span>
                  </label>
                  <input
                    type="text"
                    value={formData.googleSearchConsole || ""}
                    onChange={e => setFormData({ ...formData, googleSearchConsole: e.target.value })}
                    placeholder="Код из тега content"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Верификация Яндекс.Вебмастер</span>
                  </label>
                  <input
                    type="text"
                    value={formData.yandexWebmaster || ""}
                    onChange={e => setFormData({ ...formData, yandexWebmaster: e.target.value })}
                    placeholder="Код из тега content"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>Пользовательские скрипты (Виджеты чата, Пиксели)</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.customHeadScript || ""}
                  onChange={e => setFormData({ ...formData, customHeadScript: e.target.value })}
                  placeholder="<!-- Вставьте здесь HTML / JS код сторонних сервисов -->"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                {saveSuccess && (
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Аналитика сохранена!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="ml-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Сохранение..." : "Сохранить SEO"}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'users' && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Users list */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-headline font-bold text-lg text-white">
                    Зарегистрированные администраторы ({usersList.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {usersList.map((user) => (
                    <div
                      key={user.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg font-headline">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{user.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                              user.role === 'superadmin' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {user.role === 'superadmin' ? 'Админ' : 'Менеджер'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">Логин: <strong className="text-emerald-400">{user.login}</strong></p>
                        </div>
                      </div>

                      {usersList.length > 1 && user.login !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Удалить пользователя"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add User Form */}
              <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <UserPlus className="w-5 h-5" />
                  <span>Добавить нового пользователя</span>
                </div>
                <p className="text-xs text-slate-400">
                  Новый сотрудник сможет заходить по ссылке <code className="text-emerald-300 font-mono">/admin-panel</code> со своим логином и паролем.
                </p>

                <form onSubmit={handleAddUser} className="space-y-4 pt-2">
                  {userAddError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
                      {userAddError}
                    </div>
                  )}
                  {userAddSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Пользователь успешно добавлен!
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Имя сотрудника</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Например: Иван Петров"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Логин для входа</label>
                    <input
                      type="text"
                      required
                      value={newLogin}
                      onChange={e => setNewLogin(e.target.value)}
                      placeholder="ivan_sales"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Пароль</label>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Сложный пароль"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Права доступа</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="manager">Менеджер (обработка заявок и контент)</option>
                      <option value="superadmin">Полный доступ (Администратор)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Создать пользователя</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logo Picker Modal */}
      <AnimatePresence>
        {showLogoPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <MediaGallery
                mediaList={mediaList}
                onSaveMedia={handleSaveMedia}
                isModalPicker={true}
                onSelectMedia={(url) => {
                  setFormData({ ...formData, logoUrl: url });
                  setShowLogoPicker(false);
                }}
                onCloseModal={() => setShowLogoPicker(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
