import heroImage from './images/hero_fashion_luxury_1793091301490.jpg';
import menCollectionImage from './images/category_men_collection_1793091301301.jpg';
import womenCollectionImage from './images/category_women_collection_1793091302648.jpg';
import unstitchedImage from './images/category_unstitched_luxury_1793091303504.jpg';
import promoBannerImage from './images/promo_festive_banner_1793091303468.jpg';

export {
  heroImage,
  menCollectionImage,
  womenCollectionImage,
  unstitchedImage,
  promoBannerImage
};

export const BRAND_ASSETS = {
  hero: heroImage,
  men: menCollectionImage,
  women: womenCollectionImage,
  unstitched: unstitchedImage,
  promo: promoBannerImage,
  fallback: heroImage
};

/**
 * Robust image resolver that handles:
 * 1. Base64 / data-URI uploads from the admin dashboard
 * 2. Static path strings (/src/assets/images/..., /images/..., /uploads/...)
 * 3. Hashed bundled Vite assets in production
 * 4. External or CDN URLs
 */
export function resolveProductImage(url: string | undefined | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return heroImage;
  }

  const clean = url.trim();

  // If it's already an inlined data URL or blob, return as-is
  if (clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }

  // Match known brand assets to Vite-bundled hashed files
  if (clean.includes('category_men_collection')) {
    return menCollectionImage;
  }
  if (clean.includes('category_women_collection')) {
    return womenCollectionImage;
  }
  if (clean.includes('category_unstitched_luxury')) {
    return unstitchedImage;
  }
  if (clean.includes('hero_fashion_luxury')) {
    return heroImage;
  }
  if (clean.includes('promo_festive_banner')) {
    return promoBannerImage;
  }

  return clean;
}
