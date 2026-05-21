import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Star, Filter, ChevronRight, Menu, X, Camera, 
  Phone, MessageCircle, Scissors, Coffee, ShoppingBag, Settings, 
  PlusCircle, Globe, CheckCircle2, ArrowRight, Clock, Heart, 
  Share2, Navigation, ArrowLeft, ShieldCheck, Zap, FileText, Upload,
  Loader2, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';

// --- CONFIG ---
const API_BASE = 'https://naijabizfind.onrender.com/api';

// Custom TikTok Icon
const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// --- BRAND THEME ---
const COLORS = {
  primary: '#008751',
  primaryDark: '#007043',
  accent: '#FFC107',
  textMain: '#111827',
  textMuted: '#6B7280',
};

const CATEGORIES = [
  { name: "Fashion", value: "fashion", icon: <ShoppingBag size={18} /> },
  { name: "Food", value: "food", icon: <Coffee size={18} /> },
  { name: "Services", value: "services", icon: <Settings size={18} /> },
  { name: "Beauty", value: "beauty", icon: <Scissors size={18} /> },
  { name: "Tech", value: "tech", icon: <Globe size={18} /> }
];

// --- HELPERS ---
const getShopPhoto = (biz) => biz?.images?.shopPhoto || biz?.image || '';
const isFeatured = (biz) => biz?.plan === 'featured';
const getHours = (biz) => biz?.workingHours ? `${biz.workingHours.open} - ${biz.workingHours.close}` : biz?.hours || '';

// --- COMPONENT: Business Card ---
const BusinessCard = ({ biz, onClick }) => (
  <div
    onClick={() => onClick(biz)}
    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
  >
    <div className="relative h-40 sm:h-44 overflow-hidden">
      <img src={getShopPhoto(biz)} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {isFeatured(biz) && (
        <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
          Featured
        </div>
      )}
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">{biz.name}</h3>
      <div className="flex items-center text-gray-500 text-[10px] sm:text-xs mb-3">
        <MapPin size={12} className="mr-1 text-[#008751]" /> {biz.city}
      </div>
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star size={14} fill={COLORS.accent} stroke={COLORS.accent} />
          <span className="text-xs sm:text-sm font-bold text-gray-900">{biz.rating || '5.0'}</span>
        </div>
        <span className="text-[#008751] font-bold text-[10px] sm:text-xs capitalize">{biz.category}</span>
      </div>
    </div>
  </div>
);

// --- COMPONENT: Alert Banner ---
const Alert = ({ type, message }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };
  const icons = {
    error: <AlertCircle size={16} />,
    success: <CheckCircle size={16} />,
    info: <AlertCircle size={16} />,
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold ${styles[type]}`}>
      {icons[type]} {message}
    </div>
  );
};

// --- VIEW: HOMEPAGE ---
const HomeView = ({ onNavigate, onSelectBusiness }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/businesses`);
        if (res.ok) {
          const data = await res.json();
          setBusinesses(data);
        }
      } catch (err) {
        console.error('Failed fetching data streaming:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const featured = businesses.filter(b => isFeatured(b)).slice(0, 5);
  const popular = businesses.filter(b => !isFeatured(b)).slice(0, 10);

  return (
    <div className="animate-in fade-in duration-500">
      {/* HERO */}
      <div className="bg-[#008751] py-10 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="text-center md:text-left md:w-3/5">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
              Find Local Experts <br className="hidden md:block" /> In Your Community
            </h1>
            <p className="text-emerald-50 text-xs md:text-base mb-6 opacity-90 font-medium">
              Connecting you with verified tailors, mechanics, salons, and vendors in Nigeria.
            </p>
            <div className="flex bg-white rounded-xl p-1 shadow-lg max-w-md mx-auto md:mx-0 overflow-hidden">
              <input
                type="text"
                placeholder="e.g. Tailor in Lagos"
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
              <button
                onClick={() => onNavigate('directory')}
                className="bg-[#008751] text-white px-4 md:px-6 py-2.5 rounded-lg font-bold text-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => onNavigate('directory', { category: cat.value })}
              className="flex-shrink-0 flex items-center gap-2 px-4 md:px-5 py-2.5 bg-white border border-gray-200 rounded-full hover:border-[#008751] hover:text-[#008751] transition-all font-semibold text-[11px] md:text-sm text-gray-600 shadow-sm"
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Featured Businesses</h2>
          <button onClick={() => onNavigate('directory')} className="text-[#008751] text-xs md:text-sm font-bold">View All</button>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#008751]" /></div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">No featured directory entries live yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {featured.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-emerald-900">List your local business today</h3>
            <p className="text-emerald-700 text-xs md:text-sm font-medium">Join over 1,000+ businesses getting discovered daily.</p>
          </div>
          <button onClick={() => onNavigate('submit')} className="w-full md:w-auto bg-[#008751] text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all text-sm shadow-lg">
            Get Started
          </button>
        </div>
      </section>

      {/* POPULAR */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Popular Nearby</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#008751]" /></div>
        ) : popular.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">No active business listings available near you.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {popular.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
          </div>
        )}
      </section>
    </div>
  );
};

