import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Phone, 
  Package, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    settings, 
    cartCount, 
    wishlist, 
    currentPage, 
    setCurrentPage, 
    setSelectedCategory, 
    setIsCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    adminToken
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCategory('All');
      setCurrentPage('shop');
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop All', page: 'shop' as const, category: 'All' },
    { label: 'Men\'s Wear', page: 'shop' as const, category: 'Men\'s Clothing' },
    { label: 'Women\'s Pret', page: 'shop' as const, category: 'Women\'s Clothing' },
    { label: 'Unstitched', page: 'shop' as const, category: 'Unstitched Fabrics' },
    { label: 'Festive', page: 'shop' as const, category: 'Shalwar Kameez' },
    { label: 'Sale', page: 'shop' as const, category: 'Sale Collection' },
    { label: 'About', page: 'about' as const },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.category !== undefined) {
      setSelectedCategory(link.category);
    }
    setCurrentPage(link.page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        {/* Top Announcement Bar */}
        {settings?.announcementActive && (
          <div className="bg-stone-900 text-stone-200 text-xs py-2 px-3 sm:px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="w-full text-center tracking-wide font-medium flex items-center justify-center gap-1.5 sm:gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">{settings.announcementBarText}</span>
              </div>
              <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-400 shrink-0">
                <button 
                  onClick={() => setCurrentPage('track-order')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Package className="w-3 h-3" /> Track Order
                </button>
                <span className="text-stone-700">|</span>
                <a 
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> WhatsApp Help
                </a>
                <span className="text-stone-700">|</span>
                <button 
                  onClick={() => setCurrentPage(adminToken ? 'admin-dashboard' : 'admin-login')}
                  className="text-amber-300 hover:text-amber-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-400" /> Admin Panel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left Zone on Mobile: Hamburger menu (3 lines) only */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-stone-800 hover:text-stone-950 active:scale-95 transition-all rounded-md hover:bg-stone-100 cursor-pointer"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>

            {/* Brand Logo: Clean, centered on mobile with full breathing space */}
            <div className="flex-1 lg:flex-none text-center lg:text-left px-2 min-w-0">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex flex-col items-center lg:items-start group focus:outline-none cursor-pointer max-w-full"
              >
                <span className="font-display text-base sm:text-2xl lg:text-3xl tracking-[0.08em] sm:tracking-[0.18em] font-bold text-stone-900 group-hover:text-amber-900 transition-colors uppercase whitespace-nowrap">
                  Aman Cloth House
                </span>
                <span className="block text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-stone-500 font-sans mt-0.5 whitespace-nowrap">
                  Lahore · Pakistan
                </span>
              </button>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-xs uppercase tracking-[0.16em] font-medium py-1 transition-all relative cursor-pointer ${
                    currentPage === link.page
                      ? 'text-stone-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {link.label}
                  {link.label === 'Sale' && (
                    <span className="absolute -top-2 -right-3 text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1 rounded">
                      HOT
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2.5 shrink-0">
              {/* Desktop Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden lg:flex items-center gap-1.5 p-2 text-stone-700 hover:text-stone-950 rounded-full transition-colors cursor-pointer"
                title="Search collection"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Account / Orders */}
              <button
                type="button"
                onClick={() => setCurrentPage('customer-account')}
                className="hidden sm:flex p-2 text-stone-700 hover:text-stone-950 rounded-full transition-colors cursor-pointer relative"
                title="My Account & Orders"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentPage('shop');
                }}
                className="p-2 text-stone-700 hover:text-stone-950 rounded-full transition-colors relative cursor-pointer"
                title="Saved items"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-800 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag / Cart Icon */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-2 text-stone-900 hover:text-amber-900 rounded-full transition-colors relative flex items-center cursor-pointer"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 w-4 h-4 bg-stone-900 text-amber-300 text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Dedicated Admin Portal Button */}
              <button
                type="button"
                onClick={() => setCurrentPage(adminToken ? 'admin-dashboard' : 'admin-login')}
                className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-1.5 bg-stone-900 text-amber-300 hover:bg-stone-800 border border-amber-500/40 hover:border-amber-400 rounded-md transition-all shadow-xs cursor-pointer active:scale-95"
                title="Aman Cloth House Admin Panel"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">{adminToken ? 'Dashboard' : 'Admin'}</span>
              </button>
            </div>
          </div>

          {/* Dedicated Mobile Search Bar (Cleanly positioned under the top row, never overlapping brand name or wishlist) */}
          <div className="lg:hidden pb-3 pt-1 border-t border-stone-100">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kurta, Shalwar Kameez, Organza Suit..."
                className="w-full pl-9 pr-9 py-2 text-xs bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-stone-200 focus:border-stone-800 rounded-full focus:outline-none transition-colors text-stone-900 placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Expandable Desktop Search Bar */}
          {isSearchOpen && (
            <div className="hidden lg:block py-3 border-t border-stone-200 animate-fadeIn">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Kurta, Shalwar Kameez, Organza Suit, Raw Silk..."
                  className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:border-stone-800 focus:bg-white transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 rounded hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu (Mounted at top level with z-[100]) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu Panel */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto animate-slideRight">
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-display text-base tracking-widest font-bold text-stone-900 uppercase">
                  Aman Cloth House
                </span>
                <span className="block text-[8px] tracking-[0.25em] uppercase text-stone-500 font-sans mt-0.5">
                  Lahore · Pakistan
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:border-stone-800"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
            </form>

            {/* Nav Links */}
            <nav className="mt-5 flex-1 divide-y divide-stone-100">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="w-full flex items-center justify-between py-3 text-xs uppercase tracking-wider font-semibold text-stone-800 hover:text-amber-900 transition-colors text-left cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}

              {/* Utility Links in Mobile Menu */}
              <div className="pt-4 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('track-order');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4 text-amber-700" />
                  <span>Track Your Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('customer-account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-stone-700" />
                  <span>My Account & Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(adminToken ? 'admin-dashboard' : 'admin-login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-stone-900 text-amber-300 border border-amber-500/40 shadow-xs text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all mt-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Store Admin Panel</span>
                  </div>
                  <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-mono">
                    {adminToken ? 'Dashboard' : 'Login'}
                  </span>
                </button>
              </div>
            </nav>

            {/* Mobile Drawer Footer */}
            <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <p className="font-semibold text-stone-900 text-xs">Customer Assistance</p>
              <a 
                href={`https://wa.me/${settings?.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold text-xs"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp: {settings?.whatsappNumber}
              </a>
              <p className="text-[10px] text-stone-400 leading-tight pt-1">
                Cash on Delivery Nationwide via TCS & Leopards.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
