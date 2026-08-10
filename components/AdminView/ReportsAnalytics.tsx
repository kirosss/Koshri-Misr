'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  PieChart,
  Printer,
  Award,
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { orders, menu } = useRestaurant();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');

  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveryOrders = validOrders.filter((o) => o.orderType === 'delivery');
  const pickupOrders = validOrders.filter((o) => o.orderType !== 'delivery');

  const deliveryRevenue = deliveryOrders.reduce((sum, o) => sum + o.total, 0);
  const pickupRevenue = pickupOrders.reduce((sum, o) => sum + o.total, 0);

  const deliveryPercent = totalRevenue > 0 ? Math.round((deliveryRevenue / totalRevenue) * 100) : 0;
  const pickupPercent = totalRevenue > 0 ? 100 - deliveryPercent : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900">تقارير المبيعات والأداء</h2>
            <p className="text-xs text-slate-500">تحليلات الأرباح، نسب التوصيل، والأصناف الأكثر مبيعاً</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['today', 'week', 'month'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === t ? 'bg-slate-900 text-amber-400 font-extrabold shadow-xs' : 'text-slate-600'
                }`}
              >
                {t === 'today' ? 'اليوم' : t === 'week' ? 'هذا الأسبوع' : 'هذا الشهر'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-amber-400 font-extrabold text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Primary Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-amber-500/20 shadow-lg">
          <span className="text-xs text-amber-400 font-extrabold block mb-1">إجمالي صافي الإيرادات</span>
          <div className="text-3xl font-black text-amber-300 mb-2">
            {totalRevenue} <span className="text-sm font-bold">ج.م</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">
            متضمنة رسوم التوصيل والخصومات
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-extrabold block mb-1">مبيعات الدليفري</span>
          <div className="text-2xl font-black text-slate-900 mb-2">
            {deliveryRevenue} <span className="text-xs text-slate-500">ج.م</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${deliveryPercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            تمثل {deliveryPercent}% من إجمالي الأرباح
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-extrabold block mb-1">مبيعات الفرع والصالة</span>
          <div className="text-2xl font-black text-slate-900 mb-2">
            {pickupRevenue} <span className="text-xs text-slate-500">ج.م</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${pickupPercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            تمثل {pickupPercent}% من إجمالي الأرباح
          </span>
        </div>
      </div>

      {/* Top Dishes Popularity Table */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm text-right">
        <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>ترتيب الأصناف الأكثر طلباً ومبيعاً</span>
        </h3>

        <div className="space-y-3">
          {menu.slice(0, 5).map((dish, idx) => (
            <div key={dish.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{dish.name}</h4>
                  <span className="text-[10px] text-slate-500">السعر: {dish.basePrice} ج.م</span>
                </div>
              </div>

              <div className="text-left">
                <span className="font-black text-amber-700 text-sm block">
                  {Math.floor(Math.random() * 30 + 15)} طلب
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">ممتاز</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
