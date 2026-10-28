import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Star,
  Quote,
  Instagram,
  Send
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { 
  heroImage, 
  menCollectionImage, 
  womenCollectionImage, 
  unstitchedImage, 
  promoBannerImage,
  resolveProductImage 
} from '../assets/images';

export const HomePage: React.FC = () => {
  const { 
    products, 
    categories, 
    settings, 
    setCurrentPage, 
    setSelectedCategory, 
    showToast 
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Filter products
  const newArrivals = products.filter(p => p.newArrival).slice(0, 8);
  const bestSellers = products.filter(p => p.bestSeller || p.featured).slice(0, 8);
  const mensProducts = products.filter(p => p.category.toLowerCase().includes('men') || p.category.toLowerCase().includes('kurta')).slice(0, 4);
  const womensProducts = products.filter(p => p.category.toLowerCase().includes('women') || p.category.toLowerCase().includes('suit')).slice(0, 4);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setNewsletterSubmitted(true);
    showToast('Subscribed! Use code AMAN10 for 10% off your first order.', 'success');
  };

  const promoBanner = settings?.promotionalBanners?.[0];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[720px] flex items-center bg-stone-900 overflow-hidden">
        {/* Background Image with luxury overlay scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Aman Cloth House Festive Couture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/30 rounded-full text-amber-300 text-xs tracking-widest uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Winter & Wedding Couture 2026</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-[1.15]">
              Masterpieces of <span className="italic font-serif text-amber-200">Pakistani</span> Elegance
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
              Immerse yourself in authentic handcrafted royal sherwanis, bespoke cotton-silk kurtas, and ethereal organza luxury pret. Tailored with generational heritage in the heart of Lahore.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentPage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-amber-200 hover:bg-amber-100 text-stone-950 text-xs font-semibold uppercase tracking-widest rounded-md transition-all shadow-lg hover:shadow-amber-900/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('Men\'s Clothing');
                  setCurrentPage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-widest rounded-md border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
              >
                Men's Kurta Shalwar
              </button>
            </div>

            {/* Micro proof line */}
            <div className="pt-6 border-t border-white/10 flex items-center gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Free Shipping &gt; Rs. 4,999</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Category Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Curated Lines
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Signature Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1: Men's */}
          <div 
            onClick={() => handleCategoryClick('Men\'s Clothing')}
            className="group relative h-96 rounded-lg overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src={menCollectionImage}
              alt="Men's Traditional Clothing"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <span className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold">
                Menswear Collection
              </span>
              <h3 className="text-xl font-serif font-medium mt-1 mb-2">
                Designer Kurtas & Shalwar Kameez
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-200 group-hover:translate-x-1 transition-transform">
                <span>View Designs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Category 2: Women's */}
          <div 
            onClick={() => handleCategoryClick('Women\'s Clothing')}
            className="group relative h-96 rounded-lg overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src={womenCollectionImage}
              alt="Women's Luxury Pret"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <span className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold">
                Women's Couture
              </span>
              <h3 className="text-xl font-serif font-medium mt-1 mb-2">
                Zardozi Organza & Luxury Pret
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-200 group-hover:translate-x-1 transition-transform">
                <span>Shop Suits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Category 3: Unstitched */}
          <div 
            onClick={() => handleCategoryClick('Unstitched Fabrics')}
            className="group relative h-96 rounded-lg overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src={unstitchedImage}
              alt="Unstitched Luxury Fabrics"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <span className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold">
                Pure Textiles
              </span>
              <h3 className="text-xl font-serif font-medium mt-1 mb-2">
                Unstitched Jacquard & Raw Silk
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-200 group-hover:translate-x-1 transition-transform">
                <span>Explore Fabrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
              Fresh Off The Loom
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage('shop');
            }}
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Dynamic Admin-Configurable Promotional Banner */}
      {promoBanner && promoBanner.isActive && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-xl overflow-hidden bg-stone-900 shadow-xl">
            <img
              src={resolveProductImage(promoBanner.image) || promoBannerImage}
              alt={promoBanner.title}
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover object-center filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-transparent flex items-center">
              <div className="max-w-xl p-6 sm:p-12 text-white space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300">
                  {promoBanner.tagline || 'LIMITED EDITION RELEASE'}
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
                  {promoBanner.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md">
                  {promoBanner.subtitle || 'Handcrafted velvet kalidars, embroidered coats, and pure raw silk matching separates.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('Women\'s Clothing');
                      setCurrentPage('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-amber-300 hover:bg-amber-200 text-stone-950 text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-md cursor-pointer"
                  >
                    {promoBanner.buttonText || 'Shop Wedding Edition'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage('shop');
            }}
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Men's Feature Spotlight */}
      <section className="bg-stone-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                Crafted for Gentlemen
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
                Men's Eastern Couture
              </h2>
            </div>
            <button
              onClick={() => handleCategoryClick('Men\'s Clothing')}
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Menswear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {mensProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Real Customer Testimonials & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Trusted Across Pakistan
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Words From Our Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                "Ordered the Royal Navy Embroidered Kurta Shalwar for my brother’s Mehndi in Lahore. The embroidery was exceptionally fine, and the fabric was genuinely breathable Egyptian cotton. Delivered within 36 hours!"
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-stone-900">Hamza Tariq</h4>
                <p className="text-[11px] text-stone-500">Gulberg, Lahore</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                "The blush organza 3-piece formal is a masterpiece. The zardozi borders, stitching neatness, and dupatta fall are of high-end boutique quality. Truly pleased with Aman Cloth House."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-stone-900">Ayesha Mehmood</h4>
                <p className="text-[11px] text-stone-500">Clifton, Karachi</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-lg shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                "Cash on Delivery worked seamlessly to Islamabad. The unstitched jacquard fabric was rich, heavy, and the color tones matched the online photos exactly. Will definitely reorder."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-stone-900">Dr. Mubeen Aslam</h4>
                <p className="text-[11px] text-stone-500">F-8, Islamabad</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social / Lookbook Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            <Instagram className="w-4 h-4 text-amber-800" />
            <span>@amanclothhouse</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
            Follow The Lookbook
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="aspect-square bg-stone-100 rounded-md overflow-hidden group relative">
            <img 
              src={menCollectionImage} 
              alt="Lookbook 1" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #AmanMenswear
            </div>
          </div>
          <div className="aspect-square bg-stone-100 rounded-md overflow-hidden group relative">
            <img 
              src={womenCollectionImage} 
              alt="Lookbook 2" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #AmanCouture
            </div>
          </div>
          <div className="aspect-square bg-stone-100 rounded-md overflow-hidden group relative">
            <img 
              src={unstitchedImage} 
              alt="Lookbook 3" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #PureFabrics
            </div>
          </div>
          <div className="aspect-square bg-stone-100 rounded-md overflow-hidden group relative">
            <img 
              src={heroImage} 
              alt="Lookbook 4" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #FestiveAffair
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">
            Join The Privilege Circle
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif">
            Receive 10% Off Your First Order
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg mx-auto">
            Subscribe for private trunk show announcements, exclusive Eid drops, and master tailoring consultations.
          </p>

          {newsletterSubmitted ? (
            <div className="p-4 bg-stone-800/80 border border-amber-500/40 rounded-lg max-w-md mx-auto text-xs text-amber-200">
              Thank you for subscribing! Use promo code <strong className="font-mono text-white text-sm">AMAN10</strong> at checkout to claim your 10% privilege discount.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-xs bg-stone-800 border border-stone-700 rounded text-white focus:outline-none focus:border-amber-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-stone-500 pt-2">
            We value your discretion. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};
