'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Order, OrderStatus } from '@/lib/types';
import {
  Search,
  Printer,
  Eye,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bike,
  Volume2,
  VolumeX,
  FileText,
  User,
  X,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, branchSettings } = useRestaurant();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePrintReceipt = (order: Order) => {
    setSelectedOrderForModal(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Sound Alert Toggle & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              soundEnabled
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>تنبيه الصوت للطلبات: {soundEnabled ? 'مفعل' : 'مكتوم'}</span>
          </button>
        </div>

        {/* Live Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الفاتورة أو الهاتف أو الاسم..."
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'كافة الطلبات', count: orders.length },
          { id: 'pending', label: 'جديدة 🔴', count: orders.filter((o) => o.status === 'pending').length },
          { id: 'preparing', label: 'في المطبخ 🍳', count: orders.filter((o) => o.status === 'preparing').length },
          { id: 'delivering', label: 'مع المندوب 🛵', count: orders.filter((o) => o.status === 'delivering').length },
          { id: 'completed', label: 'مكتملة ✅', count: orders.filter((o) => o.status === 'completed').length },
          { id: 'cancelled', label: 'ملغاة ❌', count: orders.filter((o) => o.status === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedStatus === tab.id
                ? 'bg-slate-900 text-amber-400 shadow-md ring-2 ring-amber-500/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className="mr-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List Table / Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-amber-200/80 text-center text-slate-500">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-bold">لا توجد طلبات تطابق معايير البحث الحالية</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm hover:border-amber-400 transition-all text-right"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-900 bg-amber-100/80 text-amber-950 px-3 py-1 rounded-xl">
                    {order.id}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {order.customer.name} ({order.customer.phone})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      تاريخ الطلب: {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    order.status === 'pending'
                      ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                      : order.status === 'preparing'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : order.status === 'delivering'
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : order.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {order.status === 'pending' && 'طلب جديد 🔴'}
                    {order.status === 'preparing' && 'في المطبخ 🍳'}
                    {order.status === 'delivering' && 'جاري التوصيل 🛵'}
                    {order.status === 'completed' && 'تم التسليم ✅'}
                    {order.status === 'cancelled' && 'ملغي ❌'}
                  </span>

                  <button
                    onClick={() => setSelectedOrderForModal(order)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="عرض الفاتورة بالتفصيل"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePrintReceipt(order)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="طباعة فاتورة المطبخ"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items Summary */}
              <div className="py-3 space-y-1.5 text-xs text-slate-700">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>
                      • <strong>{item.menuItem.name}</strong> x {item.quantity}
                      {item.selectedSize && <span className="text-slate-500 font-medium"> ({item.selectedSize.name})</span>}
                      {item.selectedAddons.length > 0 && (
                        <span className="text-amber-800 text-[10px]"> + {item.selectedAddons.map((a) => a.name).join('، ')}</span>
                      )}
                    </span>
                    <span className="font-bold text-slate-900">{item.totalPrice} ج.م</span>
                  </div>
                ))}
              </div>

              {/* Status Updater Actions Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span>نوع الطلب: <strong>{order.orderType === 'delivery' ? 'توصيل' : order.orderType === 'pickup' ? 'استلام' : 'صالة'}</strong></span>
                  <span className="mr-3">طريقة الدفع: <strong>{order.paymentMethod === 'cash' ? 'كاش' : 'إلكتروني'}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-amber-700 text-sm ml-2">الإجمالي: {order.total} ج.م</span>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                    >
                      قبول وتحضير
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivering')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black"
                    >
                      إرسال للمندوب
                    </button>
                  )}

                  {order.status === 'delivering' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black"
                    >
                      تم التسليم
                    </button>
                  )}

                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button
                      onClick={() => {
                        if (confirm('هل أنت تأكد من إمكانية إلغاء هذا الطلب؟')) {
                          updateOrderStatus(order.id, 'cancelled');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal & Printable Thermal Receipt Layout */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 printable-receipt shadow-2xl relative text-right text-xs">
            
            <button
              onClick={() => setSelectedOrderForModal(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b pb-3 border-dashed border-slate-300">
              <h2 className="font-black text-xl text-slate-900">كشري هند - Koshari Hind</h2>
              <p className="text-[10px] text-slate-500">{branchSettings.name}</p>
              <p className="text-[10px] text-slate-500">الخط الساخن: {branchSettings.phone}</p>
              <div className="mt-2 inline-block px-3 py-1 rounded-md bg-slate-900 text-amber-400 font-black text-sm">
                فاتورة طلب رقم: {selectedOrderForModal.id}
              </div>
            </div>

            {/* Receipt Customer Details */}
            <div className="space-y-1 text-[11px] border-b pb-3 border-dashed border-slate-300">
              <p><strong>العميل:</strong> {selectedOrderForModal.customer.name}</p>
              <p><strong>الهاتف:</strong> {selectedOrderForModal.customer.phone}</p>
              <p><strong>العنوان:</strong> {selectedOrderForModal.customer.address || 'استلام بالفرع'}</p>
              {selectedOrderForModal.customer.buildingFloor && <p><strong>الدور/الشقة:</strong> {selectedOrderForModal.customer.buildingFloor}</p>}
            </div>

            {/* Receipt Items */}
            <div className="space-y-2 border-b pb-3 border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-slate-900 border-b pb-1">
                <span>الصنف والكمية</span>
                <span>السعر</span>
              </div>
              {selectedOrderForModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <span className="font-bold">{item.menuItem.name} x {item.quantity}</span>
                    {item.selectedSize && <span className="text-[10px] block text-slate-500">حجم: {item.selectedSize.name}</span>}
                    {item.selectedAddons.map((a) => (
                      <span key={a.id} className="text-[9px] block text-slate-500">+ {a.name}</span>
                    ))}
                  </div>
                  <span className="font-bold">{item.totalPrice} ج.م</span>
                </div>
              ))}
            </div>

            {/* Receipt Totals */}
            <div className="space-y-1 font-bold pt-1">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{selectedOrderForModal.subtotal} ج.م</span>
              </div>
              {selectedOrderForModal.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>الخصم:</span>
                  <span>- {selectedOrderForModal.discount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>التوصيل:</span>
                <span>{selectedOrderForModal.deliveryFee} ج.م</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>الإجمالي النهائي:</span>
                <span>{selectedOrderForModal.total} ج.م</span>
              </div>
            </div>

            <div className="pt-3 text-center border-t border-dashed border-slate-300">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الفاتورة الآن</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
