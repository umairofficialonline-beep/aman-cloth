import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  CheckCheck, 
  AlertCircle,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import * as api from '../api';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';

export const TrackOrderPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      showToast('Please enter both Order Number and Phone Number', 'error');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const order = await api.trackOrder(orderNumber.trim(), phone.trim());
      setTrackedOrder(order);
    } catch (err: any) {
      setTrackedOrder(null);
      setErrorMsg(err.message || 'No matching order found for this order number and mobile combination.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepName: string, currentStatus: string) => {
    const orderHierarchy = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = orderHierarchy.indexOf(currentStatus);
    const stepIdx = orderHierarchy.indexOf(stepName);

    if (currentStatus === 'Cancelled') {
      return 'cancelled';
    }
    if (stepIdx <= currentIdx) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 text-amber-400 flex items-center justify-center mb-2">
          <Package className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif text-stone-900">Track Your Shipment</h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Enter your official order number and contact number used during checkout.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white border border-stone-200/80 rounded-lg p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. ACH-2026-89102"
                className="w-full px-3.5 py-2.5 text-xs uppercase font-mono bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Locating Parcel...' : 'Track Parcel'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracked Order Result */}
      {trackedOrder && (
        <div className="bg-white border border-stone-200/80 rounded-lg p-6 sm:p-8 shadow-xs space-y-8 animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Order Status</span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-xl font-bold font-mono text-stone-900">
                  {trackedOrder.orderNumber}
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded font-semibold uppercase ${
                  trackedOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : trackedOrder.orderStatus === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {trackedOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-600 sm:text-right space-y-0.5">
              <p><strong>Courier:</strong> {trackedOrder.courierName || 'TCS Pakistan'}</p>
              {trackedOrder.trackingNumber && (
                <p><strong>Tracking #:</strong> <span className="font-mono text-stone-900">{trackedOrder.trackingNumber}</span></p>
              )}
            </div>
          </div>

          {/* Stepper Progress */}
          {trackedOrder.orderStatus !== 'Cancelled' ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-6">
                Shipment Milestones
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    getStepStatus('Pending', trackedOrder.orderStatus) === 'completed'
                      ? 'bg-stone-900 text-amber-300'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900">Order Booked</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Fulfillment recorded</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    getStepStatus('Processing', trackedOrder.orderStatus) === 'completed'
                      ? 'bg-stone-900 text-amber-300'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900">Tailoring & Pack</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Quality check passed</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    getStepStatus('Shipped', trackedOrder.orderStatus) === 'completed'
                      ? 'bg-stone-900 text-amber-300'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900">Handed to Courier</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">In transit to destination</p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    getStepStatus('Delivered', trackedOrder.orderStatus) === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900">Delivered</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Handed to customer</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
              <strong>Order Cancelled:</strong> {trackedOrder.cancellationReason || 'Customer requested or stock unavailable.'}
            </div>
          )}

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-stone-200 text-xs">
            <div>
              <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-2">Delivery Address</h4>
              <p className="text-stone-700 font-medium">{trackedOrder.customer.name}</p>
              <p className="text-stone-600">{trackedOrder.customer.address}, {trackedOrder.customer.city}</p>
              <p className="text-stone-500 mt-1">Phone: {trackedOrder.customer.phone}</p>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-2">Payment Details</h4>
              <p className="text-stone-600">Method: <strong>{trackedOrder.paymentMethod}</strong></p>
              <p className="text-stone-600">Total: <strong className="font-mono text-stone-900">Rs. {trackedOrder.totalAmount.toLocaleString()}</strong></p>
              <p className="text-stone-500 mt-1">Status: {trackedOrder.paymentStatus}</p>
            </div>
          </div>

          {/* Items */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-xs mb-3">Items in Parcel</h4>
            <div className="space-y-2">
              {trackedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    {it.image && (
                      <img src={it.image} alt={it.name} referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded border" />
                    )}
                    <span>{it.name} ({it.size} / {it.color}) × {it.quantity}</span>
                  </div>
                  <span className="font-mono font-medium">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Assistance callout */}
      <div className="p-4 bg-stone-100 rounded-lg text-center text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Need urgent courier rerouting or delivery schedule change?</span>
        <a
          href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>WhatsApp Courier Desk</span>
        </a>
      </div>

    </div>
  );
};
