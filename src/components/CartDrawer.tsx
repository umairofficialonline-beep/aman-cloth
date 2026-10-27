import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    shippingFee, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    discountAmount, 
    finalTotal, 
    settings,
    setCurrentPage,
    navigateToProduct
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const freeThreshold = settings?.freeShippingThreshold ?? 4999;
  const remainingForFreeShipping = Math.max(0, freeThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const success = await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
    if (success) setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="text-base font-serif tracking-wide text-stone-900">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-amber-50/70 border-b border-amber-200/60 p-3.5">
            <div className="flex items-center gap-2 text-xs text-amber-900 mb-1.5 font-medium">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-stone-900 font-mono">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more for <strong>FREE Express Shipping</strong>!
                </span>
              ) : (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You've unlocked FREE Express Shipping across Pakistan!
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${remainingForFreeShipping === 0 ? 'bg-emerald-600' : 'bg-amber-600'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-serif text-stone-800 mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mb-6 max-w-xs">
                  Discover our timeless Shalwar Kameez, luxury Kurtas, and unstitched collections.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div 
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigateToProduct(item.productId);
                    }}
                    className="w-20 h-24 bg-stone-100 rounded overflow-hidden shrink-0 cursor-pointer border border-stone-200/60"
                  >
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          navigateToProduct(item.productId);
                        }}
                        className="text-xs font-semibold text-stone-900 hover:text-amber-800 cursor-pointer line-clamp-1"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Color: {item.selectedColor} · Size: {item.selectedSize}
                      </p>
                      <p className="text-xs font-mono font-medium text-stone-900 mt-1">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Qty & Delete */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-300 rounded bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals and checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              
              {/* Coupon Bar */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-Rs. {appliedCoupon.calculatedDiscount.toLocaleString()})</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs text-emerald-700 hover:text-emerald-950 font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Discount code (e.g. AMAN10)"
                      className="w-full px-3 py-2 text-xs uppercase bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-stone-800 disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Price calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900 font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-stone-900">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-medium">FREE</span> : `Rs. ${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-stone-950">Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-stone-950 text-white rounded text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <p className="text-[11px] text-center text-stone-500">
                Cash on Delivery (COD) & Bank Transfer available.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
