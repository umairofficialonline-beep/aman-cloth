import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const isWomen = category?.toLowerCase().includes('women');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-700" />
            <h3 className="text-lg font-serif tracking-wide text-stone-900">
              {isWomen ? 'Women\'s Pret Size Guide' : 'Men\'s Kurta & Shalwar Kameez Size Guide'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 text-xs text-stone-500">
          All measurements are in inches. Standard Pakistani tailored fit. Measure across flat garment.
        </div>

        <div className="mt-4 overflow-x-auto">
          {isWomen ? (
            <table className="w-full text-left text-xs border border-stone-200">
              <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 border-b">Size</th>
                  <th className="py-2.5 px-3 border-b">Chest</th>
                  <th className="py-2.5 px-3 border-b">Waist</th>
                  <th className="py-2.5 px-3 border-b">Hips</th>
                  <th className="py-2.5 px-3 border-b">Shirt Length</th>
                  <th className="py-2.5 px-3 border-b">Trouser Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-600 font-mono">
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">XS</td>
                  <td className="py-2 px-3">36"</td>
                  <td className="py-2 px-3">32"</td>
                  <td className="py-2 px-3">39"</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">37"</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">S</td>
                  <td className="py-2 px-3">38"</td>
                  <td className="py-2 px-3">34"</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">38"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">M</td>
                  <td className="py-2 px-3">41"</td>
                  <td className="py-2 px-3">37"</td>
                  <td className="py-2 px-3">45"</td>
                  <td className="py-2 px-3">43"</td>
                  <td className="py-2 px-3">39"</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">L</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">41"</td>
                  <td className="py-2 px-3">48"</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">40"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">XL</td>
                  <td className="py-2 px-3">47"</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">52"</td>
                  <td className="py-2 px-3">45"</td>
                  <td className="py-2 px-3">40.5"</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border border-stone-200">
              <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 border-b">Size</th>
                  <th className="py-2.5 px-3 border-b">Collar</th>
                  <th className="py-2.5 px-3 border-b">Chest</th>
                  <th className="py-2.5 px-3 border-b">Length</th>
                  <th className="py-2.5 px-3 border-b">Sleeve</th>
                  <th className="py-2.5 px-3 border-b">Shalwar Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-600 font-mono">
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">S (Small)</td>
                  <td className="py-2 px-3">14.5"</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">23.5"</td>
                  <td className="py-2 px-3">40"</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">M (Medium)</td>
                  <td className="py-2 px-3">15.5"</td>
                  <td className="py-2 px-3">43"</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">24.5"</td>
                  <td className="py-2 px-3">41"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">L (Large)</td>
                  <td className="py-2 px-3">16.5"</td>
                  <td className="py-2 px-3">46"</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">25.5"</td>
                  <td className="py-2 px-3">42"</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">XL (X-Large)</td>
                  <td className="py-2 px-3">17.5"</td>
                  <td className="py-2 px-3">49"</td>
                  <td className="py-2 px-3">45"</td>
                  <td className="py-2 px-3">26.5"</td>
                  <td className="py-2 px-3">43"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-900 font-sans">XXL</td>
                  <td className="py-2 px-3">18.5"</td>
                  <td className="py-2 px-3">52"</td>
                  <td className="py-2 px-3">46"</td>
                  <td className="py-2 px-3">27.0"</td>
                  <td className="py-2 px-3">44"</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200/60 text-xs text-amber-900">
          <strong>Need Bespoke Fitting?</strong> Contact our master tailoring desk via WhatsApp with your custom dimensions.
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
