'use client';

import React from 'react';
import { CategoryType } from '@/lib/types';

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  counts: Record<CategoryType, number>;
}

export const CATEGORIES: { id: CategoryType; name: string; icon: string }[] = [
  { id: 'all', name: 'الكل', icon: '🍽️' },
  { id: 'koshari', name: 'أطباق الكشري', icon: '🍲' },
  { id: 'tajins', name: 'طواجن الفرن', icon: '🥘' },
  { id: 'special', name: 'وجبات هند السبيشال', icon: '🌟' },
  { id: 'family', name: 'وجبات العائلات', icon: '👨‍👩‍👧‍👦' },
  { id: 'addons', name: 'الإضافات والمقبلات', icon: '🌶️' },
  { id: 'desserts', name: 'الحلويات والقنبلة', icon: '🍨' },
  { id: 'beverages', name: 'المشروبات والحمص', icon: '🥤' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="my-5 sticky top-20 z-30 bg-slate-50/90 backdrop-blur-md py-2.5 border-y border-slate-200">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-white text-orange-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
