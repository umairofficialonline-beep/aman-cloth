import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { 
  Product, Category, Order, Customer, Coupon, StoreSettings, AdminMetrics, 
  ProductReview, StockLog, SalesAnalyticsReport, OrderStatus 
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Increase payload limit for direct mobile & desktop image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

interface DBStructure {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  stockLogs: StockLog[];
  settings: StoreSettings;
  adminCredentials: {
    email: string;
    passwordHash: string; // Plain/hash for store administration
    token: string;
  };
}

// Initial seed data with generated luxury Pakistani fashion assets
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Royal Navy Embroidered Kurta Shalwar',
    slug: 'royal-navy-embroidered-kurta-shalwar',
    sku: 'ACH-MEN-001',
    category: 'Men\'s Clothing',
    brand: 'Aman Couture',
    price: 8950,
    salePrice: 7499,
    stock: 24,
    description: 'Masterfully crafted from premium staple blended cotton-silk with intricate tilla and resham threadwork along the band collar and cuffs. Tailored to perfection for festive occasions and formal celebrations.',
    fabricDetails: '80% Premium Egyptian Cotton, 20% Mulberry Silk Blend. Breathable & crease-resistant.',
    careInstructions: 'Dry clean recommended. Gentle hand wash inside out with cold water. Iron on medium heat.',
    packageContains: '1 Embroidered Kurta, 1 Matching Tailored Shalwar, Extra Replacement Buttons.',
    images: [
      '/src/assets/images/category_men_collection_1793091301301.jpg',
      '/src/assets/images/hero_fashion_luxury_1793091301490.jpg'
    ],
    colors: ['Royal Navy', 'Charcoal Grey', 'Deep Emerald'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    bestSeller: true,
    newArrival: true,
    isUnstitched: false,
    isPublished: true,
    tags: ['Kurta Shalwar', 'Festive', 'Men Fashion', 'Embroidery'],
    rating: 4.9,
    reviewsCount: 18,
    reviews: [
      {
        id: 'rev-01',
        userName: 'Hamza Tariq',
        userCity: 'Lahore',
        rating: 5,
        comment: 'Outstanding quality and stitching! The collar embroidery is subtle yet luxurious. Delivered in 2 days to Gulberg.',
        date: '2026-10-15',
        verifiedPurchase: true
      },
      {
        id: 'rev-02',
        userName: 'Bilal Qureshi',
        userCity: 'Islamabad',
        rating: 5,
        comment: 'Fabric feels ultra soft and breathable. The navy tone has a regal sheen.',
        date: '2026-10-18',
        verifiedPurchase: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-002',
    name: 'Zardozi Rose Organza Formal 3-Piece Suit',
    slug: 'zardozi-rose-organza-formal-suit',
    sku: 'ACH-WMN-002',
    category: 'Women\'s Clothing',
    brand: 'Aman Couture',
    price: 19500,
    salePrice: 16999,
    stock: 15,
    description: 'An ethereal blush pink pure organza kali-dar angrakha tunic adorned with hand-embellished dabka, sequins, cutdana, and zardozi work. Paired with a tailored silk trouser and scalloped zari-embroidered dupatta.',
    fabricDetails: 'Shirt: Pure Organza with Silk Lining. Trouser: Pure Raw Silk. Dupatta: Soft Organza with 4-side border.',
    careInstructions: 'Strictly dry clean only. Store wrapped in muslin cloth.',
    packageContains: 'Stitched Shirt, Stitched Trousers, Embellished Dupatta, Slip Lining.',
    images: [
      '/src/assets/images/category_women_collection_1793091302648.jpg',
      '/src/assets/images/promo_festive_banner_1793091303468.jpg'
    ],
    colors: ['Blush Rose', 'Champagne Gold', 'Ice Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
    bestSeller: true,
    newArrival: true,
    isUnstitched: false,
    isPublished: true,
    tags: ['Women Formal', 'Zardozi', 'Organza', 'Wedding Collection'],
    rating: 5.0,
    reviewsCount: 22,
    reviews: [
      {
        id: 'rev-03',
        userName: 'Ayesha Mehmood',
        userCity: 'Karachi',
        rating: 5,
        comment: 'Even more stunning in reality than pictures. The handwork is meticulous and fitting is true to size chart.',
        date: '2026-10-12',
        verifiedPurchase: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-003',
    name: 'Imperial Emerald Velvet Sherwani Kurta Ensemble',
    slug: 'imperial-emerald-velvet-sherwani-kurta',
    sku: 'ACH-MEN-003',
    category: 'Men\'s Clothing',
    brand: 'Aman Heritage',
    price: 24500,
    salePrice: null,
    stock: 4, // Low stock demo
    description: 'Regal micro-velvet sherwani kurta in deep jewel-toned emerald. Accented with handcrafted gold marori work on the neckline and sleeves, complemented by an ivory chudidar pajama and velvet shawl.',
    fabricDetails: 'Pure Micro Velvet 9000 with satin lining. Breathable inner finish.',
    careInstructions: 'Professional dry clean only. Steam iron only.',
    packageContains: '1 Velvet Sherwani, 1 Inner Silk Kurta, 1 Raw Silk Pajama, Matching Shawl.',
    images: [
      '/src/assets/images/hero_fashion_luxury_1793091301490.jpg',
      '/src/assets/images/promo_festive_banner_1793091303468.jpg'
    ],
    colors: ['Jewel Emerald', 'Midnight Black', 'Ruby Maroon'],
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    bestSeller: false,
    newArrival: true,
    isUnstitched: false,
    isPublished: true,
    tags: ['Sherwani', 'Groom Wear', 'Velvet', 'Luxury Menswear'],
    rating: 4.8,
    reviewsCount: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-004',
    name: 'Bespoke Unstitched Jacquard & Raw Silk 3-Piece',
    slug: 'bespoke-unstitched-jacquard-raw-silk-3-piece',
    sku: 'ACH-UNS-004',
    category: 'Unstitched Fabrics',
    brand: 'Aman Fabrics',
    price: 7800,
    salePrice: 6499,
    stock: 35,
    description: 'Premium unstitched 3-piece suit featuring woven metallic jacquard front and back, heavy organza embroidered neckline patch, embroidered daman border, and pure slub-silk trouser with printed chiffon dupatta.',
    fabricDetails: 'Jacquard Fabric: 3.25 meters. Raw Silk Trouser: 2.5 meters. Pure Chiffon Dupatta: 2.5 meters. Embroidered Patches: 3 pieces.',
    careInstructions: 'Shrink fabric before stitching. Hand wash separate in mild detergent.',
    packageContains: 'Unstitched Shirt Fabric, Trouser Fabric, Dupatta, 3x Embroidered Border Patches.',
    images: [
      '/src/assets/images/category_unstitched_luxury_1793091303504.jpg',
      '/src/assets/images/category_women_collection_1793091302648.jpg'
    ],
    colors: ['Teal & Gold', 'Crimson & Rust', 'Ivory & Ochre'],
    sizes: ['Unstitched'],
    featured: true,
    bestSeller: true,
    newArrival: false,
    isUnstitched: true,
    isPublished: true,
    tags: ['Unstitched', 'Jacquard', 'Pakistani Lawn', 'Festive Lawn'],
    rating: 4.9,
    reviewsCount: 31,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-005',
    name: 'Classic Egyptian Cotton Kurta — Pure Ivory',
    slug: 'classic-egyptian-cotton-kurta-ivory',
    sku: 'ACH-MEN-005',
    category: 'Kurtas',
    brand: 'Aman Daily',
    price: 4950,
    salePrice: 3999,
    stock: 40,
    description: 'Refined minimalism for everyday elegance and Jummah prayers. Tailored from 120/2 double-ply long-staple Egyptian cotton with mother-of-pearl buttons and crisp banded collar.',
    fabricDetails: '100% Giza Egyptian Long Staple Cotton. Silky smooth finish.',
    careInstructions: 'Machine wash gentle. Warm iron with light starch.',
    packageContains: '1 Kurta.',
    images: [
      '/src/assets/images/category_men_collection_1793091301301.jpg'
    ],
    colors: ['Pure Ivory', 'Soft Slate', 'Biscuit Cream'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    bestSeller: true,
    newArrival: false,
    isUnstitched: false,
    isPublished: true,
    tags: ['Kurta', 'Cotton', 'Summer Collection', 'Men Casual'],
    rating: 4.7,
    reviewsCount: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-006',
    name: 'The Opulent Velvet Wedding Kalidar Suit',
    slug: 'opulent-velvet-wedding-kalidar-suit',
    sku: 'ACH-WMN-006',
    category: 'Women\'s Clothing',
    brand: 'Aman Couture',
    price: 28000,
    salePrice: 24500,
    stock: 3, // Low stock demo
    description: 'Royal midnight blue and plum hand-worked velvet kalidar gown. Embellished with resham, tilla, mukesh work, and paired with a heavy organza dupatta finished with gold kiran edging.',
    fabricDetails: 'Pure Korean Velvet 9000 with rich zari hand-embroidery.',
    careInstructions: 'Dry clean only. Do not wash or steam at home.',
    packageContains: '1 Stitched Kalidar Anarkali, 1 Silk Trouser, 1 Heavy Embroidered Dupatta.',
    images: [
      '/src/assets/images/promo_festive_banner_1793091303468.jpg',
      '/src/assets/images/category_women_collection_1793091302648.jpg'
    ],
    colors: ['Midnight Blue', 'Royal Plum', 'Deep Crimson'],
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    bestSeller: false,
    newArrival: true,
    isUnstitched: false,
    isPublished: true,
    tags: ['Velvet', 'Kalidar', 'Bridal Festive', 'Formal'],
    rating: 5.0,
    reviewsCount: 11,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-007',
    name: 'Boys Traditional Embroidered Kurta Pajama',
    slug: 'boys-traditional-embroidered-kurta-pajama',
    sku: 'ACH-KID-007',
    category: 'Kids\' Clothing',
    brand: 'Aman Junior',
    price: 3600,
    salePrice: 2999,
    stock: 18,
    description: 'Charming festive kurta pajama set for boys. Breathable soft cotton blend with subtle collar threadwork and elastic waistband trousers for full comfort throughout celebrations.',
    fabricDetails: '100% Cotton Linen blend. Skin friendly.',
    careInstructions: 'Machine wash cold. Gentle tumble dry.',
    packageContains: '1 Kurta, 1 Cotton Pajama.',
    images: [
      '/src/assets/images/category_men_collection_1793091301301.jpg'
    ],
    colors: ['Sky Blue', 'Ivory Cream', 'Sage Green'],
    sizes: ['4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y', '12-13 Y'],
    featured: false,
    bestSeller: true,
    newArrival: true,
    isUnstitched: false,
    isPublished: true,
    tags: ['Kids', 'Boys Kurta', 'Festive Kids', 'Junior'],
    rating: 4.9,
    reviewsCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-008',
    name: 'Executive Cutaway Collar Crisp Cotton Shirt',
    slug: 'executive-cutaway-collar-crisp-cotton-shirt',
    sku: 'ACH-SHR-008',
    category: 'Shirts',
    brand: 'Aman Man',
    price: 4200,
    salePrice: 3499,
    stock: 25,
    description: 'Crisp semi-formal tailored button-down shirt designed with cutaway collar, French placket, and adjustable double barrel cuffs. Ideal for boardroom meetings and formal dinners.',
    fabricDetails: '100% Compact Twill Cotton. Easy-care wrinkle-free finish.',
    careInstructions: 'Machine wash warm. Medium iron.',
    packageContains: '1 Tailored Formal Shirt.',
    images: [
      '/src/assets/images/category_men_collection_1793091301301.jpg'
    ],
    colors: ['Crisp White', 'Sky Blue', 'Charcoal Stripe'],
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    bestSeller: false,
    newArrival: false,
    isUnstitched: false,
    isPublished: true,
    tags: ['Shirts', 'Menswear', 'Formal', 'Western'],
    rating: 4.6,
    reviewsCount: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Men\'s Clothing', slug: 'mens-clothing', description: 'Designer Kurtas, Shalwar Kameez, Waistcoats & Formalwear', image: '/src/assets/images/category_men_collection_1793091301301.jpg', itemCount: 12, displayOrder: 1, isVisible: true },
  { id: 'cat-2', name: 'Women\'s Clothing', slug: 'womens-clothing', description: 'Luxury Pret, Festive 3-Piece, Chiffon & Organza Ensembles', image: '/src/assets/images/category_women_collection_1793091302648.jpg', itemCount: 18, displayOrder: 2, isVisible: true },
  { id: 'cat-3', name: 'Unstitched Fabrics', slug: 'unstitched-fabrics', description: 'Pure Jacquard, Embroidered Lawn & Raw Silk Cut Pieces', image: '/src/assets/images/category_unstitched_luxury_1793091303504.jpg', itemCount: 9, displayOrder: 3, isVisible: true },
  { id: 'cat-4', name: 'Shalwar Kameez', slug: 'shalwar-kameez', description: 'Signature Pakistani traditional suits tailored to perfection', image: '/src/assets/images/hero_fashion_luxury_1793091301490.jpg', itemCount: 14, displayOrder: 4, isVisible: true },
  { id: 'cat-5', name: 'Kurtas', slug: 'kurtas', description: 'Contemporary & Traditional kurtas in premium cotton and silks', image: '/src/assets/images/category_men_collection_1793091301301.jpg', itemCount: 10, displayOrder: 5, isVisible: true },
  { id: 'cat-6', name: 'Kids\' Clothing', slug: 'kids-clothing', description: 'Traditional Festive Wear & Casuals for Boys and Girls', image: '/src/assets/images/category_men_collection_1793091301301.jpg', itemCount: 6, displayOrder: 6, isVisible: true },
  { id: 'cat-7', name: 'Shirts', slug: 'shirts', description: 'Crisp formal and semi-formal button-down shirts', image: '/src/assets/images/category_men_collection_1793091301301.jpg', itemCount: 7, displayOrder: 7, isVisible: true },
  { id: 'cat-8', name: 'Sale Collection', slug: 'sale-collection', description: 'Up to 30% Off on select festive and casual designs', image: '/src/assets/images/promo_festive_banner_1793091303468.jpg', itemCount: 8, displayOrder: 8, isVisible: true }
];

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'cpn-1', code: 'AMAN10', discountType: 'percentage', discountValue: 10, minOrderAmount: 3000, maxDiscount: 2500, usageCount: 42, isActive: true },
  { id: 'cpn-2', code: 'FESTIVE15', discountType: 'percentage', discountValue: 15, minOrderAmount: 8000, maxDiscount: 5000, usageCount: 19, isActive: true },
  { id: 'cpn-3', code: 'WELCOME1000', discountType: 'fixed', discountValue: 1000, minOrderAmount: 6000, usageCount: 15, isActive: true }
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Aman Cloth House',
  tagline: 'Timeless Pakistani Elegance & Bespoke Couture',
  logoUrl: '',
  phone: '+92 300 8472910',
  whatsappNumber: '+92 300 8472910',
  email: 'support@amanclothhouse.pk',
  address: 'Shop # 14-16, Liberty Market, Gulberg III',
  city: 'Lahore, Pakistan',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  announcementBarText: '✨ FREE Nationwide Express Shipping on Orders Above Rs. 4,999 · Cash on Delivery Available',
  announcementActive: true,
  standardShippingFee: 250,
  freeShippingThreshold: 4999,
  enableCod: true,
  enableBankTransfer: true,
  bankDetails: {
    bankName: 'Habib Bank Limited (HBL)',
    accountTitle: 'Aman Cloth House Pvt Ltd',
    accountNumber: '0129-8472910384',
    iban: 'PK42HABB0001298472910384'
  },
  socialLinks: {
    instagram: 'https://instagram.com/amanclothhouse',
    facebook: 'https://facebook.com/amanclothhouse',
    whatsapp: 'https://wa.me/923008472910',
    youtube: 'https://youtube.com/@amanclothhouse'
  },
  heroBanner: {
    title: 'Masterpieces of Pakistani Elegance',
    subtitle: 'Immerse yourself in authentic handcrafted royal sherwanis, bespoke cotton-silk kurtas, and ethereal organza luxury pret. Tailored with generational heritage in the heart of Lahore.',
    image: '/src/assets/images/hero_fashion_luxury_1793091301490.jpg',
    ctaText: 'Explore Collection',
    ctaLink: '/shop'
  },
  promotionalBanners: [
    {
      id: 'banner-1',
      title: 'Festive & Wedding Couture 2026',
      subtitle: 'Hand-crafted Zardozi, Velvet and Pure Raw Silk Ensembles',
      tagline: 'THE OPULENT AFFAIR',
      buttonText: 'Explore Collection',
      link: '/shop?category=Women%27s+Clothing',
      image: '/src/assets/images/promo_festive_banner_1793091303468.jpg',
      isActive: true
    }
  ],
  policies: {
    shipping: 'We deliver nationwide across all cities, towns, and tehsils in Pakistan via TCS, Leopard, and CallCourier. Standard delivery time is 2-4 business days for major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta) and 3-5 business days for other areas. Express orders are processed same-day before 3:00 PM PST.',
    returns: 'Aman Cloth House provides a hassle-free 7-day return and exchange policy. Items must be unused, unwashed, and in original packaging with all tags attached. Made-to-measure and custom-tailored suits cannot be returned unless defective. Return postage is covered by Aman Cloth House in case of damaged or incorrect items.',
    privacy: 'Your privacy is paramount. Aman Cloth House protects customer personal contact information and delivery details. We never sell or distribute phone numbers or addresses to third parties. All transactions and online payment channels are encrypted with industry-standard protocols.',
    terms: 'By placing an order on Aman Cloth House, you confirm your acceptance of our standard terms. Prices are subject to availability. Order verification calls or WhatsApp confirmations may be conducted prior to dispatch for high-value Cash on Delivery parcels.',
    about: 'Founded with a dedication to preserving Pakistan’s rich heritage of master textiles and artisanal embroidery, Aman Cloth House has grown from a prestigious Lahore boutique into a premier nationwide clothing destination. We fuse age-old zardozi, resham threadcraft, and pure natural fabrics with contemporary tailored silhouettes.'
  }
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ACH-2026-89102',
    customer: {
      name: 'Muhammad Daniyal',
      phone: '03001234567',
      email: 'daniyal.m@gmail.com',
      city: 'Karachi',
      address: 'House 42, Block 4, Clifton',
      postalCode: '75600',
      notes: 'Please call before delivery'
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Royal Navy Embroidered Kurta Shalwar',
        image: '/src/assets/images/category_men_collection_1793091301301.jpg',
        color: 'Royal Navy',
        size: 'L',
        quantity: 1,
        price: 7499,
        total: 7499
      }
    ],
    subtotal: 7499,
    shippingCharge: 0,
    discountAmount: 749,
    couponCode: 'AMAN10',
    totalAmount: 6750,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Processing',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'Order placed by customer via Cash on Delivery' },
      { status: 'Processing', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), note: 'Stock verified and garment sent for final pressing and tag inspection' }
    ],
    courierName: 'TCS Express',
    trackingNumber: 'TCS-92847192',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ord-102',
    orderNumber: 'ACH-2026-89101',
    customer: {
      name: 'Zainab Fatima',
      phone: '03219876543',
      email: 'zainab.f@outlook.com',
      city: 'Lahore',
      address: 'Apartment 302, Gold Crest Mall, DHA Phase 4',
      postalCode: '54000'
    },
    items: [
      {
        productId: 'prod-002',
        name: 'Zardozi Rose Organza Formal 3-Piece Suit',
        image: '/src/assets/images/category_women_collection_1793091302648.jpg',
        color: 'Blush Rose',
        size: 'M',
        quantity: 1,
        price: 16999,
        total: 16999
      }
    ],
    subtotal: 16999,
    shippingCharge: 0,
    discountAmount: 0,
    totalAmount: 16999,
    paymentMethod: 'BankTransfer',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 36).toISOString(), note: 'Bank transfer pending verification' },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 30).toISOString(), note: 'HBL IBFT verified via WhatsApp slip' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 3600000 * 10).toISOString(), note: 'Dispatched via Leopards Courier tracking LEO-77291038' }
    ],
    courierName: 'Leopards Courier',
    trackingNumber: 'LEO-77291038',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Muhammad Daniyal',
    phone: '03001234567',
    email: 'daniyal.m@gmail.com',
    city: 'Karachi',
    address: 'House 42, Block 4, Clifton',
    totalOrders: 1,
    totalSpent: 6750,
    lastOrderDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'cust-2',
    name: 'Zainab Fatima',
    phone: '03219876543',
    email: 'zainab.f@outlook.com',
    city: 'Lahore',
    address: 'Apartment 302, Gold Crest Mall, DHA Phase 4',
    totalOrders: 1,
    totalSpent: 16999,
    lastOrderDate: new Date(Date.now() - 3600000 * 36).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

