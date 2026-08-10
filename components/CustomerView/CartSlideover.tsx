'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  Flame,
} from 'lucide-react';

interface CartSlideoverProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartSlideover: React.FC<CartSlideoverProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    branchSettings,
  } = useRestaurant();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-amber-300">
          
          {/* Cart Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-amber-300">سلة طلبات كشري هند</h2>
                <p className="text-xs text-slate-400">({cart.length}) صنف في السلة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded-lg hover:bg-red-950/50 transition-colors"
                >
                  تفرغ السلة
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-1">السلة فارغة حالياً</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  اختر أشهى أطباق الكشري والطواجن من المنيو وأضفها لسلتك الآن!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 text-amber-400 font-bold text-xs hover:bg-red-700 hover:text-white transition-colors shadow-md"
                >
                  تصفح المنيو الأشهى 🍲
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-slate-50 rounded-2xl p-3.5 border border-amber-200/80 shadow-2xs flex gap-3 text-right"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-20 h-20 rounded-xl object-cover border border-amber-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors shrink-0"
                          title="حذف الصنف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedSize && (
                        <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md mt-1">
                          حجم: {item.selectedSize.name}
                        </span>
                      )}

                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-slate-600 mt-1 leading-tight">
                          إضافات: {item.selectedAddons.map((a) => a.name).join('، ')}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">
                          ملاحظة: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/70">
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-1.5 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded-md text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-black text-amber-700 text-sm sm:text-base">
                        {item.totalPrice} <span className="text-[10px] font-bold">ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-900 text-white border-t border-slate-800 space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-500/50 p-2.5 rounded-xl text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>الكوبون <strong>{appliedCoupon.code}</strong> (خصم {appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-white font-bold px-2 py-0.5 rounded bg-red-950/80 text-[10px]"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="كود الخصم (جرب: HIND10 أو KOSHARI20)"
                        className="w-full text-xs py-2.5 pr-3 pl-8 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors shrink-0"
                    >
                      تطبيق
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 font-bold ${couponFeedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponFeedback.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{couponFeedback.message}</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>إجمالي المنتجات:</span>
                  <span className="font-bold text-white">{cartSubtotal} ج.م</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>قيمة الخصم:</span>
                    <span>- {discountAmount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    خدمة التوصيل:
                  </span>
                  <span className="font-bold text-white">{branchSettings.deliveryFee} ج.م</span>
                </div>

                <div className="flex justify-between text-base sm:text-lg font-black text-amber-400 pt-2 border-t border-slate-800">
                  <span>المبلغ الإجمالي المطلق:</span>
                  <span className="text-xl font-extrabold">{cartTotal} ج.م</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-xl shadow-amber-500/20"
              >
                <span>متابعة إتمام الطلب</span>
                <ArrowRight className="w-5 h-5 text-slate-950 rotate-180" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
