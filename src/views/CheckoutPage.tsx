import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building2, 
  Phone, 
  ArrowRight, 
  Lock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import * as api from '../api';

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Jhelum',
  'Gujrat',
  'Kasur',
  'Rahim Yar Khan',
  'Other / Custom City'
];

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    shippingFee, 
    appliedCoupon, 
    discountAmount, 
    finalTotal, 
    settings,
    clearCart,
    setLastPlacedOrder,
    setCurrentPage,
    showToast 
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BankTransfer' | 'WhatsAppOrder'>('COD');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-serif text-stone-900 mb-2">No garments in bag to checkout</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="mt-4 px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Full name is required';
    
    // Pakistani phone validation (11 digits, starts with 03)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Valid Pakistani mobile number required (e.g. 03001234567)';
    }

    const effectiveCity = city === 'Other / Custom City' ? customCity : city;
    if (!effectiveCity.trim()) errs.city = 'Please specify your city';

    if (!address.trim() || address.trim().length < 8) {
      errs.address = 'Complete delivery street address & house number required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the highlighted form errors', 'error');
      return;
    }

    try {
      setLoading(true);
      const effectiveCity = city === 'Other / Custom City' ? customCity.trim() : city;

      const orderPayload = {
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          city: effectiveCity,
          address: address.trim(),
          postalCode: postalCode.trim() || undefined,
          notes: notes.trim() || undefined
        },
        items: cart.map(item => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images[0],
          color: item.selectedColor,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod,
        couponCode: appliedCoupon?.code,
        notes: notes.trim()
      };

      const placedOrder = await api.submitOrder(orderPayload);

      // Verify that backend actually saved order before showing confirmation!
      if (!placedOrder || !placedOrder.orderNumber) {
        throw new Error('Server did not return a valid order confirmation');
      }

      setLastPlacedOrder(placedOrder);
      clearCart();
      showToast(`Order ${placedOrder.orderNumber} successfully booked!`, 'success');
      setCurrentPage('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.message || 'Failed to place order. Please check connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider mb-1">
          <span>Bag</span>
          <span aria-hidden="true">/</span>
          <span className="text-stone-900 font-semibold">Delivery & Payment</span>
        </div>
        <h1 className="text-3xl font-serif text-stone-900">Checkout & Dispatch</h1>
        <p className="text-xs text-stone-500 mt-1">Direct nationwide delivery via TCS & Leopards Courier</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form: Customer Details & Shipping (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Contact */}
          <div className="bg-white border border-stone-200/80 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                1. Customer Information
              </h2>
              <span className="text-xs text-stone-400">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className={`w-full px-3.5 py-2.5 text-xs bg-stone-50 border rounded focus:outline-none focus:bg-white transition-colors ${
                    errors.name ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                  }`}
                  required
                />
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className={`w-full px-3.5 py-2.5 text-xs bg-stone-50 border rounded focus:outline-none focus:bg-white transition-colors ${
                    errors.phone ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                  }`}
                  required
                />
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                <p className="text-[10px] text-stone-400 mt-0.5">Courier rider will call on this number</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For order receipt & tracking updates"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white border border-stone-200/80 rounded-lg p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                2. Delivery Destination (Pakistan)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white cursor-pointer"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {city === 'Other / Custom City' ? (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Enter Your City / Tehsil *
                  </label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="e.g. Chakwal, Muzaffarabad, Swat"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 54000"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Complete Street Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House / Flat #, Street #, Sector / Phase / Mohallah / Landmark..."
                className={`w-full px-3.5 py-2.5 text-xs bg-stone-50 border rounded focus:outline-none focus:bg-white transition-colors ${
                  errors.address ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                }`}
                required
              />
              {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please deliver after 2 PM or call neighbor if unavailable"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-stone-200/80 rounded-lg p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                3. Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* COD Option */}
              <label 
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'COD' 
                    ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900' 
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-stone-900 focus:ring-stone-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Pay securely in cash when your parcel is delivered to your doorstep anywhere in Pakistan.
                  </p>
                </div>
              </label>

              {/* Bank Transfer Option */}
              {settings?.enableBankTransfer && (
                <label 
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'BankTransfer' 
                      ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900' 
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'BankTransfer'}
                    onChange={() => setPaymentMethod('BankTransfer')}
                    className="mt-1 text-stone-900 focus:ring-stone-800"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Direct Bank Transfer / IBFT
                    </span>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      Transfer directly to our Habib Bank Limited (HBL) official business account.
                    </p>

                    {paymentMethod === 'BankTransfer' && settings?.bankDetails && (
                      <div className="mt-3 p-3 bg-white border border-stone-300 rounded text-xs space-y-1 font-mono text-stone-800">
                        <p><strong>Bank:</strong> {settings.bankDetails.bankName}</p>
                        <p><strong>Account Title:</strong> {settings.bankDetails.accountTitle}</p>
                        <p><strong>Account #:</strong> {settings.bankDetails.accountNumber}</p>
                        <p><strong>IBAN:</strong> {settings.bankDetails.iban}</p>
                        <p className="text-[10px] text-amber-800 font-sans mt-2">
                          * Please send screenshot of payment on WhatsApp ({settings.whatsappNumber}) along with your Order Number after booking.
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              )}

              {/* WhatsApp Option */}
              <label 
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'WhatsAppOrder' 
                    ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900' 
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'WhatsAppOrder'}
                  onChange={() => setPaymentMethod('WhatsAppOrder')}
                  className="mt-1 text-stone-900 focus:ring-stone-800"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    WhatsApp Representative Order
                  </span>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Confirm your measurements, tailoring choices, and delivery date directly with our Lahore customer desk.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary: Items & Totals (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200/80 rounded-lg p-6 shadow-xs space-y-5 sticky top-28">
            <h3 className="text-base font-serif font-semibold text-stone-900 pb-3 border-b border-stone-200">
              Your Garments ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>

            {/* Small items list */}
            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="py-3 flex gap-3 items-center">
                  <div className="w-14 h-16 bg-stone-100 rounded overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-stone-900 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-stone-500">
                      Size: {item.selectedSize} · Color: {item.selectedColor}
                    </p>
                    <p className="text-xs font-mono font-medium text-stone-800 mt-0.5">
                      {item.quantity} × Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-stone-950 shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
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
                <span>Nationwide Shipping</span>
                <span className="font-mono text-stone-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `Rs. ${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-stone-950 pt-3 border-t border-stone-200">
                <span>Grand Total (PKR)</span>
                <span className="font-mono text-xl text-stone-950">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Generating Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Confirm Order · Rs. {finalTotal.toLocaleString()}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-stone-500 text-center space-y-1">
              <p>By placing this order, you agree to our 7-day exchange and delivery policies.</p>
              <p className="text-stone-400">Parcel opened upon cash delivery or rider verification.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