const DEFAULT_STOCK_LOGS: StockLog[] = [
  {
    id: 'stk-log-1',
    productId: 'prod-001',
    productName: 'Royal Navy Embroidered Kurta Shalwar',
    previousStock: 25,
    newStock: 24,
    change: -1,
    reason: 'Customer Order ACH-2026-89102',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'stk-log-2',
    productId: 'prod-002',
    productName: 'Zardozi Rose Organza Formal 3-Piece Suit',
    previousStock: 16,
    newStock: 15,
    change: -1,
    reason: 'Customer Order ACH-2026-89101',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

// Helper to read and write database
function getDB(): DBStructure {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDB: DBStructure = {
        products: DEFAULT_PRODUCTS,
        categories: DEFAULT_CATEGORIES,
        orders: DEFAULT_ORDERS,
        customers: DEFAULT_CUSTOMERS,
        coupons: DEFAULT_COUPONS,
        stockLogs: DEFAULT_STOCK_LOGS,
        settings: DEFAULT_SETTINGS,
        adminCredentials: {
          email: 'admin@amancloth.pk',
          passwordHash: 'admin123',
          token: 'ach-admin-secure-auth-token-2026'
        }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
      return initialDB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Ensure backwards compatibility with newly added fields
    if (!parsed.stockLogs) parsed.stockLogs = DEFAULT_STOCK_LOGS;
    if (!parsed.settings.heroBanner) parsed.settings.heroBanner = DEFAULT_SETTINGS.heroBanner;
    return parsed;
  } catch (err) {
    console.error('Error reading DB:', err);
    return {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      orders: DEFAULT_ORDERS,
      customers: DEFAULT_CUSTOMERS,
      coupons: DEFAULT_COUPONS,
      stockLogs: DEFAULT_STOCK_LOGS,
      settings: DEFAULT_SETTINGS,
      adminCredentials: {
        email: 'admin@amancloth.pk',
        passwordHash: 'admin123',
        token: 'ach-admin-secure-auth-token-2026'
      }
    };
  }
}

function saveDB(data: DBStructure): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Security Middleware for Admin Access
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const db = getDB();
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'];

  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : (typeof customHeader === 'string' ? customHeader.trim() : null);

  if (!token || token !== db.adminCredentials.token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Valid administrator credentials required.'
    });
  }

  next();
}

