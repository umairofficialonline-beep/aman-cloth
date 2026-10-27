export interface ProductVariant {
  color: string;
  colorCode?: string;
  sizes: {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Unstitched' | string;
    stock: number;
  }[];
}

export interface ProductReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  description: string;
  fabricDetails?: string;
  careInstructions?: string;
  packageContains?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  isUnstitched?: boolean;
  isPublished?: boolean;
  tags: string[];
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
  displayOrder: number;
  isVisible?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'BankTransfer' | 'WhatsAppOrder';

export interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Unpaid' | 'Paid';
  orderStatus: OrderStatus;
  statusHistory?: OrderStatusEntry[];
  courierName?: string;
  trackingNumber?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  buttonText: string;
  link: string;
  image: string;
  isActive: boolean;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: string;
  timestamp: string;
  adminEmail?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  currency: string;
  currencySymbol: string;
  announcementBarText: string;
  announcementActive: boolean;
  standardShippingFee: number;
  freeShippingThreshold: number;
  enableCod: boolean;
  enableBankTransfer: boolean;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
    youtube?: string;
  };
  heroBanner: {
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  promotionalBanners: PromoBanner[];
  policies: {
    shipping: string;
    returns: string;
    privacy: string;
    terms: string;
    about: string;
  };
}

export interface AdminMetrics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  salesTrend: { date: string; amount: number; orders: number }[];
}

export interface SalesAnalyticsReport {
  timeframe: 'day' | 'week' | 'month' | 'all';
  grossRevenue: number;
  netRevenue: number;
  totalDiscounts: number;
  cancelledRevenue: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  inventoryValuation: {
    totalUnits: number;
    totalRetailValue: number;
  };
  bestSellingProducts: {
    productId: string;
    name: string;
    unitsSold: number;
    revenue: number;
    stockRemaining: number;
  }[];
  salesByCategory: {
    category: string;
    unitsSold: number;
    revenue: number;
  }[];
  timeSeries: {
    label: string;
    revenue: number;
    orders: number;
  }[];
}
