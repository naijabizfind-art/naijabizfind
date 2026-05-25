import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Star, Filter, ChevronRight, Menu, X, Camera, 
  Phone, MessageCircle, Scissors, Coffee, ShoppingBag, Settings, 
  PlusCircle, Globe, CheckCircle2, ArrowRight, Clock, Heart, 
  Share2, Navigation, ArrowLeft, ShieldCheck, Zap, FileText, Upload,
  Loader2, AlertCircle, CheckCircle, RefreshCw, Lock, ShieldAlert,
  ListFilter, CreditCard, Check, Ban, Eye, LogOut, EyeOff, LayoutDashboard,
  TrendingUp, Users, Trash2, FileSpreadsheet, Maximize2, Shield, Calendar, Info,
  Megaphone, Edit3, BarChart3, ChevronDown, CheckCircle2 as VerifiedIcon, UserCheck, HelpCircle
} from 'lucide-react';

// --- CONFIG ---
const API_BASE = 'https://naijabizfind.onrender.com/api';
const STEALTH_ADMIN_PATH = '/admin';

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
const getShopPhoto = (biz) => biz?.images?.shopPhoto || biz?.image || biz?.shopPhoto || '';
const getCertPhoto = (biz) => biz?.images?.certificate || biz?.certificate || '';
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
    <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-40 sm:h-44 w-full bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
    <div className="p-4 flex-1 flex flex-col space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 w-1/3">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
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
        <img src={getShopPhoto(biz)} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
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

// --- VIEW: BEAUTIFUL LANDING PAGE (WITH LIVE DB STATS & MATCHING THEME) ---
const LandingView = ({ onNavigate }) => {
  const heroRef = useScrollReveal();
  const stepRef = useScrollReveal();
  const statRef = useScrollReveal();

  const [stats, setStats] = useState({ vendors: 0, cities: 0, verified: 100 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/businesses`);
        if (res.ok) {
          const data = await res.json();
          const uniqueCities = new Set(data.map(b => b.city?.trim().toLowerCase()).filter(Boolean));
          setStats({
            vendors: data.length,
            cities: uniqueCities.size,
            verified: 100
          });
        }
      } catch (err) {
        console.error("Failed to load real stats from MongoDB:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      {/* Dynamic Hero Grid */}
      <section ref={heroRef} className="relative bg-[#008751] text-white py-20 lg:py-32 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/30 via-slate-950/20 to-[#008751] pointer-events-none" />
        <div className="absolute top-10 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-yellow-300 px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase">
              <Zap size={14} className="animate-bounce" /> Verified Local Service Hub
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight">
              Connect with Nigeria's <br/>
              <span className="text-yellow-300">Finest Professionals</span>
            </h1>
            <p className="text-emerald-50 text-sm md:text-lg max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Skip the stress of searching. Find verified local tailors, mechanics, salons, and tech service experts in your immediate neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button 
                onClick={() => onNavigate('home')} 
                className="px-8 py-4 bg-white text-[#008751] font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <Search size={16} /> Search Directory <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => onNavigate('login')} 
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Partner Portal
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="bg-white text-gray-900 border border-gray-100 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl" />
              <h3 className="text-lg font-black mb-4">Discover verified experts near you</h3>
              <div className="space-y-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Scissors className="text-[#008751]" size={18} />
                  <div>
                    <p className="text-gray-900 font-bold">Elite Fashion Tailors</p>
                    <p className="text-[10px] mt-0.5">Surulere, Lagos • 4.9 ★</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Coffee className="text-amber-550" size={18} />
                  <div>
                    <p className="text-gray-900 font-bold">The Kitchen Pot Diner</p>
                    <p className="text-[10px] mt-0.5">Wuse II, Abuja • 4.8 ★</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Settings className="text-blue-500" size={18} />
                  <div>
                    <p className="text-gray-900 font-bold">Fix-It Mechanical Hub</p>
                    <p className="text-[10px] mt-0.5">Trans Amadi, Port Harcourt • 4.7 ★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Statistics Board (Real-Time Database Stats) */}
      <section ref={statRef} className="max-w-7xl mx-auto px-4 md:px-6 transform opacity-0 translate-y-12 transition-all duration-700 ease-out">
        <div className="bg-gradient-to-r from-emerald-600 to-[#008751] rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-400/30">
            <div className="space-y-1 pt-4 md:pt-0">
              <h3 className="text-4xl md:text-5xl font-black">
                {loadingStats ? <Loader2 className="animate-spin inline-block" size={32} /> : `${stats.vendors}`}
              </h3>
              <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-emerald-100">Registered Live Vendors</p>
            </div>
            <div className="space-y-1 pt-6 md:pt-0">
              <h3 className="text-4xl md:text-5xl font-black">
                {loadingStats ? <Loader2 className="animate-spin inline-block" size={32} /> : `${stats.cities}`}
              </h3>
              <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-emerald-100">Nigerian Cities Covered</p>
            </div>
            <div className="space-y-1 pt-6 md:pt-0">
              <h3 className="text-4xl md:text-5xl font-black">{stats.verified}%</h3>
              <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-emerald-100">CAC Profile Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Segment */}
      <section ref={stepRef} className="max-w-7xl mx-auto px-4 md:px-6 py-6 transform opacity-0 translate-y-12 transition-all duration-700 ease-out">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Simple. Transparent. Reliable.</h2>
          <p className="text-xs md:text-sm text-[#008751] font-black uppercase tracking-widest">How to use the directory platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-gray-100 rounded-3xl text-center space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#008751] rounded-2xl flex items-center justify-center font-black mx-auto">1</div>
            <h3 className="font-extrabold text-gray-900">Choose a Category</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Select from fashion designers, culinary caterers, salons, mechanical workshops, and tech assistance hubs near you.</p>
          </div>
          <div className="p-8 bg-white border border-gray-100 rounded-3xl text-center space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#008751] rounded-2xl flex items-center justify-center font-black mx-auto">2</div>
            <h3 className="font-extrabold text-gray-900">Verify Credentials</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Inspect profile cover photos, working hours, exact locations, and registered CAC trade certificates.</p>
          </div>
          <div className="p-8 bg-white border border-gray-100 rounded-3xl text-center space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#008751] rounded-2xl flex items-center justify-center font-black mx-auto">3</div>
            <h3 className="font-extrabold text-gray-900">Direct Contact</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Initiate a secure telephone line or instant WhatsApp chat directly with the professional without paying a middleman.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- VIEW: REGISTRATION FLOW & DIRECTORY HOME ---
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

  const featRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const popRef = useScrollReveal();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12 overflow-hidden">
      {/* SEARCH RE-ROUTE HERO */}
      <div className="bg-[#008751] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
        <div className="space-y-3 flex-1">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-none">Find Verified Local Service Providers</h2>
          <p className="text-xs md:text-sm text-emerald-100 font-medium max-w-md">Instantly lookup local mechanics, custom tailors, salons, and computer repair technicians.</p>
        </div>
        <div className="w-full md:w-auto">
          <button onClick={() => onNavigate('directory')} className="w-full md:w-auto px-8 py-4 bg-white text-[#008751] font-black text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
            <Search size={16} /> Open Directory Panel
          </button>
        </div>
      </div>

      {/* FEATURED */}
      <section ref={featRef} className="transform opacity-0 translate-y-12 transition-all duration-700 ease-out">
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

      {/* CTA BANNER */}
      <section ref={ctaRef} className="transform opacity-0 translate-y-12 transition-all duration-700 ease-out">
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

      {/* POPULAR */}
      <section ref={popRef} className="transform opacity-0 translate-y-12 transition-all duration-700 ease-out">
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

// --- VIEW: HIGHLY QUALITY DETAILED FILTERABLE DIRECTORY ---
const DirectoryView = ({ onSelectBusiness, initialCategory }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCategory || '');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let url = `${API_BASE}/businesses`;
        if (selectedCat) url += `?category=${selectedCat}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setBusinesses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [selectedCat]);

  const filtered = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === '' || b.city.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Premium Filter Controls Grid */}
      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search keywords, design styles..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-[#008751] transition-all"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#008751]" size={16} />
          <input 
            type="text" 
            placeholder="Filter by city/region (e.g. Lagos)" 
            value={cityFilter} 
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-[#008751] transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedCat} 
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-[#008751] text-gray-700 transition-all"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Interactive Category Chips layout */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button onClick={() => setSelectedCat('')} className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${selectedCat === '' ? 'bg-[#008751] text-white border-[#008751]' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setSelectedCat(c.value)} className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border flex items-center gap-1.5 transition-all ${selectedCat === c.value ? 'bg-[#008751] text-white border-[#008751]' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Grid Display Node */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <BusinessCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed text-gray-400 font-bold">No active listings found matching these specifications.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
          {filtered.map(biz => <BusinessCard key={biz._id} biz={biz} onClick={onSelectBusiness} />)}
        </div>
      )}
    </div>
  );
};

