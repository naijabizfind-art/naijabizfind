import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, User, Loader2, AlertCircle } from 'lucide-react';

const API_BASE = 'https://naijabizfind.onrender.com/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('user'); // 'user' or 'owner'
  
  // Controlled input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Loading and Error Status Hooks
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Read URL params to pre-select role if they clicked a specific button on landing page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'owner') setRole('owner');
  }, [location]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Send registration payload directly to the authenticated user route
      const res = await fetch(`${API_BASE}/businesses/owner-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
          role
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration rejected by database cluster.');
      }

      // Populate local browser cache fields safely
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('username', data.name);
      localStorage.setItem('userPhone', data.phone);

      if (data.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to establish connection to authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join NaijaBizFind today</p>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold animate-in fade-in">
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`py-3 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${
                role === 'user' ? 'border-[#008751] bg-green-50 text-[#008751]' : 'border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              <User size={20} />
              <span className="text-sm font-bold">Explorer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`py-3 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${
                role === 'owner' ? 'border-[#008751] bg-green-50 text-[#008751]' : 'border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              <Store size={20} />
              <span className="text-sm font-bold">Business</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" 
              placeholder="niikpakpo" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email (Gmail)</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" 
              placeholder="user@gmail.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone Number</label>
            <input 
              type="tel" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" 
              placeholder="e.g. +2348031234567" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full text-white bg-[#008751] hover:bg-[#006B40] font-bold rounded-lg text-sm px-5 py-3.5 text-center transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-900/20 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Sign Up as {role === 'owner' ? 'Business' : 'Explorer'}
          </button>
          
          <p className="text-sm font-medium text-gray-500 text-center mt-4">
            Already have an account? <span onClick={() => navigate('/login')} className="text-[#008751] hover:underline cursor-pointer">Log in</span>
          </p>
        </form>
      </div>
    </div>
  );
}
