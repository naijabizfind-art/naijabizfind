import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, PlusCircle, CreditCard, LogOut, Settings } from 'lucide-react';

export default function OwnerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#008751] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl leading-none">N</span>
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900">NaijaBiz<span className="text-[#008751]">Find</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-[#008751] rounded-xl font-bold text-sm">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-colors">
            <Store size={18} />
            My Listings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-colors">
            <CreditCard size={18} />
            Payments
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-50">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Business Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your storefronts and performance.</p>
          </div>
          <button className="bg-[#008751] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#006B40] transition-colors shadow-sm shadow-green-900/10">
            <PlusCircle size={18} />
            Add New Listing
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Views</div>
            <div className="text-3xl font-black text-gray-900">0</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Active Listings</div>
            <div className="text-3xl font-black text-gray-900">0</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Rating</div>
            <div className="text-3xl font-black text-gray-900">--</div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white border border-gray-100 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <Store size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No businesses listed yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">Create your first business listing to get discovered by users across NaijaBizFind.</p>
          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors">
            <PlusCircle size={18} />
            Register Business
          </button>
        </div>
      </main>
    </div>
  );
}