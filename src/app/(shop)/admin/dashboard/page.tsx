'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OverviewTab from '@/components/admin/AdminOverviewTab';
import ProductsTab from '@/components/admin/AdminProductsTab';
import SellersTab from '@/components/admin/AdminSellersTab';
import ImportTab from '@/components/admin/AdminImportTab';
import AdminsTab from '@/components/admin/AdminsRechteTab';

// Definition des Seller-Interfaces passend zur Datenbank-Struktur
interface Seller {
  id: string; // 🎯 Geändert auf string für Prisma-UUIDs
  name: string;
  itemsCount: number;
  revenue: number;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // 🎯 State startet mit einem leeren Array und wird über die DB befüllt
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    // 1. Auth-Check
    const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
    const userRoleNormalized = (currentUser.role || '').toUpperCase();

    if (userRoleNormalized !== 'ADMIN' && currentUser.firstName !== 'Admin') {
      router.push('/');
      return;
    } else {
      setIsAdmin(true);
    }

    // 2. 🎯 Echte Händler-Daten aus der API laden
    async function fetchSellers() {
      try {
        const response = await fetch('/api/admin/sellers');
        if (response.ok) {
          const data = await response.json();
          setSellers(data);
        } else {
          console.error('Fehler beim Laden der Händler-Daten');
        }
      } catch (error) {
        console.error('Server-Verbindungsfehler:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSellers();
  }, [router]);

  // 🎯 ID-Typ auf string | number angepasst, um absolut kompatibel mit SellersTab zu sein
  const handleMahnung = async (id: string | number, name: string) => {
    try {
      // API-Call, um den Status in der DB zu ändern
      const response = await fetch(`/api/admin/sellers/${id}/mahnungen`, {
        method: 'POST',
      });

      if (response.ok) {
        setSellers(sellers.map(s => s.id === id ? { ...s, status: 'Gemahnt' } : s));
        alert(`⚠️ Händler "${name}" wurde offiziell gemahnt. Warnung im Seller-Dashboard hinterlegt.`);
      } else {
        alert('Fehler beim Speichern der Mahnung im System.');
      }
    } catch (error) {
      console.error('Mahnungs-Fehler:', error);
    }
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
            <button 
              onClick={() => router.push('/seller/dashboard')}
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white px-2 py-1.5 bg-transparent transition-colors cursor-pointer"
            >
              ⚙️ Seller-HQ
            </button>
            <button 
              onClick={() => router.push('/')}
              className="text-[10px] font-mono uppercase tracking-widest text-white px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black transition-colors cursor-pointer"
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
        
        {/* Sidebar */}
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

        {/* Content-Workspace */}
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