# Aman Cloth House — Luxury Pakistani Clothing Brand

A professional, modern, fully functional Pakistani clothing e-commerce web application built for **Aman Cloth House**, based in Lahore, Pakistan.

---

## 🌟 Brand & Feature Highlights

1. **Brand Identity & Aesthetic**:
   - Signature text logo and bespoke luxury typography (`Cinzel`, `Playfair Display`, `Plus Jakarta Sans`).
   - Sophisticated luxury palette: Deep obsidian, warm cream, pure silk white, subtle rich gold accents.
   - High-fidelity fashion imagery covering Eastern Menswear, Women's Luxury Pret, and Unstitched Jacquard/Silk fabrics.

2. **Homepage**:
   - Top dynamic announcement bar with delivery alerts (customizable by Admin).
   - High-impact editorial hero section with CTA buttons for New Season and Festive Collections.
   - Signature category showcase cards (Men's, Women's, Unstitched Fabrics).
   - New Arrivals & Best Sellers with quick "Add to Bag", sale discounts, and wishlist toggling.
   - Dynamic Admin-configurable promotional banner.
   - Real, authentic customer testimonials from Lahore, Karachi, and Islamabad with verified badges.
   - Lookbook / Instagram gallery.
   - VIP privilege circle newsletter subscription with instant discount coupon code generation.

3. **Garment Catalog & Filtering**:
   - Filter by categories (Men's, Women's, Kids', Shalwar Kameez, Kurtas, Shirts, Unstitched, Sale).
   - Price range filters (Under 5,000, 5,000–10,000, 10,000–20,000, Above 20,000 PKR).
   - Garment size selector (XS, S, M, L, XL, XXL, Unstitched).
   - Sort by Newest, Price (Low to High, High to Low), and Customer Rating.
   - Real-time search query filtering.

4. **Product Page & Sizing**:
   - Multi-angle product image gallery with thumbnail preview.
   - Color and size selection.
   - Pakistani garment **Size Guide Modal** (providing exact Chest, Length, Collar, and Waist measurements in inches).
   - Direct "Add to Shopping Bag", "Buy Now", and "Order on WhatsApp" pre-filled with garment details.
   - Customer review submission system (stars, name, city, comment) saving directly to persistent storage.

5. **Cart, Checkout & Pakistani Localizations**:
   - Free shipping progress meter (Threshold: Rs. 4,999; Standard fee: Rs. 250).
   - Coupon verification (`AMAN10` for 10% off, `FESTIVE15` for 15% off, `WELCOME1000` for Rs. 1,000 off).
   - Pakistani address fields: City dropdown with all major Pakistani cities + custom city option, complete street address, mobile/WhatsApp number.
   - Payment choices:
     - **Cash on Delivery (COD)** (Default nationwide)
     - **Direct Bank Transfer / IBFT** (Habib Bank Limited account details)
     - **WhatsApp Confirmation**
   - Unique order numbers (e.g. `ACH-2026-XXXXX`).
   - Printable order invoice (`window.print()`).
   - Dedicated **Track Order** page by Order Number + Mobile Number with a 4-step courier milestone tracker (TCS/Leopards).

6. **Full-Featured Admin Management Portal**:
   - Accessible via **Admin Portal** link in the footer or directly from `/admin-login`.
   - **Credentials**: `admin@amancloth.pk` / `admin123`.
   - **Dashboard Overview**: Total Sales in PKR, Total Orders, Active Catalog Count, Low-Stock Warnings (&le; 5 units), 7-day revenue bar chart.
   - **Product Management**: Add, edit, and delete garments. Direct image uploads from computer/mobile device gallery with preview.
   - **Order Fulfillment**: Filter orders by status (Pending, Processing, Shipped, Delivered, Cancelled), add courier tracking numbers (TCS, Leopards, Trax), print invoices.
   - **Customer Directory**: View customer profiles, cities, order counts, and total spend.
   - **Category & Coupon Management**: Create promotional discount codes, manage categories.
   - **Store Settings & Policies**: Edit announcement bar, phone numbers, WhatsApp link, shipping fees, free shipping thresholds, bank details, and legal policies.

---

## 🚀 Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React Icons.
- **Backend**: Node.js & Express server with RESTful API.
- **Persistence**: Server-side storage (`/data/store.json`) with auto-seeding and atomic file updates.
- **Asset Uploads**: Local persistent file storage (`/data/uploads/`) served at `/uploads/*`, supporting base64 dataURL uploads directly from user devices.

---

## 🛠️ Running the Application

### Development
```bash
npm run dev
```
Runs the Express backend server with Vite middleware at `http://0.0.0.0:3000`.

### Building for Production
```bash
npm run build
npm start
```
Compiles client assets to `/dist` and serves via Express.
