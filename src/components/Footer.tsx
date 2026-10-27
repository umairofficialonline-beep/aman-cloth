import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setCurrentPage, setSelectedCategory, adminToken } = useStore();

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNav = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      {/* Brand Values Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Nationwide Express</h4>
              <p className="text-xs text-stone-400 mt-1">Free delivery above Rs. 4,999 across all Pakistan</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">100% Pure Fabric</h4>
              <p className="text-xs text-stone-400 mt-1">Guaranteed authentic cotton, silk & organza</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">Pay when your parcel arrives safely at your doorstep</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">7-Day Easy Exchange</h4>
              <p className="text-xs text-stone-400 mt-1">Hassle-free sizing exchanges nationwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display text-2xl tracking-[0.2em] font-semibold text-white uppercase">
              Aman Cloth House
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Pakistan's hallmark of couture perfection. Crafting bespoke luxury kurtas, traditional shalwar kameez, intricate zardozi formals, and premium unstitched textiles since 1998.
            </p>
            
            <div className="pt-2 space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings?.address || 'Shop # 14-16, Liberty Market, Gulberg III'}, {settings?.city || 'Lahore, Pakistan'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                  {settings?.phone || '+92 300 8472910'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors">
                  {settings?.email || 'support@amanclothhouse.pk'}
                </a>
              </div>
            </div>
          </div>

          {/* Collections Col */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => handleCategoryNav('Men\'s Clothing')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Men's Kurta Shalwar
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('Women\'s Clothing')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Women's Luxury Pret
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('Unstitched Fabrics')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Unstitched Jacquard & Silk
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('Shalwar Kameez')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Festive Wedding Edit
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('Kids\' Clothing')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Kids' Traditional Wear
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('Sale Collection')} className="hover:text-amber-300 text-amber-400 font-medium transition-colors cursor-pointer">
                  Sale & Clearance
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-widest mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => handlePageNav('track-order')} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <span>Track Parcel</span>
                  <ArrowRight className="w-3 h-3 text-stone-600" />
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('customer-account')} className="hover:text-white transition-colors cursor-pointer">
                  My Orders & Account
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('shipping-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('returns-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('faqs')} className="hover:text-white transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Master Tailor
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-widest mb-4">
              Security & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => handlePageNav('privacy-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('terms-conditions')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('about')} className="hover:text-white transition-colors cursor-pointer">
                  Our Heritage & Craft
                </button>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${settings?.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 rounded text-[11px] font-medium hover:bg-emerald-900 transition-colors"
                >
                  <span>Order on WhatsApp</span>
                </a>
              </li>
              <li className="pt-3">
                <button
                  onClick={() => handlePageNav(adminToken ? 'admin-dashboard' : 'admin-login')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-400/30 hover:border-amber-400 rounded text-xs font-medium tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <div>
          © {new Date().getFullYear()} Aman Cloth House. All rights reserved. Registered Clothing Brand in Pakistan.
        </div>
        <div className="flex flex-wrap items-center gap-4 text-stone-400 text-xs">
          <span>TCS · Leopards · Trax</span>
          <span>·</span>
          <span>COD Nationwide</span>
          <span>·</span>
          <button
            onClick={() => handlePageNav(adminToken ? 'admin-dashboard' : 'admin-login')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-700 hover:border-amber-400/60 text-stone-300 hover:text-amber-300 transition-all font-semibold tracking-wider text-[11px] cursor-pointer"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
