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
    return <div className="p-20 text-center font-mono font-bold text-zinc-500">Verifiziere Händler-Lizenz...</div>;
  }

  if (!isSeller) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-6 lg:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        
        {/* Dashboard-Kopf (Dunkles Dashboard-Thema aus deiner Grafikvorlage) */}
        <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-950 text-purple-400 border border-purple-900/50 px-2.5 py-1 rounded-md">
              shop4you // Händler-Zentrale
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight mt-2 text-white">
              Seller <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Dashboard</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1 font-medium">
              Verwalte deine angebotene Hardware, nutze den Massenimport und verfolge deine Statistiken.
            </p>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all active:scale-95"
          >
            ← Zum Shopfront
          </button>
        </div>

        {/* 📊 Statistik-Karten (Exakt angelehnt an dein Wunsch-Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121214] border border-zinc-800/80 p-6 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              Gesamtumsatz
            </p>
            <p className="text-3xl font-black text-white mt-1">14.249,00 €</p>
            <span className="text-[10px] text-emerald-400 font-medium mt-1">Bester Käufer: David S. (5 Käufe)</span>
          </div>

          <div className="bg-[#121214] border border-zinc-800/80 p-6 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500" />
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              Verkaufte Artikel
            </p>
            <p className="text-3xl font-black text-white mt-1">42 Einheiten</p>
            <span className="text-[10px] text-purple-400 font-medium mt-1">Top-Sektor: Grafikkarten</span>
          </div>

          <div className="bg-[#121214] border border-zinc-800/80 p-6 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              Live-Angebote in DB
            </p>
            <p className="text-3xl font-black text-white mt-1">20 Artikel</p>
            <span className="text-[10px] text-zinc-500 font-medium mt-1">Aus deiner PostgreSQL</span>
          </div>
        </div>

        {/* 📉 Mittlere Sektion: Diagramm & Massenimport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Linke Seite: Das Kurvendiagramm-Visual (Aus deinem Screenshot abgeleitet) */}
          <div className="lg:col-span-2 bg-[#121214] border border-zinc-800/80 p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sales Volatility (2026)</h3>
              <div className="flex gap-3 text-[10px] font-bold text-zinc-500">
                <span>Daily</span>
                <span>Weekly</span>
                <span className="text-purple-400 border-b border-purple-400 pb-0.5">Monthly</span>
              </div>
            </div>

            {/* Simulierter Graph über CSS-Höhen */}
            <div className="h-48 w-full flex items-end gap-3 pt-6 relative border-b border-zinc-800 bg-[#09090b]/50 rounded-xl px-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 px-2 py-4">
                <div className="w-full border-t border-dashed border-white text-[8px]">200 Sales</div>
                <div className="w-full border-t border-dashed border-white text-[8px]">100 Sales</div>
                <div className="w-full text-[8px]">0</div>
              </div>
              
              {/* Die Monats-Balken */}
              {[35, 55, 45, 75, 40, 90, 65, 55, 70, 45, 65, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10 h-full justify-end">
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-gradient-to-t from-purple-600/20 via-pink-500/40 to-purple-400 rounded-t-sm transition-all duration-300 group-hover:to-cyan-400" 
                  />
                  <span className="text-[8px] text-zinc-600 font-bold uppercase mt-1.5 select-none">
                    {['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Seite: Der 5-auf-einmal JSON Importer */}
          <div className="bg-[#121214] border border-zinc-800/80 p-6 rounded-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                ⚡ Bulk Importer
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1">Pushe maximal 5 Artikel simultan in die Datenbank.</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"title": "Produkt 1", "price": 299, ...}, {...}]'
                className="w-full flex-1 min-h-[140px] bg-[#09090b] border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-purple-500 transition-all resize-none"
              />
              
              {importStatus && (
                <div className="text-[10px] font-bold text-center p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  {importStatus}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={insertTemplate}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all"
                >
                  📝 Template
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase py-2.5 rounded-xl transition-all"
                >
                  🚀 Import
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Produkt-Verwaltungs-Tabelle */}
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-zinc-800 bg-[#09090b]/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Deine gelisteten Artikel</h3>
          </div>
          
          <div className="p-6 text-center text-zinc-500 text-xs font-bold uppercase py-12">
            Hier binden wir als Nächstes die Tabelle deiner Live-Datenbankartikel ein!
          </div>
        </div>

      </div>
    </div>
  );
}