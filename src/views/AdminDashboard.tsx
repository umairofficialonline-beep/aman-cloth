import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Tag, 
  Settings, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Printer, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Eye, 
  X, 
  Check, 
  ArrowUpRight,
  Download,
  Boxes,
  FileText,
  SlidersHorizontal,
  DollarSign,
  Layers,
  Sparkles,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  Phone,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import * as api from '../api';
import type { 
  Product, Category, Order, Customer, Coupon, StoreSettings, AdminMetrics, 
  OrderStatus, StockLog, SalesAnalyticsReport 
} from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    adminToken, 
    adminUser, 
    logoutAdmin, 
    setCurrentPage, 
    showToast,
    refreshData 
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'inventory' | 'customers' | 'categories' | 'coupons' | 'content' | 'reports' | 'settings'
  >('overview');

  // Core Data
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0,
    recentOrders: [],
    salesTrend: []
  });
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [stockLogsList, setStockLogsList] = useState<StockLog[]>([]);
  const [analyticsReport, setAnalyticsReport] = useState<SalesAnalyticsReport | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Timeframe for reports & overview
  const [reportTimeframe, setReportTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('month');

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');
  const [productPublishFilter, setProductPublishFilter] = useState('All');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('All');

  const [customerSearch, setCustomerSearch] = useState('');

  // Modals & Drawers
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<Customer | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<Product | null>(null);
  const [stockAdjustValue, setStockAdjustValue] = useState<number>(0);
  const [stockAdjustReason, setStockAdjustReason] = useState('New Shipment Received');

  // Form states for Product Modal
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Men\'s Clothing',
    brand: 'Aman Couture',
    price: 4950,
    salePrice: 0,
    stock: 20,
    description: '',
    fabricDetails: '',
    careInstructions: '',
    packageContains: '',
    colors: 'Navy, Black, Emerald',
    sizes: 'S, M, L, XL',
    tags: 'Kurta, Festive, Men',
    featured: false,
    bestSeller: false,
    newArrival: true,
    isUnstitched: false,
    isPublished: true,
    images: [] as string[]
  });
  const [uploadProgress, setUploadProgress] = useState(false);

  // Form states for Category Modal
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '', isVisible: true });

  // Form state for Coupon Modal
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderAmount: 3000,
    maxDiscount: 2500,
    usageLimit: 100,
    expiryDate: ''
  });

  // Admin security credentials form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        api.fetchAdminMetrics(),
        api.fetchProducts({ includeUnpublished: true }),
        api.fetchOrders(),
        api.fetchCustomers(),
        api.fetchCategories(),
        api.fetchAdminCoupons(),
        api.fetchStoreSettings(),
        api.fetchStockLogs(),
        api.fetchSalesAnalyticsReport(reportTimeframe)
      ]);

      if (results[0].status === 'fulfilled' && results[0].value) setMetrics(results[0].value);
      if (results[1].status === 'fulfilled' && results[1].value) setProductsList(results[1].value);
      if (results[2].status === 'fulfilled' && results[2].value) setOrdersList(results[2].value);
      if (results[3].status === 'fulfilled' && results[3].value) setCustomersList(results[3].value);
      if (results[4].status === 'fulfilled' && results[4].value) setCategoriesList(results[4].value);
      if (results[5].status === 'fulfilled' && results[5].value) setCouponsList(results[5].value);
      if (results[6].status === 'fulfilled' && results[6].value) setStoreSettings(results[6].value);
      if (results[7].status === 'fulfilled' && results[7].value) setStockLogsList(results[7].value);
      if (results[8].status === 'fulfilled' && results[8].value) setAnalyticsReport(results[8].value);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      setCurrentPage('admin-login');
      return;
    }
    loadAdminData();
  }, [adminToken]);

  useEffect(() => {
    if (adminToken && activeTab === 'reports') {
      api.fetchSalesAnalyticsReport(reportTimeframe)
        .then(res => setAnalyticsReport(res))
        .catch(err => console.error(err));
    }
  }, [reportTimeframe, activeTab]);

  // Product CRUD
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      sku: `ACH-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categoriesList[0]?.name || 'Men\'s Clothing',
      brand: 'Aman Couture',
      price: 5500,
      salePrice: 0,
      stock: 25,
      description: 'Masterfully stitched from pure long-staple cotton with refined collar embellishments.',
      fabricDetails: '100% Pure Egyptian Giza Cotton.',
      careInstructions: 'Gentle hand wash or dry clean recommended.',
      packageContains: '1 Stitched Kurta, 1 Shalwar.',
      colors: 'Navy, Charcoal, Ivory',
      sizes: 'S, M, L, XL',
      tags: 'Kurta Shalwar, Men, Festive',
      featured: false,
      bestSeller: false,
      newArrival: true,
      isUnstitched: false,
      isPublished: true,
      images: ['/src/assets/images/category_men_collection_1793091301301.jpg']
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      brand: prod.brand,
      price: prod.price,
      salePrice: prod.salePrice || 0,
      stock: prod.stock,
      description: prod.description,
      fabricDetails: prod.fabricDetails || '',
      careInstructions: prod.careInstructions || '',
      packageContains: prod.packageContains || '',
      colors: prod.colors?.join(', ') || 'Standard',
      sizes: prod.sizes?.join(', ') || 'M, L',
      tags: prod.tags?.join(', ') || '',
      featured: Boolean(prod.featured),
      bestSeller: Boolean(prod.bestSeller),
      newArrival: Boolean(prod.newArrival),
      isUnstitched: Boolean(prod.isUnstitched),
      isPublished: prod.isPublished !== false,
      images: prod.images && prod.images.length > 0 ? prod.images : ['/src/assets/images/category_men_collection_1793091301301.jpg']
    });
    setIsProductModalOpen(true);
  };

  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadProgress(true);
      const file = files[0];
      const uploadedUrl = await api.uploadDeviceImage(file);
      setProductForm(prev => ({
        ...prev,
        images: [uploadedUrl, ...prev.images]
      }));
      showToast('Image uploaded directly from device storage!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    const payload: Partial<Product> = {
      name: productForm.name.trim(),
      sku: productForm.sku.trim(),
      category: productForm.category,
      brand: productForm.brand,
      price: Number(productForm.price),
      salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
      stock: Number(productForm.stock),
      description: productForm.description,
      fabricDetails: productForm.fabricDetails,
      careInstructions: productForm.careInstructions,
      packageContains: productForm.packageContains,
      colors: productForm.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      tags: productForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      featured: productForm.featured,
      bestSeller: productForm.bestSeller,
      newArrival: productForm.newArrival,
      isUnstitched: productForm.isUnstitched,
      isPublished: productForm.isPublished,
      images: productForm.images.length > 0 ? productForm.images : ['/src/assets/images/category_men_collection_1793091301301.jpg']
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        showToast(`Product "${productForm.name}" updated successfully`, 'success');
      } else {
        await api.createProduct(payload);
        showToast(`Product "${productForm.name}" added to catalog`, 'success');
      }
      setIsProductModalOpen(false);
      loadAdminData();
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from store catalog?`)) return;
    try {
      await api.deleteProduct(id);
      showToast('Product deleted from inventory', 'info');
      loadAdminData();
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Inventory Stock Adjustment
  const handleOpenStockAdjust = (prod: Product) => {
    setStockAdjustProduct(prod);
    setStockAdjustValue(prod.stock);
    setStockAdjustReason('Stock Received at Lahore Atelier');
    setIsStockAdjustModalOpen(true);
  };

  const handleSaveStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustProduct) return;
    try {
      await api.adjustInventory({
        productId: stockAdjustProduct.id,
        newStock: stockAdjustValue,
        reason: stockAdjustReason
      });
      showToast(`Stock updated to ${stockAdjustValue} units for ${stockAdjustProduct.name}`, 'success');
      setIsStockAdjustModalOpen(false);
      loadAdminData();
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust stock', 'error');
    }
  };

  // Order Status update with history note
  const handleUpdateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string, 
    courierName?: string, 
    paymentStatus?: 'Unpaid' | 'Paid',
    cancellationReason?: string,
    statusNote?: string
  ) => {
    try {
      await api.updateOrderStatus(orderId, {
        status,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        paymentStatus,
        cancellationReason,
        statusNote
      });
      showToast(`Order status updated to ${status}`, 'success');
      loadAdminData();
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails(prev => prev ? { 
          ...prev, 
          orderStatus: status, 
          paymentStatus: paymentStatus || prev.paymentStatus,
          trackingNumber: trackingNumber || prev.trackingNumber,
          cancellationReason: cancellationReason || prev.cancellationReason
        } : null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Category Actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    try {
      await api.createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        image: categoryForm.image.trim() || '/src/assets/images/category_men_collection_1793091301301.jpg',
        isVisible: categoryForm.isVisible
      });
      showToast(`Category "${categoryForm.name}" created`, 'success');
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', description: '', image: '', isVisible: true });
      loadAdminData();
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add category', 'error');
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.deleteCategory(cat.id);
      showToast('Category deleted successfully', 'info');
      loadAdminData();
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Cannot delete category', 'error');
    }
  };

  // Coupon Actions
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    try {
      await api.createCoupon({
        code: couponForm.code.trim().toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: Number(couponForm.minOrderAmount),
        maxDiscount: couponForm.maxDiscount ? Number(couponForm.maxDiscount) : undefined,
        usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : undefined,
        expiryDate: couponForm.expiryDate || undefined
      });
      showToast(`Coupon ${couponForm.code} created!`, 'success');
      setIsCouponModalOpen(false);
      setCouponForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 3000, maxDiscount: 2500, usageLimit: 100, expiryDate: '' });
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await api.deleteCoupon(id);
      showToast('Coupon removed', 'info');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete coupon', 'error');
    }
  };

  // Save Store Settings & CMS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;
    try {
      await api.updateStoreSettings(storeSettings);
      showToast('Store settings & content saved persistently', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  // Update Admin Credentials
  const handleUpdateAdminSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail && !newAdminPassword) return;
    try {
      await api.updateAdminCredentials(newAdminEmail || undefined, newAdminPassword || undefined);
      showToast('Admin credentials updated securely', 'success');
      setNewAdminEmail('');
      setNewAdminPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update credentials', 'error');
    }
  };

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchesSearch = productSearch === '' || 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = productCatFilter === 'All' || p.category === productCatFilter;
      const matchesPublish = productPublishFilter === 'All' || 
        (productPublishFilter === 'published' ? p.isPublished !== false : p.isPublished === false);
      const matchesStock = productStockFilter === 'All' ||
        (productStockFilter === 'out' ? p.stock === 0 :
         productStockFilter === 'low' ? p.stock > 0 && p.stock <= 5 :
         p.stock > 5);
      return matchesSearch && matchesCat && matchesPublish && matchesStock;
    });
  }, [productsList, productSearch, productCatFilter, productStockFilter, productPublishFilter]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      const matchesSearch = orderSearch === '' ||
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer.phone.includes(orderSearch) ||
        o.customer.city.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      const matchesPayment = orderPaymentFilter === 'All' || o.paymentMethod === orderPaymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [ordersList, orderSearch, orderStatusFilter, orderPaymentFilter]);

  const filteredCustomers = useMemo(() => {
    return customersList.filter(c => {
      return customerSearch === '' ||
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch) ||
        c.city.toLowerCase().includes(customerSearch.toLowerCase());
    });
  }, [customersList, customerSearch]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      
      {/* Top Luxury Admin Header */}
      <header className="bg-stone-950 text-white px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-800 shrink-0 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className="text-left group cursor-pointer"
          >
            <span className="font-display text-lg tracking-widest font-bold uppercase text-amber-300 group-hover:text-amber-200">
              Aman Cloth House
            </span>
            <span className="block text-[9px] uppercase tracking-[0.25em] text-stone-400 font-sans">
              Executive Management Console
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-xs">
          <div className="hidden md:flex items-center gap-2 text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin: <strong className="text-white">{adminUser?.email}</strong></span>
          </div>

          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Customer Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-2 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-1 shrink-0">
          
          <div className="hidden md:block text-[11px] font-bold uppercase tracking-widest text-stone-400 px-3 py-2">
            Store Management
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Products & Catalog</span>
            </div>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded-full font-mono">
              {productsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Orders & Courier</span>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-mono font-bold">
              {ordersList.filter(o => o.orderStatus === 'Pending').length} pending
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>Inventory Control</span>
            </div>
            {metrics?.lowStockProducts ? (
              <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-mono font-bold">
                {metrics.lowStockProducts} low
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'customers' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Customer Registry</span>
            </div>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded-full font-mono">
              {customersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Categories</span>
          </button>

          <div className="pt-3 text-[11px] font-bold uppercase tracking-widest text-stone-400 px-3 py-2">
            Marketing & CMS
          </div>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'coupons' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Coupons & Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'content' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Homepage & Content CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'reports' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-500" />
            <span>Reports & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-stone-900 text-amber-200 shadow-sm' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Store Settings & Security</span>
          </button>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Aman Cloth House — Executive Overview
                  </h1>
                  <p className="text-xs text-stone-500">
                    Live operational metrics directly from persistent store database
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAdminData}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  <button
                    onClick={api.downloadOrdersCSV}
                    className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-stone-800 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Valid Net Revenue</span>
                  <p className="font-mono text-2xl font-bold text-stone-950">
                    Rs. {metrics.totalSales.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Excludes Cancelled Orders
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Orders</span>
                  <p className="font-mono text-2xl font-bold text-stone-950">
                    {metrics.totalOrders}
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono">
                    {metrics.pendingOrders} Pending Verification
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Active Catalog</span>
                  <p className="font-mono text-2xl font-bold text-stone-950">
                    {metrics.totalProducts} Garments
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono">
                    {categoriesList.length} Categories
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Low Stock Warning</span>
                  <p className={`font-mono text-2xl font-bold ${metrics.lowStockProducts > 0 ? 'text-amber-700' : 'text-stone-950'}`}>
                    {metrics.lowStockProducts} Designs
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Stock &le; 5 units remaining
                  </p>
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded border border-stone-200 text-center">
                  <span className="text-[11px] text-stone-500 uppercase block">Pending</span>
                  <span className="font-mono text-xl font-bold text-amber-700">{metrics.pendingOrders}</span>
                </div>
                <div className="bg-white p-3.5 rounded border border-stone-200 text-center">
                  <span className="text-[11px] text-stone-500 uppercase block">Confirmed</span>
                  <span className="font-mono text-xl font-bold text-sky-700">{metrics.confirmedOrders || 0}</span>
                </div>
                <div className="bg-white p-3.5 rounded border border-stone-200 text-center">
                  <span className="text-[11px] text-stone-500 uppercase block">Processing</span>
                  <span className="font-mono text-xl font-bold text-indigo-700">{metrics.processingOrders}</span>
                </div>
                <div className="bg-white p-3.5 rounded border border-stone-200 text-center">
                  <span className="text-[11px] text-stone-500 uppercase block">Shipped</span>
                  <span className="font-mono text-xl font-bold text-purple-700">{metrics.shippedOrders}</span>
                </div>
                <div className="bg-white p-3.5 rounded border border-stone-200 text-center">
                  <span className="text-[11px] text-stone-500 uppercase block">Delivered</span>
                  <span className="font-mono text-xl font-bold text-emerald-700">{metrics.deliveredOrders}</span>
                </div>
                <div className="bg-white p-3.5 rounded border border-stone-200 text-center">
                  <span className="text-[11px] text-stone-500 uppercase block">Cancelled</span>
                  <span className="font-mono text-xl font-bold text-rose-700">{metrics.cancelledOrders}</span>
                </div>
              </div>

              {/* Sales Chart with Daily, Weekly, and Monthly view filters */}
              <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                    Sales Trajectory & Order Counts
                  </h3>
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md text-xs">
                    {(['day', 'week', 'month', 'all'] as const).map(tf => (
                      <button
                        key={tf}
                        onClick={() => setReportTimeframe(tf)}
                        className={`px-3 py-1 rounded capitalize font-medium transition-colors cursor-pointer ${
                          reportTimeframe === tf ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {tf === 'day' ? 'Today' : (tf === 'week' ? 'This Week' : (tf === 'month' ? 'This Month' : 'All Time'))}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between h-44 pt-6 gap-2 sm:gap-4 border-b border-stone-100 pb-2">
                  {(analyticsReport?.timeSeries || metrics.salesTrend).map((point: any, idx) => {
                    const maxVal = Math.max(...(analyticsReport?.timeSeries || metrics.salesTrend).map((t: any) => t.revenue || t.amount), 50000);
                    const amount = point.revenue ?? point.amount;
                    const heightPercent = Math.max(18, Math.round((amount / maxVal) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] font-mono text-stone-500">
                          {Math.round(amount / 1000)}k
                        </span>
                        <div 
                          className="w-full bg-stone-900 hover:bg-amber-800 transition-colors rounded-t-sm" 
                          style={{ height: `${heightPercent}%` }}
                          title={`Rs. ${amount.toLocaleString()} (${point.orders} orders)`}
                        />
                        <span className="text-[10px] font-mono text-stone-600 truncate">{point.label || point.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                    Latest Customer Orders
                  </h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 uppercase border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">City</th>
                        <th className="py-2.5 px-3">Total Amount</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono text-stone-800">
                      {metrics.recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-3 font-bold">{ord.orderNumber}</td>
                          <td className="py-3 px-3 font-sans font-medium">{ord.customer.name}</td>
                          <td className="py-3 px-3 font-sans">{ord.customer.city}</td>
                          <td className="py-3 px-3">Rs. {ord.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-3 font-sans">{ord.paymentMethod}</td>
                          <td className="py-3 px-3 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-sans">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails(ord);
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 bg-stone-900 text-white hover:bg-stone-800 rounded font-semibold text-[11px] cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCT MANAGEMENT TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Product & Catalog Management
                  </h1>
                  <p className="text-xs text-stone-500">
                    Upload gallery photos, manage sizes, colors, variants, prices, and stock
                  </p>
                </div>

                <button
                  onClick={handleOpenNewProduct}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add New Garment</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search garment name or SKU..."
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Category:</span>
                    <select
                      value={productCatFilter}
                      onChange={(e) => setProductCatFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50"
                    >
                      <option value="All">All Categories</option>
                      {categoriesList.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Stock:</span>
                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50"
                    >
                      <option value="All">All Stock</option>
                      <option value="in">In Stock (&gt; 5)</option>
                      <option value="low">Low Stock (1-5)</option>
                      <option value="out">Out of Stock (0)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Status:</span>
                    <select
                      value={productPublishFilter}
                      onChange={(e) => setProductPublishFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50"
                    >
                      <option value="All">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Unpublished / Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-3">Garment Details</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Stock Units</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || '/src/assets/images/category_men_collection_1793091301301.jpg'}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-12 object-cover object-top rounded border border-stone-200"
                              />
                              <div>
                                <p className="font-semibold text-stone-900">{p.name}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                                  {p.featured && <span className="text-amber-800 font-semibold">Featured</span>}
                                  {p.newArrival && <span>· New</span>}
                                  {p.isUnstitched && <span>· Unstitched</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-stone-500">{p.sku}</td>
                          <td className="py-3 px-3">{p.category}</td>
                          <td className="py-3 px-3 font-mono font-medium">
                            Rs. {(p.salePrice || p.price).toLocaleString()}
                            {p.salePrice && (
                              <span className="block text-[10px] text-stone-400 line-through">
                                Rs. {p.price.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              p.stock === 0 ? 'bg-rose-100 text-rose-800' :
                              p.stock <= 5 ? 'bg-amber-100 text-amber-800' :
                              'bg-stone-100 text-stone-800'
                            }`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                              p.isPublished !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                            }`}>
                              {p.isPublished !== false ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenStockAdjust(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer"
                                title="Adjust Stock"
                              >
                                <Boxes className="w-4 h-4 text-amber-700" />
                              </button>
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. ORDER MANAGEMENT TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Order Management & Fulfillment
                  </h1>
                  <p className="text-xs text-stone-500">
                    Track statuses, assign courier partners (TCS, Leopards, Trax), and print invoices
                  </p>
                </div>

                <button
                  onClick={api.downloadOrdersCSV}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Orders CSV</span>
                </button>
              </div>

              {/* Order Search & Filter Bar */}
              <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order #, Customer Name, Phone, or City..."
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Payment:</span>
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50"
                    >
                      <option value="All">All Methods</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="BankTransfer">Bank Transfer</option>
                      <option value="WhatsAppOrder">WhatsApp Order</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-3">Order Number</th>
                        <th className="py-3 px-3">Customer Details</th>
                        <th className="py-3 px-3">City & Address</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Total (PKR)</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-3 font-mono font-bold">{ord.orderNumber}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold">{ord.customer.name}</p>
                            <p className="font-mono text-stone-500 text-[11px]">{ord.customer.phone}</p>
                          </td>
                          <td className="py-3 px-3 max-w-xs truncate">
                            <span className="font-medium text-stone-900">{ord.customer.city}</span>
                            <span className="block text-stone-500 text-[11px] truncate">{ord.customer.address}</span>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                            }`}>
                              {ord.paymentMethod} ({ord.paymentStatus})
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold text-[11px] cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. INVENTORY MANAGEMENT TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Inventory Control & Stock Adjustments
                  </h1>
                  <p className="text-xs text-stone-500">
                    Audit logs, stock replenishments, low-stock alerts, and auto-restock safeguards
                  </p>
                </div>
              </div>

              {/* Inventory Valuation Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Total Stock On Hand</span>
                  <p className="font-mono text-2xl font-bold text-stone-900">
                    {productsList.reduce((sum, p) => sum + p.stock, 0)} units
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Inventory Retail Valuation</span>
                  <p className="font-mono text-2xl font-bold text-emerald-700">
                    Rs. {productsList.reduce((sum, p) => sum + (p.stock * (p.salePrice || p.price)), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Restock Urgency</span>
                  <p className="font-mono text-2xl font-bold text-amber-700">
                    {productsList.filter(p => p.stock <= 5).length} Items Low
                  </p>
                </div>
              </div>

              {/* Inventory Products Table */}
              <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs space-y-3 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Stock Units by Garment
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 uppercase border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Garment</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Unit Price</th>
                        <th className="py-2.5 px-3">Stock Units</th>
                        <th className="py-2.5 px-3">Valuation (PKR)</th>
                        <th className="py-2.5 px-3 text-right">Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {productsList.map(prod => (
                        <tr key={prod.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-3 font-semibold text-stone-900">{prod.name}</td>
                          <td className="py-3 px-3 font-mono text-stone-500">{prod.sku}</td>
                          <td className="py-3 px-3 font-mono">Rs. {(prod.salePrice || prod.price).toLocaleString()}</td>
                          <td className="py-3 px-3 font-mono font-bold">
                            <span className={prod.stock === 0 ? 'text-rose-600' : prod.stock <= 5 ? 'text-amber-700' : 'text-stone-900'}>
                              {prod.stock}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            Rs. {(prod.stock * (prod.salePrice || prod.price)).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleOpenStockAdjust(prod)}
                              className="px-3 py-1 bg-stone-900 text-white rounded text-[11px] font-semibold hover:bg-stone-800 cursor-pointer"
                            >
                              Update Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stock Logs Audit */}
              <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Stock Change History & Audit Logs
                </h3>
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 uppercase border-b border-stone-200">
                      <tr>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Garment</th>
                        <th className="py-2 px-3">Change</th>
                        <th className="py-2 px-3">New Stock</th>
                        <th className="py-2 px-3">Reason / Trigger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800 font-mono text-[11px]">
                      {stockLogsList.map(log => (
                        <tr key={log.id}>
                          <td className="py-2 px-3 text-stone-500">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-2 px-3 font-sans font-medium text-stone-900">{log.productName}</td>
                          <td className={`py-2 px-3 font-bold ${log.change >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {log.change > 0 ? `+${log.change}` : log.change}
                          </td>
                          <td className="py-2 px-3 font-bold text-stone-900">{log.newStock}</td>
                          <td className="py-2 px-3 font-sans text-stone-600">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. CUSTOMER MANAGEMENT TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Customer Directory & Profiles
                  </h1>
                  <p className="text-xs text-stone-500">
                    Customer lifetime spend, delivery addresses, and past order histories
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex items-center gap-2 max-w-sm">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer name, phone, city..."
                  className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-3">Customer Name</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">City</th>
                        <th className="py-3 px-3">Delivery Address</th>
                        <th className="py-3 px-3 text-center">Total Orders</th>
                        <th className="py-3 px-3 text-right">Lifetime Spend</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-3 font-semibold text-stone-900">{c.name}</td>
                          <td className="py-3 px-3 font-mono">{c.phone}</td>
                          <td className="py-3 px-3">{c.city}</td>
                          <td className="py-3 px-3 max-w-xs truncate text-stone-500">{c.address}</td>
                          <td className="py-3 px-3 text-center font-mono font-semibold">{c.totalOrders}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-stone-950">
                            Rs. {c.totalSpent.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedCustomerDetails(c)}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] cursor-pointer"
                            >
                              Orders
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Category Management
                  </h1>
                  <p className="text-xs text-stone-500">
                    Organize storefront categories, visibility, and photo banners
                  </p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoriesList.map((cat) => {
                  const assignedCount = productsList.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <div key={cat.id} className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs space-y-3">
                      <div className="h-32 rounded bg-stone-100 overflow-hidden relative">
                        <img
                          src={cat.image || '/src/assets/images/category_men_collection_1793091301301.jpg'}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                          {assignedCount} items
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">{cat.name}</h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{cat.description || 'Curated fashion'}</p>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-stone-400">Slug: {cat.slug}</span>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. COUPONS & DISCOUNTS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Coupons & Promotional Discounts
                  </h1>
                  <p className="text-xs text-stone-500">
                    Create discount voucher codes validated strictly on the backend
                  </p>
                </div>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {couponsList.map((c) => (
                  <div key={c.id} className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-700">
                      <strong>{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} OFF`}</strong>
                    </p>

                    <div className="text-[11px] text-stone-500 space-y-1">
                      <p>Min Order: {c.minOrderAmount ? `Rs. ${c.minOrderAmount.toLocaleString()}` : 'None'}</p>
                      {c.maxDiscount && <p>Max Cap: Rs. {c.maxDiscount.toLocaleString()}</p>}
                      <p>Redeemed: <strong>{c.usageCount}</strong> times</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. HOMEPAGE & CONTENT CMS TAB */}
          {activeTab === 'content' && storeSettings && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Homepage & Content Management (CMS)
                  </h1>
                  <p className="text-xs text-stone-500">
                    Edit hero banner headlines, promotional cards, About story, and policies
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Save CMS Changes
                </button>
              </div>

              {/* Hero Banner CMS */}
              <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Homepage Hero Banner
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Hero Headline</label>
                    <input
                      type="text"
                      value={storeSettings.heroBanner?.title || ''}
                      onChange={(e) => setStoreSettings({
                        ...storeSettings,
                        heroBanner: { ...storeSettings.heroBanner, title: e.target.value }
                      })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">CTA Button Label</label>
                    <input
                      type="text"
                      value={storeSettings.heroBanner?.ctaText || 'Explore Collection'}
                      onChange={(e) => setStoreSettings({
                        ...storeSettings,
                        heroBanner: { ...storeSettings.heroBanner, ctaText: e.target.value }
                      })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Hero Description</label>
                  <textarea
                    rows={2}
                    value={storeSettings.heroBanner?.subtitle || ''}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      heroBanner: { ...storeSettings.heroBanner, subtitle: e.target.value }
                    })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              {/* Promotional Banner Editor */}
              {storeSettings.promotionalBanners?.[0] && (
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Mid-Page Promotional Banner
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Banner Tagline</label>
                      <input
                        type="text"
                        value={storeSettings.promotionalBanners[0].tagline || ''}
                        onChange={(e) => {
                          const updated = [...storeSettings.promotionalBanners];
                          updated[0].tagline = e.target.value;
                          setStoreSettings({ ...storeSettings, promotionalBanners: updated });
                        }}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Banner Title</label>
                      <input
                        type="text"
                        value={storeSettings.promotionalBanners[0].title || ''}
                        onChange={(e) => {
                          const updated = [...storeSettings.promotionalBanners];
                          updated[0].title = e.target.value;
                          setStoreSettings({ ...storeSettings, promotionalBanners: updated });
                        }}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Policies Content */}
              <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Store Policies & About Us Story
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">About Us Heritage Prose</label>
                  <textarea
                    rows={3}
                    value={storeSettings.policies.about}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      policies: { ...storeSettings.policies, about: e.target.value }
                    })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Shipping & Courier Policy</label>
                  <textarea
                    rows={2}
                    value={storeSettings.policies.shipping}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      policies: { ...storeSettings.policies, shipping: e.target.value }
                    })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">7-Day Return & Exchange Terms</label>
                  <textarea
                    rows={2}
                    value={storeSettings.policies.returns}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      policies: { ...storeSettings.policies, returns: e.target.value }
                    })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save CMS Changes
                </button>
              </div>
            </form>
          )}

          {/* 9. REPORTS & ANALYTICS TAB */}
          {activeTab === 'reports' && analyticsReport && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Business Reports & Financial Analytics
                  </h1>
                  <p className="text-xs text-stone-500">
                    Gross revenues, net sales, cancelled orders, inventory valuation, and category distribution
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={reportTimeframe}
                    onChange={(e) => setReportTimeframe(e.target.value as any)}
                    className="px-3 py-1.5 border border-stone-300 rounded text-xs bg-white"
                  >
                    <option value="day">Today</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="all">All Time</option>
                  </select>

                  <button
                    onClick={api.downloadOrdersCSV}
                    className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Financial Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Net Sales Revenue</span>
                  <p className="font-mono text-2xl font-bold text-stone-900">
                    Rs. {analyticsReport.netRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">Valid Delivered & Active Orders</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Gross Sales Volume</span>
                  <p className="font-mono text-2xl font-bold text-stone-900">
                    Rs. {analyticsReport.grossRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-stone-500">Subtotal before voucher discounts</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Total Discounts Given</span>
                  <p className="font-mono text-2xl font-bold text-amber-800">
                    Rs. {analyticsReport.totalDiscounts.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-stone-500">Promotions & Vouchers applied</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-stone-500">Cancelled Lost Volume</span>
                  <p className="font-mono text-2xl font-bold text-rose-700">
                    Rs. {analyticsReport.cancelledRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-stone-500">{analyticsReport.cancelledOrders} order(s) cancelled</p>
                </div>
              </div>

              {/* Best Selling Products */}
              <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Top Performing Garments by Volume
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 uppercase border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Rank</th>
                        <th className="py-2.5 px-3">Garment Title</th>
                        <th className="py-2.5 px-3 text-center">Units Sold</th>
                        <th className="py-2.5 px-3 text-right">Revenue Generated</th>
                        <th className="py-2.5 px-3 text-right">Remaining Inventory</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono text-stone-800">
                      {analyticsReport.bestSellingProducts.map((p, idx) => (
                        <tr key={p.productId}>
                          <td className="py-3 px-3 font-bold text-stone-400">#{idx + 1}</td>
                          <td className="py-3 px-3 font-sans font-medium text-stone-900">{p.name}</td>
                          <td className="py-3 px-3 text-center font-bold text-stone-950">{p.unitsSold}</td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-800">
                            Rs. {p.revenue.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-stone-600">{p.stockRemaining} units</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 10. STORE SETTINGS & SECURITY TAB */}
          {activeTab === 'settings' && storeSettings && (
            <div className="space-y-8 max-w-4xl animate-fadeIn">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-stone-900">
                      Store Settings & Regional Config
                    </h1>
                    <p className="text-xs text-stone-500">
                      Currency (PKR), bank transfer coordinates, contact desk, and shipping limits
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    Save Settings
                  </button>
                </div>

                {/* General Brand Details */}
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Store Identity & Contacts
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Store Name</label>
                      <input
                        type="text"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Order Desk</label>
                      <input
                        type="text"
                        value={storeSettings.whatsappNumber}
                        onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Flagship Boutique Address</label>
                      <input
                        type="text"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Config */}
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Shipping Rates & Free Shipping Threshold (PKR)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Standard Delivery Fee (Rs.)</label>
                      <input
                        type="number"
                        value={storeSettings.standardShippingFee}
                        onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                        className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Free Shipping Order Amount (Rs.)</label>
                      <input
                        type="number"
                        value={storeSettings.freeShippingThreshold}
                        onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800 pt-3 border-t border-stone-100">
                    Habib Bank Limited (HBL) Direct Transfer Coordinates
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-stone-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={storeSettings.bankDetails?.bankName || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          bankDetails: { ...storeSettings.bankDetails, bankName: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-stone-700 mb-1">Account Title</label>
                      <input
                        type="text"
                        value={storeSettings.bankDetails?.accountTitle || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          bankDetails: { ...storeSettings.bankDetails, accountTitle: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-stone-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={storeSettings.bankDetails?.accountNumber || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          bankDetails: { ...storeSettings.bankDetails, accountNumber: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-stone-700 mb-1">IBAN Number</label>
                      <input
                        type="text"
                        value={storeSettings.bankDetails?.iban || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          bankDetails: { ...storeSettings.bankDetails, iban: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </form>

              {/* Administrator Security Credentials Update */}
              <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Administrator Security & Credentials
                  </h3>
                </div>

                <form onSubmit={handleUpdateAdminSecurity} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">New Admin Email</label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@amancloth.pk"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">New Admin Password</label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newAdminEmail && !newAdminPassword}
                    className="px-5 py-2.5 bg-amber-950 text-amber-200 rounded text-xs font-semibold uppercase tracking-wider hover:bg-stone-900 disabled:opacity-50 cursor-pointer"
                  >
                    Update Credentials
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PRODUCT MODAL (Add / Edit) with device gallery upload */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-900">
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalog'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Device Image Upload Zone */}
              <div className="p-4 bg-stone-50 border border-dashed border-stone-300 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Product Photos (Upload Direct From Device / Gallery)
                  </span>
                  {uploadProgress && (
                    <span className="text-xs text-amber-700 font-medium">Uploading image...</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {productForm.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-20 rounded border border-stone-200 overflow-hidden group">
                      <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0 right-0 p-1 bg-black/60 text-white hover:bg-rose-600 rounded-bl cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="w-16 h-20 rounded border-2 border-dashed border-stone-300 hover:border-stone-500 flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer transition-colors bg-white">
                    <Upload className="w-4 h-4 mb-1" />
                    <span className="text-[9px] uppercase font-bold">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-stone-400">
                  Select any photo from your computer or mobile gallery. Stored persistently on server.
                </p>
              </div>

              {/* Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Royal Navy Embroidered Kurta"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                  >
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Regular Price (Rs.) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Sale Price (Rs., Optional)</label>
                  <input
                    type="number"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Stock Units *</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded"
                    required
                  />
                </div>
              </div>

              {/* Colors & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Navy, White, Charcoal"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              {/* Feature Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-stone-700">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Featured on Home</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.newArrival}
                    onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.isPublished}
                    onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })}
                  />
                  <span className="font-semibold text-stone-900">Publish to Live Storefront</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-stone-800"
                >
                  {editingProduct ? 'Save Changes' : 'Create Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {isStockAdjustModalOpen && stockAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-900">
                Adjust Inventory Stock
              </h3>
              <button onClick={() => setIsStockAdjustModalOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjust} className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <p className="font-semibold text-stone-900">{stockAdjustProduct.name}</p>
                <p className="font-mono text-stone-500">SKU: {stockAdjustProduct.sku}</p>
                <p className="font-mono text-stone-700">Current Stock: <strong>{stockAdjustProduct.stock} units</strong></p>
              </div>

              <div>
                <label className="block font-semibold mb-1">New Total Stock Units *</label>
                <input
                  type="number"
                  value={stockAdjustValue}
                  onChange={(e) => setStockAdjustValue(Number(e.target.value))}
                  min={0}
                  className="w-full font-mono text-sm px-3 py-2 border border-stone-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason for Inventory Audit *</label>
                <select
                  value={stockAdjustReason}
                  onChange={(e) => setStockAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                >
                  <option value="New Shipment Received at Atelier">New Shipment Received at Atelier</option>
                  <option value="Physical Warehouse Inventory Audit">Physical Warehouse Inventory Audit</option>
                  <option value="Damaged / Fabric Defect Removal">Damaged / Fabric Defect Removal</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-semibold uppercase tracking-wider"
                >
                  Save Stock Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS & DISPATCH DRAWER */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 no-print" onClick={() => setSelectedOrderDetails(null)} />
          <div className="relative ml-auto w-full max-w-xl bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between print-invoice-sheet">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 font-mono">ORDER SUMMARY</span>
                  <h3 className="text-base font-bold font-mono text-stone-900">{selectedOrderDetails.orderNumber}</h3>
                </div>
                <button onClick={() => setSelectedOrderDetails(null)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Status & Courier Form */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Update Order Fulfillment
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Order Status</label>
                    <select
                      value={selectedOrderDetails.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(
                        selectedOrderDetails.id, 
                        e.target.value as OrderStatus,
                        selectedOrderDetails.trackingNumber,
                        selectedOrderDetails.courierName,
                        selectedOrderDetails.paymentStatus
                      )}
                      className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded bg-white font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Payment Status</label>
                    <select
                      value={selectedOrderDetails.paymentStatus}
                      onChange={(e) => handleUpdateOrderStatus(
                        selectedOrderDetails.id,
                        selectedOrderDetails.orderStatus,
                        selectedOrderDetails.trackingNumber,
                        selectedOrderDetails.courierName,
                        e.target.value as any
                      )}
                      className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded bg-white font-semibold"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Courier Partner</label>
                    <select
                      value={selectedOrderDetails.courierName || 'TCS Express'}
                      onChange={(e) => handleUpdateOrderStatus(
                        selectedOrderDetails.id,
                        selectedOrderDetails.orderStatus,
                        selectedOrderDetails.trackingNumber,
                        e.target.value,
                        selectedOrderDetails.paymentStatus
                      )}
                      className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded bg-white"
                    >
                      <option value="TCS Express">TCS Express</option>
                      <option value="Leopards Courier">Leopards Courier</option>
                      <option value="Trax Logistics">Trax Logistics</option>
                      <option value="CallCourier">CallCourier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Courier Tracking ID</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        defaultValue={selectedOrderDetails.trackingNumber || ''}
                        id="trackingInput"
                        placeholder="e.g. TCS-99882736"
                        className="flex-1 text-xs font-mono px-2 py-1.5 border border-stone-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('trackingInput') as HTMLInputElement;
                          handleUpdateOrderStatus(
                            selectedOrderDetails.id,
                            selectedOrderDetails.orderStatus,
                            input.value,
                            selectedOrderDetails.courierName,
                            selectedOrderDetails.paymentStatus
                          );
                        }}
                        className="px-2.5 py-1 bg-stone-900 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cancellation Reason if Cancelled */}
                {selectedOrderDetails.orderStatus === 'Cancelled' && (
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Cancellation Reason</label>
                    <input
                      type="text"
                      defaultValue={selectedOrderDetails.cancellationReason || ''}
                      id="cancellationInput"
                      placeholder="e.g. Customer cancelled via WhatsApp verification"
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded"
                      onBlur={(e) => {
                        handleUpdateOrderStatus(
                          selectedOrderDetails.id,
                          'Cancelled',
                          selectedOrderDetails.trackingNumber,
                          selectedOrderDetails.courierName,
                          selectedOrderDetails.paymentStatus,
                          e.target.value
                        );
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Status History Timeline */}
              {selectedOrderDetails.statusHistory && selectedOrderDetails.statusHistory.length > 0 && (
                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                    Fulfillment History
                  </h4>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {selectedOrderDetails.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-start justify-between text-stone-600 bg-stone-50 p-2 rounded">
                        <div>
                          <strong className="text-stone-900">{h.status}</strong>: {h.note}
                        </div>
                        <span className="text-[10px] text-stone-400 shrink-0 ml-2">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="text-xs space-y-1 border-t border-stone-200 pt-3">
                <h4 className="font-semibold uppercase tracking-wider text-stone-700">Customer & Shipping Details</h4>
                <p className="font-semibold text-stone-900">{selectedOrderDetails.customer.name}</p>
                <p className="font-mono text-stone-600">Mobile: {selectedOrderDetails.customer.phone}</p>
                <p className="text-stone-700">{selectedOrderDetails.customer.address}, {selectedOrderDetails.customer.city}</p>
                {selectedOrderDetails.customer.notes && (
                  <p className="text-amber-800 italic">Instructions: "{selectedOrderDetails.customer.notes}"</p>
                )}
              </div>

              {/* Garments ordered */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Garments In Parcel</h4>
                <div className="space-y-2 border border-stone-200 rounded p-3">
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-stone-100 last:border-0">
                      <div>
                        <p className="font-medium text-stone-900">{it.name}</p>
                        <p className="text-[11px] text-stone-500">Size: {it.size} · Color: {it.color} · Qty: {it.quantity}</p>
                      </div>
                      <span className="font-mono font-semibold">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="pt-2 border-t border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">Rs. {selectedOrderDetails.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-mono">{selectedOrderDetails.shippingCharge === 0 ? 'FREE' : `Rs. ${selectedOrderDetails.shippingCharge}`}</span>
                </div>
                {selectedOrderDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({selectedOrderDetails.couponCode || 'Promo'}):</span>
                    <span className="font-mono">-Rs. {selectedOrderDetails.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-950 pt-2 border-t border-stone-100">
                  <span>Final Total:</span>
                  <span className="font-mono">Rs. {selectedOrderDetails.totalAmount.toLocaleString()} ({selectedOrderDetails.paymentMethod})</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER ORDERS MODAL */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] text-stone-400 font-mono">CUSTOMER PROFILE</span>
                <h3 className="text-base font-bold text-stone-900">{selectedCustomerDetails.name}</h3>
              </div>
              <button onClick={() => setSelectedCustomerDetails(null)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="text-xs space-y-1 p-3 bg-stone-50 rounded border border-stone-200">
              <p><strong>Mobile:</strong> <span className="font-mono">{selectedCustomerDetails.phone}</span></p>
              {selectedCustomerDetails.email && <p><strong>Email:</strong> {selectedCustomerDetails.email}</p>}
              <p><strong>City:</strong> {selectedCustomerDetails.city}</p>
              <p><strong>Default Address:</strong> {selectedCustomerDetails.address}</p>
              <p><strong>Total Orders:</strong> {selectedCustomerDetails.totalOrders}</p>
              <p><strong>Lifetime Revenue:</strong> <span className="font-mono font-bold text-stone-950">Rs. {selectedCustomerDetails.totalSpent.toLocaleString()}</span></p>
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 pt-2">
              Order History
            </h4>

            <div className="space-y-2">
              {ordersList
                .filter(o => o.customer.phone === selectedCustomerDetails.phone)
                .map(ord => (
                  <div key={ord.id} className="p-3 border border-stone-200 rounded flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                      <p className="text-[11px] text-stone-500">{new Date(ord.createdAt).toLocaleDateString()} · {ord.items.length} garments</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold block">Rs. {ord.totalAmount.toLocaleString()}</span>
                      <span className={`text-[10px] font-semibold uppercase ${
                        ord.orderStatus === 'Delivered' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>{ord.orderStatus}</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="px-5 py-2 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-stone-900">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Shalwar Kameez"
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="e.g. Traditional bespoke suits"
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-semibold uppercase tracking-wider"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON CREATE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-stone-900">Create Discount Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="e.g. EID2026"
                  className="w-full uppercase font-mono px-3 py-2 border border-stone-300 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full font-mono px-3 py-2 border border-stone-300 rounded"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Minimum Order Amount (Rs.)</label>
                  <input
                    type="number"
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full font-mono px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Maximum Cap (Rs.)</label>
                  <input
                    type="number"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                    className="w-full font-mono px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-semibold uppercase tracking-wider"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
