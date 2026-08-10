'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  BranchSettings,
  Coupon,
  SizeOption,
  AddonOption,
  CustomerInfo,
  OrderType,
  PaymentMethod,
} from '@/lib/types';
import {
  INITIAL_MENU,
  INITIAL_BRANCH_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_SEED_ORDERS,
} from '@/lib/initial-data';
import { saveToIDB, getFromIDB } from '@/lib/db-storage';

interface RestaurantContextType {
  // Navigation State
  viewMode: 'customer' | 'admin';
  setViewMode: (mode: 'customer' | 'admin') => void;
  adminTab: 'overview' | 'orders' | 'menu' | 'reports' | 'settings';
  setAdminTab: (tab: 'overview' | 'orders' | 'menu' | 'reports' | 'settings') => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;

  // Menu State
  menu: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (item: MenuItem, size?: SizeOption, addons?: AddonOption[], quantity?: number, notes?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartCount: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;

  // Orders State
  orders: Order[];
  placeOrder: (customer: CustomerInfo, orderType: OrderType, paymentMethod: PaymentMethod) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  activeOrdersCount: number;
  lastPlacedOrder: Order | null;

  // Branch Settings
  branchSettings: BranchSettings;
  updateBranchSettings: (settings: Partial<BranchSettings>) => void;

  // Reset demo
  resetToDefaultData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEY_MENU = 'koshari_hind_menu_v2';
const STORAGE_KEY_ORDERS = 'koshari_hind_orders_v2';
const STORAGE_KEY_SETTINGS = 'koshari_hind_settings_v2';
const STORAGE_KEY_COUPONS = 'koshari_hind_coupons_v2';
const STORAGE_KEY_CART = 'koshari_hind_cart_v2';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'menu' | 'reports' | 'settings'>('overview');
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);

