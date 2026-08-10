'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { Flame, Sparkles, Plus, Check, ChevronLeft } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect }) => {
  const minPrice = item.sizes && item.sizes.length > 0
    ? Math.min(...item.sizes.map((s) => s.price))
    : item.basePrice;

  return (
    <div
      onClick={() => item.isAvailable && onSelect(item)}
      className={`group relative bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-400 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
        !item.isAvailable ? 'opacity-60 grayscale-[0.3]' : ''
      }`}
    >
      <div>
        {/* Top Image Container */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

          {/* Badges Overlay */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
            {item.isPopular && (
              <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Flame className="w-3 h-3 text-white fill-white" />
                الأكثر طلباً
              </span>
            )}
            {item.isSpicy && (
              <span className="bg-red-900/90 text-red-200 border border-red-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                🌶️ حار
              </span>
            )}
            {item.isNew && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                جديد
              </span>
            )}
          </div>

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                غير متوفر حالياً
              </span>
            </div>
          )}

          {/* Price Tag Overlay at bottom right of image */}
          <div className="absolute bottom-3 right-3 z-10 flex items-baseline gap-1 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 px-3 py-1 rounded-2xl shadow-sm">
            <span className="text-xs text-slate-500 font-medium">
              {item.sizes && item.sizes.length > 0 ? 'تبدأ من' : ''}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900">{minPrice}</span>
            <span className="text-xs font-bold text-orange-600">ج.م</span>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug mb-1.5">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Sizes preview if available */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.sizes.map((sz) => (
                <span
                  key={sz.id}
                  className="bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                >
                  {sz.name}: {sz.price}ج.م
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="px-5 pb-5">
        <button
          disabled={!item.isAvailable}
          onClick={(e) => {
            e.stopPropagation();
            if (item.isAvailable) onSelect(item);
          }}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
            item.isAvailable
              ? 'bg-slate-900 hover:bg-orange-500 text-white active:scale-98'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4 text-white" />
          <span>{item.sizes && item.sizes.length > 0 ? 'تخصيص الحجم والإضافات' : 'أضف للسلّة'}</span>
          <ChevronLeft className="w-4 h-4 mr-auto opacity-60" />
        </button>
      </div>
    </div>
  );
};
