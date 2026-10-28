import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Package, 
  Phone, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { resolveProductImage, heroImage } from '../assets/images';

export const OrderConfirmationPage: React.FC = () => {
  const { lastPlacedOrder, settings, setCurrentPage } = useStore();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-serif text-stone-900 mb-2">No Active Order Confirmation</h2>
        <p className="text-xs text-stone-500 mb-6">
          If you recently placed an order, you can track it anytime with your mobile number.
        </p>
        <button
          onClick={() => setCurrentPage('track-order')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider rounded"
        >
          Track An Existing Order
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;
  const whatsappNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '923008472910';

  const handleWhatsAppUpdate = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Aman Cloth House,\n` +
      `I have placed Order #${order.orderNumber}.\n` +
      `Customer Name: ${order.customer.name}\n` +
      `Total Amount: Rs. ${order.totalAmount.toLocaleString()} (${order.paymentMethod})\n` +
      `City: ${order.customer.city}\n\n` +
      `Please provide dispatch confirmation and courier tracking.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 print:py-0 print:px-0">
      
      {/* Success banner */}
      <div className="bg-stone-900 text-white rounded-lg p-8 sm:p-10 shadow-lg text-center space-y-3 print:bg-white print:text-black print:border print:border-black">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
          Order Successfully Booked & Recorded
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold">
          Thank You, {order.customer.name}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg mx-auto print:text-stone-700">
          Your order has been registered in our Lahore fulfillment desk. Our dispatch team is packaging your garments with care.
        </p>
        <div className="pt-2">
          <div className="inline-block bg-stone-800 border border-stone-700 rounded-md px-5 py-2.5 print:bg-stone-100 print:border-stone-300">
            <span className="text-xs text-stone-400 block print:text-stone-600">Your Official Order Number:</span>
            <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-amber-300 print:text-stone-950">
              {order.orderNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Brand Header on Invoice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h2 className="font-display text-xl tracking-widest font-bold text-stone-900 uppercase">
              Aman Cloth House
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Liberty Market, Gulberg III, Lahore, Pakistan · WhatsApp: {settings?.whatsappNumber}
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-stone-600">
            <p><strong>Booking Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Payment Mode:</strong> {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</p>
            <p><strong>Status:</strong> <span className="text-emerald-700 font-semibold">{order.orderStatus}</span></p>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-stone-200 text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-900 mb-2">Shipping Details</h4>
            <div className="text-stone-600 space-y-1">
              <p className="font-semibold text-stone-800">{order.customer.name}</p>
              <p>{order.customer.phone}</p>
              {order.customer.email && <p>{order.customer.email}</p>}
              <p className="text-stone-700 font-medium mt-1">
                {order.customer.address}, {order.customer.city}
                {order.customer.postalCode ? ` - ${order.customer.postalCode}` : ''}
              </p>
              {order.customer.notes && (
                <p className="text-stone-500 italic mt-1">Note: "{order.customer.notes}"</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-900 mb-2">Dispatch Courier</h4>
            <div className="text-stone-600 space-y-1">
              <p><strong>Courier:</strong> {order.courierName || 'TCS Express Pakistan'}</p>
              <p><strong>Delivery Time:</strong> 2 to 4 business days</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p className="text-[11px] text-stone-500 pt-1">
                A verification SMS or WhatsApp confirmation is dispatched prior to delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-900 mb-3">Garments Ordered</h4>
          <div className="border border-stone-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-3">
                        <img 
                          src={resolveProductImage(item.image)} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== heroImage) {
                              e.currentTarget.src = heroImage;
                            }
                          }}
                          className="w-10 h-12 object-cover object-top rounded border border-stone-200" 
                        />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-stone-500">
                      Color: {item.color} · Size: {item.size}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">Rs. {item.price.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-stone-900">Rs. {order.subtotal.toLocaleString()}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span className="font-mono">-Rs. {order.discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Charge:</span>
              <span className="font-mono text-stone-900">
                {order.shippingCharge === 0 ? 'FREE' : `Rs. ${order.shippingCharge}`}
              </span>
            </div>

            <div className="flex justify-between text-sm font-semibold text-stone-950 pt-2 border-t border-stone-200">
              <span>Total Payable:</span>
              <span className="font-mono text-base text-stone-950">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-white border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={handleWhatsAppUpdate}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('track-order')}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Track Parcel
          </button>
          
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

    </div>
  );
};
