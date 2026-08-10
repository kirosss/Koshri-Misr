export type CategoryType = 'all' | 'koshari' | 'tajins' | 'special' | 'addons' | 'desserts' | 'beverages' | 'family';

export interface SizeOption {
  id: string;
  name: string; // e.g. "فويل صغير", "علبة وسط", "ميجا هند"
  price: number; // in EGP
}

export interface AddonOption {
  id: string;
  name: string; // e.g. "دقة زياده", "تقلية قرمشة", "صلصة حارة"
  price: number; // in EGP
}

export interface MenuItem {
  id: string;
  name: string; // Dish name in Arabic
  description: string;
  category: CategoryType;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  sizes?: SizeOption[];
  availableAddons?: AddonOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  selectedSize?: SizeOption;
  selectedAddons: AddonOption[];
  quantity: number;
  notes?: string;
  totalPrice: number;
}

export type OrderType = 'delivery' | 'pickup' | 'dinein';
export type PaymentMethod = 'cash' | 'vodafone_cash' | 'card';
export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  buildingFloor?: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "KH-1042"
  createdAt: string; // ISO String
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  customer: CustomerInfo;
  estimatedTimeMinutes: number;
}

export interface Coupon {
  id: string;
  code: string; // e.g. "HIND10"
  discountPercent: number; // e.g. 10%
  minOrderAmount: number;
  isActive: boolean;
}

export interface BranchSettings {
  name: string;
  siteName?: string;
  whatsappNumber?: string;
  address: string;
  phone: string;
  isOpen: boolean;
  deliveryFee: number;
  minOrderAmount: number;
  estimatedDeliveryTime: string; // e.g. "25-35 دقيقة"
  acceptingOrders: boolean;
  closingMessage?: string;
  // Hero banner card settings
  heroCardImage?: string;
  heroCardBadge?: string;
  heroCardTitle?: string;
  heroCardDesc?: string;
  heroCardPrice?: string;
}
