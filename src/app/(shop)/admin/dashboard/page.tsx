'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OverviewTab from '@/components/admin/OverviewTab';
import ProductsTab from '@/components/admin/ProductsTab';
import SellersTab from '@/components/admin/SellersTab';
import ImportTab from '@/components/admin/ImportTab';
import AdminsTab from '@/components/admin/AdminsTab';

const initialSellers = [
  { id: 1, name: 'Alpha Hardware GmbH', itemsCount: 142, revenue: 89430, status: 'Aktiv' },
  { id: 2, name: 'TechNexus Corp', itemsCount: 48, revenue: 12400, status: 'Mahnung offen' },
  { id: 3, name: 'ByteBoutique', itemsCount: 19, revenue: 3100, status: 'Aktiv' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sellers, setSellers] = useState(initialSellers);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
    const userRoleNormalized = (currentUser.role || '').toUpperCase();

    if (userRoleNormalized !== 'ADMIN' && currentUser.firstName !== 'Admin') {
      router.push('/');
    } else {
      setIsAdmin(true);
    }
    setLoading(false);
  }, [router]);

  const handleMahnung = (id: number, name: string) => {
    setSellers(sellers.map(s => s.id === id ? { ...s, status: 'Gemahnt' } : s));
    alert(`⚠️ Händler "${name}" wurde offiziell gemahnt. Warnung im Seller-Dashboard hinterlegt.`);
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-mono text-xs tracking-widest uppercase text-zinc-400 bg-zinc-50 min-h-screen flex items-center justify-center">
        INITIALISIERE SECURE-CORE-SYSTEM...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans selection:bg-black selection:text-white">
      
      {/* Top Admin Bar */}
      <div className="bg-black text-white h-14 border-b border-zinc-800">
        <div className="max-w-[1400px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest bg-zinc-800 px-2 py-0.5 uppercase">Core-System</span>
            <h1 className="text-xs uppercase tracking-widest font-bold font-mono">SHOP4YOU // MANAGEMENT HQ</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* 🎯 FIX: Erzwingt den absoluten Pfad direkt auf /seller ohne /admin-Präfix */}
            <button 
              onClick={() => router.push('/seller/dashboard')}
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white px-2 py-1.5 bg-transparent transition-colors cursor-pointer font-mono"
            >
              ⚙️ Seller-HQ
            </button>
            <button 
              onClick={() => router.push('/')}
              className="text-[10px] font-mono uppercase tracking-widest text-white px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black transition-colors cursor-pointer font-mono"
            >
              ← Front-End
            </button>
            <div className="text-[11px] font-mono text-zinc-400 hidden md:block">
              ROLE: [SYSTEM_ADMIN]
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* LINKER BEREICH: Sidebar mit deiner neuen Sortierung 🎯 */}
        <div className="lg:col-span-1 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer font-mono ${activeTab === 'overview' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-zinc-500 hover:border-zinc-200 hover:text-black'}`}
          >
            📊 Metriken & Umsatz
          </button>
          
          <button 
            onClick={() => setActiveTab('sellers')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer font-mono ${activeTab === 'sellers' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-zinc-500 hover:border-zinc-200 hover:text-black'}`}
          >
            🏢 Verkäufer (Seller)
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer font-mono ${activeTab === 'products' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-zinc-500 hover:border-zinc-200 hover:text-black'}`}
          >
            🛍️ Produkt-Katalog
          </button>

          <button 
            onClick={() => setActiveTab('import')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer font-mono ${activeTab === 'import' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-zinc-500 hover:border-zinc-200 hover:text-black'}`}
          >
            📥 Datenimport
          </button>
          
          <button 
            onClick={() => setActiveTab('admins')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer font-mono ${activeTab === 'admins' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-zinc-500 hover:border-zinc-200 hover:text-black'}`}
          >
            🛡️ Team & Admins
          </button>
        </div>

        {/* RECHTER BEREICH: Dynamischer Content-Workspace */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'sellers' && <SellersTab sellers={sellers} onMahnung={handleMahnung} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'import' && <ImportTab />}
          {activeTab === 'admins' && <AdminsTab />}
        </div>
      </div>
    </div>
  );
}