// ---------------- REST API ROUTES ----------------

// Products (Customer & Admin read)
app.get('/api/products', (req, res) => {
  const db = getDB();
  let list = [...db.products];
  const { category, search, minPrice, maxPrice, sort, featured, tag, includeUnpublished } = req.query;

  // Filter out unpublished for public storefront unless specified by admin
  if (includeUnpublished !== 'true') {
    list = list.filter(p => p.isPublished !== false);
  }

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    list = list.filter(p => (p.salePrice || p.price) >= Number(minPrice));
  }
  if (maxPrice) {
    list = list.filter(p => (p.salePrice || p.price) <= Number(maxPrice));
  }

  if (featured === 'true') {
    list = list.filter(p => p.featured);
  }

  if (tag && typeof tag === 'string') {
    list = list.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (sort === 'price-low') {
    list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === 'price-high') {
    list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else {
    // Default newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ success: true, count: list.length, products: list });
});

app.get('/api/products/:id', (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const related = db.products
    .filter(p => p.id !== product.id && p.category === product.category && p.isPublished !== false)
    .slice(0, 4);

  res.json({ success: true, product, related });
});

// Admin Product Create (Protected)
app.post('/api/products', requireAdminAuth, (req, res) => {
  const db = getDB();
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name,
    slug: (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sku: req.body.sku || `ACH-${Date.now().toString().slice(-4)}`,
    category: req.body.category || 'Men\'s Clothing',
    brand: req.body.brand || 'Aman Cloth House',
    price: Number(req.body.price) || 0,
    salePrice: req.body.salePrice ? Number(req.body.salePrice) : null,
    stock: Number(req.body.stock) || 0,
    description: req.body.description || '',
    fabricDetails: req.body.fabricDetails || '',
    careInstructions: req.body.careInstructions || '',
    packageContains: req.body.packageContains || '',
    images: req.body.images && req.body.images.length > 0 ? req.body.images : ['/src/assets/images/category_men_collection_1793091301301.jpg'],
    colors: req.body.colors || ['Standard'],
    sizes: req.body.sizes || ['M', 'L'],
    featured: Boolean(req.body.featured),
    bestSeller: Boolean(req.body.bestSeller),
    newArrival: Boolean(req.body.newArrival),
    isUnstitched: Boolean(req.body.isUnstitched),
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
    tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : []),
    rating: 5.0,
    reviewsCount: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);

  // Log initial stock creation
  db.stockLogs.unshift({
    id: `stk-${Date.now()}`,
    productId: newProduct.id,
    productName: newProduct.name,
    previousStock: 0,
    newStock: newProduct.stock,
    change: newProduct.stock,
    reason: 'Initial Product Inventory Setup',
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ success: true, product: newProduct });
});

// Admin Product Edit (Protected)
app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const db = getDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existing = db.products[index];
  const previousStock = existing.stock;
  const newStock = req.body.stock !== undefined ? Number(req.body.stock) : previousStock;

  const updated: Product = {
    ...existing,
    ...req.body,
    price: Number(req.body.price ?? existing.price),
    salePrice: req.body.salePrice !== undefined ? (req.body.salePrice ? Number(req.body.salePrice) : null) : existing.salePrice,
    stock: newStock,
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : (existing.isPublished !== false),
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;

  // If stock was adjusted directly in edit modal, log it
  if (newStock !== previousStock) {
    db.stockLogs.unshift({
      id: `stk-${Date.now()}`,
      productId: updated.id,
      productName: updated.name,
      previousStock,
      newStock,
      change: newStock - previousStock,
      reason: req.body.stockAdjustmentReason || 'Stock edited via Product Editor',
      timestamp: new Date().toISOString()
    });
  }

  saveDB(db);
  res.json({ success: true, product: updated });
});

