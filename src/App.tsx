import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { WhatsAppButton } from './components/WhatsAppButton';

import { HomePage } from './views/HomePage';
import { ShopPage } from './views/ShopPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { CartPage } from './views/CartPage';
import { CheckoutPage } from './views/CheckoutPage';
import { OrderConfirmationPage } from './views/OrderConfirmationPage';
import { TrackOrderPage } from './views/TrackOrderPage';
import { CustomerAccountPage } from './views/CustomerAccountPage';
import { AboutPage, ContactPage, FaqPage, PolicyPage } from './views/ContentPages';
import { AdminLoginPage } from './views/AdminLoginPage';
import { AdminDashboard } from './views/AdminDashboard';

const MainRouter: React.FC = () => {
  const { currentPage } = useStore();

  // If in admin dashboard, render full admin console without customer storefront headers
  if (currentPage === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900">
      <Header />
      
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'product-detail' && <ProductDetailPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-confirmation' && <OrderConfirmationPage />}
        {currentPage === 'track-order' && <TrackOrderPage />}
        {currentPage === 'customer-account' && <CustomerAccountPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'faqs' && <FaqPage />}
        {currentPage === 'shipping-policy' && <PolicyPage type="shipping" />}
        {currentPage === 'returns-policy' && <PolicyPage type="returns" />}
        {currentPage === 'privacy-policy' && <PolicyPage type="privacy" />}
        {currentPage === 'terms-conditions' && <PolicyPage type="terms" />}
        {currentPage === 'admin-login' && <AdminLoginPage />}
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
}
