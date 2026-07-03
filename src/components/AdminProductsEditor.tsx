import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, MediaItem } from '../types';
import { FACTORY_PHOTOS_PRESETS, DEFAULT_MEDIA_LIBRARY } from '../data';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { 
  Plus, Edit3, Trash2, ArrowUp, ArrowDown, Copy, Check, X, 
  Image as ImageIcon, Sparkles, Layers, ListChecks, Sliders, Eye, HardDrive, Upload
} from 'lucide-react';

interface AdminProductsEditorProps {
  products: Product[];
  onSaveProducts: (updatedList: Product[]) => Promise<void> | void;
  mediaList?: MediaItem[];
  onSaveMedia?: (updatedList: MediaItem[]) => Promise<void> | void;
}

export const AdminProductsEditor: React.FC<AdminProductsEditorProps> = ({
  products,
  onSaveProducts,
  mediaList = DEFAULT_MEDIA_LIBRARY,
  onSaveMedia
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [activeSlideForPicker, setActiveSlideForPicker] = useState<number | null>(null);

  const handleStartAdd = () => {
    const defaultImg = FACTORY_PHOTOS_PRESETS[0]?.url || "";
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: "Новое покрытие для КРС",
      subtitle: "Специализированное решение для животноводческих помещений",
      thickness: "24 мм (эластичная резина)",
      relief: "Антискользящий протектор с водоотводом",
      jointType: "Паз-шип или прямой край",
      warranty: "5 лет официальной гарантии",
      description: "Высокопрочные резиновые маты из первичного сырья с вулканизацией под высоким давлением. Предназначены для комфортного содержания КРС, снижения заболеваемости копыт и увеличения надоев.",
      imageUrl: defaultImg,
      images: [defaultImg],
      features: [
        "Снижение травматизма скакательных суставов",
        "Отличная теплоизоляция от холодного бетона",
        "Простота монтажа и гигиенической уборки"
      ],
      specs: [
        { label: "Назначение", value: "Стойла и проходы КРС" },
        { label: "Толщина и размер", value: "24 мм / 1800 × 1200 мм" },
        { label: "Гарантия", value: "5 лет по ГОСТ Р" }
      ]
    };
    setEditingIndex(products.length);
    setEditingProduct(newProd);
  };

  const handleStartEdit = (product: Product, index: number) => {
    // Ensure images array exists
    const images = product.images && product.images.length > 0 ? [...product.images] : [product.imageUrl];
    setEditingIndex(index);
    setEditingProduct({
      ...product,
      images,
      features: product.features ? [...product.features] : [],
      specs: product.specs ? [...product.specs] : []
    });
  };

  const handleDuplicate = (product: Product, index: number) => {
    const copy: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now()}`,
      title: `${product.title} (Копия)`,
      images: product.images ? [...product.images] : [product.imageUrl],
      features: product.features ? [...product.features] : [],
      specs: product.specs ? [...product.specs] : []
    };
    const updated = [...products];
    updated.splice(index + 1, 0, copy);
    onSaveProducts(updated);
  };

  const handleDelete = (index: number) => {
    if (products.length <= 1) {
      alert("Нельзя удалить последний товар из каталога");
      return;
    }
    if (window.confirm("Удалить этот товар из каталога?")) {
      const updated = products.filter((_, idx) => idx !== index);
      onSaveProducts(updated);
      if (editingIndex === index) {
        setEditingProduct(null);
        setEditingIndex(null);
      }
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...products];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onSaveProducts(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === products.length - 1) return;
    const updated = [...products];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onSaveProducts(updated);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || editingIndex === null) return;

    setIsSaving(true);
    // Ensure imageUrl equals first slide image if available
    const finalImages = editingProduct.images && editingProduct.images.length > 0
      ? editingProduct.images.filter(img => img && img.trim() !== "")
      : [editingProduct.imageUrl];

    const finalProd: Product = {
      ...editingProduct,
      images: finalImages.length > 0 ? finalImages : [editingProduct.imageUrl],
      imageUrl: finalImages[0] || editingProduct.imageUrl
    };

    const updated = [...products];
    if (editingIndex < products.length) {
      updated[editingIndex] = finalProd;
    } else {
      updated.push(finalProd);
    }

    try {
      await onSaveProducts(updated);
      setSaveSuccessMessage("Товар и слайды успешно сохранены!");
      setTimeout(() => {
        setSaveSuccessMessage("");
        setEditingProduct(null);
        setEditingIndex(null);
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  // Slider Image helpers for editingProduct
  const handleAddSlideImage = (url: string = "") => {
    if (!editingProduct) return;
    const currentImgs = editingProduct.images || [editingProduct.imageUrl];
    setEditingProduct({
      ...editingProduct,
      images: [...currentImgs, url]
    });
  };

  const handleRemoveSlideImage = (imgIdx: number) => {
    if (!editingProduct) return;
    const currentImgs = editingProduct.images || [editingProduct.imageUrl];
    if (currentImgs.length <= 1) {
      alert("В слайдере товара должно остаться хотя бы одно фото!");
      return;
    }
    const updated = currentImgs.filter((_, idx) => idx !== imgIdx);
    setEditingProduct({
      ...editingProduct,
      images: updated,
      imageUrl: imgIdx === 0 && updated.length > 0 ? updated[0] : editingProduct.imageUrl
    });
  };

  const handleSlideChangeUrl = (imgIdx: number, val: string) => {
    if (!editingProduct) return;
    const currentImgs = editingProduct.images ? [...editingProduct.images] : [editingProduct.imageUrl];
    currentImgs[imgIdx] = val;
    setEditingProduct({
      ...editingProduct,
      images: currentImgs,
      imageUrl: imgIdx === 0 ? val : editingProduct.imageUrl
    });
  };

  const handleMoveSlideUp = (imgIdx: number) => {
    if (!editingProduct || imgIdx === 0) return;
    const currentImgs = editingProduct.images ? [...editingProduct.images] : [editingProduct.imageUrl];
    const temp = currentImgs[imgIdx - 1];
    currentImgs[imgIdx - 1] = currentImgs[imgIdx];
    currentImgs[imgIdx] = temp;
    setEditingProduct({
      ...editingProduct,
      images: currentImgs,
      imageUrl: currentImgs[0]
    });
  };

  const handleMoveSlideDown = (imgIdx: number) => {
    if (!editingProduct) return;
    const currentImgs = editingProduct.images ? [...editingProduct.images] : [editingProduct.imageUrl];
    if (imgIdx >= currentImgs.length - 1) return;
    const temp = currentImgs[imgIdx + 1];
    currentImgs[imgIdx + 1] = currentImgs[imgIdx];
    currentImgs[imgIdx] = temp;
    setEditingProduct({
      ...editingProduct,
      images: currentImgs,
      imageUrl: currentImgs[0]
    });
  };

  // Render product editing form
  if (editingProduct && editingIndex !== null) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {editingIndex < products.length ? "Редактирование товара" : "Новый товар в каталоге"}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-headline mt-2">
              {editingProduct.title || "Без названия"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setEditingIndex(null);
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            ← Вернуться к списку
          </button>
        </div>

        <form onSubmit={handleSaveProductForm} className="space-y-8">
          {/* 1. Основная информация */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>1. Основная информация о товаре</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Название товара *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  placeholder="Например: Плиты резиновые для стойломест"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Подзаголовок / Назначение *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.subtitle}
                  onChange={e => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  placeholder="Например: Основное решение для зон отдыха КРС"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Толщина и особенности *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.thickness}
                  onChange={e => setEditingProduct({ ...editingProduct, thickness: e.target.value })}
                  placeholder="Например: 24 мм (эластичная резина с шипом)"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Рельеф поверхности *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.relief}
                  onChange={e => setEditingProduct({ ...editingProduct, relief: e.target.value })}
                  placeholder="Например: Нижний амортизирующий шип + шагрень"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Тип соединения *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.jointType}
                  onChange={e => setEditingProduct({ ...editingProduct, jointType: e.target.value })}
                  placeholder="Например: Прямой край или замок «Ласточкин хвост»"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Гарантия *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.warranty}
                  onChange={e => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                  placeholder="Например: 5 лет официальной заводской гарантии"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Подробное описание товара *</label>
              <textarea
                rows={4}
                required
                value={editingProduct.description}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* 2. Слайдер фотографий (Слайды для каждого товара) */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <span>2. Слайды товара (Фотографии в карточке)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  У каждого товара может быть разное количество фото в слайдере. Первое фото в списке автоматически становится главным изображением карточки.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAddSlideImage("")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить фото в слайд</span>
              </button>
            </div>

            {/* List of current slide images */}
            <div className="space-y-4">
              {(editingProduct.images || [editingProduct.imageUrl]).map((imgUrl, imgIdx) => (
                <div key={imgIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
                      Слайд #{imgIdx + 1}
                    </span>
                    {imgIdx === 0 && (
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        Главное
                      </span>
                    )}
                  </div>

                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                    {imgUrl ? (
                      <img src={imgUrl} alt={`slide ${imgIdx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={e => handleSlideChangeUrl(imgIdx, e.target.value)}
                      placeholder="Вставьте ссылку на фото (https://...) или выберите из галереи ниже"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleMoveSlideUp(imgIdx)}
                      disabled={imgIdx === 0}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                      title="Поднять выше"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSlideDown(imgIdx)}
                      disabled={imgIdx === (editingProduct.images?.length || 1) - 1}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                      title="Опустить ниже"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlideImage(imgIdx)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Удалить слайд"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Быстрый выбор из фотобанка завода */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Быстрый выбор из фотобанка завода (Нажмите, чтобы добавить фото в слайдер):</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
                {FACTORY_PHOTOS_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSlideImage(preset.url)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group flex items-center gap-2.5 cursor-pointer hover:border-emerald-500/50"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-800 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[11px] text-slate-300 group-hover:text-white font-medium line-clamp-2 leading-tight">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Преимущества */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-400" />
                <span>3. Преимущества товара (Пункт за пунктом)</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    ...editingProduct,
                    features: [...(editingProduct.features || []), "Новое преимущество"]
                  });
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить пункт</span>
              </button>
            </div>

            <div className="space-y-3">
              {(editingProduct.features || []).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    ✓
                  </span>
                  <input
                    type="text"
                    value={feat}
                    onChange={e => {
                      const updated = [...(editingProduct.features || [])];
                      updated[idx] = e.target.value;
                      setEditingProduct({ ...editingProduct, features: updated });
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editingProduct.features || []).filter((_, i) => i !== idx);
                      setEditingProduct({ ...editingProduct, features: updated });
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Технические характеристики */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>4. Технические характеристики (Таблица параметров)</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    ...editingProduct,
                    specs: [...(editingProduct.specs || []), { label: "Параметр", value: "Значение" }]
                  });
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить характеристику</span>
              </button>
            </div>

            <div className="space-y-3">
              {(editingProduct.specs || []).map((spec, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={e => {
                      const updated = [...(editingProduct.specs || [])];
                      updated[idx] = { ...spec, label: e.target.value };
                      setEditingProduct({ ...editingProduct, specs: updated });
                    }}
                    placeholder="Параметр (напр. Твердость)"
                    className="w-full sm:w-1/3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={e => {
                      const updated = [...(editingProduct.specs || [])];
                      updated[idx] = { ...spec, value: e.target.value };
                      setEditingProduct({ ...editingProduct, specs: updated });
                    }}
                    placeholder="Значение (напр. 58-62 ед. Шор А)"
                    className="w-full sm:w-2/3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editingProduct.specs || []).filter((_, i) => i !== idx);
                      setEditingProduct({ ...editingProduct, specs: updated });
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors cursor-pointer self-end sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 sticky bottom-4 z-20 shadow-2xl">
            {saveSuccessMessage && (
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-2 animate-bounce">
                <Check className="w-5 h-5" />
                {saveSuccessMessage}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setEditingIndex(null);
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>{isSaving ? "Сохранение..." : "Сохранить товар и слайды"}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render products list view
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h3 className="font-headline font-bold text-lg sm:text-xl text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Каталог товаров и слайды ({products.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Вы можете добавлять новые товары, настраивать параметры и создавать индивидуальное количество фото в слайдах для каждой карточки.
          </p>
        </div>
        <button
          onClick={handleStartAdd}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Добавить новый товар</span>
        </button>
      </div>

      <div className="space-y-4">
        {products.map((prod, idx) => {
          const slideCount = prod.images && prod.images.length > 0 ? prod.images.length : 1;
          return (
            <div
              key={prod.id || idx}
              className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex items-start sm:items-center gap-5">
                <div className="w-24 h-20 sm:w-28 sm:h-22 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 relative">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-slate-900/90 text-emerald-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700">
                    {slideCount} фото
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {prod.thickness}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                      ID: {prod.id}
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-base sm:text-lg text-white">
                    {prod.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {prod.subtitle}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 font-medium">
                    <span>Преимуществ: <strong className="text-slate-300">{prod.features?.length || 0}</strong></span>
                    <span>Характеристик: <strong className="text-slate-300">{prod.specs?.length || 0}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0">
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Выше в каталоге"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === products.length - 1}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Ниже в каталоге"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(prod, idx)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Дублировать товар"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Дублировать</span>
                </button>
                <button
                  onClick={() => handleStartEdit(prod, idx)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Редактировать и слайды</span>
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                  title="Удалить товар"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
