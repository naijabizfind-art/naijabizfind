import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_BASE = 'https://naijabizfind.onrender.com/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Form input hooks
  const [phoneInput, setPhoneInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status monitors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Stealth Trigger Logic
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount === 5) {
      setIsAdminMode(true);
      setLogoClicks(0); 
    }
  };

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE}/businesses/owner-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid telephone identification credentials.');
      }

      // Save database validated profiles globally to client cache
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userPhone', data.phone);
      localStorage.setItem('username', data.name);

      if (data.role === 'owner') {
        navigate('/dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/explore');
      }

    } catch (err) {
      setErrorMessage(err.message || 'Database validation stream link broken.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const secretKey = e.target.adminKey.value;
    
    localStorage.setItem('adminKey', secretKey);
    localStorage.setItem('userRole', 'admin');
    navigate('/admin'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-green-400/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#008751]/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 3D Flip Container */}
      <div className="relative w-full max-w-md h-[500px]" style={{ perspective: '1000px' }}>
        
        <div 
          className="w-full h-full transition-transform duration-700 ease-in-out relative"
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: isAdminMode ? 'rotateY(180deg)' : 'rotateY(0deg)' 
          }}
        >
          {/* ================= FRONT: NORMAL LOGIN ================= */}
          <div 
            className="absolute inset-0 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center mb-8">
              {/* Stealth Toggle Switch */}
              <div 
                onClick={handleLogoClick}
                className="w-12 h-12 bg-[#008751] rounded-xl flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-green-900/20 select-none"
              >
                <span className="text-white font-black text-2xl leading-none">N</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
            </div>

            {errorMessage && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
                <AlertCircle size={14} /> {errorMessage}
              </div>
            )}

            <form onSubmit={handleNormalLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone Number</label>
                <input 
                  type="text" 
                  required 
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" 
                  placeholder="e.g. +2348031234567" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 pr-10 outline-none transition-all" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full text-white bg-[#008751] hover:bg-[#006B40] font-bold rounded-lg text-sm px-5 py-3.5 text-center transition-all transform active:scale-95 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Log In
              </button>
              
              <p className="text-sm font-medium text-gray-500 text-center mt-4">
                Don't have an account? <span onClick={() => navigate('/signup')} className="text-[#008751] hover:underline cursor-pointer">Sign up</span>
              </p>
            </form>
          </div>

          {/* ================= BACK: STEALTH ADMIN LOGIN ================= */}
          <div 
            className="absolute inset-0 bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800 flex flex-col justify-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)' 
            }}
          >
            <button 
              type="button"
              onClick={() => setIsAdminMode(false)} 
              className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center mb-8 mt-4">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="text-red-500" size={28} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-wider">RESTRICTED</h2>
              <p className="text-xs text-red-400 font-bold tracking-[0.2em] uppercase mt-2">Admin Clearance Required</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Enter Secret Key</label>
                <input 
                  name="adminKey"
                  type="password" 
                  required 
                  className="w-full bg-black/50 border border-gray-800 text-white text-center text-xl tracking-widest rounded-lg focus:ring-red-500 focus:border-red-500 block p-4 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>

              <button type="submit" className="w-full text-white bg-red-600 hover:bg-red-700 font-bold uppercase tracking-widest rounded-lg text-sm px-5 py-4 text-center transition-all transform active:scale-95 shadow-lg shadow-red-900/20">
                Authenticate
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
