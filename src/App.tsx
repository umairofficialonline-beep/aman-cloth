import React, { Component, ErrorInfo, ReactNode } from 'react';
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

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Aman Cloth House:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100 p-6">
          <div className="max-w-md w-full bg-stone-950 p-8 rounded-xl border border-amber-500/30 text-center space-y-4">
            <h1 className="text-xl font-serif text-amber-200">Aman Cloth House</h1>
            <p className="text-sm text-stone-400">
              A temporary issue occurred while rendering this page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider rounded cursor-pointer"
            >
              Reload Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <StoreProvider>
        <MainRouter />
      </StoreProvider>
    </ErrorBoundary>
  );
}
