import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, User } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('user'); // 'user' or 'owner'

  // Read URL params to pre-select role if they clicked a specific button on landing page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'owner') setRole('owner');
  }, [location]);

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Wire up actual backend API call here
    // For now, simulate success and redirect based on role
    if (role === 'owner') {
      navigate('/dashboard');
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join NaijaBizFind today</p>
        </div>

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
            <input type="text" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" placeholder="niikpakpo" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email (Gmail)</label>
            <input type="email" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" placeholder="user@gmail.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Password</label>
            <input type="password" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#008751] focus:border-[#008751] block p-3 outline-none transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full text-white bg-[#008751] hover:bg-[#006B40] font-bold rounded-lg text-sm px-5 py-3.5 text-center transition-colors mt-4">
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