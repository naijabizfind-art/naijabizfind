import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Star, Filter, ChevronRight, Menu, X, Camera, 
  Phone, MessageCircle, Scissors, Coffee, ShoppingBag, Settings, 
  PlusCircle, Globe, CheckCircle2, ArrowRight, Clock, Heart, 
  Share2, Navigation, ArrowLeft, ShieldCheck, Zap, FileText, Upload,
  Loader2, AlertCircle, CheckCircle, RefreshCw, LogOut
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

// --- CUSTOM HOOK: Intersection Observer for Reveal-on-Scroll ---
const useScrollReveal = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return elementRef;
};

// --- COMPONENT: Business Card Skeleton Loader (Premium Shimmer) ---
const BusinessCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse shadow-sm">
    {/* pulsing cover photo container */}
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-40 sm:h-44 w-full" />
    <div className="p-4 flex-1 flex flex-col space-y-3">
      {/* pulsing business title */}
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      {/* pulsing location sub-text */}
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      {/* pulsing rating & category footer */}
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 w-1/3">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// --- COMPONENT: Business Card (With Dynamic 3D Perspective Effects) ---
const BusinessCard = ({ biz, onClick }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt angles (-12deg to 12deg)
    const rotateX = ((y / rect.height) - 0.5) * -24;
    const rotateY = ((x / rect.width) - 0.5) * 24;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(biz)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease' }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-2xl cursor-pointer flex flex-col h-full will-change-transform"
    >
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img 
          src={getShopPhoto(biz)} 
          alt={biz.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        {isFeatured(biz) && (
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg z-10">
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate group-hover:text-[#008751] transition-colors">{biz.name}</h3>
        <div className="flex items-center text-gray-500 text-[10px] sm:text-xs mb-3">
          <MapPin size={12} className="mr-1 text-[#008751]" /> {biz.city}
        </div>
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} fill={COLORS.accent} stroke={COLORS.accent} className="group-hover:rotate-[72deg] transition-transform duration-500" />
            <span className="text-xs sm:text-sm font-bold text-gray-900">{biz.rating || '5.0'}</span>
          </div>
          <span className="text-[#008751] font-bold text-[10px] sm:text-xs capitalize bg-emerald-50 px-2 py-0.5 rounded-full">{biz.category}</span>
        </div>
      </div>
    </div>
  );
};

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
  const [scrollY, setScrollY] = useState(0);
  const [heroSearchInput, setHeroSearchInput] = useState('');

  // Scroll tracking for Parallax implementation
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Initialize Scroll Reveal Elements
  const catRef = useScrollReveal();
  const featRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const popRef = useScrollReveal();

  return (
    <div className="overflow-hidden">
      {/* HERO (With Fine-tuned Parallax & Kinetic Visual Depth) */}
      <div className="relative bg-[#008751] py-16 md:py-24 px-4 md:px-6 overflow-hidden min-h-[340px] md:min-h-[420px] flex items-center">
        {/* Parallax Background Graphics Layer */}
        <div 
          style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: Math.max(0.2, 1 - scrollY / 400) }}
          className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out"
        >
          <div className="absolute top-10 right-12 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-16 -left-10 w-96 h-96 bg-emerald-600/40 rounded-full blur-2xl" />
          <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-yellow-300/10 rounded-full blur-xl" />
        </div>

        {/* Content Container */}
        <div 
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white w-full transition-transform duration-75 ease-out z-10"
        >
          <div className="text-center md:text-left md:w-3/5 space-y-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight drop-shadow-sm">
              Find Local Experts <br className="hidden md:block" /> In Your Community
            </h1>
            <p className="text-emerald-50 text-xs md:text-base mb-6 opacity-90 font-medium max-w-lg">
              Connecting you with verified tailors, mechanics, salons, and vendors in Nigeria.
            </p>
            <div className="flex bg-white rounded-xl p-1.5 shadow-2xl max-w-md mx-auto md:mx-0 overflow-hidden border border-white/20 backdrop-blur-md focus-within:ring-2 focus-within:ring-yellow-400 transition-all duration-300 transform hover:scale-[1.01]">
              <input
                type="text"
                value={heroSearchInput}
                onChange={(e) => setHeroSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('directory', { cityFilter: heroSearchInput })}
                placeholder="e.g. Tailor in Lagos"
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
              />
              <button
                onClick={() => onNavigate('directory', { cityFilter: heroSearchInput })}
                className="bg-[#008751] text-white px-5 md:px-7 py-3 rounded-lg font-extrabold text-sm hover:bg-emerald-800 active:scale-95 transition-all shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES (Reveal-on-Scroll Layout) */}
      <section 
        ref={catRef}
        className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 transform opacity-0 translate-y-12 transition-all duration-700 ease-out"
      >
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-700">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => onNavigate('directory', { category: cat.value })}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-full hover:border-[#008751] hover:text-[#008751] hover:shadow-md hover:scale-105 active:scale-95 transition-all font-bold text-xs md:text-sm text-gray-600 shadow-sm"
            >
              <span className="text-[#008751]">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED (Reveal-on-Scroll Layout) */}
      <section 
        ref={featRef}
        className="max-w-7xl mx-auto px-4 md:px-6 py-6 transform opacity-0 translate-y-12 transition-all duration-700 ease-out"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Featured Businesses</h2>
          <button onClick={() => onNavigate('directory')} className="text-[#008751] text-xs md:text-sm font-extrabold flex items-center gap-0.5 group">
            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {[1, 2, 3, 4, 5].map(i => <BusinessCardSkeleton key={i} />)}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium bg-gray-50 p-6 rounded-xl border border-dashed">No featured directory entries live yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 animate-in fade-in duration-500">
            {featured.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
          </div>
        )}
      </section>

      {/* CTA BANNER (Reveal-on-Scroll Layout) */}
      <section 
        ref={ctaRef}
        className="max-w-7xl mx-auto px-4 md:px-6 py-10 transform opacity-0 translate-y-12 transition-all duration-700 ease-out"
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-md relative overflow-hidden group">
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="relative z-10 space-y-1">
            <h3 className="text-xl md:text-2xl font-black text-emerald-900 tracking-tight">List your local business today</h3>
            <p className="text-emerald-700 text-xs md:text-sm font-semibold">Join over 1,000+ businesses getting discovered daily.</p>
          </div>
          <button onClick={() => onNavigate('submit')} className="relative z-10 w-full md:w-auto bg-[#008751] text-white px-8 py-3.5 rounded-xl font-black hover:bg-emerald-800 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all text-sm shadow-lg">
            Get Started
          </button>
        </div>
      </section>

      {/* POPULAR (Reveal-on-Scroll Layout) */}
      <section 
        ref={popRef}
        className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 transform opacity-0 translate-y-12 transition-all duration-700 ease-out"
      >
        <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Popular Nearby</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <BusinessCardSkeleton key={i} />)}
          </div>
        ) : popular.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium bg-gray-50 p-6 rounded-xl border border-dashed">No active business listings available near you.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 animate-in fade-in duration-500">
            {popular.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
          </div>
        )}
      </section>
    </div>
  );
};

