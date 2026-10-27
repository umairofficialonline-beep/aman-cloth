import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../context/StoreContext';
import { X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings, currentPage } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not show WhatsApp widget inside admin dashboard
  if (currentPage === 'admin-dashboard') {
    return null;
  }

  // Ensure client-side DOM is ready for portal mounting to document.body
  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  // Format Pakistani WhatsApp phone number (handles 0300... or +92 300...)
  const rawNumber = settings?.whatsappNumber || '+92 300 1234567';
  let cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '92' + cleanNumber.slice(1);
  }

  const defaultMessage = encodeURIComponent(
    'Assalam-o-Alaikum Aman Cloth House! I would like to inquire about your clothing collection & placing an order.'
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  const buttonContent = (
    <div
      className="ach-whatsapp-float fixed z-[99999] flex items-center gap-2.5 print:hidden select-none pointer-events-auto"
      style={{
        position: 'fixed',
        zIndex: 99999,
      }}
      aria-label="WhatsApp Customer Support"
    >
      {/* Floating Prompt Pill (Desktop) */}
      {showTooltip && (
        <div className="relative hidden sm:flex items-center gap-2 bg-stone-950/95 text-white pl-3.5 pr-2 py-2 rounded-full shadow-2xl border border-stone-800 text-xs backdrop-blur-md animate-in fade-in slide-in-from-right-3 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-100 hover:text-[#25D366] transition-colors"
          >
            Chat with Aman Cloth House
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors ml-1 cursor-pointer"
            aria-label="Dismiss message"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Direct Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Aman Cloth House"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shrink-0"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)',
        }}
        title={`Chat on WhatsApp (${rawNumber})`}
      >
        {/* Animated breathing pulse ring */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 group-hover:opacity-75 animate-ping duration-1000 pointer-events-none"
        />

        {/* WhatsApp Official SVG Icon */}
        <svg
          className="w-7 h-7 text-white fill-current drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Small live online green dot */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-sm" />
      </a>
    </div>
  );

  // Portal directly to document.body so no parent container, flex layout, or transform ever affects it
  return createPortal(buttonContent, document.body);
};
