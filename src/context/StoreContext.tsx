import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Category, CartItem, Order, StoreSettings } from '../types';
import * as api from '../api';

export type PageView = 
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'shipping-policy'
  | 'returns-policy'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'customer-account'
  | 'admin-login'
  | 'admin-dashboard';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  calculatedDiscount: number;
}

interface StoreContextType {
  // Navigation
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedProductId: string | null;
  navigateToProduct: (productId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateToCategory: (categoryName: string) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  settings: StoreSettings | null;
  loading: boolean;
  refreshData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  appliedCoupon: AppliedCoupon | null;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  discountAmount: number;
  finalTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Admin Auth
  adminToken: string | null;
  adminUser: { email: string; role: string } | null;
  loginAdmin: (token: string, user: { email: string; role: string }) => void;
  logoutAdmin: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Drawer / UI toggles
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart State (cached locally for instant UX)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ach_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ach_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ach_admin_token') || null;
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('ach_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [prods, cats, stngs] = await Promise.all([
        api.fetchProducts(),
        api.fetchCategories(),
        api.fetchStoreSettings()
      ]);
      setProducts(prods);
      setCategories(cats);
      setSettings(stngs);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const syncRouteFromUrl = () => {
      try {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const token = localStorage.getItem('ach_admin_token');

        if (
          hash === 'admin-dashboard' ||
          path.includes('/admin/dashboard') ||
          (hash === 'admin' && token)
        ) {
          if (token) {
            setCurrentPage('admin-dashboard');
          } else {
            setCurrentPage('admin-login');
          }
        } else if (
          hash === 'admin' ||
          hash === 'admin-login' ||
          path.startsWith('/admin') ||
          search.includes('admin')
        ) {
          if (token) {
            setCurrentPage('admin-dashboard');
          } else {
            setCurrentPage('admin-login');
          }
        }
      } catch (err) {
        console.error('URL sync error:', err);
      }
    };

    syncRouteFromUrl();
    window.addEventListener('hashchange', syncRouteFromUrl);
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromUrl);
      window.removeEventListener('popstate', syncRouteFromUrl);
    };
  }, []);

  useEffect(() => {
    try {
      if (currentPage === 'admin-dashboard') {
        window.location.hash = 'admin-dashboard';
      } else if (currentPage === 'admin-login') {
        window.location.hash = 'admin-login';
      }
    } catch {
      // ignore hash errors
    }
  }, [currentPage]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ach_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ach_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const addToCart = (product: Product, color?: string, size?: string, quantity: number = 1) => {
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard');
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    const price = product.salePrice || product.price;

    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.productId === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty > product.stock ? product.stock : newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            selectedColor,
            selectedSize,
            quantity: Math.min(quantity, product.stock || 1),
            price
          }
        ];
      }
    });

    showToast(`Added "${product.name}" (${selectedSize}) to shopping bag`, 'success');
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart(prev => prev.filter(
      item => !(item.productId === productId && item.selectedColor === color && item.selectedSize === size)
    ));
    showToast('Item removed from shopping bag', 'info');
  };

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.selectedColor === color && item.selectedSize === size) {
        const maxStock = item.product.stock || 99;
        return {
          ...item,
          quantity: Math.min(quantity, maxStock)
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Item removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Item saved to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const freeThreshold = settings?.freeShippingThreshold ?? 4999;
  const standardFee = settings?.standardShippingFee ?? 250;
  const shippingFee = cartSubtotal >= freeThreshold || cartSubtotal === 0 ? 0 : standardFee;

  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + (cartSubtotal > 0 ? shippingFee : 0));

  const applyCouponCode = async (code: string): Promise<boolean> => {
    try {
      const coupon = await api.validateCoupon(code, cartSubtotal);
      setAppliedCoupon(coupon);
      showToast(`Coupon "${code.toUpperCase()}" applied! You saved Rs. ${coupon.calculatedDiscount.toLocaleString()}`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon code', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = (token: string, user: { email: string; role: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    try {
      localStorage.setItem('ach_admin_token', token);
      localStorage.setItem('ach_admin_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setCurrentPage('admin-dashboard');
    showToast(`Welcome back, ${user.email}`, 'success');
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem('ach_admin_token');
      localStorage.removeItem('ach_admin_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentPage('home');
    showToast('Logged out of Admin Panel', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        navigateToProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        navigateToCategory,
        products,
        categories,
        settings,
        loading,
        refreshData,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        discountAmount,
        finalTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        lastPlacedOrder,
        setLastPlacedOrder,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
