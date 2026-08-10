'use client';

import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from '@/context/RestaurantContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/CustomerView/HeroBanner';
import { CategoryTabs } from '@/components/CustomerView/CategoryTabs';
import { MenuItemCard } from '@/components/CustomerView/MenuItemCard';
import { ItemCustomizeModal } from '@/components/CustomerView/ItemCustomizeModal';
import { CartSlideover } from '@/components/CustomerView/CartSlideover';
import { CheckoutModal } from '@/components/CustomerView/CheckoutModal';
import { OrderTrackerModal } from '@/components/CustomerView/OrderTrackerModal';

import { AdminHeader } from '@/components/AdminView/AdminHeader';
import { OverviewDashboard } from '@/components/AdminView/OverviewDashboard';
import { OrdersManager } from '@/components/AdminView/OrdersManager';
import { MenuManager } from '@/components/AdminView/MenuManager';
import { ReportsAnalytics } from '@/components/AdminView/ReportsAnalytics';
import { SettingsManager } from '@/components/AdminView/SettingsManager';

import { MenuItem, CategoryType } from '@/lib/types';
import { ShoppingBag, Phone, MapPin, Clock, Flame, Store, ChevronLeft } from 'lucide-react';

function AppContent() {
  const {
    viewMode,
    adminTab,
    menu,
    addToCart,
    cartCount,
    cartTotal,
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    branchSettings,
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Category items count
  const categoryCounts = menu.reduce((acc, item) => {
    acc['all'] = (acc['all'] || 0) + 1;
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<CategoryType, number>);

  // Filtered Menu Items for display
  const filteredItems = menu.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Cairo',sans-serif] text-slate-900 selection:bg-orange-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {viewMode === 'customer' ? (
          <div>
            {/* Customer Front Store Views */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Category Slider Tabs */}
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={categoryCounts}
            />

            {/* Closed Branch Alert Banner */}
            {!branchSettings.isOpen && (
              <div className="my-4 p-4 rounded-2xl bg-red-900 text-white border border-red-700 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>{branchSettings.closingMessage}</span>
                </div>
                <span className="font-bold text-amber-300">مغلق حالياً</span>
              </div>
            )}

            {/* Menu Items Grid Header */}
            <div className="flex items-center justify-between my-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'all' ? 'كافة الأصناف والأطباق' : 'أطباق قسم ' + selectedCategory}
              </h2>
              <span className="text-xs text-slate-600 font-bold bg-slate-200/80 px-3 py-1 rounded-full">
                {filteredItems.length} صنف متوفر
              </span>
            </div>

            {/* Menu Grid */}
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <p className="font-bold text-base mb-1">لا توجد نتائج تطابق "{searchQuery}"</p>
                <p className="text-xs text-slate-400">جرب البحث بكلمة مختلفة أو اختر قسم آخر من المنيو</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onSelect={(i) => setCustomizingItem(i)}
                  />
                ))}
              </div>
            )}

          </div>
        ) : (
          <div className="py-6 space-y-6">
            {/* Admin Control Dashboard Views */}
            <AdminHeader />

            {adminTab === 'overview' && <OverviewDashboard />}
            {adminTab === 'orders' && <OrdersManager />}
            {adminTab === 'menu' && <MenuManager />}
            {adminTab === 'reports' && <ReportsAnalytics />}
            {adminTab === 'settings' && <SettingsManager />}
          </div>
        )}

      </main>

      {/* Customer Floating Mobile Sticky Cart Bar */}
      {viewMode === 'customer' && cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto sm:hidden animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl flex items-center justify-between border border-slate-800 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs">
                {cartCount}
              </div>
              <span className="text-white text-sm font-bold">عرض سلة طلباتك</span>
            </div>

            <div className="flex items-center gap-1.5 text-orange-400 text-base font-black">
              <span>{cartTotal} ج.م</span>
              <ChevronLeft className="w-5 h-5 text-white rotate-180" />
            </div>
          </button>
        </div>
      )}

      {/* Modals & Slide-overs */}
      <ItemCustomizeModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={addToCart}
      />

      <CartSlideover
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-amber-500/20 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" />
              الخط الساخن: {branchSettings.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              {branchSettings.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              ساعات العمل: 10 ص - 2 صباحاً
            </span>
          </div>

          <p className="text-slate-500">
            © {new Date().getFullYear()} مطعم كشري هند. جميع الحقوق محفوظة. تطبيق وتصميم طلبات الأونلاين ولوحة الإدارة.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function Page() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
