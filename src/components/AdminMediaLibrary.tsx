import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types';
import { 
  Upload, Image as ImageIcon, Trash2, Copy, Check, Search, 
  Eye, X, Plus, HardDrive, Sparkles, AlertCircle
} from 'lucide-react';

interface AdminMediaLibraryProps {
  mediaList: MediaItem[];
  onSaveMedia: (updatedList: MediaItem[]) => Promise<void> | void;
  isModalPicker?: boolean;
  onSelectMedia?: (url: string) => void;
  onCloseModal?: () => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({
  mediaList,
  onSaveMedia,
  isModalPicker = false,
  onSelectMedia,
  onCloseModal
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to compress/resize image before saving to Base64 (keeps local storage clean and fast)
  const processImageFile = (file: File): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (!resultUrl) return reject(new Error("Не удалось прочитать файл"));

        const img = new Image();
        img.src = resultUrl;
        img.onload = () => {
          const maxDim = 1000; // Optimal resolution for fast loading and storage efficiency
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG quality 0.78
            const compressedUrl = canvas.toDataURL("image/jpeg", 0.78);
            const approxSizeKb = Math.round((compressedUrl.length * 0.75) / 1024);
            resolve({
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              url: compressedUrl,
              size: `${approxSizeKb} KB`,
              uploadedAt: new Date().toLocaleDateString("ru-RU")
            });
          } else {
            const approxSizeKb = Math.round(file.size / 1024);
            resolve({
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              url: resultUrl,
              size: `${approxSizeKb} KB`,
              uploadedAt: new Date().toLocaleDateString("ru-RU")
            });
          }
        };
        img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
      };
      reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newItems: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const processed = await processImageFile(file);
        newItems.push(processed);
      }

      if (newItems.length > 0) {
        const updatedList = [...newItems, ...mediaList];
        await onSaveMedia(updatedList);
        
        // If in picker mode and 1 item uploaded, auto select or highlight
        if (isModalPicker && newItems.length === 1 && onSelectMedia) {
          onSelectMedia(newItems[0].url);
        }
      }
    } catch (err) {
      alert("Произошла ошибка при загрузке фотографий. Проверьте формат файла.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Удалить это фото из медиатеки?")) {
      const updated = mediaList.filter(item => item.id !== id);
      onSaveMedia(updated);
    }
  };

  const handleCopyUrl = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={isModalPicker ? "flex flex-col h-full" : "space-y-6"}>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-emerald-400" />
            <span>{isModalPicker ? "Выбор фото из Медиатеки" : "Медиатека (Фотобанк завода)"}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Загружайте фотографии прямо с компьютера. Все фото сохраняются и доступны для добавления в карточки товаров или настройки сайта.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? "Загрузка фото..." : "Загрузить с компьютера"}</span>
          </button>
          {isModalPicker && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Upload Drag & Drop Banner */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/50 hover:bg-slate-950/90 p-6 rounded-3xl text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-2"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-white mt-1">
          Нажмите сюда, чтобы выбрать файлы с вашего компьютера
        </p>
        <p className="text-xs text-slate-400">
          Поддерживаются PNG, JPG, WEBP. Изображения автоматически оптимизируются для высокой скорости загрузки.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию файла в медиатеке..."
          className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Grid of photos */}
      {filteredMedia.length === 0 ? (
        <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-slate-400 font-medium text-sm">
            {searchQuery ? "По вашему запросу фото не найдено." : "В медиатеке пока нет загруженных фото. Нажмите «Загрузить с компьютера» сверху."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (isModalPicker && onSelectMedia) {
                  onSelectMedia(item.url);
                } else {
                  setPreviewMedia(item);
                }
              }}
              className={`bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col group relative transition-all ${
                isModalPicker ? "cursor-pointer hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10" : ""
              }`}
            >
              {/* Image Thumbnail */}
              <div className="aspect-square bg-slate-900 relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {isModalPicker ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                      <Plus className="w-3.5 h-3.5" />
                      Выбрать
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewMedia(item);
                        }}
                        className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
                        title="Просмотр крупно"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(item.url, item.id, e)}
                        className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700 transition-colors"
                        title="Скопировать ссылку"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Info footer */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 flex flex-col justify-between flex-1">
                <span className="text-xs font-medium text-slate-200 line-clamp-1 break-all" title={item.name}>
                  {item.name}
                </span>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-900">
                  <span>{item.size || "JPG"}</span>
                  <span>{item.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Image Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPreviewMedia(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-base truncate max-w-md">{previewMedia.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">Размер: {previewMedia.size || "N/A"} • Загружено: {previewMedia.uploadedAt}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 my-6 flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden max-h-[60vh] border border-slate-800/50 p-2">
                <img
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[58vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={(e) => handleCopyUrl(previewMedia.url, previewMedia.id, e)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copiedId === previewMedia.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
                  <span>{copiedId === previewMedia.id ? "Ссылка скопирована!" : "Скопировать ссылку на фото"}</span>
                </button>

                <div className="flex items-center gap-3">
                  {isModalPicker && onSelectMedia && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectMedia(previewMedia.url);
                        setPreviewMedia(null);
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Выбрать это фото</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      handleDelete(previewMedia.id, e);
                      setPreviewMedia(null);
                    }}
                    className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs sm:text-sm rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Удалить</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
