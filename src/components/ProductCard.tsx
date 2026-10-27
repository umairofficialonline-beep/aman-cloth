import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateToProduct, addToCart, isInWishlist, toggleWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100) 
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.colors?.[0] || 'Standard';
    const defaultSize = product.sizes?.[0] || 'M';
    addToCart(product, defaultColor, defaultSize, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => navigateToProduct(product.id)}
      className="group relative flex flex-col bg-white border border-stone-200/70 rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 w-full bg-stone-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
            <span>No Image</span>
          </div>
        )}

        {/* Badges - clean and subtle */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-amber-800 px-2 py-0.5 rounded-xs shadow-xs">
              Save {discountPercent}%
            </span>
          )}
          {product.newArrival && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-900 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-stone-200 shadow-xs">
              New Season
            </span>
          )}
          {product.isUnstitched && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-800 bg-stone-100/90 px-2 py-0.5 rounded-xs border border-stone-300">
              Unstitched
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
            inWishlist 
              ? 'bg-rose-500 text-white' 
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-950'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-stone-950/90 hover:bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-xs transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata line (Anti-slop zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 uppercase tracking-wider mb-1">
            <span>{product.brand || 'Aman Cloth House'}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-1 group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-stone-800">{product.rating || 5.0}</span>
            <span>({product.reviewsCount || 0})</span>
            {product.stock <= 5 && product.stock > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-medium">Only {product.stock} left</span>
              </>
            )}
            {product.stock === 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-rose-600 font-medium">Sold Out</span>
              </>
            )}
          </div>
        </div>

        {/* Price & Size options */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-semibold text-stone-950">
              Rs. {displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="font-mono text-xs text-stone-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Available Sizes Hint */}
          <div className="text-[10px] text-stone-400 uppercase tracking-wider">
            {product.sizes && product.sizes.length > 0 ? product.sizes.join(' · ') : 'Standard'}
          </div>
        </div>
      </div>
    </div>
  );
};
