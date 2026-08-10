'use client';

import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Store,
  Bell,
  RefreshCw,
  Flame,
} from 'lucide-react';

interface NavItem {
  id: 'overview' | 'orders' | 'menu' | 'reports' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const AdminHeader: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setViewMode,
    activeOrdersCount,
    branchSettings,
    resetToDefaultData,
  } = useRestaurant();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'الإحصائيات المباشرة', icon: LayoutDashboard },
    { id: 'orders', label: 'إدارة الطلبات', icon: ClipboardList, badge: activeOrdersCount },
    { id: 'menu', label: 'إدارة المنيو', icon: UtensilsCrossed },
    { id: 'reports', label: 'التقارير والمبيعات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات والكوبونات', icon: Settings },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-xs">
            ك
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-slate-800 leading-tight">
                كشري هند - لوحة التحكم والإدارة
              </h1>
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                المدير
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">إدارة الطلبات الحية، المنيو، والتقارير اليومية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('هل تريد إعادة تعيين كافة البيانات إلى وضع العرض الافتراضي؟')) {
                resetToDefaultData();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            title="إعادة ضبط البيانات النموذجية"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إعادة ضبط</span>
          </button>

          <button
            onClick={() => setViewMode('customer')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
          >
            <Store className="w-4 h-4" />
            <span>عرض المتجر</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = adminTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
                isActive
                  ? 'bg-orange-500 text-white shadow-xs font-black'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
