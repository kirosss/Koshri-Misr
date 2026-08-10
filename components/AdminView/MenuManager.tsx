'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { MenuItem, CategoryType } from '@/lib/types';
import { CATEGORIES } from '@/components/CustomerView/CategoryTabs';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  Flame,
  Search,
  X,
  Check,
  UtensilsCrossed,
} from 'lucide-react';

export const MenuManager: React.FC = () => {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [formState, setFormState] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    category: 'koshari',
    basePrice: 30,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    isPopular: false,
    isSpicy: false,
    isNew: false,
  });

  const filteredMenu = menu.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOpenAddModal = () => {
    setFormState({
      name: '',
      description: '',
      category: 'koshari',
      basePrice: 30,
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      isPopular: false,
      isSpicy: false,
      isNew: false,
    });
    setIsAddingNew(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormState({ ...item });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.basePrice) return;

    if (isAddingNew) {
      addMenuItem(formState as Omit<MenuItem, 'id'>);
      setIsAddingNew(false);
    } else if (editingItem) {
      updateMenuItem({ ...editingItem, ...formState } as MenuItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900">إدارة منيو مطعم كشري هند</h2>
            <p className="text-xs text-slate-500">إضافة أصناف جديدة، تعديل الأسعار، وإيقاف المبيعات مؤقتاً</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة طبق جديد للمنيو</span>
        </button>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-amber-400 font-black shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.icon} {cat.name}</span>
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl p-4 border border-amber-200/80 shadow-sm flex flex-col justify-between text-right ${
              !item.isAvailable ? 'bg-slate-50 opacity-75' : ''
            }`}
          >
            <div className="flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h3>
                  <span className="font-black text-amber-700 text-sm whitespace-nowrap">{item.basePrice} ج.م</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => toggleItemAvailability(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  item.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{item.isAvailable ? 'متوفر حالياً' : 'غير متوفر'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="تعديل الصنف"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`هل أنت متاكد من حذف "${item.name}" نهائياً؟`)) {
                      deleteMenuItem(item.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                  title="حذف الصنف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Dish */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right text-xs space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">
                {isAddingNew ? 'إضافة طبق جديد للمنيو' : `تعديل طبق: ${editingItem?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الصنف بالكامل *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المكونات والتحضير</label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر الأساسي (ج.م) *</label>
                  <input
                    type="number"
                    value={formState.basePrice}
                    onChange={(e) => setFormState({ ...formState, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابط صورة الطبق (Image URL)</label>
                <input
                  type="url"
                  value={formState.image}
                  onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formState.isPopular}
                    onChange={(e) => setFormState({ ...formState, isPopular: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>الأكثر طلباً🔥</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formState.isSpicy}
                    onChange={(e) => setFormState({ ...formState, isSpicy: e.target.checked })}
                    className="rounded text-red-500"
                  />
                  <span>سبايسي حار 🌶️</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formState.isAvailable}
                    onChange={(e) => setFormState({ ...formState, isAvailable: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span>متوفر للطلب ✅</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-colors mt-2"
              >
                حفظ التغييرات الآن
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
