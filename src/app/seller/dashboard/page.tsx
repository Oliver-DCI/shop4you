// src/app/(shop)/seller/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Importer-States
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState('');

  // 🔐 Sicherheits-Check: Nur echte Händler oder der Admin dürfen rein!
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('active_user') || '{}');

    if (currentUser.role !== 'seller' && currentUser.role !== 'admin' && currentUser.firstName !== 'Admin') {
      // Kein Händler oder Admin? Sofort zurück auf die Startseite werfen!
      router.push('/');
    } else {
      setIsSeller(true);
    }
    setLoading(false);
  }, [router]);

  // ⚡ Lightning Bulk Import Logik (Maximal 5 Artikel gleichzeitig für den Seller)
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
      setImportStatus('❌ Ungültiges JSON-Format. Bitte überprüfe die Syntax.');
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
    return <div className="p-20 text-center font-mono font-bold text-zinc-400">Verifiziere Händler-Lizenz...</div>;
  }

  if (!isSeller) return null;

  return (
    /* 🎨 Clean White & Bright Background mit sanften Blaulicht-Einflüssen */
    <div className="min-h-screen bg-zinc-50/50 text-zinc-800 p-6 lg:p-10 font-sans relative overflow-hidden">
      
      {/* Subtile Glow-Atmosphäre im Hintergrund */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-200/15 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Dashboard-Kopf im hellen Glass-Stil */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 text-zinc-600 border border-zinc-200 px-2.5 py-1 rounded-md shadow-sm">
              shop4you // Händler-Zentrale
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight mt-2 text-zinc-900">
              Seller <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Dashboard</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-1 font-medium">
              Verwalte deine angebotene Hardware, nutze den Massenimport und verfolge deine Statistiken.
            </p>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            ← Zum Shopfront
          </button>
        </div>

        {/* 📊 Statistik-Karten (Mattes Milchglas-Design für maximale Tiefe) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-md border border-white rounded-2xl p-6 flex flex-col gap-1 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Gesamtumsatz
            </p>
            <p className="text-3xl font-black text-zinc-900 mt-1">14.249,00 €</p>
            <span className="text-[10px] text-emerald-600 font-medium mt-1">Bester Käufer: David S. (5 Käufe)</span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white rounded-2xl p-6 flex flex-col gap-1 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Verkaufte Artikel
            </p>
            <p className="text-3xl font-black text-zinc-900 mt-1">42 Einheiten</p>
            <span className="text-[10px] text-indigo-600 font-medium mt-1">Top-Sektor: Grafikkarten</span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white rounded-2xl p-6 flex flex-col gap-1 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-400" />
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              Live-Angebote in DB
            </p>
            <p className="text-3xl font-black text-zinc-900 mt-1">20 Artikel</p>
            <span className="text-[10px] text-zinc-400 font-medium mt-1">Aus deiner PostgreSQL</span>
          </div>
        </div>

        {/* 📉 Mittlere Sektion: Diagramm & Massenimport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Linke Seite: Das Kurvendiagramm-Visual (Komplett aufgehellt) */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-white p-6 rounded-2xl flex flex-col gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sales Volatility (2026)</h3>
              <div className="flex gap-3 text-[10px] font-bold text-zinc-400">
                <span>Daily</span>
                <span>Weekly</span>
                <span className="text-blue-500 border-b-2 border-blue-500 pb-0.5">Monthly</span>
              </div>
            </div>

            {/* Helles Chart-Grid */}
            <div className="h-48 w-full flex items-end gap-3 pt-6 relative border-b border-zinc-100 bg-zinc-50/50 rounded-xl px-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 px-2 py-4">
                <div className="w-full border-t border-dashed border-zinc-200 text-[8px] text-zinc-400 pt-0.5">200 Sales</div>
                <div className="w-full border-t border-dashed border-zinc-200 text-[8px] text-zinc-400 pt-0.5">100 Sales</div>
                <div className="w-full text-[8px] text-zinc-400">0</div>
              </div>
              
              {/* Die hellen Monats-Balken mit schickem blauen Finish */}
              {[35, 55, 45, 75, 40, 90, 65, 55, 70, 45, 65, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10 h-full justify-end">
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-gradient-to-t from-blue-500/10 via-blue-500/30 to-blue-500 rounded-t-sm transition-all duration-300 group-hover:to-indigo-600" 
                  />
                  <span className="text-[8px] text-zinc-400 font-bold uppercase mt-1.5 select-none">
                    {['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Seite: Der 5-auf-einmal JSON Importer */}
          <div className="bg-white/70 backdrop-blur-md border border-white p-6 rounded-2xl flex flex-col gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                ⚡ Bulk Importer
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">Pushe maximal 5 Artikel simultan in die Datenbank.</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"title": "Produkt 1", "price": 299, ...}, {...}]'
                className="w-full flex-1 min-h-[140px] bg-white border border-zinc-200 rounded-xl p-3 text-[11px] font-mono text-zinc-700 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-inner"
              />
              
              {importStatus && (
                <div className="text-[10px] font-bold text-center p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600">
                  {importStatus}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={insertTemplate}
                  className="bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-500 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  📝 Template
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  🚀 Import
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Produkt-Verwaltungs-Tabelle im abgestimmten Design */}
        <div className="bg-white/70 backdrop-blur-md border border-white rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/30">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Deine gelisteten Artikel</h3>
          </div>
          
          <div className="p-6 text-center text-zinc-400 text-xs font-bold uppercase py-12">
            Hier binden wir als Nächstes die Tabelle deiner Live-Datenbankartikel ein!
          </div>
        </div>

      </div>
    </div>
  );
}