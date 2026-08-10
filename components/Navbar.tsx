'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Menu as MenuIcon,
  X,
  Phone,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const {
    cartCount,
    branchSettings,
    setIsOrderTrackerOpen,
    lastPlacedOrder,
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const siteName = branchSettings.siteName || 'كشري هند';

  return (
    <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md pt-3 pb-2 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Notice */}
      <div className="max-w-7xl mx-auto mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white px-4 py-1.5 rounded-2xl text-xs font-bold text-center flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Flame className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          <span>عرض اليوم من {siteName}: خصم 20% لكافة الطلبات بكود <strong className="bg-white text-orange-600 px-1.5 py-0.5 rounded-md font-black">KOSHARI20</strong></span>
        </div>

        {/* Top Header Hotline Phone Number Display */}
        <a
          href={`tel:${branchSettings.phone}`}
          className="hidden sm:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-0.5 rounded-xl text-xs font-black transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-200" />
          <span>طلب تلفوني: {branchSettings.phone}</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 text-right group focus:outline-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-black shadow-md group-hover:scale-105 transition-transform">
                {siteName.charAt(0) || 'ك'}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl text-slate-800 leading-tight">
                  {siteName}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  أصيل الطعم والمذاق 🇪🇬
                </span>
              </div>
            </Link>

            {/* Branch Status Badge & Address */}
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
            
            {/* Header Hotline Call Badge */}
            <a
              href={`tel:${branchSettings.phone}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-xs"
              title="اتصل بنا مباشرة"
            >
              <Phone className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>الخط الساخن: <strong className="font-black text-sm text-emerald-900">{branchSettings.phone}</strong></span>
            </a>

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
            {/* Mobile Header Phone Call Button */}
            <a
              href={`tel:${branchSettings.phone}`}
              className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold"
              aria-label="اتصال هاتفي"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
            </a>

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
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 rounded-3xl mt-2 text-white space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">الخط الساخن المباشر:</span>
            </div>
            <a href={`tel:${branchSettings.phone}`} className="text-sm font-black text-emerald-400 underline">
              {branchSettings.phone}
            </a>
          </div>

          <div className="w-full">
            <button
              onClick={() => {
                setIsOrderTrackerOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>متابعة حالة الطلبات</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
