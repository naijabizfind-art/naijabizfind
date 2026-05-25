import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Store, PlusCircle, CreditCard, LogOut, 
  Settings, TrendingUp, Users, Star, Menu, X, Loader2, Upload, AlertCircle, CheckCircle2 
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Premium 3D Tilt Card Component (Untouched UI) ---
const TiltCard = ({ title, value, icon: Icon, delay }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 }); 
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full transition-all duration-700 ease-out"
      style={{ 
        perspective: '1000px',
        animation: `fadeInUp 0.8s ease-out forwards`,
        animationDelay: delay,
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      <div 
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl"
        style={{
          transform: isHovered ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` : 'rotateX(0) rotateY(0) scale3d(1, 1, 1)',
          transition: isHovered ? 'none' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="flex justify-between items-start mb-4" style={{ transform: 'translateZ(30px)' }}>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</div>
          <div className="w-10 h-10 rounded-xl bg-green-50 text-[#008751] flex items-center justify-center">
            <Icon size={20} />
          </div>
        </div>
        <div className="text-4xl font-black text-gray-900" style={{ transform: 'translateZ(40px)' }}>
          {value}
        </div>
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0,135,81,0.05) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0
          }}
        />
      </div>
    </div>
  );
};

// --- Main Dashboard ---
export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview, listings, add
  
  // Data State
  const [myListings, setMyListings] = useState([]);
  const [isFetchingListings, setIsFetchingListings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', category: '', city: '', address: '', description: '',
    email: '', phone: '', whatsapp: '', openTime: '09:00', closeTime: '18:00', plan: 'basic'
  });
  const [files, setFiles] = useState({ shopPhoto: null, certificate: null });

  // Initial Load Animation & Data Fetching
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Simulate initial smooth load & fetch user data
    setTimeout(() => {
      fetchUserListings();
      setIsPageLoading(false);
    }, 1200);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUserListings = async () => {
    setIsFetchingListings(true);
    try {
      // Fetching based on the owner's phone number saved in localStorage during login
      const ownerPhone = localStorage.getItem('userPhone') || '';
      if (!ownerPhone) return;

      const res = await fetch(`${API_BASE}/businesses/owner-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: ownerPhone })
      });
      const data = await res.json();
      
      // Backend returns a single object if found, let's wrap it in array for UI
      if (res.ok && data._id) {
        setMyListings([data]); 
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setIsFetchingListings(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // --- SUBMIT REGISTRATION PIPELINE ---
  const handleRegisterBusiness = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload Files via the /api/upload route
      const uploadData = new FormData();
      uploadData.append('shopPhoto', files.shopPhoto);
      if (files.certificate) uploadData.append('certificate', files.certificate);

      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: uploadData
      });
      const uploadUrls = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadUrls.message || 'Upload failed');

      // 2. Register the Business
      const businessPayload = {
        ...formData,
        shopPhoto: uploadUrls.shopPhoto,
        certificate: uploadUrls.certificate
      };

      const regRes = await fetch(`${API_BASE}/businesses/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessPayload)
      });
      const registeredData = await regRes.json();

      if (!regRes.ok) throw new Error(registeredData.message || 'Registration failed');

      // Success! Reset form and jump to listings
      alert('Business registered successfully! Awaiting payment & approval.');
      setMyListings([registeredData, ...myListings]);
      setActiveTab('listings');
      setFormData({ name: '', category: '', city: '', address: '', description: '', email: '', phone: '', whatsapp: '', openTime: '09:00', closeTime: '18:00', plan: 'basic' });
      setFiles({ shopPhoto: null, certificate: null });

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PAYSTACK INITIALIZATION ---
  const handlePayment = async (business) => {
    try {
      const res = await fetch(`${API_BASE}/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business._id, email: business.email })
      });
      const data = await res.json();
      
      if (data.authorization_url) {
        window.location.href = data.authorization_url; // Redirects to Paystack Secure Checkout
      } else {
        alert('Payment initialization failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while connecting to payment gateway.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ----------------------------------------------------
  // FULL PAGE LOADING SCREEN
  // ----------------------------------------------------
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20 animate-pulse rounded-full"></div>
          <div className="w-16 h-16 bg-[#008751] rounded-2xl flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
            <span className="text-white font-black text-4xl leading-none">N</span>
          </div>
        </div>
        <h2 className="mt-6 text-xl font-black text-gray-900 tracking-widest uppercase animate-pulse">Initializing Dashboard</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden font-sans">
      
      {/* --- Parallax Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] bg-green-300/20 rounded-full blur-[100px] -top-40 -left-20 transition-transform duration-300 ease-out" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="absolute w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] bottom-0 right-0 transition-transform duration-300 ease-out" style={{ transform: `translateY(${scrollY * -0.2}px)` }} />
      </div>

      {/* --- Mobile Overlay --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- Glassmorphism Sidebar --- */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/70 backdrop-blur-2xl border-r border-white/50 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#008751] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
              <span className="text-white font-black text-xl leading-none">N</span>
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900">NaijaBiz<span className="text-[#008751]">Find</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${activeTab === 'overview' ? 'bg-white text-[#008751] shadow-sm border border-green-100' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('listings'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${activeTab === 'listings' ? 'bg-white text-[#008751] shadow-sm border border-green-100' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}>
            <Store size={18} /> My Listings
          </button>
          <button onClick={() => { setActiveTab('add'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${activeTab === 'add' ? 'bg-white text-[#008751] shadow-sm border border-green-100' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}>
            <PlusCircle size={18} /> Add New Listing
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded-xl font-semibold text-sm transition-all">
            <Settings size={18} /> Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-white/50 mb-4">
          <div className="mb-4 px-4 py-2 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2 text-xs font-bold text-[#008751]">
            Hello, {localStorage.getItem('username') || 'Nii Kpakpo'}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 md:p-8 z-10 overflow-y-auto w-full">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 pt-2 md:pt-0">
          <div className="flex items-center gap-4 animate-[fadeIn_1s_ease-out]">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {activeTab === 'overview' && 'Business Dashboard'}
                {activeTab === 'listings' && 'My Listings'}
                {activeTab === 'add' && 'Create Listing'}
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium hidden md:block">Manage your storefronts and monitor performance.</p>
            </div>
          </div>
          
          {activeTab !== 'add' && (
            <button onClick={() => setActiveTab('add')} className="group relative bg-[#008751] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#006B40] transition-all shadow-lg shadow-green-900/20 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <PlusCircle size={18} className="relative z-10 hidden md:block" />
              <span className="relative z-10">Add Listing</span>
            </button>
          )}
        </header>

        {/* =========================================
            TAB 1: OVERVIEW
        ============================================= */}
        {activeTab === 'overview' && (
          <div className="animate-[fadeInUp_0.5s_ease-out]">
            {/* 3D Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <TiltCard title="Total Views" value="2,405" icon={TrendingUp} delay="0s" />
              <TiltCard title="Active Listings" value={myListings.length} icon={Store} delay="0.1s" />
              <TiltCard title="Customer Rating" value="4.8" icon={Star} delay="0.2s" />
            </div>

            {myListings.length === 0 ? (
              <div 
                className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-10 md:p-16 text-center flex flex-col items-center shadow-xl transition-all duration-700 ease-out"
                style={{ transform: `translateY(${Math.max(0, 30 - scrollY * 0.1)}px)`, opacity: Math.min(1, 1 - (scrollY * 0.001)) }}
              >
                <div className="w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center text-gray-400 mb-6 shadow-inner transform rotate-3">
                  <Store size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Ready to expand your reach?</h3>
                <p className="text-gray-500 text-sm md:text-base max-w-md mb-8 leading-relaxed">Create your first verified business listing to start capturing organic traffic from users across NaijaBizFind.</p>
                <button onClick={() => setActiveTab('add')} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all hover:scale-105 shadow-xl">
                  <PlusCircle size={20} /> Register Business
                </button>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-[#008751]" /> Quick Status
                </h3>
                <div className="space-y-3">
                  {myListings.map((biz) => (
                    <div key={biz._id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100">
                      <div className="font-semibold text-gray-800">{biz.name}</div>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${biz.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {biz.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 2: MY LISTINGS (With Payment integration)
        ============================================= */}
        {activeTab === 'listings' && (
          <div className="animate-[fadeInUp_0.5s_ease-out]">
            {isFetchingListings ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#008751]" size={40} /></div>
            ) : myListings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-500">No listings found. Try registering a new business.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myListings.map(biz => (
                  <div key={biz._id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="h-40 overflow-hidden bg-gray-100 relative">
                      <img src={biz.images?.shopPhoto || 'https://via.placeholder.com/400'} alt="Shop" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                      {!biz.isPaid && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
                          <AlertCircle size={12} /> Payment Required
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-gray-900">{biz.name}</h3>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">{biz.category}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2">{biz.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          {biz.status === 'approved' ? <CheckCircle2 className="text-[#008751]" size={18} /> : <AlertCircle className="text-yellow-500" size={18} />}
                          <span className="capitalize">{biz.status}</span>
                        </div>
                        
                        {!biz.isPaid && (
                          <button onClick={() => handlePayment(biz)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                            <CreditCard size={16} /> Pay Listing Fee
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 3: ADD NEW LISTING (Registration Pipeline)
        ============================================= */}
        {activeTab === 'add' && (
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 md:p-10 shadow-2xl animate-[fadeInUp_0.5s_ease-out]">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Store className="text-[#008751]" /> Business Details
            </h2>
            
            <form onSubmit={handleRegisterBusiness} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all">
                    <option value="">Select Category...</option>
                    <option value="technology">Technology & IT</option>
                    <option value="automotive">Automotive</option>
                    <option value="retail">Retail & Fashion</option>
                    <option value="food">Food & Restaurant</option>
                    <option value="services">Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Email (For Invoices)</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Address & City</label>
                  <div className="flex gap-4">
                    <input required name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all" />
                    <input required name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} className="w-2/3 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea required name="description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#008751] transition-all"></textarea>
                </div>
                
                {/* File Uploads */}
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" />
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload Shop Photo (Required)</label>
                  <input type="file" required accept="image/*" name="shopPhoto" onChange={handleFileChange} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <CheckCircle2 className="mx-auto text-gray-400 mb-2" />
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload Certificate (Optional)</label>
                  <input type="file" accept="image/*,.pdf" name="certificate" onChange={handleFileChange} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#008751] text-white px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#006B40] transition-all shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isSubmitting ? <><Loader2 className="animate-spin" size={24} /> Uploading & Saving...</> : 'Submit Business for Review'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </div>
  );
}
