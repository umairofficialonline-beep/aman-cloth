import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw,
  Search
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery 
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [pricePreset, setPricePreset] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unstitched'];
  const pricePresets = [
    { label: 'All Prices', id: 'All' },
    { label: 'Under Rs. 5,000', id: 'under-5000', min: 0, max: 5000 },
    { label: 'Rs. 5,000 — 10,000', id: '5000-10000', min: 5000, max: 10000 },
    { label: 'Rs. 10,000 — 20,000', id: '10000-20000', min: 10000, max: 20000 },
    { label: 'Above Rs. 20,000', id: 'above-20000', min: 20000, max: 999999 },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Size filter
    if (selectedSize !== 'All') {
      list = list.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    // Price preset filter
    if (pricePreset !== 'All') {
      const preset = pricePresets.find(p => p.id === pricePreset);
      if (preset) {
        list = list.filter(p => {
          const price = p.salePrice || p.price;
          return price >= preset.min! && price <= preset.max!;
        });
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, selectedCategory, selectedSize, pricePreset, sortBy, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setPricePreset('All');
    setSortBy('newest');
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedSize !== 'All' || 
    pricePreset !== 'All' || 
    Boolean(searchQuery.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider mb-1">
          <span>Home</span>
          <span aria-hidden="true">/</span>
          <span>Catalog</span>
          {selectedCategory !== 'All' && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-stone-900 font-semibold">{selectedCategory}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-serif text-stone-900">
          {selectedCategory === 'All' ? 'All Pakistani Collections' : selectedCategory}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Showing {filteredProducts.length} authentic handcrafted garments
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white border border-stone-200/80 rounded-lg p-4 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Category horizontal scrolling buttons on desktop/tablet */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-800 text-xs font-medium rounded-md"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 whitespace-nowrap hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filters pill list */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-stone-500">Active filters:</span>
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded text-stone-800">
              Search: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer hover:text-stone-900" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded text-stone-800">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer hover:text-stone-900" onClick={() => setSelectedCategory('All')} />
            </span>
          )}
          {selectedSize !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded text-stone-800">
              Size: {selectedSize}
              <X className="w-3 h-3 cursor-pointer hover:text-stone-900" onClick={() => setSelectedSize('All')} />
            </span>
          )}
          {pricePreset !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded text-stone-800">
              Price: {pricePresets.find(p => p.id === pricePreset)?.label}
              <X className="w-3 h-3 cursor-pointer hover:text-stone-900" onClick={() => setPricePreset('All')} />
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-stone-500 hover:text-stone-900 underline font-medium ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden sm:block lg:col-span-1 space-y-6">
          <div className="bg-white border border-stone-200/80 rounded-lg p-5 shadow-xs space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-700" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                  Refine By
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-amber-800 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2.5">
                Price (PKR)
              </h4>
              <div className="space-y-1.5">
                {pricePresets.map((preset) => (
                  <label key={preset.id} className="flex items-center gap-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer">
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={pricePreset === preset.id}
                      onChange={() => setPricePreset(preset.id)}
                      className="text-stone-900 focus:ring-stone-800"
                    />
                    <span>{preset.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2.5">
                Garment Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      selectedSize === s
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Help Callout */}
            <div className="pt-4 border-t border-stone-100 p-3 bg-amber-50/50 rounded border border-amber-200/50 text-xs text-stone-700">
              <p className="font-semibold text-stone-900 mb-1">Tailoring Support</p>
              <p className="text-[11px] leading-relaxed text-stone-600">
                Can't find your exact chest or length? Our Lahore atelier offers custom bespoke stitching.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-stone-500">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif text-stone-800 mb-1">No matching garments found</h3>
              <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto">
                We couldn't find any items matching your selected criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-sm font-serif font-semibold text-stone-900">Filter Products</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Price Filter Mobile */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2">Price</h4>
                <div className="space-y-2">
                  {pricePresets.map((preset) => (
                    <label key={preset.id} className="flex items-center gap-2 text-xs text-stone-700">
                      <input
                        type="radio"
                        name="mobilePriceFilter"
                        checked={pricePreset === preset.id}
                        onChange={() => setPricePreset(preset.id)}
                      />
                      <span>{preset.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter Mobile */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2">Size</h4>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded border ${
                        selectedSize === s ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-xs text-stone-500 hover:text-stone-900 text-center"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
