'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  ShoppingBag,
  Clock,
  MapPin,
  UtensilsCrossed,
  LayoutDashboard,
  Store,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Phone,
  Flame,
  Search,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const {
    viewMode,
    setViewMode,
    cartCount,
    activeOrdersCount,
    branchSettings,
    setIsOrderTrackerOpen,
    lastPlacedOrder,
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md pt-3 pb-2 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Notice */}
      <div className="max-w-7xl mx-auto mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white px-4 py-1.5 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs">
        <Flame className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <span>عرض اليوم من كشري هند: خصم 20% لكافة الطلبات فوق 100 جنيه بكود <strong className="bg-white text-orange-600 px-1.5 py-0.5 rounded-md font-black">KOSHARI20</strong></span>
        <span className="hidden md:inline-block text-amber-100">• خدمة التوصيل السريع خلال 30 دقيقة 🛵</span>
      </div>

      <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('customer')}
              className="flex items-center gap-3 text-right group focus:outline-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-black shadow-md group-hover:scale-105 transition-transform">
                ك
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl text-slate-800 leading-tight">
                  كشري هند
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  أصيل الطعم والمذاق 🇪🇬
                </span>
              </div>
            </button>

            {/* Branch Status Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-xs border border-slate-200 text-slate-700 mr-2">
              <span className={`w-2.5 h-2.5 rounded-full ${branchSettings.isOpen ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`}></span>
              <span className="font-bold">{branchSettings.isOpen ? 'الفرع مفتوح الآن' : 'مغلق حالياً'}</span>
              <span className="text-slate-300">|</span>
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-slate-500">{branchSettings.address.split('-')[0]}</span>
            </div>
          </div>

          {/* Desktop Right Navigation Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* View Mode Toggle (Customer vs Admin) */}
            <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold border border-slate-200">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  viewMode === 'customer'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>المتجر أونلاين</span>
              </button>

              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all relative ${
                  viewMode === 'admin'
                    ? 'bg-orange-500 text-white font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة الإدارة</span>
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Live Order Tracker Trigger */}
            <button
              onClick={() => setIsOrderTrackerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold border border-slate-200 transition-all relative"
            >
              <Clock className="w-4 h-4 text-orange-500" />
              <span>متابعة الطلبات</span>
              {lastPlacedOrder && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-4 py-2 rounded-2xl active:scale-95 transition-all shadow-sm text-sm"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>السلة</span>
              {cartCount > 0 ? (
                <span className="bg-white text-orange-600 text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-orange-500 text-white p-2.5 rounded-2xl font-bold flex items-center justify-center active:scale-95 transition-transform"
              aria-label="سلة الشراء"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setViewMode('customer');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm border ${
                viewMode === 'customer'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>المتجر أونلاين</span>
            </button>

            <button
              onClick={() => {
                setViewMode('admin');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm border relative ${
                viewMode === 'admin'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>لوحة الإدارة</span>
              {activeOrdersCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              setIsOrderTrackerOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/20 text-sm font-semibold"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>تتبع حالة الطلبات الأخيرة</span>
            </div>
            <span className="text-xs text-slate-400">#KH-1082...</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>الخط الساخن: <strong>{branchSettings.phone}</strong></span>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${branchSettings.isOpen ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400'}`}>
              {branchSettings.isOpen ? 'مفتوح للطلب' : 'مغلق'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
