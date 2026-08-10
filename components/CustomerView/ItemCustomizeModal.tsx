'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem, SizeOption, AddonOption } from '@/lib/types';
import { X, Plus, Minus, Check, Flame, ShoppingBag, Sparkles } from 'lucide-react';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    size?: SizeOption,
    addons?: AddonOption[],
    quantity?: number,
    notes?: string
  ) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [prevItemId, setPrevItemId] = useState<string | null>(item?.id || null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    item?.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  if (item && item.id !== prevItemId) {
    setPrevItemId(item.id);
    setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined);
    setSelectedAddons([]);
    setQuantity(1);
    setNotes('');
  }

  if (!item) return null;

  const toggleAddon = (addon: AddonOption) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const unitPrice = (selectedSize ? selectedSize.price : item.basePrice) +
    selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = unitPrice * quantity;

  const handleSubmit = () => {
    onAddToCart(item, selectedSize, selectedAddons, quantity, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-300 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header Image */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-slate-950/70 hover:bg-red-600 text-white p-2 rounded-full border border-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 right-4 left-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                {item.category === 'koshari' ? 'كشري' : item.category === 'tajins' ? 'طاجن' : 'طبق مميز'}
              </span>
              {item.isSpicy && <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full font-bold">🌶️ حار</span>}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1">{item.description}</p>
          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-right">
          
          {/* Size Choice Section */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>اختيار الحجم</span>
                  <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    مطلوب
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {item.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3.5 rounded-2xl border text-right flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 font-bold text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-600 bg-amber-500' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <span className="text-xs sm:text-sm">{size.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-amber-700">{size.price} ج.م</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Addons Choice Section */}
          {item.availableAddons && item.availableAddons.length > 0 && (
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-3 flex items-center gap-2">
                <span>الإضافات الموصى بها</span>
                <span className="text-xs text-slate-500 font-normal">(اختياري)</span>
              </h3>
              <div className="space-y-2">
                {item.availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-right transition-all ${
                        isChecked
                          ? 'bg-amber-50 border-amber-400 font-bold text-slate-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-amber-500 border-amber-600 text-slate-950' : 'border-slate-300 bg-white'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">+ {addon.price} ج.م</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Notes */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              ملاحظات خاصة للطبق (مثال: بدون شطة، صلصة زياده، تقلية بزيادة)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أية تفضيلات خاصة بالتحضير..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="font-extrabold text-sm text-slate-900">الكمية</span>
            <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-xs hover:bg-slate-200 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-slate-900 text-base">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs hover:bg-amber-400 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 shrink-0 flex items-center justify-between gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">الإجمالي لهذا الطبق</span>
            <div className="flex items-baseline gap-1 text-amber-400 font-black text-xl sm:text-2xl">
              <span>{totalPrice}</span>
              <span className="text-xs">ج.م</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 max-w-xs py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>إضافة إلى السلة ({totalPrice} ج.م)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