// Admin Product Delete (Protected)
app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const db = getDB();
  const initialLen = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  saveDB(db);
  res.json({ success: true, message: 'Product deleted' });
});

// Reviews
app.post('/api/products/:id/reviews', (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { userName, userCity, rating, comment } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Name, rating, and comment are required' });
  }

  const newReview: ProductReview = {
    id: `rev-${Date.now()}`,
    userName,
    userCity: userCity || 'Pakistan',
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true
  };

  if (!product.reviews) {
    product.reviews = [];
  }
  product.reviews.unshift(newReview);
  product.reviewsCount = product.reviews.length;
  product.rating = Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1));

  saveDB(db);
  res.status(201).json({ success: true, review: newReview, rating: product.rating, reviewsCount: product.reviewsCount });
});

// Categories
app.get('/api/categories', (req, res) => {
  const db = getDB();
  res.json({ success: true, categories: db.categories });
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  const db = getDB();
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: req.body.name,
    slug: (req.body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: req.body.description || '',
    image: req.body.image || '/src/assets/images/category_men_collection_1793091301301.jpg',
    itemCount: 0,
    displayOrder: db.categories.length + 1,
    isVisible: req.body.isVisible !== undefined ? Boolean(req.body.isVisible) : true
  };
  db.categories.push(newCat);
  saveDB(db);
  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
  const db = getDB();
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDB(db);
  res.json({ success: true, category: db.categories[index] });
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  const db = getDB();
  const cat = db.categories.find(c => c.id === req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  // Safety check: Prevent accidental deletion of categories containing products
  const assignedProducts = db.products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
  if (assignedProducts.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete "${cat.name}": ${assignedProducts.length} product(s) are currently assigned to this category. Please reassign or delete them first.`
    });
  }

  db.categories = db.categories.filter(c => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Category removed' });
});

// Coupons
app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }

  const db = getDB();
  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: 'This coupon has reached its maximum redemption limit' });
  }

  // Check expiry date if configured
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return res.status(400).json({ success: false, message: 'This coupon code has expired' });
  }

  if (coupon.minOrderAmount && Number(cartTotal) < coupon.minOrderAmount) {
    return res.status(400).json({ 
      success: false, 
      message: `Minimum order amount for code ${coupon.code} is Rs. ${coupon.minOrderAmount.toLocaleString()}` 
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((Number(cartTotal) * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      calculatedDiscount: discount
    }
  });
});

app.get('/api/admin/coupons', requireAdminAuth, (req, res) => {
  const db = getDB();
  res.json({ success: true, coupons: db.coupons });
});

app.post('/api/admin/coupons', requireAdminAuth, (req, res) => {
  const db = getDB();
  const newCoupon: Coupon = {
    id: `cpn-${Date.now()}`,
    code: req.body.code.trim().toUpperCase(),
    discountType: req.body.discountType || 'percentage',
    discountValue: Number(req.body.discountValue),
    minOrderAmount: req.body.minOrderAmount ? Number(req.body.minOrderAmount) : undefined,
    maxDiscount: req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined,
    usageLimit: req.body.usageLimit ? Number(req.body.usageLimit) : undefined,
    expiryDate: req.body.expiryDate || undefined,
    usageCount: 0,
    isActive: true
  };
  db.coupons.push(newCoupon);
  saveDB(db);
  res.status(201).json({ success: true, coupon: newCoupon });
});

app.delete('/api/admin/coupons/:id', requireAdminAuth, (req, res) => {
  const db = getDB();
  db.coupons = db.coupons.filter(c => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Coupon deleted' });
});

// Orders & Checkout
app.post('/api/orders', (req, res) => {
  const db = getDB();
  const { customer, items, paymentMethod, couponCode, notes } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address) {
    return res.status(400).json({ success: false, message: 'Please provide full customer details: name, phone, city and address.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Calculate pricing & update inventory safely
  let subtotal = 0;
  for (const item of items) {
    const prod = db.products.find(p => p.id === item.productId);
    const itemPrice = prod ? (prod.salePrice || prod.price) : item.price;
    subtotal += itemPrice * item.quantity;

    // Decrement stock in real persistent DB and log it
    if (prod) {
      const prev = prod.stock;
      prod.stock = Math.max(0, prod.stock - item.quantity);
      db.stockLogs.unshift({
        id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: prod.id,
        productName: prod.name,
        previousStock: prev,
        newStock: prod.stock,
        change: -item.quantity,
        reason: `Order Placement checkout (${item.quantity} units)`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (couponCode) {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
    if (coupon && (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)) {
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }
      coupon.usageCount += 1;
    }
  }

  // Shipping rules
  const shippingCharge = subtotal >= db.settings.freeShippingThreshold ? 0 : db.settings.standardShippingFee;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharge);

  // Generate unique order number (Pakistani format)
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `ACH-${new Date().getFullYear()}-${randomSuffix}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      city: customer.city.trim(),
      address: customer.address.trim(),
      postalCode: customer.postalCode?.trim() || '',
      notes: notes || customer.notes || ''
    },
    items: items.map(item => ({
      productId: item.productId,
      name: item.name || item.product?.name || 'Product',
      image: item.image || item.product?.images?.[0] || '',
      color: item.color || item.selectedColor || 'Default',
      size: item.size || item.selectedSize || 'Standard',
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    subtotal,
    shippingCharge,
    discountAmount,
    couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
    totalAmount,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Pending',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: `Order booked via ${paymentMethod || 'COD'}. Total: Rs. ${totalAmount.toLocaleString()}`,
        updatedBy: 'System / Customer'
      }
    ],
    courierName: 'TCS Pakistan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Update or insert customer
  const existingCustIndex = db.customers.findIndex(c => c.phone === customer.phone.trim());
  if (existingCustIndex >= 0) {
    db.customers[existingCustIndex].totalOrders += 1;
    db.customers[existingCustIndex].totalSpent += totalAmount;
    db.customers[existingCustIndex].lastOrderDate = new Date().toISOString();
    db.customers[existingCustIndex].name = customer.name.trim();
    db.customers[existingCustIndex].city = customer.city.trim();
    db.customers[existingCustIndex].address = customer.address.trim();
  } else {
    db.customers.push({
      id: `cust-${Date.now()}`,
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      city: customer.city.trim(),
      address: customer.address.trim(),
      totalOrders: 1,
      totalSpent: totalAmount,
      lastOrderDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }

  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order: newOrder
  });
});

// Track Order (Customer facing)
app.post('/api/orders/track', (req, res) => {
  const { orderNumber, phone } = req.body;
  if (!orderNumber || !phone) {
    return res.status(400).json({ success: false, message: 'Please provide both Order Number and Phone Number.' });
  }

  const db = getDB();
  const cleanNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

  const order = db.orders.find(o => 
    o.orderNumber.toUpperCase() === cleanNum && 
    o.customer.phone.replace(/[^0-9]/g, '').slice(-9) === cleanPhone.slice(-9)
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'No matching order found for the provided details. Please verify your order number and mobile number.' });
  }

  res.json({ success: true, order });
});

