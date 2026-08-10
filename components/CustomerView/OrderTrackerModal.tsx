'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { OrderStatus, Order } from '@/lib/types';
import { openWhatsAppOrderLink } from '@/lib/whatsapp';
import {
  X,
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  Home,
  Phone,
  FileText,
  MapPin,
  Flame,
  AlertCircle,
  MessageSquare,
  Search,
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const { orders, lastPlacedOrder, branchSettings } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Search logic for finding order by ID or phone number
  let matchedOrders: Order[] = orders;
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    matchedOrders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.name.toLowerCase().includes(q)
    );
  }

  // Selected order to view
  const currentOrder: Order | undefined =
    matchedOrders.length > 0 ? matchedOrders[0] : lastPlacedOrder || orders[0];

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 1;
      case 'delivering':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'تم استلام الطلب', desc: 'وصل للمطعم', icon: FileText },
    { title: 'جاري التحضير', desc: 'في مطبخ هند', icon: ChefHat },
    { title: 'جاري التوصيل', desc: 'مع طيار الدليفري', icon: Bike },
    { title: 'تم التسليم', desc: 'بالهناء والشفاء', icon: Home },
  ];

  const currentStepIndex = currentOrder ? getStatusStepIndex(currentOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-amber-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-amber-300">متابعة حالة الطلب</h2>
              <p className="text-xs text-slate-400">أدخل رقم الطلب أو رقم الهاتف لمتابعة التحديثات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/80">
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            البحث برقم الطلب (مثال: #ORD-1001) أو رقم الهاتف:
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="أدخل رقم الفاتورة / رقم الهاتف لتتبع طلبك..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-right">
          {!currentOrder ? (
            <div className="py-12 text-center text-slate-500">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="font-bold text-slate-800">لم يتم العثور على طلب بهذا الرقم</p>
              <p className="text-xs text-slate-500 mt-1">تأكد من إدخال رقم الطلب الصحيح أو رقم الهاتف المستخدم عند الشراء</p>
            </div>
          ) : (
            <>
              {/* Order Info Bar */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">رقم الفاتورة</span>
                  <span className="text-lg font-black text-white">{currentOrder.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">الوقت المتوقع</span>
                  <span className="text-sm font-bold text-emerald-400">{currentOrder.estimatedTimeMinutes} دقيقة</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">الإجمالي الكلي</span>
                  <span className="text-lg font-black text-amber-300">{currentOrder.total} ج.م</span>
                </div>
              </div>

              {/* Step Progress Tracker */}
              {currentOrder.status === 'cancelled' ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center font-bold text-sm">
                  تم إلغاء هذا الطلب من قبل المطعم أو بناءً على طلبك.
                </div>
              ) : (
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-4">مراحل تنفيذ الطلب:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-500/40 scale-102'
                              : isCompleted
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            isCurrent
                              ? 'bg-slate-950 text-amber-400'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold leading-tight">{step.title}</span>
                          <span className="text-[10px] opacity-80 mt-0.5">{step.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Address & Customer details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>تفاصيل عنوان الشحن والاستلام:</span>
                </div>
                <p><strong>الاسم:</strong> {currentOrder.customer.name} ({currentOrder.customer.phone})</p>
                <p><strong>العنوان:</strong> {currentOrder.customer.address || 'استلام من الفرع'}</p>
                {currentOrder.customer.notes && <p><strong>ملاحظات:</strong> {currentOrder.customer.notes}</p>}
              </div>

              {/* Items Breakdown & WhatsApp Share */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900">الأصناف المطلوبة ({currentOrder.items.length}):</h4>
                  <button
                    onClick={() =>
                      openWhatsAppOrderLink(
                        currentOrder,
                        branchSettings.whatsappNumber || branchSettings.phone || '201012345678',
                        branchSettings.siteName || 'كشري هند'
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    <span>إرسال تفاصيل الفاتورة عبر الواتساب 📱</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-white border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900">{item.menuItem.name} x {item.quantity}</span>
                        {item.selectedSize && <span className="text-[10px] text-slate-500 mr-2">({item.selectedSize.name})</span>}
                      </div>
                      <span className="font-black text-amber-700">{item.totalPrice} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>

            </>
          )}
        </div>

        {/* Footer Support Hotline */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-white flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>لأي استفسار عن الطلب اتصل بالخط الساخن: <strong>{branchSettings.phone}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
