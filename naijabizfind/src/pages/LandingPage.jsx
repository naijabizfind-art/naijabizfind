import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Store, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Scroll listener for Parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#008751] rounded-lg flex items-center justify-center shadow-md shadow-green-900/20">
            <span className="text-white font-black text-xl leading-none">N</span>
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900">
            NaijaBiz<span className="text-[#008751]">Find</span>
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-600 hover:text-[#008751] transition-colors">
            Log in
          </button>
          <button onClick={() => navigate('/signup')} className="text-sm font-bold bg-[#008751] text-white px-5 py-2.5 rounded-lg hover:bg-[#006B40] transition-all shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center min-h-[90vh]">
        {/* Parallax Background Shapes */}
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        />

        <div 
          className="relative z-10 max-w-5xl"
          style={{ 
            opacity: 1 - scrollY / 600,
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-[#008751] text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#008751] animate-pulse"></span>
            Nigeria's #1 Business Directory
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]">
            Discover Top Services or <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008751] to-emerald-400">
              Grow Your Business
            </span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            The ultimate visual directory connecting skilled artisans, verified shops, and professionals with the people who need them.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
            <button 
              onClick={() => navigate('/signup?role=user')}
              className="group flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1 w-full md:w-auto"
            >
              <Search size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              I'm looking for services
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
            <button 
              onClick={() => navigate('/signup?role=owner')}
              className="group flex items-center justify-center gap-3 bg-[#008751] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#006B40] transition-all shadow-lg shadow-green-900/30 hover:-translate-y-1 w-full md:w-auto"
            >
              <Store size={20} className="text-green-200 group-hover:text-white transition-colors" />
              List my business
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </main>

      {/* 3D Scroll Cards Section */}
      <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">Why Choose NaijaBizFind?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ transform: `translateY(${Math.max(0, 50 - scrollY * 0.1)}px)` }}
            >
              <div className="w-16 h-16 bg-green-50 text-[#008751] rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Smart Discovery</h3>
              <p className="text-gray-500 leading-relaxed">Find exactly what you need with advanced visual filtering and location-based dynamic search maps.</p>
            </div>

            {/* Card 2 */}
            <div 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ transform: `translateY(${Math.max(0, 80 - scrollY * 0.15)}px)` }}
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Verified Listings</h3>
              <p className="text-gray-500 leading-relaxed">Trust in businesses that have been vetted and securely approved by our dedicated administrative team.</p>
            </div>

            {/* Card 3 */}
            <div 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ transform: `translateY(${Math.max(0, 110 - scrollY * 0.2)}px)` }}
            >
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Business Growth</h3>
              <p className="text-gray-500 leading-relaxed">Gain massive visibility, track your dashboard analytics, and attract high-quality local customers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}