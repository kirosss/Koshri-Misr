'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { compressImageFile } from '@/lib/image-compression';
import {
  Settings,
  Power,
  Store,
  Phone,
  Truck,
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const {
    branchSettings,
    updateBranchSettings,
    coupons,
    addCoupon,
    deleteCoupon,
    resetToDefaultData,
  } = useRestaurant();

  const [formSettings, setFormSettings] = useState(branchSettings);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(50);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingHeroImage(true);
      const compressedBase64 = await compressImageFile(file, 900, 0.8);
      setFormSettings((prev) => ({
        ...prev,
        heroCardImage: compressedBase64,
      }));
    } catch (err) {
      console.error('Error compressing image:', err);
    } finally {
      setIsUploadingHeroImage(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranchSettings(formSettings);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponPercent,
      minOrderAmount: newCouponMin,
      isActive: true,
    });
    setNewCouponCode('');
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Branch Status Open/Closed Banner */}
      <div className={`p-6 rounded-3xl border shadow-md flex flex-wrap items-center justify-between gap-4 transition-all ${
        branchSettings.isOpen
          ? 'bg-emerald-950 text-white border-emerald-500/40'
          : 'bg-red-950 text-white border-red-500/40'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
            branchSettings.isOpen ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'
          }`}>
            <Power className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl">
              حالة استلام الطلبات: {branchSettings.isOpen ? 'الفرع مفتوح الآن ويستقبل الطلبات' : 'الفرع مغلق حالياً'}
            </h2>
            <p className="text-xs text-slate-300">
              يمكنك إيقاف استقبال الطلبات فوراً في حالة الانشغال أو انتهاء ساعات العمل.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const nextState = !branchSettings.isOpen;
            updateBranchSettings({ isOpen: nextState });
            setFormSettings((prev) => ({ ...prev, isOpen: nextState }));
          }}
          className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-lg ${
            branchSettings.isOpen
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {branchSettings.isOpen ? 'إغلاق الفرع مؤقتاً 🛑' : 'فتح الفرع للطلب أونلاين 🟢'}
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4 border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600" />
            <span>بيانات الفرع والرسوم</span>
          </h3>

          {savedFeedback && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              تم حفظ البيانات بنجاح!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المتجر / العلامة التجارية (تظهر في الهيدر والفووتر)</label>
              <input
                type="text"
                value={formSettings.siteName || ''}
                onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                placeholder="مثال: كشري هند"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الفرع الرئيسي التفصيلي</label>
              <input
                type="text"
                value={formSettings.name}
                onChange={(e) => setFormSettings({ ...formSettings, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الخط الساخن للطلب (يظهر أعلى الهيدر والفووتر)</label>
              <input
                type="text"
                value={formSettings.phone}
                onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الواتساب لاستقبال الطلبات Direct WhatsApp</label>
              <input
                type="text"
                value={formSettings.whatsappNumber || ''}
                onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                placeholder="مثال: 201012345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-bold text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الفرع ومناطق التغطية</label>
            <input
              type="text"
              value={formSettings.address}
              onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رسوم التوصيل (ج.م)</label>
              <input
                type="number"
                value={formSettings.deliveryFee}
                onChange={(e) => setFormSettings({ ...formSettings, deliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الحد الأدنى للطلب (ج.م)</label>
              <input
                type="number"
                value={formSettings.minOrderAmount}
                onChange={(e) => setFormSettings({ ...formSettings, minOrderAmount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">وقت التوصيل المتوقع</label>
              <input
                type="text"
                value={formSettings.estimatedDeliveryTime}
                onChange={(e) => setFormSettings({ ...formSettings, estimatedDeliveryTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Hero Banner Card Management Section */}
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                التحكم في صورة وكارت الواجهة الرئيسية (Hero Card)
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">صورة الكارت البارز في الواجهة</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-28 h-28 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-300 shrink-0 shadow-sm">
                    {formSettings.heroCardImage ? (
                      <img
                        src={formSettings.heroCardImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-500" />
                        <span>لا توجد صورة</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-amber-300 hover:bg-slate-800 font-extrabold text-xs cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{isUploadingHeroImage ? 'جاري التحميل...' : 'رفع صورة من جهازك 🖼️'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        disabled={isUploadingHeroImage}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">أو ضع رابط صورة مباشر (URL)</label>
                      <input
                        type="text"
                        value={formSettings.heroCardImage || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, heroCardImage: e.target.value })}
                        placeholder="https://example.com/koshari-hero.jpg"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">الشارة الترويجية (Badge)</label>
                  <input
                    type="text"
                    value={formSettings.heroCardBadge || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, heroCardBadge: e.target.value })}
                    placeholder="الأكثر مبيعاً 🔥"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">عنوان الطبق / الوجبة</label>
                  <input
                    type="text"
                    value={formSettings.heroCardTitle || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, heroCardTitle: e.target.value })}
                    placeholder="كشري هند الخصوصي"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">السعر المعروض (ج.م)</label>
                  <input
                    type="text"
                    value={formSettings.heroCardPrice || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, heroCardPrice: e.target.value })}
                    placeholder="45"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">وصف المكونات المختصر</label>
                <input
                  type="text"
                  value={formSettings.heroCardDesc || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, heroCardDesc: e.target.value })}
                  placeholder="حمص، عدس أصلي، تقلية مقرمشة، وصلصة هند المسبكة"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Management Section */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b pb-3 border-slate-100">
          <Tag className="w-5 h-5 text-amber-600" />
          <span>إدارة أكواد الخصم والكوبونات</span>
        </h3>

        {/* Add New Coupon Form */}
        <form onSubmit={handleAddCoupon} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">كود الخصم</label>
            <input
              type="text"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              placeholder="مثال: SUMMER20"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">نسبة الخصم (%)</label>
            <input
              type="number"
              value={newCouponPercent}
              onChange={(e) => setNewCouponPercent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">حد أدنى للطلب (ج.م)</label>
            <input
              type="number"
              value={newCouponMin}
              onChange={(e) => setNewCouponMin(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-amber-400 font-extrabold text-xs hover:bg-red-700 hover:text-white transition-colors"
            >
              إضافة كود خصم
            </button>
          </div>
        </form>

        {/* Active Coupons List */}
        <div className="space-y-2 pt-2">
          {coupons.map((c) => (
            <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-black text-slate-900 bg-amber-100 px-2.5 py-1 rounded-md text-sm">{c.code}</span>
                <span className="mr-3 font-bold text-emerald-700">خصم {c.discountPercent}%</span>
                <span className="mr-3 text-slate-500">(حد أدنى {c.minOrderAmount} ج.م)</span>
              </div>

              <button
                onClick={() => deleteCoupon(c.id)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                title="حذف الكوبون"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