// Admin Orders List (Protected)
app.get('/api/orders', requireAdminAuth, (req, res) => {
  const db = getDB();
  let list = [...db.orders];
  const { status, search, paymentMethod, startDate, endDate } = req.query;

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
  }

  if (paymentMethod && typeof paymentMethod === 'string' && paymentMethod !== 'All') {
    list = list.filter(o => o.paymentMethod === paymentMethod);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(o => 
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      o.customer.city.toLowerCase().includes(q)
    );
  }

  if (startDate && typeof startDate === 'string') {
    list = list.filter(o => new Date(o.createdAt) >= new Date(startDate));
  }
  if (endDate && typeof endDate === 'string') {
    list = list.filter(o => new Date(o.createdAt) <= new Date(endDate));
  }

  res.json({ success: true, count: list.length, orders: list });
});

app.get('/api/orders/:id', (req, res) => {
  const db = getDB();
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// Update Order Status & Courier Info (Protected)
app.patch('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  const db = getDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const { status, paymentStatus, courierName, trackingNumber, cancellationReason, statusNote, updatedBy } = req.body;
  const oldStatus = order.orderStatus;

  if (status && status !== oldStatus) {
    order.orderStatus = status as OrderStatus;
    
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: status as OrderStatus,
      timestamp: new Date().toISOString(),
      note: statusNote || (status === 'Cancelled' ? `Cancelled: ${cancellationReason || 'No reason provided'}` : `Status updated to ${status}`),
      updatedBy: updatedBy || 'Store Admin'
    });

    // If order was cancelled, restock products automatically
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.items) {
        const prod = db.products.find(p => p.id === item.productId);
        if (prod) {
          const prev = prod.stock;
          prod.stock += item.quantity;
          db.stockLogs.unshift({
            id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            productId: prod.id,
            productName: prod.name,
            previousStock: prev,
            newStock: prod.stock,
            change: item.quantity,
            reason: `Restocked after Order ${order.orderNumber} cancellation`,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (courierName !== undefined) order.courierName = courierName;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (cancellationReason !== undefined) order.cancellationReason = cancellationReason;
  order.updatedAt = new Date().toISOString();

  saveDB(db);
  res.json({ success: true, order });
});

// Customers list for admin (Protected)
app.get('/api/customers', requireAdminAuth, (req, res) => {
  const db = getDB();
  let list = [...db.customers];
  const { search } = req.query;

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.city.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, customers: list });
});

// Customer history (Public for order lookup)
app.post('/api/customer/orders', (req, res) => {
  const { phone, email } = req.body;
  if (!phone && !email) {
    return res.status(400).json({ success: false, message: 'Provide phone or email' });
  }

  const db = getDB();
  const cleanPhone = phone ? phone.trim().replace(/[^0-9]/g, '').slice(-9) : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  const matched = db.orders.filter(o => {
    const orderPhone = o.customer.phone.replace(/[^0-9]/g, '').slice(-9);
    const orderEmail = (o.customer.email || '').toLowerCase();
    return (cleanPhone && orderPhone === cleanPhone) || (cleanEmail && orderEmail === cleanEmail);
  });

  res.json({ success: true, orders: matched });
});

// Direct Image Upload Endpoint (supports gallery / device file picker)
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, message: 'Missing image data' });
    }

    // Parse base64
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid image format. Expected base64 DataURL.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1] || 'jpg';
    const safeFilename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/uploads/${safeFilename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: safeFilename
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err?.message || 'Upload failed' });
  }
});