// --- VIEW: DIRECTORY ---
const DirectoryView = ({ onSelectBusiness, initialCategory, initialCity }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory || '');
  const [searchCity, setSearchCity] = useState(initialCity || '');

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
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Explore Directory</h1>
          <p className="text-xs md:text-sm text-gray-400 font-bold mt-1">
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
            className="flex-1 md:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#008751] transition-colors"
          />
          <button
            onClick={fetchBusinesses}
            className="px-4 py-2.5 bg-[#008751] text-white rounded-lg text-xs font-black hover:bg-emerald-800 active:scale-95 transition-all shadow-md"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveCategory('')}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wide transition-all transform hover:scale-105 active:scale-95 ${activeCategory === '' ? 'bg-[#008751]' : 'bg-white border border-gray-200 text-gray-500'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wide transition-all transform hover:scale-105 active:scale-95 ${activeCategory === cat.value ? 'bg-[#008751]' : 'bg-white border border-gray-200 text-gray-500'}`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <BusinessCardSkeleton key={i} />)}
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-20 text-gray-400 animate-in fade-in duration-300">
          <p className="font-bold text-base">No businesses found for this filter.</p>
          <button onClick={() => { setActiveCategory(''); setSearchCity(''); }} className="mt-3 text-[#008751] text-sm font-black underline hover:text-emerald-800">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 animate-in fade-in duration-500">
          {businesses.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
        </div>
      )}
    </div>
  );
};

// --- VIEW: BUSINESS DETAIL ---
const DetailView = ({ business, onBack }) => (
  <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-extrabold mb-6 hover:text-[#008751] text-xs md:text-sm transition-colors group">
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      <div className="lg:col-span-7 space-y-6 md:space-y-8">
        <div className="rounded-2xl md:rounded-3xl overflow-hidden h-64 md:h-96 shadow-xl border border-gray-100 group relative">
          <img src={getShopPhoto(business)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={business.name} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#008751] font-black text-[10px] uppercase tracking-widest bg-emerald-50 w-max px-2 py-0.5 rounded">
            <CheckCircle2 size={14} /> Verified Business
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">{business.name}</h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">{business.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <MapPin className="text-[#008751] flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-gray-900 text-xs md:text-sm">Location</p>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5">{business.address}, {business.city}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="text-[#008751] flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-gray-900 text-xs md:text-sm">Operating Hours</p>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5">{getHours(business)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-24 bg-white p-6 md:p-8 border border-gray-100 rounded-2xl md:rounded-3xl shadow-2xl space-y-4 transform hover:scale-[1.01] transition-transform duration-300">
          <h3 className="font-black text-gray-900 text-base md:text-lg tracking-tight">Contact Professional</h3>
          <a
            href={`tel:${business.phone}`}
            className="w-full py-4 bg-[#008751] text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-emerald-800 active:scale-[0.98] transition-all text-sm shadow-lg shadow-emerald-700/10"
          >
            <Phone size={18} /> Call {business.phone}
          </a>
          <a
            href={`https://wa.me/${(business.whatsapp || business.phone || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all text-sm shadow-lg shadow-green-600/10"
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
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-12 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Register Your Business</h2>
            <p className="text-xs md:text-sm text-gray-400 font-bold mt-1">Step {step} of 3</p>
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
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <input
              name="name" value={form.name} onChange={handleChange}
              type="text" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white focus:ring-0 font-bold text-sm outline-none transition-colors"
              placeholder="Business Name *"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category" value={form.category} onChange={handleChange}
                className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white font-bold text-sm outline-none transition-colors"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
              </select>
              <input
                name="city" value={form.city} onChange={handleChange}
                type="text" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors"
                placeholder="City *"
              />
            </div>
            <input
              name="address" value={form.address} onChange={handleChange}
              type="text" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors"
              placeholder="Street Address *"
            />
            <input
              name="phone" value={form.phone} onChange={handleChange}
              type="tel" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors"
              placeholder="Phone Number * (e.g. +234 800 000 0000)"
            />
            <input
              name="whatsapp" value={form.whatsapp} onChange={handleChange}
              type="tel" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors"
              placeholder="WhatsApp Number (optional — defaults to phone)"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="openTime" value={form.openTime} onChange={handleChange}
                type="text" className="w-full p-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors"
                placeholder="Opens at (e.g. 8am) *"
              />
              <input
                name="closeTime" value={form.closeTime} onChange={handleChange}
                type="text" className="w-full p-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors"
                placeholder="Closes at (e.g. 6pm) *"
              />
            </div>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows="3" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm resize-none outline-none transition-colors"
              placeholder="Short Description of your business *"
            />
            <button
              onClick={handleRegister}
              className="w-full py-4 md:py-5 bg-[#008751] text-white rounded-xl md:rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-800 active:scale-[0.99] transition-all"
            >
              Next: Media Upload <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 2: Media Upload */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              {/* Shop Photo */}
              <input ref={shopPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleShopPhoto} />
              <div
                onClick={() => shopPhotoInputRef.current.click()}
                className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[#008751] hover:bg-white transition-all cursor-pointer group overflow-hidden"
              >
                {shopPhotoPreview ? (
                  <img src={shopPhotoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl shadow" />
                ) : (
                  <>
                    <Camera size={32} className="mb-2 group-hover:scale-110 text-gray-400 group-hover:text-[#008751] transition-all duration-300" />
                    <span className="text-xs font-black text-gray-600">Upload Shop Cover Photo (Required)</span>
                    <span className="text-[10px] text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                  </>
                )}
              </div>

              {/* Certificate */}
              <input ref={certInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleCertificate} />
              <div
                onClick={() => certInputRef.current.click()}
                className="border-2 border-dashed border-gray-200 bg-gray-50/30 rounded-2xl p-6 flex items-center gap-4 text-gray-400 hover:border-[#008751] hover:bg-white transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                  <FileText size={20} className={certificate ? 'text-[#008751]' : 'text-gray-400 group-hover:text-[#008751] transition-colors'} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black block text-gray-600">Business Certificate / CAC (Optional)</span>
                  {certificateName && <span className="text-[10px] text-[#008751] font-bold mt-0.5 block animate-in fade-in">{certificateName}</span>}
                </div>
                <Upload size={18} className="text-gray-400 group-hover:text-[#008751] transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-black transition-colors">Back</button>
              <button onClick={handleMediaNext} className="flex-[2] py-4 bg-[#008751] text-white rounded-xl font-black shadow-lg hover:bg-emerald-800 active:scale-[0.99] transition-all">
                Next: Select Plan
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Plan & Payment */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedPlan('basic')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-[1.02] ${selectedPlan === 'basic' ? 'border-[#008751] bg-emerald-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <ShieldCheck size={24} className={selectedPlan === 'basic' ? 'text-[#008751]' : 'text-gray-300'} />
                <span className="font-black text-gray-900 block mt-3 text-base">Basic Listing</span>
                <div className="text-2xl font-black text-gray-900 mt-1">₦5,000</div>
                <p className="text-xs text-gray-500 mt-1 font-medium">12-month listing, standard placement</p>
              </div>

              <div
                onClick={() => setSelectedPlan('featured')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-[1.02] ${selectedPlan === 'featured' ? 'border-[#FFC107] bg-amber-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <Zap size={24} className={selectedPlan === 'featured' ? 'text-[#FFC107]' : 'text-gray-300'} />
                <span className="font-black text-gray-900 block mt-3 text-base">Featured Placement</span>
                <div className="text-2xl font-black text-gray-900 mt-1">₦10,000</div>
                <p className="text-xs text-gray-500 mt-1 font-medium">Priority placement, homepage visibility</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-5 text-sm space-y-2 border border-gray-100">
              <div className="flex justify-between font-bold text-gray-600">
                <span>Business</span><span className="text-gray-900 truncate max-w-[180px]">{form.name}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-600">
                <span>Plan Package</span><span className="capitalize text-[#008751] font-black bg-emerald-50 px-2 py-0.5 rounded text-xs">{selectedPlan}</span>
              </div>
              <div className="flex justify-between font-black text-base text-gray-900 pt-3 border-t border-gray-200/60 mt-2">
                <span>Total Due</span><span className="text-[#008751]">₦{selectedPlan === 'featured' ? '10,000' : '5,000'}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={() => setStep(2)} className="w-full md:w-1/3 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl font-black transition-colors" disabled={submitting}>
                Back
              </button>
              <button
                onClick={handleSubmitAndPay}
                disabled={submitting}
                className="w-full md:w-2/3 py-4 bg-[#008751] text-white rounded-xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-emerald-800 active:scale-[0.99] transition-all"
              >
                {submitting ? <><RefreshCw size={18} className="animate-spin" /> Processing Infrastructure...</> : 'Pay & List Business'}
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
    <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">About NaijaBizFind</h1>
    <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed space-y-6">
      <p className="text-xl font-medium text-gray-800">NaijaBizFind is Nigeria's premier local business directory, dedicated to connecting quality service providers with customers in every neighborhood.</p>
      <p>Our platform was born from a simple observation: many of Nigeria's most talented artisans and small business owners have no online presence. We bridge that gap by providing a professional, easy-to-use directory where tailors, mechanics, salons, and local vendors can be discovered by people in their cities.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <h3 className="text-[#008751] font-black text-xl mb-4">Our Mission</h3>
          <p className="font-medium text-emerald-800">To empower small businesses in Nigeria by providing them with a digital footprint and direct access to a wider customer base.</p>
        </div>
        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 shadow-sm">
          <h3 className="text-amber-800 font-black text-xl mb-4">Our Vision</h3>
          <p className="font-medium text-amber-900">To become the most trusted and comprehensive resource for finding reliable local services across all 36 states of Nigeria.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- VIEW: PRIVACY ---
const PrivacyView = () => (
  <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in duration-500">
    <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Privacy Policy</h1>
    <div className="text-gray-600 space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">1. Information We Collect</h2>
        <p>When you register a business, we collect your business name, contact details, physical address, and any media you upload. For users searching the directory, we may collect location data to provide local results.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">2. How We Use Your Information</h2>
        <p>Information provided in business listings is made public to allow customers to find and contact you. We use your contact details to send notifications regarding your listing status and payment confirmations.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">3. Payment Security</h2>
        <p>Payments are processed through Paystack. We do not store your credit card or bank details on our servers.</p>
      </section>
    </div>
  </div>
);

// --- VIEW: TERMS ---
const TermsView = () => (
  <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in duration-500">
    <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Terms & Conditions</h1>
    <div className="text-gray-600 space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">1. Listing Verification</h2>
        <p>All business listings are subject to verification. NaijaBizFind reserves the right to reject or remove listings that are fraudulent, illegal, or violate our community standards.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">2. Payment & Refunds</h2>
        <p>Listing fees are non-refundable once the business listing has been reviewed and published. Basic listings stay active for 12 months unless otherwise specified.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">3. User Conduct</h2>
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
          <CheckCircle size={64} className="text-[#008751] mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 text-sm font-semibold mb-8">Your business has been submitted for admin review. You'll be visible once approved.</p>
          <button onClick={() => onNavigate('home')} className="bg-[#008751] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-800 transition-all">Back to Home</button>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-500 text-sm font-semibold mb-8">We couldn't verify your payment. Please contact support with your payment reference.</p>
          <button onClick={() => onNavigate('home')} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Back to Home</button>
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
  
  // Custom Dynamic State for Page Toggling Animations
  const [isTogglingPage, setIsTogglingPage] = useState(false);

  const navigate = (p, opts = {}) => {
    // Access-Control Route Guard check for Normal Shoppers
    if (p === 'submit') {
      const activeRole = localStorage.getItem('userRole');
      if (activeRole !== 'owner') {
        alert("Access Notice: Standard Explorer accounts cannot submit businesses. Please sign up or authenticate with a dedicated Business Owner workspace to unlock listings execution.");
        window.location.href = '/signup?role=owner';
        return;
      }
    }

    // Initialize View Switch Animation Sequence Loop
    setIsTogglingPage(true);
    setTimeout(() => {
      setPage(p);
      setSelectedBiz(null);
      setIsMenuOpen(false);
      setDirectoryOptions(opts);
      window.scrollTo(0, 0);
      setIsTogglingPage(false);
    }, 400);
  };

  const handleSelectBusiness = (biz) => {
    setSelectedBiz(biz);
    navigate('detail');
  };

  // Secure Sign-Out Sequence
  const handleClearSession = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100 relative">
      
      {/* GLOBAL TAB TRANSITION LOADER SYSTEM */}
      {isTogglingPage && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-md z-[9999] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 size={40} className="text-[#008751] animate-spin mb-2" />
          <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Synchronizing Data Modules</p>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 md:py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => navigate('home')} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-[#008751] rounded-lg flex items-center justify-center text-white font-black italic text-lg shadow-inner group-hover:rotate-12 transition-transform duration-300">N</div>
            <span className="text-base md:text-lg font-black tracking-tighter text-[#008751]">NaijaBizFind</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigate('home')} className={`text-[11px] font-black transition-colors tracking-wide ${page === 'home' ? 'text-[#008751]' : 'text-gray-400 hover:text-gray-600'}`}>HOME</button>
            <button onClick={() => navigate('directory')} className={`text-[11px] font-black transition-colors tracking-wide ${page === 'directory' ? 'text-[#008751]' : 'text-gray-400 hover:text-gray-600'}`}>DIRECTORY</button>
            <button onClick={() => navigate('submit')} className="bg-[#008751] text-white px-5 py-2 rounded-lg text-xs font-black shadow-md hover:bg-emerald-800 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all">List Business</button>
            <button onClick={handleClearSession} className="text-[11px] font-black text-red-500 hover:text-red-700 tracking-wide flex items-center gap-1 transition-colors uppercase">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-4 duration-200">
            <button onClick={() => navigate('home')} className="text-left font-black text-[11px] uppercase text-gray-600 py-2 border-b border-gray-50">Home</button>
            <button onClick={() => navigate('directory')} className="text-left font-black text-[11px] uppercase text-gray-600 py-2 border-b border-gray-50">Browse Directory</button>
            <button onClick={() => navigate('submit')} className="w-full bg-[#008751] text-white py-4 rounded-xl font-black uppercase text-xs mt-2 shadow-lg hover:bg-emerald-800 transition-colors">List My Business</button>
            <button onClick={handleClearSession} className="text-left font-black text-[11px] uppercase text-red-500 py-2 transition-colors">Sign Out From Account</button>
          </div>
        )}
      </nav>

      {/* PAGE ROUTER */}
      <main>
        {page === 'home' && <HomeView onNavigate={navigate} onSelectBusiness={handleSelectBusiness} />}
        {page === 'directory' && <DirectoryView onSelectBusiness={handleSelectBusiness} initialCategory={directoryOptions.category} initialCity={directoryOptions.cityFilter} />}
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