// --- VIEW: DIRECTORY ---
const DirectoryView = ({ onSelectBusiness, initialCategory }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory || '');
  const [searchCity, setSearchCity] = useState('');

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.append('category', activeCategory);
      if (searchCity.trim()) params.append('city', searchCity.trim());

      const res = await fetch(`${API_BASE}/businesses?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBusinesses(data);
    } catch (err) {
      console.error('API integration stream halt:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBusinesses(); }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Explore Directory</h1>
          <p className="text-xs md:text-sm text-gray-400 font-medium">
            {businesses.length} verified businesses listed online
          </p>
        </div>
        {/* City search */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchBusinesses()}
            placeholder="Filter by city..."
            className="flex-1 md:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#008751]"
          />
          <button
            onClick={fetchBusinesses}
            className="px-4 py-2.5 bg-[#008751] text-white rounded-lg text-xs font-black"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveCategory('')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wide transition-all ${activeCategory === '' ? 'bg-[#008751] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wide transition-all ${activeCategory === cat.value ? 'bg-[#008751] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={28} className="text-[#008751] animate-spin" />
        </div>
      )}

      {!loading && businesses.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="font-bold text-base">No businesses found for this filter.</p>
          <button onClick={() => { setActiveCategory(''); setSearchCity(''); }} className="mt-3 text-[#008751] text-sm font-bold">Clear filters</button>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {businesses.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
        </div>
      )}
    </div>
  );
};

// --- VIEW: BUSINESS DETAIL ---
const DetailView = ({ business, onBack }) => (
  <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-bold mb-6 hover:text-[#008751] text-xs md:text-sm">
      <ArrowLeft size={16} /> Back to Search
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      <div className="lg:col-span-7 space-y-6 md:space-y-8">
        <div className="rounded-2xl md:rounded-3xl overflow-hidden h-64 md:h-96 shadow-lg border border-gray-100">
          <img src={getShopPhoto(business)} className="w-full h-full object-cover" alt={business.name} />
        </div>
        <div>
          <div className="flex items-center gap-2 text-[#008751] font-bold text-[10px] uppercase tracking-widest mb-2">
            <CheckCircle2 size={14} /> Verified Business
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">{business.name}</h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">{business.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <MapPin className="text-[#008751] flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-gray-900 text-xs md:text-sm">Location</p>
              <p className="text-gray-500 text-xs md:text-sm">{business.address}, {business.city}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="text-[#008751] flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-gray-900 text-xs md:text-sm">Operating Hours</p>
              <p className="text-gray-500 text-xs md:text-sm">{getHours(business)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-24 bg-white p-6 md:p-8 border border-gray-100 rounded-2xl md:rounded-3xl shadow-xl space-y-4">
          <h3 className="font-extrabold text-gray-900 text-base md:text-lg">Contact Professional</h3>
          <a
            href={`tel:${business.phone}`}
            className="w-full py-4 bg-[#008751] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all text-sm"
          >
            <Phone size={18} /> Call {business.phone}
          </a>
          <a
            href={`https://wa.me/${(business.whatsapp || business.phone || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
);

