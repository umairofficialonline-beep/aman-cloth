import type { 
  Product, Category, Order, Customer, Coupon, StoreSettings, AdminMetrics, 
  ProductReview, StockLog, SalesAnalyticsReport 
} from './types';

const BASE_URL = '';

function getAdminHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ach_admin_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  featured?: boolean;
  tag?: string;
  includeUnpublished?: boolean;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
  if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
  if (params?.sort) query.set('sort', params.sort);
  if (params?.featured) query.set('featured', 'true');
  if (params?.tag) query.set('tag', params.tag);
  if (params?.includeUnpublished) query.set('includeUnpublished', 'true');

  const res = await fetch(`${BASE_URL}/api/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products || [];
}

export async function fetchProductById(id: string): Promise<{ product: Product; related: Product[] }> {
  const res = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Product not found');
  const data = await res.json();
  return { product: data.product, related: data.related || [] };
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create product');
  return data.product;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update product');
  return data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete product');
}

export async function submitProductReview(productId: string, review: {
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
}): Promise<{ review: ProductReview; rating: number; reviewsCount: number }> {
  const res = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(productId)}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to submit review');
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.categories || [];
}

export async function createCategory(cat: Partial<Category>): Promise<Category> {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(cat),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create category');
  return data.category;
}

export async function updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
  const res = await fetch(`${BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(cat),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update category');
  return data.category;
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete category');
}

export async function validateCoupon(code: string, cartTotal: number): Promise<{
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  calculatedDiscount: number;
}> {
  const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, cartTotal }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Invalid coupon code');
  }
  return data.coupon;
}

export async function fetchAdminCoupons(): Promise<Coupon[]> {
  const res = await fetch(`${BASE_URL}/api/admin/coupons`, {
    headers: getAdminHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch coupons');
  const data = await res.json();
  return data.coupons || [];
}

export async function createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
  const res = await fetch(`${BASE_URL}/api/admin/coupons`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(coupon),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create coupon');
  return data.coupon;
}

export async function deleteCoupon(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/coupons/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete coupon');
}

export async function submitOrder(orderData: {
  customer: {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
  };
  items: {
    productId: string;
    name: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to place order');
  }
  return data.order;
}

export async function trackOrder(orderNumber: string, phone: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, phone }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Order not found');
  }
  return data.order;
}

export async function fetchOrders(params?: {
  status?: string;
  search?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Order[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.paymentMethod && params.paymentMethod !== 'All') query.set('paymentMethod', params.paymentMethod);
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);

  const res = await fetch(`${BASE_URL}/api/orders?${query.toString()}`, {
    headers: getAdminHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders || [];
}

export async function updateOrderStatus(
  orderId: string, 
  update: {
    status?: string;
    paymentStatus?: string;
    courierName?: string;
    trackingNumber?: string;
    cancellationReason?: string;
    statusNote?: string;
  }
): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
    body: JSON.stringify(update),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update order status');
  return data.order;
}

export async function fetchCustomers(search?: string): Promise<Customer[]> {
  const query = new URLSearchParams();
  if (search) query.set('search', search);
  const res = await fetch(`${BASE_URL}/api/customers?${query.toString()}`, {
    headers: getAdminHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch customers');
  const data = await res.json();
  return data.customers || [];
}

export async function fetchCustomerOrders(phoneOrEmail: { phone?: string; email?: string }): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/api/customer/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(phoneOrEmail),
  });
  if (!res.ok) throw new Error('Failed to fetch customer orders');
  const data = await res.json();
  return data.orders || [];
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const res = await fetch(`${BASE_URL}/api/settings`);
  if (!res.ok) throw new Error('Failed to fetch store settings');
  const data = await res.json();
  return data.settings;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const res = await fetch(`${BASE_URL}/api/admin/settings`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update store settings');
  return data.settings;
}

export async function adminLogin(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Invalid admin credentials');
  }
  return data;
}

export async function adminGoogleLogin(profile: {
  email: string;
  name?: string;
  avatar?: string;
}): Promise<{ token: string; user: any }> {
  const res = await fetch(`${BASE_URL}/api/admin/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Google authentication failed');
  }
  return data;
}

export async function updateAdminCredentials(newEmail?: string, newPassword?: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/update-credentials`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify({ newEmail, newPassword })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update credentials');
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const res = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: getAdminHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch admin metrics');
  const data = await res.json();
  return data.metrics;
}

export async function fetchSalesAnalyticsReport(timeframe: 'day' | 'week' | 'month' | 'all'): Promise<SalesAnalyticsReport> {
  const res = await fetch(`${BASE_URL}/api/admin/reports?timeframe=${timeframe}`, {
    headers: getAdminHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch sales analytics report');
  const data = await res.json();
  return data.report;
}

export async function adjustInventory(payload: {
  productId: string;
  change?: number;
  newStock?: number;
  reason: string;
}): Promise<{ product: Product; log: StockLog }> {
  const res = await fetch(`${BASE_URL}/api/admin/inventory/adjust`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to adjust inventory');
  return data;
}

export async function fetchStockLogs(): Promise<StockLog[]> {
  const res = await fetch(`${BASE_URL}/api/admin/inventory/logs`, {
    headers: getAdminHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch stock logs');
  const data = await res.json();
  return data.logs || [];
}

export async function downloadOrdersCSV(): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ach_admin_token') : null;
  const res = await fetch(`${BASE_URL}/api/admin/export/orders.csv`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error('Failed to export CSV');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Aman_Cloth_House_Orders_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function uploadDeviceImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl,
            filename: file.name
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Upload failed');
        }
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from device'));
    reader.readAsDataURL(file);
  });
}
