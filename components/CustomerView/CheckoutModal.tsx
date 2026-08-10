'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { OrderType, PaymentMethod, CustomerInfo } from '@/lib/types';
import { openWhatsAppOrderLink } from '@/lib/whatsapp';
import {
  X,
  Truck,
  Store,
  Utensils,
  Wallet,
  CreditCard,
  Banknote,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Clock,
  MessageSquare,
  Flame,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    branchSettings,
    placeOrder,
  } = useRestaurant();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    buildingFloor: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'يرجى إدخال اسمك بالكامل';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'يرجى إدخال رقم هاتف صحبح لمتابعة الطلب (مثال: 01012345678)';
    }
    if (orderType === 'delivery' && !formData.address.trim()) {
      errs.address = 'يرجى إدخال عنوان التوصيل بالتفصيل';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProcessOrder = (sendToWhatsApp: boolean = false) => {
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = placeOrder(formData, orderType, paymentMethod);
      if (sendToWhatsApp && createdOrder) {
        openWhatsAppOrderLink(
          createdOrder,
          branchSettings.whatsappNumber || branchSettings.phone || '201012345678',
          branchSettings.siteName || 'كشري هند'
        );
      }
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessOrder(true); // Default form submit sends via WhatsApp
  };

  const finalDeliveryFee = orderType === 'delivery' ? branchSettings.deliveryFee : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + finalDeliveryFee);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-amber-300 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-amber-300">إتمام طلب كشري هند</h2>
              <p className="text-xs text-slate-400">أدخل بيانات التوصيل والدفع لإتمام الطلب فوراً</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-right">
          
          {/* Order Type Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              طريقة استلام الطلب
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-extrabold ${
                  orderType === 'delivery'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>توصيل للمنزل</span>
                <span className="text-[10px] font-normal text-slate-800">({branchSettings.deliveryFee} ج.م)</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-extrabold ${
                  orderType === 'pickup'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>استلام من الفرع</span>
                <span className="text-[10px] font-normal text-slate-800">(مجاناً)</span>
              </button>
            </div>
          </div>

          {/* Customer Inputs */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>بيانات العميل والموقع</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم العميل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد محمود"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                    errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-amber-500'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف للتواصل والواتساب <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="مثال: 01012345678"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                    errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-amber-500'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.phone}</p>}
              </div>
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عنوان التوصيل بالتفصيل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="اسم الشارع، اسم المنطقة، رقم العمارة ومدرس شهير"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                      errors.address ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الدور ورقم الشقة
                    </label>
                    <input
                      type="text"
                      value={formData.buildingFloor}
                      onChange={(e) => setFormData({ ...formData, buildingFloor: e.target.value })}
                      placeholder="الدور الثالث / شقة 302"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      تعليمات للطيار
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="مثال: يرجي الاتصال عند الوصول للباب"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              طريقة الدفع
            </label>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-400 text-slate-900 flex items-center gap-3">
              <Banknote className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-right">
                <span className="block font-black text-xs sm:text-sm">الدفع كاش نقداً عند الاستلام 💵</span>
                <span className="text-[10px] text-slate-600">تسليم المبلغ المباشر لمندوب التوصيل أو بالفرع</span>
              </div>
            </div>
          </div>

          {/* Order Brief Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>عدد الأصناف في الطلب:</span>
              <span className="text-amber-400">{cart.length} أصناف</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>الوقت المتوقع للتوصيل:</span>
              <span className="text-emerald-400">{branchSettings.estimatedDeliveryTime}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-black text-amber-300 pt-2 border-t border-slate-800">
              <span>المبلغ الكلي المطلوب:</span>
              <span className="text-xl text-amber-400">{finalTotal} ج.م</span>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
              <span>تأكيد وإرسال الطلب ({finalTotal} ج.م) 📱</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
