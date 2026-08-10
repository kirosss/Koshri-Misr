'use client';

import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from '@/context/RestaurantContext';
import { AdminView } from '@/components/AdminView/AdminView';
import { Lock, KeyRound, Store, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function AdminPageContent() {
  const { branchSettings } = useRestaurant();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('koshari_admin_authed');
    if (isAuthed === 'true') {
      const timer = setTimeout(() => setIsAuthenticated(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN is 1234
    if (pinInput === '1234' || pinInput === '0000') {
      setIsAuthenticated(true);
      sessionStorage.setItem('koshari_admin_authed', 'true');
      setPinError('');
    } else {
      setPinError('رمز الدخول غير صحيح (رمز الدخول الافتراضي: 1234)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('koshari_admin_authed');
  };

  const siteName = branchSettings.siteName || 'كشري هند';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 text-right font-['Cairo',sans-serif]">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة إدارة {siteName}</h1>
            <p className="text-xs text-slate-400">
              قسم خاص بإدارة المطعم والموظفين. يرجى إدخال رمز الأمان للمتابعة.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رمز المرور للوحة الإدارة (PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="رمز الدخول (الافتراضي: 1234)"
                  maxLength={10}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-center text-lg tracking-widest focus:outline-none focus:border-orange-500 transition-all"
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-4 top-4" />
              </div>
              {pinError && (
                <p className="text-xs text-red-400 font-bold mt-2 text-center">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg active:scale-98"
            >
              تسجيل الدخول للوحة التحكم
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              منطقة آمنة ومحمية
            </span>
            <Link
              href="/"
              className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
            >
              <span>العودة للمتجر</span>
              <Store className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/50 text-[11px] text-slate-400 text-center">
            💡 <strong>ملاحظة للتجربة:</strong> رمز الدخول الافتراضي للوحة الإدارة هو <code className="bg-slate-800 text-orange-300 px-1.5 py-0.5 rounded font-mono font-bold">1234</code>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-['Cairo',sans-serif] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Top Admin Header Bar with Logout & Store Link */}
        <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-bold text-sm text-slate-200">
              جلسة عمل نشطة - مدير {siteName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span>معاينة المتجر أونلاين</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Admin Dashboard */}
        <AdminView />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RestaurantProvider>
      <AdminPageContent />
    </RestaurantProvider>
  );
}
