'use client';

import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Search, Flame, Truck, Award, Sparkles, ChefHat } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const { branchSettings } = useRestaurant();
  const siteName = branchSettings.siteName || 'كشري هند';

  return (
    <div className="relative bg-white text-slate-900 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm my-4 sm:my-6 p-6 sm:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left/Main Text Column */}
        <div className="flex-1 space-y-4 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              الطعم المصري الأصيل 100%
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              صلصة {siteName} المسبكة المخصوصة
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            أحلى طبق كشري وطواجن <span className="text-orange-500">من {siteName}</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
            اطلب أونلاين الآن من {siteName} وتذوق أشهى أطباق الكشري الساخنة، الطواجن الفرن، الإضافات المقرمشة والحلويات المميزة مع توصيل صاروخي لحد باب البيت.
          </p>

          {/* Search Input */}
          <div className="relative max-w-lg pt-2">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-orange-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طبق، طاجن، أو حلوى (مثال: كشري سوبر، طاجن لحمة)..."
              className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-orange-600 hover:text-slate-900"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Stats/Features Bento Chips */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-xs font-bold text-slate-700">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">توصيل 30 دقيقة</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">مكونات بلدي</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">ضمان جودة 100%</span>
            </div>
          </div>
        </div>

        {/* Right Bento Visual Card */}
        <div className="w-full md:w-80 h-64 md:h-80 rounded-[2rem] bg-slate-900 text-white p-6 relative overflow-hidden flex flex-col justify-between shadow-lg shrink-0">
          <img
            src="https://images.unsplash.com/photo-1541518763669-27fef04b14da?auto=format&fit=crop&q=80&w=800"
            alt="طبق كشري هند"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative z-10">
            <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-2">
              الأكثر مبيعاً 🔥
            </span>
            <h3 className="text-xl font-black">كشري هند الخصوصي</h3>
            <p className="text-xs text-slate-300 mt-1">حمص، عدس أصلي، تقلية مقرمشة، وصلصة هند المسبكة</p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">السعر الاصلي</span>
              <span className="text-xl font-black text-amber-400">45 ج.م</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-extrabold text-xl">
              🍜
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