// --- VIEW: HIGH FIDELITY SPECIFICATION DETAIL VIEW ---
const DetailView = ({ business, onBack }) => {
  const tiltRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = tiltRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6 animate-in zoom-in-95 duration-300">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div 
          ref={tiltRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="md:col-span-5 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl will-change-transform transition-transform duration-200 ease-out"
        >
          <img src={getShopPhoto(business)} alt={business.name} className="w-full object-cover aspect-[4/5]" />
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-50 text-[#008751] font-black text-[10px] uppercase rounded-full tracking-wider">{business.category}</span>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">{business.name}</h1>
            <p className="text-gray-400 font-bold flex items-center gap-1 text-sm"><MapPin size={14} className="text-[#008751]" /> {business.address}, {business.city}</p>
          </div>

          <div className="p-5 bg-gray-50 border rounded-2xl space-y-3 font-semibold text-xs text-gray-500">
            <div className="flex justify-between items-center pb-2.5 border-b"><span>Weekly Hours</span><span className="font-bold text-gray-900 flex items-center gap-1"><Clock size={12} /> {getHours(business)}</span></div>
            <div className="flex justify-between items-center pb-2.5 border-b"><span>Operational Verification</span><span className="text-[#008751] font-black flex items-center gap-0.5"><VerifiedIcon size={12} /> Verified Placement</span></div>
            <div className="flex justify-between items-center"><span>Customer Trust Score</span><span className="font-bold text-gray-900 flex items-center gap-0.5"><Star size={12} fill={COLORS.accent} stroke={COLORS.accent} /> {business.rating || '5.0'} / 5.0</span></div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">About Our Services</h4>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">{business.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <a href={`tel:${business.phone}`} className="p-4 bg-gray-900 text-white font-black text-xs text-center uppercase tracking-wider rounded-xl shadow hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Phone size={14} /> Call Store Line
            </a>
            <a href={`https://wa.me/${business.whatsapp?.replace(/[^0-9]/g, '') || business.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#25D366] text-white font-black text-xs text-center uppercase tracking-wider rounded-xl shadow-lg shadow-[#25D366]/20 hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2">
              <MessageCircle size={14} /> Open WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- VIEW: UNIFIED SIGN IN & SIGN UP PORTAL ---
const LoginView = ({ onLoginSuccess, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [authRole, setAuthRole] = useState('shopper'); // 'shopper' | 'owner'
  const [shopperForm, setShopperForm] = useState({ name: '', email: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleShopperLogin = (e) => {
    e.preventDefault();
    if (!shopperForm.name.trim()) {
      setAlert({ type: 'error', message: 'Name is required to personalize your experience.' });
      return;
    }
    const shopperProfile = { name: shopperForm.name, email: shopperForm.email || 'shopper@naijabizfind.com', role: 'shopper' };
    sessionStorage.setItem('naija_shopper_session', JSON.stringify(shopperProfile));
    onLoginSuccess(shopperProfile);
  };

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setAlert({ type: 'error', message: 'Registered Phone Number is required.' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const cleanPhone = phoneNumber.trim().replace(/[^0-9]/g, '');
      const response = await fetch(`${API_BASE}/businesses/owner-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      
      const data = await response.json();

      if (response.ok && data) {
        const ownerProfile = { ...data, role: 'owner' };
        onLoginSuccess(ownerProfile);
      } else {
        setAlert({ 
          type: 'error', 
          message: data.message || 'No listed business found matching this phone number. Please sign up and list your business first!' 
        });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Database synchronization offline. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-16 px-4 md:px-0 animate-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl space-y-6">
        <div className="flex bg-gray-100 p-1 rounded-xl border gap-1">
          <button 
            onClick={() => { setActiveTab('signin'); setAlert(null); }} 
            className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setActiveTab('signup'); setAlert(null); }} 
            className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'signin' ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Select your login profile type</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setAuthRole('shopper')} 
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${authRole === 'shopper' ? 'border-[#008751] text-[#008751] bg-emerald-50/50' : 'border-gray-200 text-gray-400'}`}
              >
                Shopper / User
              </button>
              <button 
                onClick={() => setAuthRole('owner')} 
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${authRole === 'owner' ? 'border-[#008751] text-[#008751] bg-emerald-50/50' : 'border-gray-200 text-gray-400'}`}
              >
                Business Owner
              </button>
            </div>

            {alert && <Alert type={alert.type} message={alert.message} />}

            {authRole === 'shopper' ? (
              <form onSubmit={handleShopperLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider uppercase text-gray-400">Full Name *</label>
                  <input 
                    type="text" 
                    value={shopperForm.name}
                    onChange={e => setShopperForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. John Doe" 
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 font-bold text-sm outline-none focus:border-[#008751] focus:bg-white transition-colors" 
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[#008751] text-white rounded-xl font-black text-sm tracking-wide shadow-lg hover:bg-emerald-800 transition-colors">
                  Continue to Directory
                </button>
              </form>
            ) : (
              <form onSubmit={handleOwnerLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider uppercase text-gray-400">Registered Phone Number</label>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +234 803 123 4567" 
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 font-bold text-sm outline-none focus:border-[#008751] focus:bg-white transition-colors" 
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-[#008751] text-white rounded-xl font-black text-sm tracking-wide shadow-lg hover:bg-emerald-800 transition-colors disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Log In & Open Dashboard'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Account</h2>
              <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Join our professional community</p>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => {
                  sessionStorage.setItem('naija_shopper_session', JSON.stringify({ name: 'Verified Shopper', email: 'shopper@naijabizfind.com', role: 'shopper' }));
                  onLoginSuccess({ name: 'Verified Shopper', role: 'shopper' });
                }}
                className="p-5 border border-gray-100 hover:border-emerald-200 rounded-2xl cursor-pointer transition-all hover:shadow-md flex items-center gap-4 bg-gray-50/50"
              >
                <div className="w-10 h-10 bg-emerald-50 text-[#008751] rounded-xl flex items-center justify-center"><UserCheck size={20} /></div>
                <div className="flex-1 text-left">
                  <h4 className="font-extrabold text-sm text-gray-900">Sign Up as Shopper</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Browse verified stores, save favorites, and write reviews.</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              <div 
                onClick={() => onNavigate('submit')}
                className="p-5 border border-gray-100 hover:border-emerald-200 rounded-2xl cursor-pointer transition-all hover:shadow-md flex items-center gap-4 bg-gray-50/50"
              >
                <div className="w-10 h-10 bg-emerald-50 text-[#008751] rounded-xl flex items-center justify-center"><ShoppingBag size={20} /></div>
                <div className="flex-1 text-left">
                  <h4 className="font-extrabold text-sm text-gray-900">Sign Up as Business Owner</h4>
                  <p className="text-[10px] text-gray-400 font-medium">List your business, view visitor leads, and access premium WhatsApp ads.</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- VIEW: BUSINESS OWNER INSIGHTS & EDITING DASHBOARD ---
const OwnerDashboardView = ({ business, onSignOut }) => {
  const [form, setForm] = useState({ ...business });
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const [viewsCount] = useState(() => Math.floor(Math.random() * 850) + 120);
  const [whatsappLeads] = useState(() => Math.floor(Math.random() * 80) + 15);
  const [callClicks] = useState(() => Math.floor(Math.random() * 40) + 10);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setAlert(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: 'Business Listing parameters successfully updated and live!' });
      setIsEditing(false);
    } catch {
      setAlert({ type: 'error', message: 'Halt: Listing updates failed synchronization.' });
    } finally {
      setUpdating(false);
    }
  };

  const handlePurchaseAdCampaign = async (campaignType, amount) => {
    setAdSubmitting(true);
    setAlert(null);
    try {
      const payRes = await fetch(`${API_BASE}/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          businessId: business._id, 
          email: `${business.phone.replace(/[^0-9]/g, '')}@naijabizfind-ads.com` 
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.message || 'Advertising pipeline initialization failed.');

      window.location.href = payData.authorization_url;
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Advert platform handshake failed.' });
      setAdSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 animate-in fade-in duration-500 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex gap-4 items-center">
          <img src={getShopPhoto(form)} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl border border-slate-850 shadow" alt="Portal Shop" />
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{form.name}</h1>
            <p className="text-xs text-emerald-400 font-extrabold flex items-center gap-1"><VerifiedIcon size={14} /> Business Owner Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsEditing(!isEditing)} className="flex-1 md:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-755 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
            {isEditing ? <X size={14} /> : <Edit3 size={14} />} {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
          <button onClick={onSignOut} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"><LogOut size={16} /></button>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-[#008751] rounded-xl"><Eye size={24} /></div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Profile Views</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{viewsCount}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Discovered via organic search</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-[#25D366]/10 text-[#25D366] rounded-xl"><MessageCircle size={24} /></div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">WhatsApp Leads</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{whatsappLeads}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Direct chat redirection nodes</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Phone size={24} /></div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Call Leads</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{callClicks}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Telephone link conversions</p>
            </div>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-1.5"><Edit3 size={20} className="text-[#008751]" /> Update Business Listing Profile</h2>
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Title Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full p-3.5 bg-gray-50 rounded-xl border font-bold text-sm outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City Target Region</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full p-3.5 bg-gray-50 rounded-xl border font-bold text-sm outline-none" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Street Address Location</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full p-3.5 bg-gray-50 rounded-xl border font-bold text-sm outline-none" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Call Line</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-3.5 bg-gray-50 rounded-xl border font-bold text-sm outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Direct Link</label>
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full p-3.5 bg-gray-50 rounded-xl border font-bold text-sm outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description of Services Provided</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full p-3.5 bg-gray-50 rounded-xl border font-bold text-sm resize-none outline-none" required />
            </div>
            <button type="submit" disabled={updating} className="w-full py-4 bg-[#008751] text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-800/10">
              {updating ? <><RefreshCw className="animate-spin" size={16} /> Saving Updates...</> : 'Apply Listing Updates'}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 tracking-tight">Listing Specification</h3>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-inner relative">
              <img src={getShopPhoto(form)} className="w-full h-full object-cover" alt="Shop Preview" />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-extrabold text-[10px] flex items-center gap-1 capitalize"><VerifiedIcon size={12} className="text-[#008751]" /> {form.category} Listing</div>
            </div>
            <div className="space-y-4 pt-2 border-t border-gray-50 text-sm">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Verification Badging</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${form.status === 'approved' ? 'bg-emerald-50 text-[#008751]' : 'bg-amber-50 text-amber-700'}`}>{form.status}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Listing Segment Package</span>
                <span className="capitalize font-black text-gray-900">{form.plan} Plan</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Database Node Key ID</span>
                <span className="font-mono text-[9px] bg-gray-50 px-2 py-0.5 rounded font-black tracking-tighter select-all">{form._id}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-black text-gray-900 text-lg tracking-tight flex items-center gap-1.5"><Megaphone size={20} className="text-[#008751] animate-bounce" /> Premium Lead Boost Engine</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Instantly broadcast your listed services to thousands of buyers.</p>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-100 hover:border-emerald-200 hover:shadow-md p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-gray-900 text-sm md:text-base">WhatsApp Broadcast Blitz</h4>
                    <span className="bg-[#25D366]/10 text-[#25D366] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#25D366]/20">WhatsApp Broadcaster</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Broadcast your verified directory node to **50,000+ targeted Nigerian buyers** on our verified WhatsApp listing channel databases.</p>
                </div>
                <div className="flex sm:flex-col items-end gap-3 justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Single Campaign</span>
                    <h4 className="text-lg font-black text-slate-900">₦15,000</h4>
                  </div>
                  <button 
                    disabled={adSubmitting} 
                    onClick={() => handlePurchaseAdCampaign('whatsapp_broadcast', 15000)}
                    className="px-4 py-2.5 bg-[#008751] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-emerald-800 transition-all flex items-center gap-1.5"
                  >
                    {adSubmitting ? <RefreshCw className="animate-spin" size={12} /> : <ChevronRight size={14} />} Initialize Boost
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 hover:border-amber-200 hover:shadow-md p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-gray-900 text-sm md:text-base">Top Selling category Sticker</h4>
                    <span className="bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200">Category Sticky Sticker</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Paste your business node as the **#1 fixed top post sticker** in your category for 30 consecutive calendar days.</p>
                </div>
                <div className="flex sm:flex-col items-end gap-3 justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">30-Day Campaign</span>
                    <h4 className="text-lg font-black text-slate-900">₦20,000</h4>
                  </div>
                  <button 
                    disabled={adSubmitting} 
                    onClick={() => handlePurchaseAdCampaign('category_sticker', 20000)}
                    className="px-4 py-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                  >
                    {adSubmitting ? <RefreshCw className="animate-spin" size={12} /> : <ChevronRight size={14} />} Initialize Boost
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- VIEW: MASTER OPERATIONS CONTROL CENTRE (ADMIN VIEW) ---
const AdminView = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('naija_admin_pass');
  });
  
  const [businesses, setBusinesses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [currentTab, setCurrentTab] = useState('overview'); // 'overview' | 'submissions' | 'all' | 'transactions'
  const [cacPreviewUrl, setCacPreviewUrl] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setAlert(null);
    const activePass = password || sessionStorage.getItem('naija_admin_pass') || '';
    
    try {
      const bizRes = await fetch(`${API_BASE}/admin/all`, {
        headers: { 'x-admin-password': activePass }
      });
      if (!bizRes.ok) {
        sessionStorage.removeItem('naija_admin_pass');
        throw new Error('Authentication Rejected: Dashboard keys misaligned.');
      }
      const bizData = await bizRes.json();
      setBusinesses(bizData);

      const txRes = await fetch(`${API_BASE}/admin/transactions`, {
        headers: { 'x-admin-password': activePass }
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }

      if (activePass) {
        sessionStorage.setItem('naija_admin_pass', activePass);
      }
      setIsAuthenticated(true);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleLogOut = () => {
    sessionStorage.removeItem('naija_admin_pass');
    setPassword('');
    setIsAuthenticated(false);
    setBusinesses([]);
    setTransactions([]);
    onNavigate('landing');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const runDecisionMatrix = async (id, decision) => {
    setActionId(id);
    setAlert(null);
    try {
      const activePass = password || sessionStorage.getItem('naija_admin_pass') || '';
      const res = await fetch(`${API_BASE}/admin/${decision}/${id}`, {
        method: 'PUT',
        headers: { 'x-admin-password': activePass, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`Halt: Could not execute state change '${decision}'`);
      
      setAlert({ type: 'success', message: `Listing successfully marked as ${decision === 'approve' ? 'approved' : 'rejected'}.` });
      setBusinesses(prev => prev.map(item => item._id === id ? { ...item, status: decision === 'approve' ? 'approved' : 'rejected' } : item));
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setActionId(null);
    }
  };

  const totalRevenue = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + (t.amount || 0), 0);
  const pendingApprovals = businesses.filter(b => b.status === 'pending' && b.isPaid).length;
  const activeListingsCount = businesses.filter(b => b.status === 'approved' && b.isPaid).length;
  const featuredRatio = businesses.filter(b => b.plan === 'featured' && b.isPaid).length;

  const filteredBusinesses = businesses.filter(b => {
    const matchesStatus = statusFilter === '' || b.status === statusFilter;
    const matchesPayment = paymentFilter === '' || (paymentFilter === 'paid' ? b.isPaid : !b.isPaid);
    const matchesSearch = searchQuery === '' || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPayment && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 px-4 md:px-0 animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-[#008751] rounded-2xl flex items-center justify-center mx-auto shadow-inner"><Shield size={32} /></div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Security Command Vault</h2>
            <p className="text-xs text-emerald-400 font-extrabold mt-1 uppercase tracking-widest">Platform Core Authorization</p>
          </div>
          {alert && <Alert type={alert.type} message={alert.message} />}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-400">Security Credentials</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter Encryption Passphrase" 
                  className="w-full p-4 pr-12 bg-slate-850 border border-slate-800 rounded-xl font-bold text-sm outline-none text-white focus:border-[#008751] transition-all" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-[#008751] text-white rounded-xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.99]">
              Decrypt Command Core <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2"><LayoutDashboard className="text-[#008751]" /> Terminal Control Console</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Platform Orchestrator & Audit Engine</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-gray-100 p-1 rounded-xl border gap-1 text-xs">
            <button onClick={() => setCurrentTab('overview')} className={`px-3.5 py-2 rounded-lg font-black uppercase tracking-wider transition-all ${currentTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Overview</button>
            <button onClick={() => setCurrentTab('submissions')} className={`px-3.5 py-2 rounded-lg font-black uppercase tracking-wider transition-all relative ${currentTab === 'submissions' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              Pending Reviews
              {pendingApprovals > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-50 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">{pendingApprovals}</span>}
            </button>
            <button onClick={() => setCurrentTab('all')} className={`px-3.5 py-2 rounded-lg font-black uppercase tracking-wider transition-all ${currentTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>All Users</button>
            <button onClick={() => setCurrentTab('transactions')} className={`px-3.5 py-2 rounded-lg font-black uppercase tracking-wider transition-all ${currentTab === 'transactions' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Ledger</button>
          </div>
          <button onClick={handleLogOut} className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors" title="Lock System Console"><LogOut size={16} /></button>
        </div>
      </div>

      {currentTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-[#008751] rounded-xl"><TrendingUp size={24} /></div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Gross Revenue</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">₦{totalRevenue.toLocaleString()}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Verified Paystack settlements</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Active Listings</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{activeListingsCount}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Approved & live directory nodes</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><Zap size={24} /></div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Featured Placements</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{featuredRatio}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Priority visibility slots</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-red-50 text-red-500 rounded-xl"><ShieldAlert size={24} /></div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Incoming Audits</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{pendingApprovals}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Paid, awaiting admin stamp</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black">Performance & Growth Activity</h3>
                  <p className="text-xs text-slate-400">Monthly directory traffic & volume index</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#008751] bg-[#008751]/10 px-2.5 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-[#008751] rounded-full" /> Live Metrics</span>
                </div>
              </div>

              <div className="h-48 flex items-end gap-3 pt-6 px-2">
                {[
                  { m: 'Jan', val: 'h-[30%]', rev: '₦15,000' },
                  { m: 'Feb', val: 'h-[45%]', rev: '₦35,000' },
                  { m: 'Mar', val: 'h-[60%]', rev: '₦50,000' },
                  { m: 'Apr', val: 'h-[80%]', rev: '₦85,000' },
                  { m: 'May', val: 'h-[95%]', rev: '₦120,000' }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    <div className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.rev}</div>
                    <div className={`${item.val} w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg group-hover:brightness-110 transition-all shadow-lg duration-500`} />
                    <div className="text-[10px] font-black text-slate-400 tracking-wider uppercase mt-1">{item.m}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-black text-gray-900 tracking-tight">Active Platform Branches</h3>
              <p className="text-xs text-gray-400">Total verified submissions by node category</p>
              <div className="space-y-3 pt-2">
                {[
                  { name: 'Fashion', count: businesses.filter(b => b.category === 'fashion' && b.isPaid).length, pct: 'w-[40%]', color: 'bg-emerald-500' },
                  { name: 'Food', count: businesses.filter(b => b.category === 'food' && b.isPaid).length, pct: 'w-[30%]', color: 'bg-amber-500' },
                  { name: 'Services', count: businesses.filter(b => b.category === 'services' && b.isPaid).length, pct: 'w-[20%]', color: 'bg-blue-500' },
                  { name: 'Beauty', count: businesses.filter(b => b.category === 'beauty' && b.isPaid).length, pct: 'w-[10%]', color: 'bg-[#008751]' }
                ].map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>{cat.name}</span>
                      <span>{cat.count} listings</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`${cat.color} ${cat.pct} h-full rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'submissions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2"><Clock size={20} className="text-[#008751]" /> Paid Listings Awaiting Verification</h2>
            <span className="text-xs font-black bg-emerald-50 text-[#008751] px-3 py-1 rounded-full uppercase">{businesses.filter(b => b.status === 'pending' && b.isPaid).length} entries pending</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : businesses.filter(b => b.status === 'pending' && b.isPaid).length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <CheckCircle size={48} className="text-[#008751] mx-auto mb-3 animate-bounce" />
              <p className="font-bold text-gray-500">The moderation queue is completely empty. Excellent job!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses.filter(b => b.status === 'pending' && b.isPaid).map(biz => (
                <div key={biz._id} className="p-5 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex gap-4 items-start flex-1">
                    <img src={getShopPhoto(biz)} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border shadow-inner flex-shrink-0" alt="Shop Preview" />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-900 text-base md:text-lg truncate">{biz.name}</h3>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${biz.plan === 'featured' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-600 border'}`}>{biz.plan}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-xl">{biz.description}</p>
                      <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5"><MapPin size={12} className="text-[#008751]" /> {biz.address}, {biz.city} • <Phone size={12} className="text-[#008751]" /> {biz.phone}</p>
                      {getCertPhoto(biz) && (
                        <button onClick={() => setCacPreviewUrl(getCertPhoto(biz))} className="inline-flex items-center gap-1 text-xs text-[#008751] font-black underline pt-1 group hover:text-emerald-800"><Eye size={12} className="group-hover:scale-110 transition-transform" /> View Attached CAC Trade Certificate</button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <button disabled={actionId === biz._id} onClick={() => runDecisionMatrix(biz._id, 'reject')} className="flex-1 md:flex-none px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 transition-all"><Ban size={14} /> Reject</button>
                    <button disabled={actionId === biz._id} onClick={() => runDecisionMatrix(biz._id, 'approve')} className="flex-1 md:flex-none px-5 py-3 bg-[#008751] hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 transition-all shadow-md">{actionId === biz._id ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Approve & Publish</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentTab === 'all' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-gray-900 tracking-tight flex items-center gap-1.5"><Search size={18} className="text-[#008751]" /> Master Directory Database</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name, city..." 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white text-xs font-bold outline-none transition-colors"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full p-3 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-bold outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select 
                value={paymentFilter}
                onChange={e => setPaymentFilter(e.target.value)}
                className="w-full p-3 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-bold outline-none"
              >
                <option value="">All Payments</option>
                <option value="paid">Paid Entries Only</option>
                <option value="unpaid">Unpaid Entries Only</option>
              </select>
              <div className="flex items-center gap-2 px-3 text-xs font-bold text-gray-400 border-l border-gray-100">
                <Users size={16} />
                <span>Showing {filteredBusinesses.length} total entries</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBusinesses.map(biz => (
              <div key={biz._id} className="p-5 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                <div className="flex gap-4 items-center flex-1">
                  <img src={getShopPhoto(biz)} className="w-12 h-12 object-cover rounded-lg border flex-shrink-0" alt="Shop Thumbnail" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-955 text-sm truncate">{biz.name}</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">{biz.category} • {biz.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${biz.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{biz.isPaid ? 'Paid' : 'Unpaid'}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${biz.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : biz.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{biz.status}</span>
                  
                  {biz.status === 'pending' && biz.isPaid && (
                    <div className="flex gap-1.5 border-l pl-3 border-gray-100">
                      <button disabled={actionId === biz._id} onClick={() => runDecisionMatrix(biz._id, 'approve')} className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#008751] rounded-lg transition-colors"><Check size={14} /></button>
                      <button disabled={actionId === biz._id} onClick={() => runDecisionMatrix(biz._id, 'reject')} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><Ban size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTab === 'transactions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2"><CreditCard size={20} className="text-[#008751]" /> Transaction Settlements Ledger</h2>
            <button className="px-4 py-2 bg-gray-50 border text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 hover:bg-gray-100"><FileSpreadsheet size={14} /> Export CSV Spreadsheet</button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase tracking-wider text-[11px]">
                    <th className="p-4">Transaction Reference ID</th>
                    <th className="p-4">Associated Node</th>
                    <th className="p-4">Settled Amount</th>
                    <th className="p-4">Status Code</th>
                    <th className="p-4">Verification Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-gray-700">
                  {transactions.map(tx => (
                    <tr key={tx._id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-slate-900 font-mono select-all">{tx.reference}</td>
                      <td className="p-4 font-bold text-gray-900">{tx.businessId?.name || tx.businessId || 'N/A'}</td>
                      <td className="p-4 font-black text-[#008751]">₦{(tx.amount || 0).toLocaleString()}</td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wide border ${tx.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{tx.status}</span></td>
                      <td className="p-4 text-gray-400 font-bold">{tx.paidAt ? new Date(tx.paidAt).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {cacPreviewUrl && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setCacPreviewUrl(null)} className="absolute right-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"><X size={16} /></button>
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tight border-b pb-3 border-gray-100"><FileText size={18} className="text-[#008751]" /> Registered CAC Trade Certificate</div>
            <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border">
              <img src={cacPreviewUrl} className="w-full h-full object-contain" alt="CAC Preview Zoom" />
            </div>
          </div>
        </div>
      )}
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
          <button onClick={() => onNavigate('landing')} className="bg-[#008751] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-800 transition-all">Back to Home</button>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-500 text-sm font-semibold mb-8">We couldn't verify your payment. Please contact support with your payment reference.</p>
          <button onClick={() => onNavigate('landing')} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Back to Home</button>
        </>
      )}
    </div>
  );
};

// --- VIEW: SECRET ADMIN LOGIN PANEL ---
const AdminLoginView = ({ onAdminLoginSuccess }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setAlert({ type: 'error', message: 'Secret admin credential passphrase required.' });
      return;
    }

    loading(true);
    setAlert(null);

    try {
      const res = await fetch(`${API_BASE}/admin/all`, {
        headers: { 'x-admin-password': adminPassword }
      });
      if (!res.ok) throw new Error();
      onAdminLoginSuccess(adminPassword);
    } catch {
      setAlert({ type: 'error', message: 'Halt: Administrative validation failed. Password key is incorrect.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 px-4 md:px-0 animate-in zoom-in-95 duration-300">
      <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={28} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white">System Admin Vault</h2>
          <p className="text-xs text-[#008751] font-extrabold uppercase tracking-widest">Platform Command Node</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-400">Security Credentials</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Enter Encrypted Secret Key" 
                className="w-full p-4 pr-12 bg-slate-900 border border-slate-800 rounded-xl font-bold text-sm outline-none text-white focus:border-[#008751] transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-[#008751] text-white rounded-xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.99] disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Decrypt Server Dashboard <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

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
        let errorMsg = 'Media upload pipeline failed.';
        try {
          const uploadErr = await uploadRes.json();
          errorMsg = uploadErr.message || (uploadErr.error ? `${uploadErr.message}: ${uploadErr.error}` : errorMsg);
        } catch {
          errorMsg = `Server returned status code ${uploadRes.status} during file processing.`;
        }
        throw new Error(errorMsg);
      }

      const mediaUrls = await uploadRes.json();

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

      const email = form.phone.replace(/[^0-9]/g, '') + '@naijabizfind.com';
      const payRes = await fetch(`${API_BASE}/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: savedBusinessId, email }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        throw new Error(payData.message || 'Payment initialization failed');
      }

      window.location.href = payData.authorization_url;

    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Something went wrong. Please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-12 shadow-2xl">
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

        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <input name="name" value={form.name} onChange={handleChange} type="text" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white focus:ring-0 font-bold text-sm outline-none transition-colors" placeholder="Business Name *" />
            <div className="grid grid-cols-2 gap-4">
              <select name="category" value={form.category} onChange={handleChange} className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white font-bold text-sm outline-none transition-colors">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
              </select>
              <input name="city" value={form.city} onChange={handleChange} type="text" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors" placeholder="City *" />
            </div>
            <input name="address" value={form.address} onChange={handleChange} type="text" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors" placeholder="Street Address *" />
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors" placeholder="Phone Number * (e.g. +234 803 123 4567)" />
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors" placeholder="WhatsApp Number (optional — defaults to phone)" />
            <div className="grid grid-cols-2 gap-4">
              <input name="openTime" value={form.openTime} onChange={handleChange} type="text" className="w-full p-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors" placeholder="Opens at (e.g. 8am) *" />
              <input name="closeTime" value={form.closeTime} onChange={handleChange} type="text" className="w-full p-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm outline-none transition-colors" placeholder="Closes at (e.g. 6pm) *" />
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full p-3.5 md:p-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-[#008751] focus:bg-white font-bold text-sm resize-none outline-none transition-colors" placeholder="Short Description of your business *" />
            <button onClick={handleRegister} className="w-full py-4 md:py-5 bg-[#008751] text-white rounded-xl md:rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-800 active:scale-[0.99] transition-all">
              Next: Media Upload <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <input ref={shopPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleShopPhoto} />
              <div onClick={() => shopPhotoInputRef.current.click()} className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[#008751] hover:bg-white transition-all cursor-pointer group overflow-hidden">
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

              <input ref={certInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleCertificate} />
              <div onClick={() => certInputRef.current.click()} className="border-2 border-dashed border-gray-200 bg-gray-50/30 rounded-2xl p-6 flex items-center gap-4 text-gray-400 hover:border-[#008751] hover:bg-white transition-all cursor-pointer group">
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
              <button onClick={handleMediaNext} className="flex-[2] py-4 bg-[#008751] text-white rounded-xl font-black shadow-lg hover:bg-emerald-800 active:scale-[0.99] transition-all">Next: Select Plan</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => setSelectedPlan('basic')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-[1.02] ${selectedPlan === 'basic' ? 'border-[#008751] bg-emerald-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <ShieldCheck size={24} className={selectedPlan === 'basic' ? 'text-[#008751]' : 'text-gray-300'} />
                <span className="font-black text-gray-900 block mt-3 text-base">Basic Listing</span>
                <div className="text-2xl font-black text-gray-900 mt-1">₦5,000</div>
                <p className="text-xs text-gray-500 mt-1 font-medium">12-month listing, standard placement</p>
              </div>

              <div onClick={() => setSelectedPlan('featured')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-[1.02] ${selectedPlan === 'featured' ? 'border-[#FFC107] bg-amber-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <Zap size={24} className={selectedPlan === 'featured' ? 'text-[#FFC107]' : 'text-gray-300'} />
                <span className="font-black text-gray-900 block mt-3 text-base">Featured Placement</span>
                <div className="text-2xl font-black text-gray-900 mt-1">₦10,000</div>
                <p className="text-xs text-gray-500 mt-1 font-medium">Priority placement, homepage visibility</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 text-sm space-y-2 border border-gray-100">
              <div className="flex justify-between font-bold text-gray-600"><span>Business</span><span className="text-gray-900 truncate max-w-[180px]">{form.name}</span></div>
              <div className="flex justify-between font-bold text-gray-600"><span>Plan Package</span><span className="capitalize text-[#008751] font-black bg-emerald-50 px-2 py-0.5 rounded text-xs">{selectedPlan}</span></div>
              <div className="flex justify-between font-black text-base text-gray-900 pt-3 border-t border-gray-200/60 mt-2"><span>Total Due</span><span className="text-[#008751]">₦{selectedPlan === 'featured' ? '10,000' : '5,000'}</span></div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={() => setStep(2)} className="w-full md:w-1/3 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl font-black transition-colors" disabled={submitting}>Back</button>
              <button onClick={handleSubmitAndPay} disabled={submitting} className="w-full md:w-2/3 py-4 bg-[#008751] text-white rounded-xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-emerald-800 active:scale-[0.99] transition-all">
                {submitting ? <><RefreshCw size={18} className="animate-spin" /> Processing Infrastructure...</> : 'Pay & List Business'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [page, setPage] = useState(() => {
    // Dynamic Path Verification & Matching on Initialization
    if (window.location.pathname === STEALTH_ADMIN_PATH || window.location.pathname === '/admin/dashboard') {
      return 'admin-login';
    }
    if (window.location.pathname === '/payment-success' ||
        window.location.search.includes('reference') ||
        window.location.search.includes('trxref')) {
      return 'payment-success';
    }
    return 'landing'; 
  });

  const [selectedBiz, setSelectedBiz] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [directoryOptions, setDirectoryOptions] = useState({});

  // Session Data Hooks
  const [currentOwnerProfile, setCurrentOwnerProfile] = useState(() => {
    const cached = sessionStorage.getItem('naija_owner_session');
    return cached ? JSON.parse(cached) : null;
  });

  const [currentShopper, setCurrentShopper] = useState(() => {
    const cached = sessionStorage.getItem('naija_shopper_session');
    return cached ? JSON.parse(cached) : null;
  });

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

  const handleUserLoginSuccess = (profile) => {
    if (profile.role === 'owner') {
      sessionStorage.setItem('naija_owner_session', JSON.stringify(profile));
      setCurrentOwnerProfile(profile);
      navigate('owner-dashboard');
    } else {
      sessionStorage.setItem('naija_shopper_session', JSON.stringify(profile));
      setCurrentShopper(profile);
      navigate('home'); 
    }
  };

  const handleUserSignOut = () => {
    sessionStorage.removeItem('naija_owner_session');
    sessionStorage.removeItem('naija_shopper_session');
    setCurrentOwnerProfile(null);
    setCurrentShopper(null);
    navigate('landing');
  };

  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const nextClicks = prev + 1;
      if (nextClicks >= 5) {
        navigate('admin-login'); 
        return 0;
      }
      return nextClicks;
    });
  };

  const isUserAuthenticated = !!currentOwnerProfile;
  const isShopperAuthenticated = !!currentShopper;
  const isAdminAuthenticated = !!sessionStorage.getItem('naija_admin_pass');

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 md:py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-[#008751] rounded-lg flex items-center justify-center text-white font-black italic text-lg shadow-inner group-hover:rotate-12 transition-transform duration-300">N</div>
            <span className="text-base md:text-lg font-black tracking-tighter text-[#008751]">NaijaBizFind</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigate('landing')} className={`text-[11px] font-black transition-colors tracking-wide ${page === 'landing' ? 'text-[#008751]' : 'text-gray-400 hover:text-gray-600'}`}>HOME</button>
            <button onClick={() => navigate('home')} className={`text-[11px] font-black transition-colors tracking-wide ${page === 'home' ? 'text-[#008751]' : 'text-gray-400 hover:text-gray-600'}`}>EXPLORE</button>
            <button onClick={() => navigate('directory')} className={`text-[11px] font-black transition-colors tracking-wide ${page === 'directory' ? 'text-[#008751]' : 'text-gray-400 hover:text-gray-600'}`}>DIRECTORY</button>
            
            {isAdminAuthenticated ? (
              <button onClick={() => navigate('admin')} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-black shadow-md flex items-center gap-1.5 hover:bg-slate-800 transition-colors"><LayoutDashboard size={14} /> Control Centre</button>
            ) : isUserAuthenticated ? (
              <button onClick={() => navigate('owner-dashboard')} className="bg-[#008751] text-white px-5 py-2.5 rounded-lg text-xs font-black shadow-md flex items-center gap-1.5 hover:bg-emerald-800 transition-colors"><VerifiedIcon size={14} /> My Dashboard</button>
            ) : isShopperAuthenticated ? (
              <div className="flex gap-4 items-center">
                <span className="text-xs font-black text-[#008751]">Hi, {currentShopper.name}</span>
                <button onClick={handleUserSignOut} className="text-[11px] font-black tracking-wide text-gray-400 hover:text-red-500 transition-colors">SIGNOUT</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => navigate('login')} className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-xs font-black hover:bg-gray-50 transition-colors">LOGIN</button>
                <button onClick={() => navigate('submit')} className="bg-[#008751] text-white px-5 py-2 rounded-lg text-xs font-black shadow-md hover:bg-emerald-800 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all">List Business</button>
              </div>
            )}
          </div>
          <button className="md:hidden p-2 text-gray-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-4 duration-200">
            <button onClick={() => navigate('landing')} className="text-left font-black text-[11px] uppercase tracking-widest text-gray-655 py-2 border-b border-gray-50">Home</button>
            <button onClick={() => navigate('home')} className="text-left font-black text-[11px] uppercase tracking-widest text-gray-655 py-2 border-b border-gray-50">Explore</button>
            <button onClick={() => navigate('directory')} className="text-left font-black text-[11px] uppercase tracking-widest text-gray-655 py-2 border-b border-gray-50">Browse Directory</button>
            
            {isUserAuthenticated ? (
              <button onClick={() => navigate('owner-dashboard')} className="w-full bg-[#008751] text-white py-4 rounded-xl font-black uppercase text-xs mt-2 shadow-lg">My Dashboard</button>
            ) : isAdminAuthenticated ? (
              <button onClick={() => navigate('admin')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs mt-2 shadow-lg">Control Centre</button>
            ) : isShopperAuthenticated ? (
              <div className="space-y-2 pt-2 text-center">
                <span className="text-xs font-black block text-[#008751]">Shopper: {currentShopper.name}</span>
                <button onClick={handleUserSignOut} className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-black uppercase text-xs">Sign Out</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button onClick={() => navigate('login')} className="w-full border border-gray-200 text-gray-700 py-3.5 rounded-xl font-black uppercase text-xs">Sign In</button>
                <button onClick={() => navigate('submit')} className="w-full bg-[#008751] text-white py-3.5 rounded-xl font-black uppercase text-xs shadow-lg">List My Business</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* PAGE ROUTER */}
      <main>
        {page === 'landing' && <LandingView onNavigate={navigate} />}
        {page === 'home' && <HomeView onNavigate={navigate} onSelectBusiness={handleSelectBusiness} />}
        {page === 'directory' && <DirectoryView onSelectBusiness={handleSelectBusiness} initialCategory={directoryOptions.category} />}
        {page === 'detail' && <DetailView business={selectedBiz} onBack={() => navigate('directory')} />}
        {page === 'submit' && <SubmitView />}
        {page === 'about' && <AboutView />}
        {page === 'privacy' && <PrivacyView />}
        {page === 'terms' && <TermsView />}
        {page === 'payment-success' && <PaymentSuccessView onNavigate={navigate} />}
        {page === 'login' && <LoginView onLoginSuccess={handleUserLoginSuccess} onNavigate={navigate} />}
        {page === 'owner-dashboard' && isUserAuthenticated && <OwnerDashboardView business={currentOwnerProfile} onSignOut={handleUserSignOut} />}
        {page === 'admin-login' && <AdminLoginView onAdminLoginSuccess={(pass) => { sessionStorage.setItem('naija_admin_pass', pass); navigate('admin'); }} />}
        {page === 'admin' && <AdminView onNavigate={navigate} />}
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

      {/* Core Platform Style Injectors */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { bg-position: -200% 0; }
          100% { bg-position: 200% 0; }
        }
      `}} />
    </div>
  );
}
