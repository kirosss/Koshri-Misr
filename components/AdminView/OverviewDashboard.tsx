'use client';

import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  Banknote,
  ShoppingBag,
  TrendingUp,
  Award,
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { orders, setAdminTab, updateOrderStatus } = useRestaurant();

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const deliveringOrders = orders.filter((o) => o.status === 'delivering');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Layout - Main Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Bento Card 1: Today's Total Sales */}
        <div className="md:col-span-4 bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col justify-between shadow-xs min-h-[200px]">
          <div>
            <p className="text-slate-500 text-sm font-bold mb-1">إجمالي مبيعات اليوم</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              {totalRevenue.toLocaleString()} <span className="text-lg font-bold text-slate-400">ج.م</span>
            </h2>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-black">
              <span>↑ +18.5%</span>
              <span className="text-emerald-500 font-medium">عن الأمس</span>
            </div>
            <span className="text-xs text-slate-400 font-bold">{totalOrdersCount} طلب محقق</span>
          </div>
        </div>

        {/* Bento Card 2: Weekly Orders Chart Visual */}
        <div className="md:col-span-8 bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base">مخطط الطلبات الأسبوعي</h3>
              <p className="text-xs text-slate-400 font-medium">موزعة على الأيام السبعة الماضية</p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
          </div>

          <div className="flex items-end justify-between h-28 px-2 pt-2">
            <div className="w-10 bg-orange-100 rounded-t-xl h-[40%] flex justify-center pt-1"><span className="text-[9px] font-bold text-orange-600">32</span></div>
            <div className="w-10 bg-orange-200 rounded-t-xl h-[60%] flex justify-center pt-1"><span className="text-[9px] font-bold text-orange-600">45</span></div>
            <div className="w-10 bg-orange-300 rounded-t-xl h-[85%] flex justify-center pt-1"><span className="text-[9px] font-bold text-orange-700">68</span></div>
            <div className="w-10 bg-orange-500 rounded-t-xl h-[100%] flex justify-center pt-1"><span className="text-[9px] font-bold text-white">84</span></div>
            <div className="w-10 bg-orange-300 rounded-t-xl h-[70%] flex justify-center pt-1"><span className="text-[9px] font-bold text-orange-700">56</span></div>
            <div className="w-10 bg-orange-200 rounded-t-xl h-[55%] flex justify-center pt-1"><span className="text-[9px] font-bold text-orange-600">42</span></div>
            <div className="w-10 bg-orange-100 rounded-t-xl h-[30%] flex justify-center pt-1"><span className="text-[9px] font-bold text-orange-600">28</span></div>
          </div>

          <div className="flex justify-between px-2 mt-2 text-[10px] text-slate-400 font-black border-t border-slate-100 pt-1.5">
            <span>السبت</span>
            <span>الأحد</span>
            <span>الاثنين</span>
            <span>الثلاثاء</span>
            <span>الأربعاء</span>
            <span>الخميس</span>
            <span>الجمعة</span>
          </div>
        </div>

      </div>

      {/* Bento Grid Layout - Main Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Bento Card 3: Recent Orders Stream */}
        <div className="md:col-span-4 bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">أحدث الطلبات</h3>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              عرض الكل ←
            </button>
          </div>

          <div className="space-y-3 flex-grow">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div className="flex flex-col max-w-[170px]">
                  <span className="font-bold text-slate-800">{order.id} • {order.customer.name}</span>
                  <span className="text-[11px] text-slate-500 truncate">
                    {order.items.map((i) => i.menuItem.name).join('، ')}
                  </span>
                </div>

                {order.status === 'pending' && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-bold">
                    قيد الانتظار
                  </span>
                )}
                {order.status === 'preparing' && (
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-lg font-bold">
                    قيد التحضير
                  </span>
                )}
                {order.status === 'delivering' && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-lg font-bold">
                    في الطريق
                  </span>
                )}
                {order.status === 'completed' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg font-bold">
                    تم التوصيل
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setAdminTab('orders')}
            className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs mt-4 hover:bg-slate-800 transition-colors"
          >
            إدارة كافة الطلبات الواردة
          </button>
        </div>

        {/* Bento Card 4: Best Sellers Highlights (Dark Premium Bento Box) */}
        <div className="md:col-span-5 bg-slate-900 rounded-[2rem] p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-5 flex items-center justify-between">
              <span>الأكثر مبيعاً هذا الشهر</span>
              <span className="text-xs bg-slate-800 text-orange-400 px-2.5 py-1 rounded-full font-bold">تقرير فوري</span>
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-lg shrink-0">🍜</div>
                <div className="flex-grow">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>كشري هند الخصوصي</span>
                    <span className="text-orange-400">840 طلب</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-lg shrink-0">🥘</div>
                <div className="flex-grow">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>طاجن فراخ بالصلصة</span>
                    <span className="text-orange-300">612 طلب</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-orange-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-lg shrink-0">🍮</div>
                <div className="flex-grow">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>أرز باللبن بالمكسرات</span>
                    <span className="text-orange-200">420 طلب</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-orange-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Bento Card 5: Quick Cashier Action & Store Status */}
        <div className="md:col-span-3 space-y-4">
          
          {/* Quick Order Cashier Button */}
          <div
            onClick={() => setAdminTab('orders')}
            className="bg-orange-500 hover:bg-orange-600 transition-colors rounded-[2rem] p-6 text-white shadow-xs flex flex-col justify-center items-center text-center cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-2 text-2xl group-hover:scale-110 transition-transform">
              ➕
            </div>
            <h3 className="font-bold text-base leading-tight">إضافة طلب جديد</h3>
            <p className="text-white/80 text-xs mt-1">نظام الكاشير السريع</p>
          </div>

          {/* Store Status Indicator */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-5 shadow-xs flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-800">حالة الفرع: مفتوح</span>
            </div>
            <p className="text-xs text-slate-400">استقبال الطلبات أونلاين فعال</p>
            <div className="mt-3 flex gap-1">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500"></div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Live Status Pipeline Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-md">
        <h3 className="font-bold text-sm text-orange-400 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>تتبع العمليات الحية في المطبخ:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-amber-400 font-bold block mb-1">جديدة</span>
            <span className="text-xl font-black text-amber-300">{pendingOrders.length}</span>
          </div>
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-orange-400 font-bold block mb-1">في المطبخ</span>
            <span className="text-xl font-black text-orange-300">{preparingOrders.length}</span>
          </div>
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-blue-400 font-bold block mb-1">مع التوصيل</span>
            <span className="text-xl font-black text-blue-300">{deliveringOrders.length}</span>
          </div>
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-emerald-400 font-bold block mb-1">مكتملة</span>
            <span className="text-xl font-black text-emerald-300">{completedOrders.length}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