  // Core States
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(INITIAL_SEED_ORDERS);
  const [branchSettings, setBranchSettings] = useState<BranchSettings>(INITIAL_BRANCH_SETTINGS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isStorageLoaded, setIsStorageLoaded] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Load from localStorage / IndexedDB after mount to prevent SSR hydration mismatches
  useEffect(() => {
    let isMounted = true;

    async function loadSavedData() {
      try {
        // 1. Menu
        let loadedMenu: MenuItem[] | null = null;
        const savedMenuStr = localStorage.getItem(STORAGE_KEY_MENU);
        if (savedMenuStr) {
          try { loadedMenu = JSON.parse(savedMenuStr); } catch {}
        }
        if (!loadedMenu) {
          loadedMenu = await getFromIDB<MenuItem[]>(STORAGE_KEY_MENU);
        }
        if (loadedMenu && loadedMenu.length > 0 && isMounted) {
          setMenu(loadedMenu);
        }

        // 2. Orders
        let loadedOrders: Order[] | null = null;
        const savedOrdersStr = localStorage.getItem(STORAGE_KEY_ORDERS);
        if (savedOrdersStr) {
          try { loadedOrders = JSON.parse(savedOrdersStr); } catch {}
        }
        if (!loadedOrders) {
          loadedOrders = await getFromIDB<Order[]>(STORAGE_KEY_ORDERS);
        }
        if (loadedOrders && isMounted) {
          setOrders(loadedOrders);
        }

        // 3. Branch Settings
        let loadedSettings: BranchSettings | null = null;
        const savedSettingsStr = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (savedSettingsStr) {
          try { loadedSettings = JSON.parse(savedSettingsStr); } catch {}
        }
        if (!loadedSettings) {
          loadedSettings = await getFromIDB<BranchSettings>(STORAGE_KEY_SETTINGS);
        }
        if (loadedSettings && isMounted) {
          setBranchSettings(loadedSettings);
        }

        // 4. Coupons
        let loadedCoupons: Coupon[] | null = null;
        const savedCouponsStr = localStorage.getItem(STORAGE_KEY_COUPONS);
        if (savedCouponsStr) {
          try { loadedCoupons = JSON.parse(savedCouponsStr); } catch {}
        }
        if (!loadedCoupons) {
          loadedCoupons = await getFromIDB<Coupon[]>(STORAGE_KEY_COUPONS);
        }
        if (loadedCoupons && isMounted) {
          setCoupons(loadedCoupons);
        }

        // 5. Cart
        let loadedCart: CartItem[] | null = null;
        const savedCartStr = localStorage.getItem(STORAGE_KEY_CART);
        if (savedCartStr) {
          try { loadedCart = JSON.parse(savedCartStr); } catch {}
        }
        if (!loadedCart) {
          loadedCart = await getFromIDB<CartItem[]>(STORAGE_KEY_CART);
        }
        if (loadedCart && isMounted) {
          setCart(loadedCart);
        }
      } catch (e) {
        console.error('Failed to load local storage:', e);
      } finally {
        if (isMounted) {
          setIsStorageLoaded(true);
        }
      }
    }

    loadSavedData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync back to LocalStorage & IndexedDB (ONLY after initial load finishes)
  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu));
    } catch (e) {}
    saveToIDB(STORAGE_KEY_MENU, menu);
  }, [menu, isStorageLoaded]);

  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {}
    saveToIDB(STORAGE_KEY_ORDERS, orders);
  }, [orders, isStorageLoaded]);

  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(branchSettings));
    } catch (e) {}
    saveToIDB(STORAGE_KEY_SETTINGS, branchSettings);
  }, [branchSettings, isStorageLoaded]);

  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
    } catch (e) {}
    saveToIDB(STORAGE_KEY_COUPONS, coupons);
  }, [coupons, isStorageLoaded]);

  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {}
    saveToIDB(STORAGE_KEY_CART, cart);
  }, [cart, isStorageLoaded]);

  // MENU ACTIONS
  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const item: MenuItem = {
      ...newItem,
      id: 'item_' + Date.now().toString(36),
    };
    setMenu((prev) => [item, ...prev]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenu((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const deleteMenuItem = (id: string) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  // CART ACTIONS
  const addToCart = (
    item: MenuItem,
    size?: SizeOption,
    selectedAddons: AddonOption[] = [],
    quantity: number = 1,
    notes: string = ''
  ) => {
    const unitPrice = (size ? size.price : item.basePrice) + selectedAddons.reduce((a, b) => a + b.price, 0);
    const totalPrice = unitPrice * quantity;
    const cartItemId = `${item.id}_${size ? size.id : 'base'}_${selectedAddons.map((a) => a.id).sort().join('-')}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: unitPrice * newQty,
          notes: notes || existing.notes,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            selectedSize: size,
            selectedAddons,
            quantity,
            notes,
            totalPrice,
          },
        ];
      }
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice = ci.totalPrice / ci.quantity;
            return {
              ...ci,
              quantity: newQty,
              totalPrice: unitPrice * newQty,
            };
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // CALCULATIONS
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const deliveryFee = cart.length > 0 ? branchSettings.deliveryFee : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // COUPON ACTIONS
  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { success: false, message: 'كوبون الخصم غير صحيح أو منتهي الصلاحية' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `حد أدنى للطلب لاستخدام الكوبون: ${found.minOrderAmount} جنيه`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `تم تطبيق خصم ${found.discountPercent}% بنجاح!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newC: Coupon = {
      ...coupon,
      id: 'c_' + Date.now().toString(36),
    };
    setCoupons((prev) => [newC, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (appliedCoupon?.id === id) setAppliedCoupon(null);
  };

  // ORDERS ACTIONS
  const placeOrder = (
    customer: CustomerInfo,
    orderType: OrderType,
    paymentMethod: PaymentMethod
  ): Order => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const finalDeliveryFee = orderType === 'delivery' ? branchSettings.deliveryFee : 0;
    const finalTotal = Math.max(0, cartSubtotal - discountAmount + finalDeliveryFee);

    const newOrder: Order = {
      id: `KH-${orderNumber}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: finalDeliveryFee,
      discount: discountAmount,
      total: finalTotal,
      status: 'pending',
      orderType,
      paymentMethod,
      customer,
      estimatedTimeMinutes: orderType === 'delivery' ? 30 : 15,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setIsOrderTrackerOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (lastPlacedOrder?.id === orderId) {
      setLastPlacedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'delivering'
  ).length;

  const updateBranchSettings = (settings: Partial<BranchSettings>) => {
    setBranchSettings((prev) => ({ ...prev, ...settings }));
  };

  const resetToDefaultData = () => {
    setMenu(INITIAL_MENU);
    setOrders(INITIAL_SEED_ORDERS);
    setBranchSettings(INITIAL_BRANCH_SETTINGS);
    setCoupons(INITIAL_COUPONS);
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem(STORAGE_KEY_MENU);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_COUPONS);
    localStorage.removeItem(STORAGE_KEY_CART);
  };

  return (
    <RestaurantContext.Provider
      value={{
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        menu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartCount,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        addCoupon,
        deleteCoupon,
        orders,
        placeOrder,
        updateOrderStatus,
        activeOrdersCount,
        lastPlacedOrder,
        branchSettings,
        updateBranchSettings,
        resetToDefaultData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
