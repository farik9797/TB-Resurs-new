import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DOCUMENTS_DATA } from '../data';
import { DocumentItem, SiteSettings } from '../types';
import { MapPin, Award, ShieldCheck, FlaskConical, HardHat, FileText, X, CheckCircle2, ArrowRight, Download, Server, CloudUpload, Terminal, Check } from 'lucide-react';

interface AboutAndDocsProps {
  settings?: SiteSettings;
}

export const AboutAndDocs: React.FC<AboutAndDocsProps> = ({ settings }) => {
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showHostingModal, setShowHostingModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'docker' | 'cpanel' | 'vercel'>('docker');

  const renderDocIcon = (iconType?: string) => {
    switch (iconType) {
      case 'verified':
        return <Award className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />;
      case 'health_and_safety':
        return <ShieldCheck className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />;
      case 'science':
        return <FlaskConical className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />;
      default:
        return <FileText className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />;
    }
  };

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left: Factory About */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-100">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Республика Татарстан, Кукморский р-н</span>
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 sm:mb-6 leading-tight">
            {settings?.aboutTitle ? settings.aboutTitle : (
              <>Производитель — <br /><span className="text-emerald-600">ООО «ТБ-Ресурс»</span></>
            )}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-5 sm:mb-6 leading-relaxed font-normal">
            {settings?.aboutText || "Наш специализированный завод расположен в Кукморском районе Республики Татарстан. Мы занимаемся исключительно разработкой и производством высокоплотных изделий из резины для агропромышленного комплекса."}
          </p>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 leading-relaxed font-normal">
            Использование автоматических вулканизационных прессов и первичного сырья позволяет нам достигать плотности и износостойкости, превосходящей многие европейские аналоги при стоимости на 30-40% ниже.
          </p>

          <div className="rounded-3xl overflow-hidden border border-slate-200 h-[280px] sm:h-[320px] shadow-organic relative group bg-slate-100">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9dJoUoVd6sqJmXq7Cnu7mMw2Ri32kQrQWAhB6mZv0-5Kw8sd91M4QGQWZLU_dtk8hfTNe65VCJgQnOJp3tpxJJ_mSmrumR4iHFS-D6vxI3-RUcZUGSq7CueGkGBD1TVx2_l46pptRMZQs1cX1OBgVHiysbggGeaeItPI36CK3d-L9CARqBcoixExfnLA8IOaAx4ZXUJqYXOhYtPpOoPADNmnElfltq1r7P8hQSIti64YUHIZCcEcpgg"
              alt="Производственный комплекс ТБ-Ресурс в Татарстане"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold bg-emerald-600 px-3 py-1 rounded-lg shadow-sm">Мощность завода</span>
              <p className="text-sm font-semibold mt-1.5">Более 15 000 кв.м готовой продукции в месяц</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Docs & Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <h3 className="font-headline text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Документация и испытания
          </h3>

          <div className="space-y-4 mb-8">
            {DOCUMENTS_DATA.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setActiveDoc(doc);
                  setDownloading(false);
                }}
                className="flex items-center justify-between p-5 bg-slate-100/80 hover:bg-white rounded-2xl border border-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-organic group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white group-hover:bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-200 group-hover:border-emerald-600 transition-colors">
                    {renderDocIcon(doc.icon)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-600 transition-colors">
                      {doc.title}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {doc.format} • {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-white p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 group-hover:border-emerald-600 shadow-2xs flex-shrink-0">
                  <span className="hidden sm:inline">Посмотреть</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 sm:p-8 bg-emerald-50/60 border-2 border-emerald-200 rounded-3xl mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <HardHat className="w-5 h-5" />
              </div>
              <h4 className="font-headline font-bold text-slate-900 text-lg">Нужна техническая консультация?</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed font-normal">
              Наши инженеры помогут рассчитать толщину покрытия, спланировать уклон дренажа и подобрать стыковочные швы под ваш тип навозного скрепера.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="tel:+79156387259"
                className="font-headline font-bold text-lg text-emerald-600 hover:underline"
              >
                +7 915 638-72-59
              </a>
              <span className="text-xs text-slate-500 font-medium">Пн-Пт с 08:00 до 17:00</span>
            </div>
          </div>

          {/* Hosting Deployment Box */}
          <div className="p-6 bg-[#E4EDFE] text-slate-900 rounded-3xl shadow-md border border-[#c8dbfc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600/15 text-emerald-700 flex items-center justify-center border border-emerald-600/25 flex-shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold block">Готово к публикации</span>
                <h4 className="font-headline font-bold text-base mt-0.5 text-slate-900">Развертывание на хостинге</h4>
                <p className="text-xs text-slate-600 mt-0.5">Включен Dockerfile, настройки Vercel и экспорт в Excel</p>
              </div>
            </div>
            <button
              onClick={() => setShowHostingModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Инструкция по загрузке</span>
            </button>
          </div>
        </motion.div>

      </div>

      {/* Interactive Document Preview Modal */}
      <AnimatePresence>
        {activeDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-mono uppercase bg-slate-100 px-2.5 py-1 rounded text-slate-600 font-medium">
                Официальный документ
              </span>
              <h3 className="font-headline text-2xl font-bold text-slate-900 mt-2 mb-3">
                {activeDoc.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {activeDoc.summary}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500">Статус валидации:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Действителен (ГОСТ Р)</span>
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDownloading(true);
                    setTimeout(() => {
                      setDownloading(false);
                      setActiveDoc(null);
                    }, 1200);
                  }}
                  disabled={downloading}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? "Загрузка файла..." : `Скачать PDF (${activeDoc.size})`}</span>
                </button>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="px-5 h-12 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-800"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Hosting Instructions Modal */}
      <AnimatePresence>
        {showHostingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CloudUpload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-slate-900">Выгрузка на хостинг</h3>
                    <p className="text-xs text-slate-500 font-mono">Готовые скрипты и сборка для любого сервера</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHostingModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl my-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('docker')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'docker' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>VPS / Docker / Node.js</span>
                </button>
                <button
                  onClick={() => setActiveTab('cpanel')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'cpanel' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  <span>Reg.ru / Beget (cPanel)</span>
                </button>
                <button
                  onClick={() => setActiveTab('vercel')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'vercel' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>Vercel / Облако</span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 pr-1">
                {activeTab === 'docker' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Идеально для VPS на Beget, Timeweb или Amvera. Работает и сайт, и база заявок (с выгрузкой в Excel).</span>
                    </div>
                    <p className="font-bold text-slate-900">Запуск одной командой через Docker:</p>
                    <pre className="bg-slate-900 text-emerald-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      docker build -t tb-resurs .{'\n'}
                      docker run -d -p 80:3000 --restart always tb-resurs
                    </pre>
                    <p className="font-bold text-slate-900 pt-2">Или запуск через стандартный Node.js (PM2):</p>
                    <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      npm install && npm run build{'\n'}
                      npm install -g pm2{'\n'}
                      pm2 start dist/server.cjs --name "tb-resurs"
                    </pre>
                  </div>
                )}

                {activeTab === 'cpanel' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 text-xs">
                      Подходит для обычного виртуального хостинга (тарифы PHP/HTML без поддержки Node.js).
                    </div>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-800 font-medium">
                      <li>Выполните команду сборки: <code className="bg-slate-100 text-emerald-600 px-1.5 py-0.5 rounded font-mono">npm run build</code></li>
                      <li>В корне проекта появится папка <strong className="text-slate-900">dist</strong>.</li>
                      <li>Скопируйте всё содержимое папки <strong className="text-slate-900">dist</strong> (файлы <code className="text-xs">index.html</code>, папку <code className="text-xs">assets</code>) в папку <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">public_html</code> на вашем хостинге через FTP или файловый менеджер.</li>
                      <li>Сайт начнет открываться моментально со всеми калькуляторами и анимациями! Форма автоматически переключится в автономный режим.</li>
                    </ol>
                  </div>
                )}

                {activeTab === 'vercel' && (
                  <div className="space-y-3">
                    <p className="font-medium">
                      В корне проекта подготовлен конфигурационный файл <code className="bg-slate-100 font-mono text-emerald-600 px-1.5 py-0.5 rounded">vercel.json</code>.
                    </p>
                    <ul className="space-y-2 list-disc pl-5 font-medium text-slate-800">
                      <li>Загрузите код на свой GitHub-аккаунт.</li>
                      <li>Зарегистрируйтесь на <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Vercel.com</a> и выберите «Import Git Repository».</li>
                      <li>Платформа автоматически выполнит <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">npm run build</code> и выдаст вам бесплатный домен с HTTPS.</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowHostingModal(false)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Понятно, закрыть
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
