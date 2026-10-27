import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Ruler, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Star, 
  Plus, 
  Minus, 
  Phone, 
  ChevronRight,
  Share2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SizeChartModal } from '../components/SizeChartModal';
import { ProductCard } from '../components/ProductCard';
import * as api from '../api';
import type { Product, ProductReview } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    settings,
    setCurrentPage,
    showToast 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'care' | 'shipping'>('details');

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || '');
      setSelectedColor(product.colors?.[0] || 'Standard');
      setSelectedSize(product.sizes?.[0] || 'M');
      setQuantity(1);
      setReviewsList(product.reviews || []);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Loading garment details...</p>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppOrder = () => {
    const phone = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '923008472910';
    const message = encodeURIComponent(
      `Hello Aman Cloth House! I would like to order:\n` +
      `Product: ${product.name}\n` +
      `SKU: ${product.sku}\n` +
      `Size: ${selectedSize}\n` +
      `Color: ${selectedColor}\n` +
      `Quantity: ${quantity}\n` +
      `Total: Rs. ${(displayPrice * quantity).toLocaleString()}\n\n` +
      `Please confirm stock and dispatch details.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this luxury design from Aman Cloth House: ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and review remarks', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.submitProductReview(product.id, {
        userName: reviewName.trim(),
        userCity: reviewCity.trim() || 'Pakistan',
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setReviewsList(prev => [res.review, ...prev]);
      setReviewName('');
      setReviewCity('');
      setReviewComment('');
      showToast('Thank you! Your verified review has been published.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
        <button onClick={() => setCurrentPage('home')} className="hover:text-stone-900">Home</button>
        <span aria-hidden="true">/</span>
        <button onClick={() => setCurrentPage('shop')} className="hover:text-stone-900">Catalog</button>
        <span aria-hidden="true">/</span>
        <span className="text-stone-900 font-semibold line-clamp-1">{product.name}</span>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Images Column (Left, 7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 sm:w-20">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded border overflow-hidden shrink-0 transition-all ${
                    activeImage === img ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`View ${idx + 1}`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Image */}
          <div className="relative flex-1 aspect-3/4 bg-stone-100 rounded-lg overflow-hidden border border-stone-200/80 group">
            <img
              src={activeImage || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {hasDiscount && (
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-amber-800 px-2.5 py-1 rounded shadow-xs">
                  Save {discountPercent}%
                </span>
              )}
              {product.newArrival && (
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 bg-white/95 px-2.5 py-1 rounded border border-stone-200 shadow-xs">
                  New Arrival
                </span>
              )}
            </div>

            {/* Share action */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-stone-700 hover:text-stone-950 shadow-md transition-colors"
              title="Share garment"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details & Actions Column (Right, 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header */}
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest mb-1.5">
              <span>{product.brand} · {product.category}</span>
              <span className="font-mono text-stone-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 mt-2.5 text-xs text-stone-600">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-stone-300'}`} 
                  />
                ))}
              </div>
              <span className="font-semibold text-stone-900">{product.rating}</span>
              <span aria-hidden="true">·</span>
              <span className="underline cursor-pointer" onClick={() => setActiveTab('details')}>
                {reviewsList.length} verified reviews
              </span>
            </div>

            {/* Pricing */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-stone-950">
                Rs. {displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="font-mono text-base text-stone-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Inclusive of all taxes. Free shipping on orders above Rs. {settings?.freeShippingThreshold?.toLocaleString() || '4,999'}.
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-stone-900 uppercase tracking-wider">
                  Color: <span className="font-normal text-stone-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                      selectedColor === color
                        ? 'border-stone-950 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector with Size Guide button */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-900 uppercase tracking-wider">
                Size: <span className="font-normal text-stone-600">{selectedSize}</span>
              </span>
              <button
                onClick={() => setIsSizeModalOpen(true)}
                className="text-amber-800 hover:text-stone-950 flex items-center gap-1 font-medium underline cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-10 px-3 py-2 text-xs font-semibold rounded border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'border-stone-950 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Stock Status */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-stone-300 rounded bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-stone-100 text-stone-600 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-mono font-semibold text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                className="p-2 hover:bg-stone-100 text-stone-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs">
              {product.stock > 5 ? (
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
                </span>
              ) : product.stock > 0 ? (
                <span className="text-amber-700 font-medium">
                  Only {product.stock} pieces left in stock!
                </span>
              ) : (
                <span className="text-rose-600 font-medium">
                  Temporarily Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded border transition-colors flex items-center justify-center cursor-pointer ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-stone-500'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full py-3.5 bg-amber-300 hover:bg-amber-200 text-stone-950 text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              Buy Now with Cash on Delivery
            </button>

            {/* Direct WhatsApp Ordering */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Order via WhatsApp (+92 300 8472910)</span>
            </button>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="border-t border-stone-200 pt-5 space-y-3 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-stone-800 shrink-0" />
              <span>Delivered nationwide in <strong>2-4 business days</strong> via TCS / Leopards</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0" />
              <span>100% Guaranteed original Pakistani fabric & master tailoring</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-stone-800 shrink-0" />
              <span>Hassle-free <strong>7-Day size exchange</strong> policy</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section: Description, Fabric, Care, Reviews */}
      <div className="border-t border-stone-200 pt-10">
        <div className="flex border-b border-stone-200 gap-8 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details' ? 'border-stone-900 text-stone-950 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Design & Details
          </button>
          <button
            onClick={() => setActiveTab('fabric')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'fabric' ? 'border-stone-900 text-stone-950 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Fabric & Material
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'care' ? 'border-stone-900 text-stone-950 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Care Instructions
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shipping' ? 'border-stone-900 text-stone-950 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Verified Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-6 max-w-4xl text-xs sm:text-sm text-stone-700 leading-relaxed">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              {product.packageContains && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                  <h4 className="font-semibold text-stone-900 mb-1">Package Inclusions:</h4>
                  <p>{product.packageContains}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fabric' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-stone-900">Textile Composition:</h4>
              <p>{product.fabricDetails || 'Premium grade Pakistani long-staple cotton and silk blends carefully woven for all-day comfort, rich sheen, and lasting durability.'}</p>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-stone-900">Garment Maintenance:</h4>
              <p>{product.careInstructions || 'Dry clean recommended for hand-embroidered items. Mild machine wash inside-out for casual cotton kurtas. Use medium steam iron.'}</p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div className="space-y-4">
                <h4 className="text-base font-serif font-semibold text-stone-900">
                  Customer Ratings & Experiences
                </h4>

                {reviewsList.length === 0 ? (
                  <p className="text-stone-500 italic">No reviews yet. Be the first to share your experience with this design!</p>
                ) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white border border-stone-200 rounded-lg shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900">{rev.userName}</span>
                          <span className="text-stone-400">({rev.userCity})</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <p className="text-stone-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Write a Review Form */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-4">
                <h4 className="text-sm font-serif font-semibold text-stone-900">
                  Write a Customer Review
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Usman Ali"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={reviewCity}
                        onChange={(e) => setReviewCity(e.target.value)}
                        placeholder="e.g. Lahore / Karachi / Islamabad"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                        </button>
                      ))}
                      <span className="text-xs text-stone-600 font-medium ml-2">{reviewRating} out of 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Your Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="Comment on the fabric quality, stitching, and fit..."
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-800 disabled:opacity-50 transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Garments Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-stone-200 pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                You May Also Like
              </span>
              <h2 className="text-2xl font-serif text-stone-900 mt-1">
                Complementary Pieces
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        category={product.category}
      />

    </div>
  );
};
