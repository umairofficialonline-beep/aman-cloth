import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Heritage of Lahore
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900">
          The Craft of Aman Cloth House
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
          Preserving centuries of subcontinental embroidery and artisanal weaving since 1998.
        </p>
      </div>

      <div className="aspect-16/9 rounded-xl overflow-hidden shadow-md">
        <img
          src="/src/assets/images/hero_fashion_luxury_1793091301490.jpg"
          alt="Aman Cloth House Craftsmanship"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
        <p>
          {settings?.policies?.about || 
            `Founded in the historical heart of Lahore's Liberty Market, Aman Cloth House began with a singular mission: to restore the unmatched elegance of authentic Pakistani textiles and handcrafted tailoring. From pure long-staple Egyptian cottons to resplendent raw silks and hand-loomed jacquards, every fiber is selected for its tactile indulgence and longevity.`
          }
        </p>

        <h3 className="text-lg font-serif font-bold text-stone-900 pt-4">Artisanal Dedication</h3>
        <p>
          Our atelier brings together master ustaads whose ancestral lineage traces through zardozi, dabka, resham threadwork, and hand-cut kalidars. Whether you are dressing for a prestigious Mehndi in Islamabad, a boardroom in Karachi, or Jummah prayer in Lahore, our garments deliver immaculate structure and timeless dignity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-200 text-center">
          <div className="p-4 bg-stone-50 rounded border border-stone-200">
            <h4 className="text-2xl font-serif font-bold text-stone-900">28+</h4>
            <p className="text-xs text-stone-500 mt-1">Years of Tailoring Mastery</p>
          </div>
          <div className="p-4 bg-stone-50 rounded border border-stone-200">
            <h4 className="text-2xl font-serif font-bold text-stone-900">100%</h4>
            <p className="text-xs text-stone-500 mt-1">Guaranteed Pure Fabrics</p>
          </div>
          <div className="p-4 bg-stone-50 rounded border border-stone-200">
            <h4 className="text-2xl font-serif font-bold text-stone-900">Nationwide</h4>
            <p className="text-xs text-stone-500 mt-1">Express Delivery to Every City</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast('Please fill out all contact fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your inquiry has been submitted. Our team will contact you shortly.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Get in Touch
        </span>
        <h1 className="text-3xl font-serif text-stone-900">Visit Our Atelier or Inquire Online</h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          Our master consultants are available for bespoke orders, size consultations, and bridal bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900 text-white rounded-lg p-8 space-y-6 shadow-md">
          <h3 className="font-display text-xl tracking-wider uppercase text-amber-300">
            Aman Cloth House
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Experience our fabrics in person or receive instant video consultation for your wedding ensembles.
          </p>

          <div className="space-y-4 text-xs text-stone-300 pt-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Flagship Boutique:</p>
                <p>{settings?.address || 'Shop # 14-16, Liberty Market, Gulberg III'}</p>
                <p>{settings?.city || 'Lahore, Pakistan'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Phone & WhatsApp:</p>
                <p>{settings?.phone || '+92 300 8472910'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email Address:</p>
                <p>{settings?.email || 'support@amanclothhouse.pk'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Atelier Hours:</p>
                <p>Monday – Saturday: 11:00 AM – 10:00 PM PST</p>
                <p>Sunday: 3:00 PM – 10:00 PM PST</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800">
            <a
              href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Instant WhatsApp Message</span>
            </a>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-lg p-8 shadow-xs">
          <h3 className="text-lg font-serif font-semibold text-stone-900 mb-4">
            Send an Online Inquiry
          </h3>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-semibold text-emerald-950">Inquiry Received</h4>
              <p className="text-xs text-emerald-800">
                A customer representative will contact you via WhatsApp or phone within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Farhan Tariq"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Message or Inquired Design *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us about the design, occasion date, or specific sizing questions..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-800 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'We offer Cash on Delivery across all cities, tehsils, and towns in Pakistan through TCS and Leopards Courier. You pay the exact order amount in cash to the rider upon parcel delivery. No credit card or upfront deposit required for standard orders.'
    },
    {
      q: 'What is your nationwide shipping time?',
      a: 'Deliveries to major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan) typically arrive within 2 to 3 business days. Deliveries to other cities and rural regions take 3 to 4 business days. Orders booked before 3:00 PM are dispatched same-day.'
    },
    {
      q: 'Can I exchange my garment if the size does not fit?',
      a: 'Yes, absolutely. We provide a 7-day hassle-free size exchange policy. As long as the garment is unworn, unwashed, and retains all original tags, our courier will arrange a replacement parcel.'
    },
    {
      q: 'Are your unstitched suits complete with dupatta and lining?',
      a: 'Yes, each unstitched 3-piece product description specifies the exact yardage (e.g. 3.25m shirt, 2.5m pure raw silk trouser, 2.5m chiffon/organza dupatta) and all matching embroidered neckline patches and borders.'
    },
    {
      q: 'Do you offer custom tailoring / made-to-measure stitching?',
      a: 'Yes! You can contact our Lahore atelier directly on WhatsApp with your exact chest, length, shoulder, and sleeve measurements for bespoke tailoring.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Got Questions?
        </span>
        <h1 className="text-3xl font-serif text-stone-900">Frequently Asked Questions</h1>
        <p className="text-xs text-stone-500">
          Everything you need to know about our fabrics, deliveries, and payment modes.
        </p>
      </div>

      <div className="divide-y divide-stone-200 border border-stone-200 rounded-lg bg-white overflow-hidden shadow-xs">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-5">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left text-sm font-semibold text-stone-900 cursor-pointer"
            >
              <span>{faq.q}</span>
              <span className="text-stone-400 font-mono text-base">{openIdx === idx ? '−' : '+'}</span>
            </button>
            {openIdx === idx && (
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{ type: 'shipping' | 'returns' | 'privacy' | 'terms' }> = ({ type }) => {
  const { settings } = useStore();

  const titles = {
    shipping: 'Shipping & Delivery Policy',
    returns: 'Return & Exchange Policy',
    privacy: 'Privacy & Data Protection Policy',
    terms: 'Terms of Service'
  };

  const content = settings?.policies?.[type] || 'Policy content currently being updated by store administration.';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Aman Cloth House Guidelines
        </span>
        <h1 className="text-3xl font-serif text-stone-900 mt-1">
          {titles[type]}
        </h1>
        <p className="text-xs text-stone-500 mt-1">Last revised: October 2026 · Applicable nationwide in Pakistan</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-xs prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};
