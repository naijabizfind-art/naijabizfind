import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Store, CheckCircle, XCircle, LogOut, Activity, Database, ChevronRight, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://naijabizfind.onrender.com/api';

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

  // Dynamic Data Stream States
  const [pendingListings, setPendingListings] = useState([]);
  const [allListingsCount, setAllListingsCount] = useState(0);
  const [totalTransactionsValue, setTotalTransactionsValue] = useState(0);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Parallax Scroll Tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hydrate Control Center with Secure Network Requests
  const loadControlCenterData = async () => {
    try {
      const adminSecret = localStorage.getItem('adminKey') || '';
      const requestHeaders = {
        'Content-Type': 'application/json',
        'x-admin-password': adminSecret
      };

      // 1. Pull Paid But Awaiting Approval Submissions
      const submissionsRes = await fetch(`${API_BASE}/admin/submissions`, { headers: requestHeaders });
      const pendingData = await submissionsRes.json();
      if (submissionsRes.ok) setPendingListings(pendingData);

      // 2. Fetch Aggregated Metrics for Global Counters
      const allRes = await fetch(`${API_BASE}/admin/all`, { headers: requestHeaders });
      const allData = await allRes.json();
      if (allRes.ok) setAllListingsCount(allData.length);

      // 3. Extract Financial Transaction Log Volatilities
      const transRes = await fetch(`${API_BASE}/admin/transactions`, { headers: requestHeaders });
      const transData = await transRes.json();
      if (transRes.ok) {
        const totalRevenue = transData.reduce((acc, tx) => acc + (tx.amount || 0), 0);
        setTotalTransactionsValue(totalRevenue);
      }

    } catch (err) {
      console.error("Failed to synchronize admin panel with backend data nodes:", err);
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

  // Live Core Verification Pipelines
  const handleApprove = async (id) => {
    setActionInProgress(id);
    try {
      const res = await fetch(`${API_BASE}/admin/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': localStorage.getItem('adminKey') || ''
        }
      });
      if (res.ok) {
        setPendingListings(prev => prev.filter(b => b._id !== id));
        setAllListingsCount(prev => prev + 1);
      } else {
        const err = await res.json();
        alert(`Approval rejected by server: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id) => {
    setActionInProgress(id);
    try {
      const res = await fetch(`${API_BASE}/admin/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': localStorage.getItem('adminKey') || ''
        },
        body: JSON.stringify({ reason: "Listing did not meet directory guidelines." })
      });
      if (res.ok) {
        setPendingListings(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-sm border border-gray-700 transition-all">
            <Activity size={18} className="text-red-400" />
            Command Center
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-900 hover:text-gray-300 rounded-xl font-semibold text-sm transition-all">
            <Store size={18} />
            All Businesses
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-900 hover:text-gray-300 rounded-xl font-semibold text-sm transition-all">
            <Database size={18} />
            Transactions
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800 mb-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-semibold text-sm transition-colors">
            <LogOut size={18} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-8 z-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div className="animate-[fadeIn_1s_ease-out]">
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Overview</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Review pending submissions and monitor platform health.</p>
          </div>
        </header>

        {/* 3D Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <AdminTiltCard title="Pending Approvals" value={isFetchingData ? "..." : pendingListings.length} icon={CheckCircle} delay="0s" colorClass="bg-yellow-500/20 text-yellow-500" />
          <AdminTiltCard title="Total Businesses" value={isFetchingData ? "..." : allListingsCount} icon={Store} delay="0.1s" colorClass="bg-green-500/20 text-green-500" />
          <AdminTiltCard title="Platform Revenue" value={isFetchingData ? "..." : `₦${totalTransactionsValue.toLocaleString()}`} icon={Users} delay="0.2s" colorClass="bg-blue-500/20 text-blue-500" />
        </div>

        {/* Pending Submissions Data Table */}
        <div 
          className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl transition-all duration-700 ease-out"
          style={{ transform: `translateY(${Math.max(0, 30 - scrollY * 0.1)}px)` }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Awaiting Verification
            </h3>
          </div>

          {isFetchingData ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-red-500" size={32} /></div>
          ) : pendingListings.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-700 rounded-2xl">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={40} />
              <p className="text-gray-400 font-bold">All caught up!</p>
              <p className="text-sm text-gray-600">No pending business submissions at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((business) => (
                <div key={business._id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-black/40 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors group">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                      {business.images?.shopPhoto || business.shopPhoto ? (
                        <img src={business.images?.shopPhoto || business.shopPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="text-gray-400" size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {business.name}
                        {business.plan === 'featured' && (
                          <span className="text-[10px] bg-[#008751]/20 text-[#008751] px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Featured</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{business.category} • {business.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <a 
                      href={`tel:${business.phone}`}
                      className="flex-1 md:flex-none text-center text-gray-400 hover:text-white px-4 py-2 text-sm font-bold transition-colors"
                    >
                      Call Owner
                    </a>
                    {actionInProgress === business._id ? (
                      <Loader2 className="animate-spin text-gray-400 mx-6" size={20} />
                    ) : (
                      <>
                        <button onClick={() => handleReject(business._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          <XCircle size={20} />
                        </button>
                        <button onClick={() => handleApprove(business._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-900/20">
                          <CheckCircle size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
