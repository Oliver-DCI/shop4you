'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [timeFilter, setTimeFilter] = useState('MONAT');

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
      <div className="p-20 text-center font-mono text-xs tracking-widest uppercase text-samsung-muted bg-zinc-50 min-h-screen flex items-center justify-center">
        INITIALISIERE SECURE-CORE-SYSTEM...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans selection:bg-black selection:text-white">
      
      {/* Top Admin Bar */}
      <div className="bg-black text-white h-14 px-8 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono tracking-widest bg-zinc-800 px-2 py-0.5 uppercase">Core-System</span>
          <h1 className="text-xs uppercase tracking-widest font-bold">SHOP4YOU // MANAGEMENT HQ</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted hover:text-white border border-zinc-800 px-3 py-1 bg-zinc-900 transition-colors cursor-pointer"
          >
            ← Zum Shop Front-End
          </button>
          <div className="text-[11px] font-mono text-samsung-muted hidden sm:block">
            ROLE: [SYSTEM_ADMIN]
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* LINKER BEREICH: CEO-STEUERUNG (Sidebar) */}
        <div className="lg:col-span-1 flex flex-col gap-1">
          <p className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest mb-4 px-2">Kommando-Zentrale</p>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-samsung-muted hover:border-zinc-200 hover:text-black'}`}
          >
            📊 Live-Metriken & Umsatz
          </button>
          <button 
            onClick={() => setActiveTab('sellers')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer ${activeTab === 'sellers' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-samsung-muted hover:border-zinc-200 hover:text-black'}`}
          >
            🏢 Verkäufer (Seller)
          </button>
          <button 
            onClick={() => setActiveTab('import')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer ${activeTab === 'import' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-samsung-muted hover:border-zinc-200 hover:text-black'}`}
          >
            📥 25-Artikel Datenimport
          </button>
          <button 
            onClick={() => setActiveTab('admins')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest border transition-colors cursor-pointer ${activeTab === 'admins' ? 'bg-black text-white border-black' : 'bg-white border-transparent text-samsung-muted hover:border-zinc-200 hover:text-black'}`}
          >
            🛡️ Team & Admins
          </button>
        </div>

        {/* RECHTER BEREICH: Dynamischer Content-Workspace */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                <div>
                  <h2 className="text-xl uppercase tracking-wider font-light">Unternehmens-Leistung & Business Intelligence</h2>
                  <p className="text-samsung-muted text-[10px] uppercase tracking-widest mt-1">Globales Reporting für Management und Investoren</p>
                </div>
                
                <div className="flex bg-zinc-100 p-1 border border-zinc-200 self-start sm:self-auto">
                  {['HEUTE', '7 TAGE', 'MONAT', 'JAHR'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                        timeFilter === filter ? 'bg-black text-white' : 'text-samsung-muted hover:text-black'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-[10px] text-samsung-muted uppercase tracking-widest">Gross Merchandise Value (GMV)</p>
                  <p className="text-2xl font-mono mt-2 font-light">104.930,00 €</p>
                  <span className="text-[9px] text-emerald-600 font-mono font-bold mt-1 inline-block">↑ 14.2% VS. VORMONAT</span>
                </div>
                <div className="border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-[10px] text-samsung-muted uppercase tracking-widest">Plattform-Umsatz (Take-Rate 10%)</p>
                  <p className="text-2xl font-mono mt-2 font-light">10.493,00 €</p>
                  <span className="text-[9px] text-black font-mono mt-1 inline-block">REINER PLATTFORM-GEWINN</span>
                </div>
                <div className="border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-[10px] text-samsung-muted uppercase tracking-widest">Ø Warenkorbwert (AOV)</p>
                  <p className="text-2xl font-mono mt-2 font-light">642,10 €</p>
                  <span className="text-[9px] text-samsung-muted uppercase tracking-widest mt-1 inline-block">High-End Hardware Fokus</span>
                </div>
                <div className="border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-[10px] text-samsung-muted uppercase tracking-widest">Kunden-Konvertierungsrate</p>
                  <p className="text-2xl font-mono mt-2 font-light">3.84 %</p>
                  <span className="text-[9px] text-emerald-600 font-mono font-bold mt-1 inline-block">↑ 0.5% OPTIMIERT</span>
                </div>
              </div>

              {/* Haupt-Diagramm */}
              <div className="border border-zinc-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">Umsatzverlauf & Performance-Trend ({timeFilter})</p>
                    <p className="text-[9px] text-samsung-muted uppercase font-mono tracking-wider">Intervall: Täglich aggregiert</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold">Spitzenwert: 8.400 € / Tag</span>
                  </div>
                </div>
                
                <div className="w-full h-48 relative bg-zinc-50 border border-zinc-100 p-2">
                  <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="100" x2="1000" y2="100" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="150" x2="1000" y2="150" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="4" />
                    <path d="M 0,200 L 0,150 L 150,130 L 300,160 L 450,80 L 600,95 L 750,40 L 900,60 L 1000,20 L 1000,200 Z" fill="rgba(0,0,0,0.03)" />
                    <path d="M 0,150 L 150,130 L 300,160 L 450,80 L 600,95 L 750,40 L 900,60 L 1000,20" fill="none" stroke="black" strokeWidth="2" />
                    <circle cx="450" cy="80" r="3" fill="black" />
                    <circle cx="750" cy="40" r="3" fill="black" />
                    <circle cx="1000" cy="20" r="4" fill="black" />
                  </svg>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-samsung-muted uppercase tracking-widest mt-2 px-1">
                  <span>Start</span>
                  <span>Intervall Mitte</span>
                  <span>Ende</span>
                </div>
              </div>

              {/* Detail-Analysen */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-zinc-200 p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">Top 3 Artikelumsatz</p>
                    <p className="text-[9px] text-samsung-muted uppercase tracking-widest">Die profitabelsten Hardware-Komponenten</p>
                  </div>
                  <div className="flex flex-col gap-4 font-mono text-[11px] mt-2">
                    <div>
                      <div className="flex justify-between text-[10px] uppercase mb-1">
                        <span className="font-sans font-medium text-black">MacBook Pro Studio M5X</span>
                        <span className="font-bold">42.100 €</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 rounded-none"><div className="h-full bg-black transition-all" style={{ width: '85%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase mb-1">
                        <span className="font-sans font-medium text-black">UltraWide Quantum OLED 49"</span>
                        <span className="font-bold">28.900 €</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 rounded-none"><div className="h-full bg-black transition-all" style={{ width: '58%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase mb-1">
                        <span className="font-sans font-medium text-black">GeForce RTX 5090 Ti Founders</span>
                        <span className="font-bold">19.400 €</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 rounded-none"><div className="h-full bg-zinc-400 transition-all" style={{ width: '40%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="border border-zinc-200 p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">Kundenakquise & Wachstum</p>
                    <p className="text-[9px] text-samsung-muted uppercase tracking-widest">Neuregistrierungen im Quartalsvergleich</p>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-6 font-mono text-[9px] text-samsung-muted pt-4 px-4 bg-zinc-50 border border-zinc-100">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-zinc-300 transition-all hover:bg-black" style={{ height: '40%' }}></div><span>Q1</span></div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-zinc-300 transition-all hover:bg-black" style={{ height: '55%' }}></div><span>Q2</span></div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-zinc-400 transition-all hover:bg-black" style={{ height: '75%' }}></div><span>Q3</span></div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-black transition-all" style={{ height: '95%' }}></div><span className="text-black font-bold">Q4 (ACT)</span></div>
                  </div>
                </div>
              </div>

              {/* Händler-Umsatzmatrix */}
              <div className="border border-zinc-200 p-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black">Händler-Umsatzanteil (Share of Wallet)</p>
                  <p className="text-[9px] text-samsung-muted uppercase tracking-widest">Direkte Performance-Auswertung aller Seller im System</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs pt-4 mt-2">
                  <div className="border-l-2 border-black pl-4 py-2">
                    <p className="font-sans font-bold text-black text-xs uppercase">Alpha Hardware</p>
                    <p className="text-lg font-light mt-1">89.430 €</p>
                    <p className="text-[9px] text-samsung-muted uppercase tracking-wider mt-0.5">Anteil am Marktplatz: 85.2%</p>
                  </div>
                  <div className="border-l-2 border-zinc-400 pl-4 py-2">
                    <p className="font-sans font-medium text-zinc-700 text-xs uppercase">TechNexus Corp</p>
                    <p className="text-lg font-light mt-1 text-zinc-600">12.400 €</p>
                    <p className="text-[9px] text-samsung-muted uppercase tracking-wider mt-0.5">Anteil am Marktplatz: 11.8%</p>
                  </div>
                  <div className="border-l-2 border-zinc-200 pl-4 py-2">
                    <p className="font-sans font-medium text-zinc-500 text-xs uppercase">ByteBoutique</p>
                    <p className="text-lg font-light mt-1 text-samsung-muted">3.100 €</p>
                    <p className="text-[9px] text-samsung-muted uppercase tracking-wider mt-0.5">Anteil am Marktplatz: 3.0%</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SELLERS */}
          {activeTab === 'sellers' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl uppercase tracking-wider font-light">Verkäufer-Netzwerk (Sellers)</h2>
                <p className="text-samsung-muted text-[10px] uppercase tracking-widest mt-1">Überwachung von Artikeln, Umsätzen und Compliance</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[10px] uppercase text-samsung-muted tracking-wider">
                      <th className="py-3 font-normal">Händler Name</th>
                      <th className="py-3 font-normal text-right">Gelistete Artikel</th>
                      <th className="py-3 font-normal text-right">Gesamtumsatz</th>
                      <th className="py-3 font-normal text-center">Status</th>
                      <th className="py-3 font-normal text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-zinc-100">
                    {sellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-zinc-50">
                        <td className="py-4 font-sans font-medium text-black">{seller.name}</td>
                        <td className="py-4 text-right">{seller.itemsCount} Stk.</td>
                        <td className="py-4 text-right font-bold">{seller.revenue.toLocaleString('de-DE')} €</td>
                        <td className="py-4 text-center">
                          <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold ${seller.status === 'Aktiv' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : seller.status === 'Mahnung offen' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            {seller.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleMahnung(seller.id, seller.name)}
                            disabled={seller.status === 'Gemahnt'}
                            className="text-[10px] border border-zinc-200 hover:border-black text-black px-3 py-1.5 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            🚨 Mahnen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DATAIMPORT */}
          {activeTab === 'import' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl uppercase tracking-wider font-light">Massen-Datenimport (JSON)</h2>
                <p className="text-samsung-muted text-[10px] uppercase tracking-widest mt-1">Einspeisung von 25 vordefinierten High-End Tech-Artikeln in die Datenbank</p>
              </div>
              <div className="border border-dashed border-zinc-300 p-8 text-center flex flex-col items-center justify-center bg-zinc-50">
                <span className="text-3xl mb-3">📦</span>
                <p className="text-xs uppercase tracking-wider font-medium text-black">25 Premium-Hardware-Artikel bereit zur Injektion</p>
                <p className="text-[10px] text-samsung-muted uppercase tracking-widest mt-1 mb-6">Prüft Kategorien, Bilder-URLs und setzt Standard-Lagerbestände</p>
                <button className="bg-black text-white text-[10px] font-mono tracking-widest px-6 py-3 uppercase hover:bg-zinc-900 transition-colors cursor-pointer">
                  EXECUTE_MASS_IMPORT.JSON
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TEAM & ADMINS */}
          {activeTab === 'admins' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl uppercase tracking-wider font-light">Administratoren & Rechteverwaltung</h2>
                  <p className="text-samsung-muted text-[10px] uppercase tracking-widest mt-1">Berechtigte Teammitglieder für das Marktplatz-HQ</p>
                </div>
                <button 
                  onClick={() => setShowAdminForm(!showAdminForm)}
                  className="bg-black text-white text-[10px] tracking-widest px-4 py-2 uppercase hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  {showAdminForm ? 'Schließen' : '+ NEUEN ADMIN ANLEGEN'}
                </button>
              </div>

              {showAdminForm && (
                <div className="border border-black p-6 bg-zinc-50 flex flex-col gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black">Neuen System-Administrator autorisieren</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="VORNAME" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
                    <input type="text" placeholder="NACHNAME" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
                  </div>
                  <input type="email" placeholder="E-MAIL ADRESSE" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
                  <input type="password" placeholder="PASSWORT" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
                  <button className="bg-black text-white text-[10px] tracking-widest py-3 uppercase hover:bg-zinc-900 transition-colors self-start px-6 cursor-pointer">
                    ADMIN-RECHTE ERTEILEN
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}