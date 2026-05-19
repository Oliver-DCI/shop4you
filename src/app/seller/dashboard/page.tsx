'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('active_user') || '{}');

    if (currentUser.role !== 'seller' && currentUser.role !== 'admin' && currentUser.firstName !== 'Admin') {
      router.push('/');
    } else {
      setIsSeller(true);
    }
    setLoading(false);
  }, [router]);

  const handleBulkImport = async () => {
    try {
      setImportStatus('');
      if (!jsonInput.trim()) {
        setImportStatus('❌ Bitte füge zuerst JSON-Daten ein.');
        return;
      }

      const parsedData = JSON.parse(jsonInput);
      const articlesArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      const currentUser = JSON.parse(localStorage.getItem('active_user') || '{}');

      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          products: articlesArray,
          role: currentUser.role || 'seller'
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        setImportStatus(`✅ ${resData.message}`);
        setJsonInput('');
      } else {
        setImportStatus(`❌ ${resData.error}`);
      }
    } catch (e) {
      setImportStatus('❌ Ungültiges JSON-Format. Bitte Syntax prüfen.');
    }
  };

  const insertTemplate = () => {
    const template = [
      { "title": "Core i9-14900K", "price": 589.00, "category": "Prozessoren", "description": "High-End CPU für extreme Setups" },
      { "title": "RTX 5080 Ti Super", "price": 1249.00, "category": "Grafikkarten", "description": "Next-Gen Grafikbeschleuniger" }
    ];
    setJsonInput(JSON.stringify(template, null, 2));
  };

  if (loading) {
    return <div className="p-20 text-center font-mono text-xs tracking-widest uppercase text-zinc-400 bg-white min-h-screen">Verifiziere Händler-Lizenz...</div>;
  }

  if (!isSeller) return null;

  return (
    <div className="min-h-screen bg-white text-black p-6 lg:p-10 relative overflow-hidden rounded-none selection:bg-black selection:text-white">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Dashboard-Header */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest bg-zinc-100 text-zinc-600 border border-zinc-200 px-2.5 py-1 rounded-none">
              shop4you // Händler-Zentrale
            </span>
            <h1 className="text-xl font-normal uppercase tracking-widest mt-3 text-black">
              Seller Dashboard
            </h1>
            <p className="text-zinc-400 text-xs mt-1 font-normal">
              Verwalte deine angebotene Hardware, nutze den Massenimport und verfolge deine Statistiken.
            </p>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="bg-white border border-zinc-200 hover:border-black text-black font-normal text-xs uppercase tracking-widest px-5 py-3 rounded-none transition-colors cursor-pointer"
          >
            ← Zum Shopfront
          </button>
        </div>

        {/* 📊 Statistik-Karten (Strenge Monochrome Boxen mit linker Orientierungslinie) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-none p-6 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-black" />
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
              Gesamtumsatz
            </p>
            <p className="text-2xl font-light text-black mt-1">14.249,00 €</p>
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider mt-1">Best Buyer: David S.</span>
          </div>

          <div className="bg-white border border-zinc-200 rounded-none p-6 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-black" />
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
              Verkaufte Artikel
            </p>
            <p className="text-2xl font-light text-black mt-1">42 Einheiten</p>
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider mt-1">Top Sector: Grafikkarten</span>
          </div>

          <div className="bg-white border border-zinc-200 rounded-none p-6 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-300" />
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
              Live-Angebote in DB
            </p>
            <p className="text-2xl font-light text-black mt-1">20 Artikel</p>
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider mt-1">PostgreSQL Connection</span>
          </div>
        </div>

        {/* 📉 Mittlere Sektion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Datenkurve: Monochrom flach */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 rounded-none flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Sales Volatility (2026)</h3>
              <div className="flex gap-3 text-[9px] font-medium uppercase tracking-widest text-zinc-400">
                <span>Daily</span>
                <span>Weekly</span>
                <span className="text-black border-b border-black pb-0.5">Monthly</span>
              </div>
            </div>

            {/* Eckiges Chart-Grid */}
            <div className="h-48 w-full flex items-end gap-2 pt-6 relative border-b border-zinc-200 bg-zinc-50 rounded-none px-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 px-2 py-4">
                <div className="w-full border-t border-dashed border-zinc-300 text-[8px] font-mono text-zinc-400 pt-0.5">200 SALES</div>
                <div className="w-full border-t border-dashed border-zinc-300 text-[8px] font-mono text-zinc-400 pt-0.5">100 SALES</div>
                <div className="w-full text-[8px] font-mono text-zinc-400">0</div>
              </div>
              
              {/* Rechteckige Balken ohne Rundung oder Farbverlauf */}
              {[35, 55, 45, 75, 40, 90, 65, 55, 70, 45, 65, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10 h-full justify-end">
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-zinc-300 group-hover:bg-black transition-colors rounded-none" 
                  />
                  <span className="text-[8px] text-zinc-400 font-medium uppercase mt-1.5 select-none font-mono">
                    {['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Importer */}
          <div className="bg-white border border-zinc-200 p-6 rounded-none flex flex-col gap-4">
            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-widest text-black">
                ■ Bulk Importer
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">Pushe maximal 5 Artikel simultan in die Datenbank.</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"title": "Produkt 1", "price": 299, ...}, {...}]'
                className="w-full flex-1 min-h-[140px] bg-white border border-zinc-200 rounded-none p-3 text-[11px] font-mono text-black focus:outline-none focus:border-black resize-none"
              />
              
              {importStatus && (
                <div className="text-[10px] font-mono text-center p-2 bg-zinc-50 border border-zinc-200 rounded-none text-zinc-600">
                  {importStatus}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={insertTemplate}
                  className="bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-[10px] font-medium uppercase tracking-widest py-3 rounded-none transition-colors cursor-pointer"
                >
                  📝 Template
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="bg-black hover:bg-zinc-900 text-white text-[10px] font-medium uppercase tracking-widest py-3 rounded-none transition-colors cursor-pointer"
                >
                  🚀 Import
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}