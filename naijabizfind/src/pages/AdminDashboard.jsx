import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Users, Store, CheckCircle, XCircle, LogOut, Activity, 
  Database, ChevronRight, Loader2, Clock, MapPin, Phone, Eye, Check, 
  Ban, TrendingUp, Zap, ShieldCheck, FileSpreadsheet, CreditCard, FileText, X, Mail, ShieldAlert as BlacklistIcon
} from 'lucide-react';

// ✅ FIX: Synced admin panel API base explicitly with your active production cluster
const API_BASE = 'https://naijabizfind.onrender.com/api';

const getShopPhoto = (biz) => biz?.images?.shopPhoto || biz?.shopPhoto || '';
const getCertPhoto = (biz) => biz?.images?.certificate || biz?.certificate || '';

// --- Premium 3D Tilt Card (Dark Theme) ---
const AdminTiltCard = ({ title, value, icon: Icon, delay, colorClass }) => {
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
        className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-800 shadow-2xl"
        style={{
          transform: isHovered ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` : 'rotateX(0) rotateY(0) scale3d(1, 1, 1)',
          transition: isHovered ? 'none' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="flex justify-between items-start mb-4" style={{ transform: 'translateZ(30px)' }}>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
            <Icon size={20} />
          </div>
        </div>
        <div className="text-4xl font-black text-white" style={{ transform: 'translateZ(40px)' }}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Core Orchestration States
  const [currentTab, setCurrentTab] = useState('overview'); 
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [cacPreviewUrl, setCacPreviewUrl] = useState(null);

  // Live Data Matrices
  const [businesses, setBusinesses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Administrative Filtering Controls
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User Tab Search & Filtering Controls
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Parallax Scroll Tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hydrate Control Center with Secure Network Requests
  const loadControlCenterData = async () => {
    setIsFetchingData(true);
    try {
      const adminSecret = localStorage.getItem('adminKey') || '';
      const requestHeaders = {
        'Content-Type': 'application/json',
        'x-admin-password': adminSecret
      };

      // 1. Fetch ALL businesses for complete visibility filtering logs
      const allRes = await fetch(`${API_BASE}/admin/all`, { headers: requestHeaders });
      const allData = await allRes.json();
      if (allRes.ok) setBusinesses(allData);

      // 2. Extract Complete Financial Transaction Log Ledger Books
      const transRes = await fetch(`${API_BASE}/admin/transactions`, { headers: requestHeaders });
      const transData = await transRes.json();
      if (transRes.ok) setTransactions(transData);

      // 3. Fetch Master List of Registered Platform Users
      const usersRes = await fetch(`${API_BASE}/admin/users`, { headers: requestHeaders });
      const usersData = await usersRes.json();
      if (usersRes.ok) setUsersList(usersData);

    } catch (err) {
      console.error("Failed to synchronize admin command center nodes:", err);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    loadControlCenterData();
  }, []);

  // Smart Logout Function
  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // State Change Operations Matrices
  const runDecisionMatrix = async (id, decision) => {
    setActionInProgress(id);
    try {
      const res = await fetch(`${API_BASE}/admin/${decision}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': localStorage.getItem('adminKey') || ''
        },
        body: JSON.stringify({ reason: "Listing verified against community index." })
      });

      if (res.ok) {
        setBusinesses(prev => prev.map(item => item._id === id ? { ...item, status: decision === 'approve' ? 'approved' : 'rejected' } : item));
      } else {
        const err = await res.json();
        alert(`Action declined by core framework: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Live Blacklist / Account Deactivation Toggle Engine
  const toggleUserBlacklist = async (id, currentRole) => {
    setActionInProgress(id);
    const targetAction = currentRole === 'blacklisted' ? 'activate' : 'blacklist';
    const confirmProceed = window.confirm(`Are you sure you want to change this account's status to ${targetAction.toUpperCase()}?`);
    if (!confirmProceed) {
      setActionInProgress(null);
      return;
    }

    try {
      const adminSecret = localStorage.getItem('adminKey') || '';
      const res = await fetch(`${API_BASE}/admin/users/blacklist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminSecret
        }
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setUsersList(prev => prev.map(user => user._id === id ? { ...user, role: data.user.role } : user));
      } else {
        alert(`Failed to update account scope: ${data.message}`);
      }
    } catch (err) {
      console.error("Blacklist toggle error:", err);
      alert("Network error updating security clearance level.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Metric computations for command Overview tab derived completely from state layers
  const totalRevenue = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + (t.amount || 0), 0);
  const pendingApprovalsCount = businesses.filter(b => b.status === 'pending' && b.isPaid).length;
  const activeListingsCount = businesses.filter(b => b.status === 'approved' && b.isPaid).length;

  // Filter listings across master tables cleanly
  const filteredBusinesses = businesses.filter(b => {
    const matchesStatus = statusFilter === '' || b.status === statusFilter;
    const matchesPayment = paymentFilter === '' || (paymentFilter === 'paid' ? b.isPaid : !b.isPaid);
    const matchesSearch = searchQuery === '' || b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || b.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPayment && matchesSearch;
  });

  // Filter accounts list across dataset matrices cleanly
  const filteredUsers = usersList.filter(u => {
    const matchesRole = userRoleFilter === '' || u.role === userRoleFilter;
    const matchesSearch = userSearchQuery === '' || 
      u.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
      u.phone?.includes(userSearchQuery);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex relative overflow-hidden font-sans text-white">
      
      {/* Dark Theme Parallax Backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -top-40 -left-20 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute w-[600px] h-[600px] bg-[#008751]/10 rounded-full blur-[120px] bottom-0 right-0 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
      </div>

      {/* Admin Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-2xl border-r border-gray-800 flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
            <ShieldAlert className="text-red-500" size={20} />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-none">SYS_ADMIN</span>
            <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">Clearance Level 5</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button onClick={() => setCurrentTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${currentTab === 'overview' ? 'bg-gray-900 text-white border border-gray-700 shadow-sm' : 'text-gray-500 hover:bg-gray-950 hover:text-gray-300'}`}>
            <Activity size={18} className="text-red-400" /> Command Center
          </button>
          <button onClick={() => setCurrentTab('submissions')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${currentTab === 'submissions' ? 'bg-gray-900 text-white border border-gray-700 shadow-sm' : 'text-gray-500 hover:bg-gray-950 hover:text-gray-300'}`}>
            <div className="flex items-center gap-3"><Clock size={18} className="text-yellow-500" /> Pending Reviews</div>
            {pendingApprovalsCount > 0 && <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{pendingApprovalsCount}</span>}
          </button>
          <button onClick={() => setCurrentTab('all')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${currentTab === 'all' ? 'bg-gray-900 text-white border border-gray-700 shadow-sm' : 'text-gray-500 hover:bg-gray-950 hover:text-gray-300'}`}>
            <Store size={18} className="text-emerald-500" /> All Businesses
          </button>
          <button onClick={() => setCurrentTab('users')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${currentTab === 'users' ? 'bg-gray-900 text-white border border-gray-707 shadow-sm' : 'text-gray-500 hover:bg-gray-950 hover:text-gray-300'}`}>
            <div className="flex items-center gap-3"><Users size={18} className="text-purple-400" /> User Accounts</div>
            {usersList.length > 0 && <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{usersList.length}</span>}
          </button>
          <button onClick={() => setCurrentTab('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${currentTab === 'transactions' ? 'bg-gray-900 text-white border border-gray-700 shadow-sm' : 'text-gray-500 hover:bg-gray-950 hover:text-gray-300'}`}>
            <Database size={18} className="text-blue-400" /> Ledger Logs
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800 mb-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-semibold text-sm transition-colors">
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-8 z-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div className="animate-[fadeIn_1s_ease-out]">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {currentTab === 'overview' && 'Admin Command Center'}
              {currentTab === 'submissions' && 'Verification Management'}
              {currentTab === 'all' && 'Master Platform Registry'}
              {currentTab === 'users' && 'User Access Accounts Ecosystem'}
              {currentTab === 'transactions' && 'Financial Settlement Records'}
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Review secure server structures and authorize directory nodes.</p>
          </div>
        </header>

        {/* 3D Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <AdminTiltCard title="Awaiting Verification" value={isFetchingData ? "..." : pendingApprovalsCount} icon={Clock} delay="0s" colorClass="bg-yellow-500/20 text-yellow-500" />
          <AdminTiltCard title="Platform Registrations" value={isFetchingData ? "..." : usersList.length} icon={Users} delay="0.1s" colorClass="bg-purple-500/20 text-purple-400" />
          <AdminTiltCard title="Gross Settlement Roll" value={isFetchingData ? "..." : `₦${totalRevenue.toLocaleString()}`} icon={TrendingUp} delay="0.2s" colorClass="bg-blue-500/20 text-blue-500" />
        </div>

        {/* =========================================
            TAB 1: OVERVIEW METRIC VISUAL PLOTS
        ============================================= */}
        {currentTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeInUp_0.5s_ease-out]">
            <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight">Growth Volatility Tracker</h3>
                  <p className="text-xs text-gray-500">Live system performance & transaction index curves</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#008751] bg-[#008751]/10 px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-[#008751] rounded-full animate-pulse" /> Network Stream Node
                </span>
              </div>
              <div className="h-48 flex items-end gap-3 pt-6 px-2">
                {[
                  { m: 'Jan', val: 'h-[35%]', rev: '₦20k' },
                  { m: 'Feb', val: 'h-[50%]', rev: '₦55k' },
                  { m: 'Mar', val: 'h-[75%]', rev: '₦110k' },
                  { m: 'Apr', val: 'h-[90%]', rev: '₦185k' },
                  { m: 'May', val: 'h-[100%]', rev: `₦${totalRevenue.toLocaleString()}` }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    <div className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.rev}</div>
                    <div className={`${item.val} w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg group-hover:brightness-110 transition-all shadow-lg duration-500`} />
                    <div className="text-[10px] font-black text-gray-500 tracking-wider uppercase mt-1">{item.m}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="font-black text-white text-base tracking-tight">User Proportions</h3>
              <p className="text-xs text-gray-500">System account allocation profiles</p>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                    <span>Business Storefront Owners</span>
                    <span>{usersList.filter(u => u.role === 'owner').length} listings</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                    <span>Explorer Consumers</span>
                    <span>{usersList.filter(u => u.role === 'user').length} accounts</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[75%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: AWAITING VERIFICATION SUBMISSIONS
        ============================================= */}
        {currentTab === 'submissions' && (
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl animate-[fadeInUp_0.5s_ease-out]">
            {isFetchingData ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-red-500" size={32} /></div>
            ) : businesses.filter(b => b.status === 'pending' && b.isPaid).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={40} />
                <p className="text-gray-400 font-bold">All audits cleared!</p>
                <p className="text-sm text-gray-600">No paid listings require modification logs at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.filter(b => b.status === 'pending' && b.isPaid).map((business) => (
                  <div key={business._id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 bg-black/40 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors gap-6 group">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border border-gray-700 flex-shrink-0">
                        {getShopPhoto(business) ? (
                          <img src={getShopPhoto(business)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="text-gray-400" size={24} />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-bold text-white text-base flex items-center gap-2 flex-wrap">
                          {business.name}
                          <span className="text-[10px] bg-[#008751]/20 text-[#008751] px-2 py-0.5 rounded uppercase tracking-wider font-black">{business.plan}</span>
                        </h4>
                        <p className="text-xs text-gray-400 font-medium line-clamp-2">{business.description}</p>
                        <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 pt-1">
                          <MapPin size={12} className="text-[#008751]" /> {business.address}, {business.city}
                        </p>
                        {getCertPhoto(business) && (
                          <button onClick={() => setCacPreviewUrl(getCertPhoto(business))} className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold underline pt-1">
                            <Eye size={12} /> View Attached CAC Document
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
                      <a href={`tel:${business.phone}`} className="flex-1 lg:flex-none text-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors">
                        Call Owner
                      </a>
                      {actionInProgress === business._id ? (
                        <Loader2 className="animate-spin text-gray-500 mx-6" size={20} />
                      ) : (
                        <>
                          <button onClick={() => runDecisionMatrix(business._id, 'reject')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                            <Ban size={18} />
                          </button>
                          <button onClick={() => runDecisionMatrix(business._id, 'approve')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-900/20">
                            <Check size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 3: MASTER PLATFORM REGISTRY
        ============================================= */}
        {currentTab === 'all' && (
          <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter key arrays (name, city)..."
                  className="w-full px-4 py-3 bg-black/40 border border-gray-800 text-white rounded-xl text-xs font-bold outline-none focus:border-[#008751] transition-colors"
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-3 bg-black/40 border border-gray-800 rounded-xl text-xs font-bold outline-none text-gray-400">
                  <option value="">All Status Enums</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="w-full p-3 bg-black/40 border border-gray-800 rounded-xl text-xs font-bold outline-none text-gray-400">
                  <option value="">All Verification Invoices</option>
                  <option value="paid">Paid Settlements</option>
                  <option value="unpaid">Unpaid Incomplete</option>
                </select>
                <div className="flex items-center gap-2 px-3 text-xs font-bold text-gray-500 border-l border-gray-800">
                  <Store size={16} className="text-[#008751]" />
                  <span>Showing {filteredBusinesses.length} active storefronts</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredBusinesses.map(biz => (
                <div key={biz._id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-700 transition-colors">
                  <div className="flex gap-4 items-center">
                    <img src={getShopPhoto(biz) || 'https://via.placeholder.com/100'} className="w-10 h-10 object-cover rounded-lg border border-gray-800 flex-shrink-0" alt="" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{biz.name}</h4>
                      <p className="text-[10px] font-black text-gray-500 uppercase mt-0.5 tracking-wider">{biz.category} • {biz.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${biz.isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{biz.isPaid ? 'Paid' : 'Unpaid'}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${biz.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : biz.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{biz.status}</span>
                    {biz.status === 'pending' && biz.isPaid && (
                      <div className="flex gap-1 border-l border-gray-800 pl-2 ml-1">
                        <button onClick={() => runDecisionMatrix(biz._id, 'approve')} className="p-1 bg-green-500/10 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors"><Check size={12} /></button>
                        <button onClick={() => runDecisionMatrix(biz._id, 'reject')} className="p-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all"><Ban size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            TAB 4: USER ACCESS ACCOUNTS ECOSYSTEM
        ============================================= */}
        {currentTab === 'users' && (
          <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <input 
                    type="text" 
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    placeholder="Search registered network users (username, email, or telephone logs)..."
                    className="w-full px-4 py-3 bg-black/40 border border-gray-800 text-white rounded-xl text-xs font-bold outline-none focus:border-[#008751] transition-colors"
                  />
                </div>
                <div>
                  <select 
                    value={userRoleFilter} 
                    onChange={e => setUserRoleFilter(e.target.value)} 
                    className="w-full p-3 bg-black/40 border border-gray-800 rounded-xl text-xs font-bold outline-none text-gray-400"
                  >
                    <option value="">All Account Scopes</option>
                    <option value="user">Explorer (Standard Customer)</option>
                    <option value="owner">Business Owner</option>
                    <option value="blacklisted">Blacklisted / Deactivated</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isFetchingData ? (
                <div className="col-span-full flex justify-center p-12"><Loader2 className="animate-spin text-purple-500" size={32} /></div>
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-full text-center py-12 border border-dashed border-gray-800 rounded-2xl">
                  <Users className="mx-auto text-gray-600 mb-2" size={32} />
                  <p className="text-gray-500 font-bold">No user profiles matched this query.</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user._id} className={`p-5 bg-gray-900/40 border rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all space-y-4 ${user.role === 'blacklisted' ? 'border-red-900/50 hover:border-red-800' : 'border-gray-800 hover:border-gray-700'}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-white text-base tracking-tight truncate max-w-[65%]">{user.username}</h4>
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                          user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          user.role === 'owner' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          user.role === 'blacklisted' ? 'bg-red-900/30 text-red-500 border-red-900/40 animate-pulse' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.role === 'owner' ? 'Business Owner' : user.role === 'admin' ? 'System Admin' : user.role === 'blacklisted' ? 'Blacklisted' : 'Explorer'}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-400 font-medium">
                        <p className="flex items-center gap-2 truncate"><Mail size={12} className="text-gray-500 flex-shrink-0" /> {user.email}</p>
                        <p className="flex items-center gap-2"><Phone size={12} className="text-gray-500 flex-shrink-0" /> {user.phone || 'No direct log phone'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-850 gap-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      {user.role !== 'admin' && (
                        <button 
                          disabled={actionInProgress === user._id}
                          onClick={() => toggleUserBlacklist(user._id, user.role)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide flex items-center gap-1 transition-all ${
                            user.role === 'blacklisted' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {actionInProgress === user._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : user.role === 'blacklisted' ? (
                            <>Unban Account</>
                          ) : (
                            <><BlacklistIcon size={12} /> Blacklist</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================================
            TAB 5: LEDGER SETTLEMENT TRANSACTIONS
        ============================================= */}
        {currentTab === 'transactions' && (
          <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2"><CreditCard size={20} className="text-emerald-500" /> Paystack Infrastructure Log</h2>
              <button onClick={() => alert("CSV Export Execution Sequence Activated.")} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors">
                <FileSpreadsheet size={14} /> Export CSV
              </button>
            </div>

            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-950/60 border-b border-gray-800 font-black text-gray-400 uppercase tracking-widest text-[10px]">
                      <th className="p-4">Reference Token</th>
                      <th className="p-4">Storefront Entity</th>
                      <th className="p-4">Settled Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Verification Stamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-850 font-medium text-gray-300">
                    {transactions.map(tx => (
                      <tr key={tx._id} className="hover:bg-gray-900/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-gray-400 select-all tracking-wider">{tx.reference}</td>
                        <td className="p-4 font-bold text-white">{tx.businessId?.name || tx.businessId || 'Corrupted Record Link'}</td>
                        <td className="p-4 font-black text-emerald-400 text-sm">₦{(tx.amount || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-xs font-semibold">{tx.paidAt ? new Date(tx.paidAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ZOOM MODAL FOR CAC TRADE CERTIFICATES */}
      {cacPreviewUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gray-900 rounded-3xl overflow-hidden max-w-2xl w-full p-6 space-y-4 border border-gray-800 shadow-2xl relative">
            <button onClick={() => setCacPreviewUrl(null)} className="absolute right-4 top-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
              <X size={16} />
            </button>
            <div className="flex items-center gap-2 text-white font-black text-sm tracking-tight border-b pb-3 border-gray-800">
              <FileText size={18} className="text-[#008751]" /> Registered CAC Trade Certificate Document
            </div>
            <div className="aspect-[4/3] bg-black/20 rounded-xl overflow-hidden border border-gray-800">
              <img src={cacPreviewUrl} className="w-full h-full object-contain" alt="CAC View Zoomed" />
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
