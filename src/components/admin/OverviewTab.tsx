'use client';

import React, { useState, useEffect } from 'react';

export default function OverviewTab() {
  const [timeFilter, setTimeFilter] = useState('MONAT');
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        // 🎯 Auf die neue globale Admin-API umgestellt
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          // Da die neue API ein flaches Array zurückgibt, zählen wir direkt die Länge
          setTotalProducts(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Produktanzahl:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchTotalProducts();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h2 className="text-xl uppercase tracking-wider font-light text-black">Unternehmens-Leistung & Business Intelligence</h2>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">Globales Reporting für Management und Investoren</p>
        </div>
        
        <div className="flex bg-zinc-100 p-1 border border-zinc-200 self-start sm:self-auto">
          {['HEUTE', '7 TAGE', 'MONAT', 'JAHR'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                timeFilter === filter ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-200 p-6 bg-zinc-50">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Gross Merchandise Value (GMV)</p>
          <p className="text-2xl font-mono mt-2 font-light">104.930,00 €</p>
          <span className="text-[9px] text-emerald-600 font-mono font-bold mt-1 inline-block">↑ 14.2% VS. VORMONAT</span>
        </div>
        <div className="border border-zinc-200 p-6 bg-zinc-50">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Plattform-Umsatz (Take-Rate 10%)</p>
          <p className="text-2xl font-mono mt-2 font-light">10.493,00 €</p>
          <span className="text-[9px] text-black font-mono mt-1 inline-block">REINER PLATTFORM-GEWINN</span>
        </div>
        <div className="border border-zinc-200 p-6 bg-zinc-50">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Ø Warenkorbwert (AOV)</p>
          <p className="text-2xl font-mono mt-2 font-light">642,10 €</p>
          <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono mt-1 inline-block">High-End Hardware Fokus</span>
        </div>
        
        {/* 🎯 ZÄHLER KORRIGIERT: Zieht die Daten nun sauber aus der Admin-Schnittstelle */}
        <div className="border border-zinc-200 p-6 bg-zinc-50">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Gesamte Artikel im Shop</p>
          <p className="text-2xl font-mono mt-2 font-light">
            {isLoadingProducts ? '...' : `${totalProducts} Stk.`}
          </p>
          <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono mt-1 inline-block">
            Aus PostgreSQL Datenbank
          </span>
        </div>
      </div>

      {/* Haupt-Diagramm */}
      <div className="border border-zinc-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black font-mono">Umsatzverlauf & Performance-Trend ({timeFilter})</p>
            <p className="text-[9px] text-zinc-400 uppercase font-mono tracking-wider">Intervall: Täglich aggregiert</p>
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
        <div className="flex justify-between font-mono text-[9px] text-zinc-400 uppercase tracking-widest mt-2 px-1">
          <span>Start</span>
          <span>Intervall Mitte</span>
          <span>Ende</span>
        </div>
      </div>

      {/* Detail-Analysen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-zinc-200 p-6 flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black font-mono">Top 3 Artikelumsatz</p>
            <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Die profitabelsten Hardware-Komponenten</p>
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-black font-mono">Kundenakquise & Wachstum</p>
            <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Neuregistrierungen im Quartalsvergleich</p>
          </div>
          <div className="h-32 flex items-end justify-between gap-6 font-mono text-[9px] text-zinc-400 pt-4 px-4 bg-zinc-50 border border-zinc-100">
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-zinc-300 transition-all hover:bg-black" style={{ height: '40%' }}></div><span>Q1</span></div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-zinc-300 transition-all hover:bg-black" style={{ height: '55%' }}></div><span>Q2</span></div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-zinc-400 transition-all hover:bg-black" style={{ height: '75%' }}></div><span>Q3</span></div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end"><div className="w-full bg-black transition-all" style={{ height: '95%' }}></div><span className="text-black font-bold">Q4 (ACT)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}