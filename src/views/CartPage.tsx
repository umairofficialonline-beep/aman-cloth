import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const { 
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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-8">
          Explore our signature collections of men’s embroidered kurtas, women’s festive pret, and premium unstitched fabrics.
        </p>
        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-stone-800 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif text-stone-900">Your Shopping Bag</h1>
        <p className="text-xs text-stone-500 mt-1">Review your selected garments before secure checkout</p>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-4">
        <div className="flex items-center justify-between text-xs font-medium text-amber-950 mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-800" />
            {remainingForFreeShipping > 0 ? (
              <span>Add <strong className="font-mono">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more to unlock <strong>FREE Express Shipping</strong>!</span>
            ) : (
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Congratulations! You qualified for Free Express Shipping anywhere in Pakistan.
              </span>
            )}
          </div>
          <span className="font-mono text-stone-500 text-[11px]">{progressPercent}%</span>
        </div>
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${remainingForFreeShipping === 0 ? 'bg-emerald-600' : 'bg-amber-600'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-700 hidden sm:grid sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">Garment</div>
            <div className="sm:col-span-2 text-center">Price</div>
            <div className="sm:col-span-2 text-center">Quantity</div>
            <div className="sm:col-span-2 text-right">Subtotal</div>
          </div>

          <div className="divide-y divide-stone-100 p-4 sm:p-0">
            {cart.map((item) => (
              <div 
                key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                className="py-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
              >
                {/* Product info */}
                <div className="w-full sm:col-span-6 flex gap-4">
                  <div 
                    onClick={() => navigateToProduct(item.productId)}
                    className="w-20 h-24 bg-stone-100 rounded overflow-hidden shrink-0 cursor-pointer border border-stone-200"
                  >
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => navigateToProduct(item.productId)}
                        className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-amber-800 cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                        <span>Color: <strong>{item.selectedColor}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Size: <strong>{item.selectedSize}</strong></span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                      className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1 mt-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="w-full sm:col-span-2 sm:text-center text-xs font-mono font-medium text-stone-800 flex justify-between sm:block">
                  <span className="sm:hidden text-stone-500">Unit Price:</span>
                  <span>Rs. {item.price.toLocaleString()}</span>
                </div>

                {/* Qty controls */}
                <div className="w-full sm:col-span-2 flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden text-xs text-stone-500">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity - 1)}
                      className="p-1.5 hover:bg-stone-100 text-stone-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-semibold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity + 1)}
                      className="p-1.5 hover:bg-stone-100 text-stone-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="w-full sm:col-span-2 sm:text-right text-xs font-mono font-semibold text-stone-950 flex justify-between sm:block border-t sm:border-0 pt-2 sm:pt-0">
                  <span className="sm:hidden text-stone-500">Total:</span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setCurrentPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-stone-700 hover:text-stone-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200/80 rounded-lg p-6 shadow-xs space-y-5">
            <h3 className="text-base font-serif font-semibold text-stone-900 pb-3 border-b border-stone-200">
              Order Summary
            </h3>

            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-Rs. {appliedCoupon.calculatedDiscount.toLocaleString()})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-emerald-700 underline font-semibold cursor-pointer">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. AMAN10)"
                    className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-mono">-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono text-stone-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `Rs. ${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-stone-950 pt-3 border-t border-stone-200">
                <span>Final Total</span>
                <span className="font-mono text-lg text-stone-950">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setCurrentPage('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Safe & Secure Pakistani Checkout</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