// --- VIEW: SUBMIT BUSINESS ---
const SubmitView = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const shopPhotoInputRef = useRef(null);
  const certInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '', category: 'fashion', city: '', address: '',
    description: '', phone: '', whatsapp: '',
    openTime: '', closeTime: '',
  });

  const [shopPhoto, setShopPhoto] = useState(null);
  const [shopPhotoPreview, setShopPhotoPreview] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [certificateName, setCertificateName] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShopPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShopPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setShopPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCertificate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCertificate(file);
    setCertificateName(file.name);
  };

  const handleRegister = async () => {
    if (!form.name || !form.city || !form.address || !form.phone || !form.openTime || !form.closeTime || !form.description) {
      setAlert({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    setAlert(null);
    setStep(2);
  };

  const handleMediaNext = () => {
    if (!shopPhoto) {
      setAlert({ type: 'error', message: 'Please upload a shop cover photo.' });
      return;
    }
    setAlert(null);
    setStep(3);
  };

  const handleSubmitAndPay = async () => {
    setSubmitting(true);
    setAlert(null);

    try {
      // 1. Core upload flow handling multipart multi-destination assets
      const uploadData = new FormData();
      uploadData.append('shopPhoto', shopPhoto);
      if (certificate) {
        uploadData.append('certificate', certificate);
      }

      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.message || 'Media file assets processing failed.');
      }

      const mediaUrls = await uploadRes.json();

      // 2. Register the business with real cloud URLs
      const registerRes = await fetch(`${API_BASE}/businesses/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          plan: selectedPlan,
          shopPhoto: mediaUrls.shopPhoto,
          certificate: mediaUrls.certificate || null,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.message || 'Registration failed');
      }

      const savedBusinessId = registerData._id;

      // 3. Initialize Paystack payment
      const email = form.phone + '@naijabizfind.com';
      const payRes = await fetch(`${API_BASE}/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: savedBusinessId, email }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        throw new Error(payData.message || 'Payment initialization failed');
      }

      // 4. Redirect to secure external checkouts
      window.location.href = payData.authorization_url;

    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Something went wrong. Please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-12 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Register Your Business</h2>
            <p className="text-xs md:text-sm text-gray-500 font-semibold mt-1">Step {step} of 3</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 w-6 md:w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#008751]' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>

        {alert && <div className="mb-4"><Alert type={alert.type} message={alert.message} /></div>}

        {/* STEP 1: Business Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <input
              name="name" value={form.name} onChange={handleChange}
              type="text" className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] focus:ring-0 font-bold text-sm outline-none"
              placeholder="Business Name *"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category" value={form.category} onChange={handleChange}
                className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold text-sm outline-none"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
              </select>
              <input
                name="city" value={form.city} onChange={handleChange}
                type="text" className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm outline-none"
                placeholder="City *"
              />
            </div>
            <input
              name="address" value={form.address} onChange={handleChange}
              type="text" className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm outline-none"
              placeholder="Street Address *"
            />
            <input
              name="phone" value={form.phone} onChange={handleChange}
              type="tel" className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm outline-none"
              placeholder="Phone Number * (e.g. +234 800 000 0000)"
            />
            <input
              name="whatsapp" value={form.whatsapp} onChange={handleChange}
              type="tel" className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm outline-none"
              placeholder="WhatsApp Number (optional — defaults to phone)"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="openTime" value={form.openTime} onChange={handleChange}
                type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm outline-none"
                placeholder="Opens at (e.g. 8am) *"
              />
              <input
                name="closeTime" value={form.closeTime} onChange={handleChange}
                type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm outline-none"
                placeholder="Closes at (e.g. 6pm) *"
              />
            </div>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows="3" className="w-full p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#008751] font-bold text-sm resize-none outline-none"
              placeholder="Short Description of your business *"
            />
            <button
              onClick={handleRegister}
              className="w-full py-4 md:py-5 bg-[#008751] text-white rounded-xl md:rounded-2xl font-extrabold shadow-lg flex items-center justify-center gap-2"
            >
              Next: Media Upload <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 2: Media Upload */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="space-y-4">
              {/* Shop Photo */}
              <input ref={shopPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleShopPhoto} />
              <div
                onClick={() => shopPhotoInputRef.current.click()}
                className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[#008751] transition-all cursor-pointer group overflow-hidden"
              >
                {shopPhotoPreview ? (
                  <img src={shopPhotoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                ) : (
                  <>
                    <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-gray-600">Upload Shop Cover Photo (Required)</span>
                    <span className="text-[10px] text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                  </>
                )}
              </div>

              {/* Certificate */}
              <input ref={certInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleCertificate} />
              <div
                onClick={() => certInputRef.current.click()}
                className="border-2 border-dashed border-gray-200 bg-gray-50/30 rounded-2xl p-6 flex items-center gap-4 text-gray-400 hover:border-[#008751] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                  <FileText size={20} className={certificate ? 'text-[#008751]' : ''} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold block text-gray-600">Business Certificate / CAC (Optional)</span>
                  {certificateName && <span className="text-[10px] text-[#008751] font-semibold">{certificateName}</span>}
                </div>
                <Upload size={18} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-xl font-bold">Back</button>
              <button onClick={handleMediaNext} className="flex-[2] py-4 bg-[#008751] text-white rounded-xl font-extrabold shadow-lg">
                Next: Select Plan
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Plan & Payment */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedPlan('basic')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'basic' ? 'border-[#008751] bg-emerald-50' : 'border-gray-100 bg-white'}`}
              >
                <ShieldCheck size={20} className={selectedPlan === 'basic' ? 'text-[#008751]' : 'text-gray-300'} />
                <span className="font-black text-gray-900 block mt-2">Basic Listing</span>
                <div className="text-2xl font-black text-gray-900">₦5,000</div>
                <p className="text-xs text-gray-500 mt-1">12-month listing, standard placement</p>
              </div>

              <div
                onClick={() => setSelectedPlan('featured')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'featured' ? 'border-[#FFC107] bg-amber-50' : 'border-gray-100 bg-white'}`}
              >
                <Zap size={20} className={selectedPlan === 'featured' ? 'text-[#FFC107]' : 'text-gray-300'} />
                <span className="font-black text-gray-900 block mt-2">Featured</span>
                <div className="text-2xl font-black text-gray-900">₦10,000</div>
                <p className="text-xs text-gray-500 mt-1">Priority placement, homepage visibility</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              <div className="flex justify-between font-bold text-gray-700">
                <span>Business</span><span>{form.name}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-700">
                <span>Plan</span><span className="capitalize">{selectedPlan}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span><span>₦{selectedPlan === 'featured' ? '10,000' : '5,000'}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={() => setStep(2)} className="w-full md:w-1/3 py-4 bg-gray-100 text-gray-400 rounded-xl font-bold" disabled={submitting}>
                Back
              </button>
              <button
                onClick={handleSubmitAndPay}
                disabled={submitting}
                className="w-full md:w-2/3 py-4 bg-[#008751] text-white rounded-xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'Pay & List Business'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- VIEW: ABOUT ---
const AboutView = () => (
  <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in duration-500">
    <h1 className="text-4xl font-black text-gray-900 mb-6">About NaijaBizFind</h1>
    <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed space-y-6">
      <p className="text-xl font-medium">NaijaBizFind is Nigeria's premier local business directory, dedicated to connecting quality service providers with customers in every neighborhood.</p>
      <p>Our platform was born from a simple observation: many of Nigeria's most talented artisans and small business owners have no online presence. We bridge that gap by providing a professional, easy-to-use directory where tailors, mechanics, salons, and local vendors can be discovered by people in their cities.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-emerald-50 p-8 rounded-3xl">
          <h3 className="text-[#008751] font-black text-xl mb-4">Our Mission</h3>
          <p>To empower small businesses in Nigeria by providing them with a digital footprint and direct access to a wider customer base.</p>
        </div>
        <div className="bg-amber-50 p-8 rounded-3xl">
          <h3 className="text-amber-800 font-black text-xl mb-4">Our Vision</h3>
          <p>To become the most trusted and comprehensive resource for finding reliable local services across all 36 states of Nigeria.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- VIEW: PRIVACY ---
const PrivacyView = () => (
  <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in duration-500">
    <h1 className="text-4xl font-black text-gray-900 mb-6">Privacy Policy</h1>
    <div className="text-gray-600 space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
        <p>When you register a business, we collect your business name, contact details, physical address, and any media you upload. For users searching the directory, we may collect location data to provide local results.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
        <p>Information provided in business listings is made public to allow customers to find and contact you. We use your contact details to send notifications regarding your listing status and payment confirmations.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Payment Security</h2>
        <p>Payments are processed through Paystack. We do not store your credit card or bank details on our servers.</p>
      </section>
    </div>
  </div>
);

// --- VIEW: TERMS ---
const TermsView = () => (
  <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in duration-500">
    <h1 className="text-4xl font-black text-gray-900 mb-6">Terms & Conditions</h1>
    <div className="text-gray-600 space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Listing Verification</h2>
        <p>All business listings are subject to verification. NaijaBizFind reserves the right to reject or remove listings that are fraudulent, illegal, or violate our community standards.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Payment & Refunds</h2>
        <p>Listing fees are non-refundable once the business listing has been reviewed and published. Basic listings stay active for 12 months unless otherwise specified.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
        <p>Users are expected to provide accurate information. Misrepresentation of a business or service may lead to permanent banning from the platform.</p>
      </section>
    </div>
  </div>
);

// --- PAYMENT SUCCESS PAGE ---
const PaymentSuccessView = ({ onNavigate }) => {
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('reference') ||
                new URLSearchParams(window.location.search).get('trxref');
    if (!ref) { setStatus('error'); return; }

    fetch(`${API_BASE}/payments/verify/${ref}`)
      .then(r => r.json())
      .then(data => setStatus(data.success ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center animate-in fade-in duration-500">
      {status === 'verifying' && (
        <><Loader2 size={48} className="text-[#008751] animate-spin mx-auto mb-4" /><p className="text-gray-500 font-bold">Verifying your payment...</p></>
      )}
      {status === 'success' && (
        <>
          <CheckCircle size={64} className="text-[#008751] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 text-sm font-semibold mb-8">Your business has been submitted for admin review. You'll be visible once approved.</p>
          <button onClick={() => onNavigate('home')} className="bg-[#008751] text-white px-8 py-3 rounded-xl font-bold">Back to Home</button>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-500 text-sm font-semibold mb-8">We couldn't verify your payment. Please contact support with your payment reference.</p>
          <button onClick={() => onNavigate('home')} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold">Back to Home</button>
        </>
      )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [page, setPage] = useState(() => {
    if (window.location.pathname === '/payment-success' ||
        window.location.search.includes('reference') ||
        window.location.search.includes('trxref')) {
      return 'payment-success';
    }
    return 'home';
  });
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [directoryOptions, setDirectoryOptions] = useState({});

  const navigate = (p, opts = {}) => {
    setPage(p);
    setSelectedBiz(null);
    setIsMenuOpen(false);
    setDirectoryOptions(opts);
    window.scrollTo(0, 0);
  };

  const handleSelectBusiness = (biz) => {
    setSelectedBiz(biz);
    setPage('detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 py-3 md:py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => navigate('home')} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-[#008751] rounded-lg flex items-center justify-center text-white font-black italic text-lg shadow-inner group-hover:rotate-6 transition-transform">N</div>
            <span className="text-base md:text-lg font-black tracking-tighter text-[#008751]">NaijaBizFind</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigate('home')} className={`text-[11px] font-black transition-colors ${page === 'home' ? 'text-[#008751]' : 'text-gray-400'}`}>HOME</button>
            <button onClick={() => navigate('directory')} className={`text-[11px] font-black transition-colors ${page === 'directory' ? 'text-[#008751]' : 'text-gray-400'}`}>DIRECTORY</button>
            <button onClick={() => navigate('submit')} className="bg-[#008751] text-white px-5 py-2 rounded-lg text-xs font-black shadow-md">List Business</button>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-4">
            <button onClick={() => navigate('home')} className="text-left font-black text-[11px] uppercase text-gray-600 py-2 border-b border-gray-50">Home</button>
            <button onClick={() => navigate('directory')} className="text-left font-black text-[11px] uppercase text-gray-600 py-2 border-b border-gray-50">Browse Directory</button>
            <button onClick={() => navigate('submit')} className="w-full bg-[#008751] text-white py-4 rounded-xl font-black uppercase text-xs mt-2 shadow-lg">List My Business</button>
          </div>
        )}
      </nav>

      {/* PAGE ROUTER */}
      <main>
        {page === 'home' && <HomeView onNavigate={navigate} onSelectBusiness={handleSelectBusiness} />}
        {page === 'directory' && <DirectoryView onSelectBusiness={handleSelectBusiness} initialCategory={directoryOptions.category} />}
        {page === 'detail' && <DetailView business={selectedBiz} onBack={() => navigate('directory')} />}
        {page === 'submit' && <SubmitView />}
        {page === 'about' && <AboutView />}
        {page === 'privacy' && <PrivacyView />}
        {page === 'terms' && <TermsView />}
        {page === 'payment-success' && <PaymentSuccessView onNavigate={navigate} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-12 md:pt-16 pb-8 px-4 md:px-6 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#008751] rounded flex items-center justify-center text-white font-black italic text-xs">N</div>
              <span className="text-sm font-black text-[#008751]">NaijaBizFind</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed max-w-xs font-medium">Connecting Nigerian neighborhoods. Built for Nigerians, by Nigerians.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Company</h4>
            <ul className="text-xs md:text-sm text-gray-500 space-y-3 font-bold uppercase tracking-tight">
              <li onClick={() => navigate('about')} className="hover:text-[#008751] cursor-pointer text-[11px]">About Us</li>
              <li onClick={() => navigate('privacy')} className="hover:text-[#008751] cursor-pointer text-[11px]">Privacy Policy</li>
              <li onClick={() => navigate('terms')} className="hover:text-[#008751] cursor-pointer text-[11px]">Terms</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="text-xs md:text-sm text-gray-500 space-y-3 font-bold uppercase tracking-tight">
              <li onClick={() => navigate('submit')} className="hover:text-[#008751] cursor-pointer text-[11px]">Submit Listing</li>
              <li className="hover:text-[#008751] cursor-pointer text-[11px]">Partner Portal</li>
              <li className="hover:text-[#008751] cursor-pointer text-[11px]">Support</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="https://tiktok.com/@yourprofile" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#008751] hover:text-white transition-all cursor-pointer">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">© 2026 NaijaBizFind. Supporting Small Business Growth.</p>
          <div className="flex gap-4 md:gap-6 text-[9px] md:text-[10px] font-black uppercase text-gray-300">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Platform Active</span>
            <span className="hidden sm:inline">Lagos • Abuja • Port Harcourt</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