// Store Settings (Read public, Update protected)
app.get('/api/settings', (req, res) => {
  const db = getDB();
  res.json({ success: true, settings: db.settings });
});

app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// Inventory Manual Stock Adjustment (Protected)
app.post('/api/admin/inventory/adjust', requireAdminAuth, (req, res) => {
  const { productId, change, reason, newStock } = req.body;
  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  const db = getDB();
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const prev = product.stock;
  let targetStock = prev;

  if (newStock !== undefined) {
    targetStock = Math.max(0, Number(newStock));
  } else if (change !== undefined) {
    targetStock = Math.max(0, prev + Number(change));
  }

  const actualChange = targetStock - prev;
  product.stock = targetStock;

  const logEntry: StockLog = {
    id: `stk-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    previousStock: prev,
    newStock: targetStock,
    change: actualChange,
    reason: reason || 'Manual stock adjustment by administrator',
    timestamp: new Date().toISOString()
  };

  db.stockLogs.unshift(logEntry);
  saveDB(db);

  res.json({ success: true, product, log: logEntry });
});

app.get('/api/admin/inventory/logs', requireAdminAuth, (req, res) => {
  const db = getDB();
  res.json({ success: true, logs: db.stockLogs.slice(0, 100) });
});

// Admin Auth Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  
  if (
    (email === db.adminCredentials.email || email === 'admin') &&
    password === db.adminCredentials.passwordHash
  ) {
    return res.json({
      success: true,
      token: db.adminCredentials.token,
      user: { email: db.adminCredentials.email, role: 'SuperAdmin' }
    });
  }

  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Admin Google Sign-In Login
app.post('/api/admin/google-login', (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Google account email is required' });
  }

  const db = getDB();
  const cleanEmail = email.trim().toLowerCase();

  const authorizedEmails = [
    'umair.official.online@gmail.com',
    db.adminCredentials.email.toLowerCase(),
    'admin@amancloth.pk'
  ];

  const isAuthorized = authorizedEmails.includes(cleanEmail) || 
                       cleanEmail.endsWith('@amancloth.pk') ||
                       cleanEmail.includes('admin') ||
                       cleanEmail === 'umair.official.online@gmail.com';

  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      message: `Access denied. "${cleanEmail}" is not authorized as an administrator for Aman Cloth House.`
    });
  }

  const token = db.adminCredentials.token;
  res.json({
    success: true,
    token,
    user: {
      email: cleanEmail,
      name: name || (cleanEmail === 'umair.official.online@gmail.com' ? 'Umair (Owner)' : 'Aman Store Admin'),
      avatar: avatar || '',
      role: 'SuperAdmin',
      provider: 'google'
    }
  });
});

// Update Admin Credentials (Protected)
app.post('/api/admin/update-credentials', requireAdminAuth, (req, res) => {
  const { newEmail, newPassword } = req.body;
  const db = getDB();

  if (newEmail) db.adminCredentials.email = newEmail.trim();
  if (newPassword) db.adminCredentials.passwordHash = newPassword.trim();

  saveDB(db);
  res.json({ success: true, message: 'Admin credentials updated successfully' });
});

// Admin Metrics (Protected)
app.get('/api/admin/metrics', requireAdminAuth, (req, res) => {
  const db = getDB();
  const orders = db.orders;

  const totalSales = orders.reduce((sum, o) => o.orderStatus !== 'Cancelled' ? sum + o.totalAmount : sum, 0);
  const totalOrders = orders.length;
  const totalCustomers = db.customers.length;
  const totalProducts = db.products.length;

  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const confirmedOrders = orders.filter(o => o.orderStatus === 'Confirmed').length;
  const processingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
  const shippedOrders = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

  const lowStockProducts = db.products.filter(p => p.stock <= 5).length;

  const recentOrders = orders.slice(0, 8);

  const salesTrend = [
    { date: 'Oct 21', amount: 18500, orders: 3 },
    { date: 'Oct 22', amount: 24200, orders: 4 },
    { date: 'Oct 23', amount: 31900, orders: 5 },
    { date: 'Oct 24', amount: 28400, orders: 4 },
    { date: 'Oct 25', amount: 36800, orders: 6 },
    { date: 'Oct 26', amount: 42100, orders: 7 },
    { date: 'Oct 27', amount: totalSales > 0 ? totalSales : 22500, orders: totalOrders }
  ];

  const metrics: AdminMetrics = {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    lowStockProducts,
    recentOrders,
    salesTrend
  };

  res.json({ success: true, metrics });
});

// Comprehensive Reports & Analytics (Protected)
app.get('/api/admin/reports', requireAdminAuth, (req, res) => {
  const db = getDB();
  const timeframe = (req.query.timeframe as string) || 'month';

  const validOrders = db.orders.filter(o => o.orderStatus !== 'Cancelled');
  const cancelledOrdersList = db.orders.filter(o => o.orderStatus === 'Cancelled');

  const grossRevenue = db.orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = db.orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  const cancelledRevenue = cancelledOrdersList.reduce((sum, o) => sum + o.totalAmount, 0);
  const netRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Best selling products calculation
  const productSalesMap: Record<string, { name: string; units: number; revenue: number; stock: number }> = {};
  for (const ord of validOrders) {
    for (const item of ord.items) {
      if (!productSalesMap[item.productId]) {
        const prod = db.products.find(p => p.id === item.productId);
        productSalesMap[item.productId] = {
          name: item.name,
          units: 0,
          revenue: 0,
          stock: prod?.stock ?? 0
        };
      }
      productSalesMap[item.productId].units += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    }
  }

  const bestSellingProducts = Object.entries(productSalesMap)
    .map(([productId, data]) => ({
      productId,
      name: data.name,
      unitsSold: data.units,
      revenue: data.revenue,
      stockRemaining: data.stock
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 10);

  // Sales by Category
  const categorySalesMap: Record<string, { units: number; revenue: number }> = {};
  for (const ord of validOrders) {
    for (const item of ord.items) {
      const prod = db.products.find(p => p.id === item.productId);
      const cat = prod?.category || 'General';
      if (!categorySalesMap[cat]) categorySalesMap[cat] = { units: 0, revenue: 0 };
      categorySalesMap[cat].units += item.quantity;
      categorySalesMap[cat].revenue += item.price * item.quantity;
    }
  }

  const salesByCategory = Object.entries(categorySalesMap).map(([category, data]) => ({
    category,
    unitsSold: data.units,
    revenue: data.revenue
  }));

  // Inventory valuation
  const totalInventoryUnits = db.products.reduce((sum, p) => sum + p.stock, 0);
  const totalRetailValue = db.products.reduce((sum, p) => sum + (p.stock * (p.salePrice || p.price)), 0);

  // Time Series based on timeframe
  const timeSeries = [
    { label: timeframe === 'day' ? '12:00 AM' : (timeframe === 'week' ? 'Mon' : 'Week 1'), revenue: Math.round(netRevenue * 0.2), orders: Math.max(1, Math.round(validOrders.length * 0.2)) },
    { label: timeframe === 'day' ? '06:00 AM' : (timeframe === 'week' ? 'Tue' : 'Week 2'), revenue: Math.round(netRevenue * 0.25), orders: Math.max(1, Math.round(validOrders.length * 0.25)) },
    { label: timeframe === 'day' ? '12:00 PM' : (timeframe === 'week' ? 'Wed' : 'Week 3'), revenue: Math.round(netRevenue * 0.35), orders: Math.max(1, Math.round(validOrders.length * 0.35)) },
    { label: timeframe === 'day' ? '06:00 PM' : (timeframe === 'week' ? 'Thu' : 'Week 4'), revenue: Math.round(netRevenue * 0.2), orders: Math.max(1, Math.round(validOrders.length * 0.2)) }
  ];

  const report: SalesAnalyticsReport = {
    timeframe: (timeframe as any) || 'month',
    grossRevenue,
    netRevenue,
    totalDiscounts,
    cancelledRevenue,
    totalOrders: db.orders.length,
    completedOrders: validOrders.length,
    cancelledOrders: cancelledOrdersList.length,
    inventoryValuation: {
      totalUnits: totalInventoryUnits,
      totalRetailValue
    },
    bestSellingProducts,
    salesByCategory,
    timeSeries
  };

  res.json({ success: true, report });
});

// CSV Export Endpoint (Protected)
app.get('/api/admin/export/orders.csv', requireAdminAuth, (req, res) => {
  const db = getDB();
  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Customer Phone',
    'City',
    'Address',
    'Payment Method',
    'Payment Status',
    'Order Status',
    'Items Summary',
    'Subtotal PKR',
    'Shipping Fee PKR',
    'Discount PKR',
    'Total PKR',
    'Courier',
    'Tracking Number'
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = db.orders.map(o => {
    const itemsSummary = o.items.map(i => `${i.name} (${i.size}/${i.color}) x${i.quantity}`).join('; ');
    return [
      escapeCSV(o.orderNumber),
      escapeCSV(o.createdAt.split('T')[0]),
      escapeCSV(o.customer.name),
      escapeCSV(o.customer.phone),
      escapeCSV(o.customer.city),
      escapeCSV(o.customer.address),
      escapeCSV(o.paymentMethod),
      escapeCSV(o.paymentStatus),
      escapeCSV(o.orderStatus),
      escapeCSV(itemsSummary),
      escapeCSV(o.subtotal),
      escapeCSV(o.shippingCharge),
      escapeCSV(o.discountAmount),
      escapeCSV(o.totalAmount),
      escapeCSV(o.courierName || 'TCS'),
      escapeCSV(o.trackingNumber || '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=Aman_Cloth_House_Orders_${new Date().toISOString().split('T')[0]}.csv`);
  res.status(200).send(csvContent);
});

// Vite middleware in dev or static serve in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ Aman Cloth House server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
