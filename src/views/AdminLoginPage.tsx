import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  X,
  UserCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import * as api from '../api';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setCurrentPage, adminToken } = useStore();
  const [email, setEmail] = useState('admin@amancloth.pk');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Google sign in modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (adminToken) {
      setCurrentPage('admin-dashboard');
    }
  }, [adminToken, setCurrentPage]);

  // Standard Email/Password Login
  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const targetEmail = customEmail || email;
      const targetPass = customPass || password;
      const res = await api.adminLogin({ email: targetEmail.trim(), password: targetPass.trim() });
      loginAdmin(res.token, res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Execution
  const handleGoogleAccountSelect = async (selectedEmail: string, displayName: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.adminGoogleLogin({
        email: selectedEmail,
        name: displayName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      });
      setIsGoogleModalOpen(false);
      loginAdmin(res.token, res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-stone-900 font-bold">Store Staff & Admin Portal</h1>
          <p className="text-xs text-stone-500">
            Authorized management access for Aman Cloth House staff
          </p>
        </div>

        {/* 1. Continue with Google Button */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-3 px-4 bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-200 hover:border-stone-400 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center gap-3 transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {/* Google official SVG logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA3435"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Demo Credentials Helper with 1-Click Access */}
        <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-lg text-xs text-amber-950 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5 text-stone-900 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-700" /> Default Credentials:
            </span>
            <span className="px-2 py-0.5 bg-amber-200/80 rounded text-[10px] font-mono font-bold text-amber-950">
              ACTIVE
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/80 p-2 rounded border border-amber-200/80">
            <div>
              <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Email</span>
              <span className="font-bold text-stone-900 truncate block">admin@amancloth.pk</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Password</span>
              <span className="font-bold text-stone-900">admin123</span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setEmail('admin@amancloth.pk');
              setPassword('admin123');
              handleLogin(undefined, 'admin@amancloth.pk', 'admin123');
            }}
            className="w-full py-2 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>1-Click Instant Demo Login</span>
          </button>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@amancloth.pk"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                required
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                required
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        <div className="pt-1 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
          </button>
        </div>

      </div>

      {/* Google Account Selector Dialog */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-stone-200">
            
            {/* Google Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA3435"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-semibold text-stone-800 text-sm">Choose an account</span>
              </div>
              <button 
                onClick={() => setIsGoogleModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              to continue to <strong className="text-stone-800">Aman Cloth House Admin</strong>
            </p>

            {/* Account List */}
            <div className="space-y-2">
              {/* Primary Owner Account */}
              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('umair.official.online@gmail.com', 'Umair (Store Owner)')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-amber-400 transition-all text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-amber-900 text-amber-200 font-bold flex items-center justify-center text-sm shrink-0">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-xs text-stone-900 truncate">Umair</p>
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                      OWNER
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">umair.official.online@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Staff Default Google Account */}
              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('admin@amancloth.pk', 'Aman Cloth House Staff')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-amber-400 transition-all text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 font-bold flex items-center justify-center text-sm shrink-0">
                  ACH
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-stone-900 truncate">Aman Cloth House Admin</p>
                  <p className="text-[11px] text-stone-500 truncate">admin@amancloth.pk</p>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Custom Google Email Option */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-xs text-stone-600 hover:text-stone-900 py-2 border-t border-stone-100 flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <UserCheck className="w-4 h-4 text-stone-400" />
                <span>Use another Google account</span>
              </button>
            ) : (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="Enter authorized Google email..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail.trim()) {
                      handleGoogleAccountSelect(customGoogleEmail.trim(), customGoogleEmail.split('@')[0]);
                    }
                  }}
                  className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Verify & Sign In
                </button>
              </div>
            )}

            <div className="pt-2 text-center text-[10px] text-stone-400">
              To continue, Google will share your name, email address, and profile picture with Aman Cloth House Admin.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
