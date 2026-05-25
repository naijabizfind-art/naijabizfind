import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Store, CheckCircle, XCircle, LogOut, Activity, Database, ChevronRight } from 'lucide-react';

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

  // Mocking the pending submissions from your backend
  const [pendingListings, setPendingListings] = useState([
    { _id: '1', name: 'AJ Enterprise Tech', category: 'technology', city: 'Accra', plan: 'featured' },
    { _id: '2', name: 'Kpakpo Auto Spares', category: 'automotive', city: 'Kumasi', plan: 'basic' }
  ]);

  // Parallax Scroll Tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smart Logout Function
  const handleLogout = () => {
    // Clear the secret keys and roles from local storage
    localStorage.removeItem('adminKey');
    localStorage.removeItem('userRole');
    // Send back to standard login
    navigate('/login');
  };

  const handleApprove = (id) => {
    // TODO: Call PUT /api/admin/approve/:id
    setPendingListings(pendingListings.filter(b => b._id !== id));
  };

  const handleReject = (id) => {
    // TODO: Call PUT /api/admin/reject/:id
    setPendingListings(pendingListings.filter(b => b._id !== id));
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
          <AdminTiltCard title="Pending Approvals" value={pendingListings.length} icon={CheckCircle} delay="0s" colorClass="bg-yellow-500/20 text-yellow-500" />
          <AdminTiltCard title="Total Businesses" value="142" icon={Store} delay="0.1s" colorClass="bg-green-500/20 text-green-500" />
          <AdminTiltCard title="Total Users" value="3,892" icon={Users} delay="0.2s" colorClass="bg-blue-500/20 text-blue-500" />
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

          {pendingListings.length === 0 ? (
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
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Store className="text-gray-400" size={20} />
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
                    <button className="flex-1 md:flex-none text-gray-400 hover:text-white px-4 py-2 text-sm font-bold transition-colors">
                      View Details
                    </button>
                    <button onClick={() => handleReject(business._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <XCircle size={20} />
                    </button>
                    <button onClick={() => handleApprove(business._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-900/20">
                      <CheckCircle size={20} />
                    </button>
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