import React, { useState } from 'react';
import { User, Package, Search, Calendar, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import * as api from '../api';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';

export const CustomerAccountPage: React.FC = () => {
  const { setCurrentPage, setLastPlacedOrder } = useStore();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  const handleFetchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const isEmail = phoneOrEmail.includes('@');
      const payload = isEmail 
        ? { email: phoneOrEmail.trim() }
        : { phone: phoneOrEmail.trim() };
      
      const res = await api.fetchCustomerOrders(payload);
      setOrders(res);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setLastPlacedOrder(order);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 text-amber-400 flex items-center justify-center mb-2">
          <User className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif text-stone-900">Customer Account & Orders</h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Enter your mobile number or email address to review your past orders and tracking statuses.
        </p>
      </div>

      {/* Search box */}
      <div className="bg-white border border-stone-200/80 rounded-lg p-6 shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleFetchOrders} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Mobile Number or Email
            </label>
            <input
              type="text"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="e.g. 03001234567 or yourname@gmail.com"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Finding Your Orders...' : 'Find My Orders'}</span>
          </button>
        </form>
      </div>

      {/* Orders List */}
      {searched && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Orders Found ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-stone-500">
              <Package className="w-8 h-8 mx-auto text-stone-400 mb-2" />
              <p className="text-sm font-medium text-stone-800">No orders found for this contact.</p>
              <p className="text-xs text-stone-500 mt-1">Make sure you are entering the same phone number used at checkout.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white border border-stone-200/80 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-400 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-stone-900">{order.orderNumber}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{order.items.length} garment{order.items.length > 1 ? 's' : ''}</span>
                    </div>

                    <p className="text-xs font-mono font-semibold text-stone-800 pt-1">
                      Rs. {order.totalAmount.toLocaleString()} ({order.paymentMethod})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Invoice</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
