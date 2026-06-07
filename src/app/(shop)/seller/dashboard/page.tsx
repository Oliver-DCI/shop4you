'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SellerStats {
  totalRevenue: number;
  totalSalesCount: number;
  liveProductsCount: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
  createdAt?: string;
}

// 🎯 FEST HINTERLEGTE ERLAUBTE KATEGORIEN (Whitelist)
const ALLOWED_CATEGORIES = ['Notebooks', 'Smartphones', 'TV', 'Audio', 'Zubehör'];

export default function SellerDashboardPage() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [livePreview, setLivePreview] = useState<any[]>([]);

  const [stats, setStats] = useState<SellerStats>({ totalRevenue: 0, totalSalesCount: 0, liveProductsCount: 0 });
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // 🎯 STATE FÜR CUSTOM-LÖSCHMODAL (Ersetzt localhost:3000)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
    const userRoleNormalized = (currentUser.role || '').toUpperCase();
    const userId = currentUser.id;

    if (userRoleNormalized !== 'SELLER' && userRoleNormalized !== 'ADMIN' && currentUser.firstName !== 'Admin') {
      router.push('/');
      return;
    }
    
    setIsSeller(true);

    async function fetchDashboardData() {
      try {
        const statsRes = await fetch(`/api/seller/stats?userId=${userId}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const productsRes = await fetch(`/api/seller/products?userId=${userId}`);
        if (productsRes.ok) {
          const productsData: Product[] = await productsRes.json();
          setMyProducts(productsData);

          if (productsData.length > 0) {
            const monthlyDistribution = new Array(12).fill(0);
            productsData.forEach((product, index) => {
              const month = product.createdAt 
                ? new Date(product.createdAt).getMonth() 
                : (index % 12); 
              monthlyDistribution[month] += 1;
            });

            const maxVal = Math.max(...monthlyDistribution);
            const scaledData = monthlyDistribution.map(val => 
              maxVal > 0 ? Math.round((val / maxVal) * 95) : 10
            );
            setChartData(scaledData);
          } else {
            setChartData([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]);
          }
        }
      } catch (err) {
        console.error("Fehler beim Abrufen der Live-Daten:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchDashboardData();
    }
  }, [router, refreshTrigger]);

  useEffect(() => {
    if (!jsonInput.trim()) {
      setLivePreview([]);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const array = Array.isArray(parsed) ? parsed : [parsed];
      setLivePreview(array);
    } catch (e) {
      setLivePreview([]);
    }
  }, [jsonInput]);

  // Trigger für das Öffnen des Custom-Modals
  const handleOpenDeleteModal = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(productId);
  };

  // Die eigentliche Lösch-Logik, die vom Modal aufgerufen wird
  const confirmDeleteProduct = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await fetch(`/api/seller/products?id=${deleteTargetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert('Fehler beim Löschen des Artikels.');
      }
    } catch (err) {
      console.error("Lösch-Fehler:", err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const removeProductFromPreview = (e: React.MouseEvent, indexToRemove: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const parsed = JSON.parse(jsonInput);
      const array = Array.isArray(parsed) ? parsed : [parsed];
      const updatedArray = array.filter((_, idx) => idx !== indexToRemove);
      if (updatedArray.length === 0) {
        setJsonInput('');
        setLivePreview([]);
      } else {
        setJsonInput(JSON.stringify(updatedArray, null, 2));
      }
    } catch (err) {
      console.error("Vorschau-Fehler:", err);
    }
  };

  const handleBulkImport = async () => {
    try {
      setImportStatus('');
      if (!jsonInput.trim()) {
        setImportStatus('❌ Bitte füge JSON ein.');
        return;
      }
      
      const parsedData = JSON.parse(jsonInput);
      const articlesArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // 🎯 FRONTEND-VALIDIERUNG: Prüfen ob unerlaubte Kategorien enthalten sind
      for (const prod of articlesArray) {
        if (!prod.category || !ALLOWED_CATEGORIES.includes(prod.category)) {
          setImportStatus(`❌ Fehler: '${prod.category || 'Keine'}' ist keine erlaubte Kategorie. Erlaubt sind nur: ${ALLOWED_CATEGORIES.join(', ')}`);
          return;
        }
      }

      const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
      const userId = currentUser.id;

      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          products: articlesArray,
          role: currentUser.role?.toUpperCase() || 'SELLER',
          userId: userId
        }),
      });

      if (response.ok) {
        setImportStatus(`✅ Import erfolgreich!`);
        setJsonInput('');
        setLivePreview([]);
        setRefreshTrigger(prev => prev + 1);
      } else {
        const resData = await response.json();
        setImportStatus(`❌ ${resData.error || 'Fehler beim DB-Upload.'}`);
      }
    } catch (e) {
      setImportStatus('❌ JSON Syntax prüfen.');
    }
  };

  const insertTemplate = () => {
    const template = [
      {
        "title": "UltraBook Pro 14",
        "price": 999,
        "category": "Notebooks",
        "brand": "S4Y",
        "quantity": 1,
        "description": "High-End Arbeitsgerät mit CNC-Aluminium-Chassis.",
        "images": ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"]
      },
      {
        "title": "S4Y Phone Matrix",
        "price": 799,
        "category": "Smartphones",
        "brand": "S4Y",
        "quantity": 1,
        "description": "Next-Gen Display mit ultradünnem Rahmen.",
        "images": ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]
      },
      {
        "title": "QuantumView OLED 55",
        "price": 1499,
        "category": "TV",
        "brand": "S4Y",
        "quantity": 1,
        "description": "Echtes Schwarz und unendlicher Kontrast.",
        "images": ["https://images.unsplash.com/photo-1593305841991-05c297ba4575"]
      },
      {
        "title": "StudioSound ANC ONE",
        "price": 299,
        "category": "Audio",
        "brand": "S4Y",
        "quantity": 1,
        "description": "Aktive Geräuschunterdrückung in Studioqualität.",
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"]
      }
    ];
    setJsonInput(JSON.stringify(template, null, 2));
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-mono text-xs uppercase tracking-widest text-samsung-muted bg-white min-h-screen">
        Synchronisiere Live-Datenbank...
      </div>
    );
  }

  return (
    /* 🎯 Äußerer Container nimmt die volle Breite ein, die Innenabstände werden im Child-Div perfekt erzwungen */
    <div className="min-h-screen bg-white text-black relative overflow-hidden rounded-none selection:bg-black selection:text-white">
      
      {/* 🎯 Hier ist der magische Wrapper, der exakt wie der Header fluchtet */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest bg-zinc-100 text-zinc-600 border border-zinc-200 px-2.5 py-1 font-mono">
              shop4you // Händler-Zentrale
            </span>
            <h1 className="text-xl font-normal uppercase tracking-widest mt-3 text-black font-mono">
              Seller Dashboard
            </h1>
          </div>
          <button onClick={() => router.push('/')} className="bg-white border border-zinc-200 hover:border-black text-black font-mono text-xs uppercase tracking-widest px-5 py-3 transition-colors cursor-pointer">
            ← Zum Shop
          </button>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-black" />
            <p className="text-[10px] text-samsung-muted font-medium uppercase tracking-widest font-mono">Gesamtumsatz</p>
            <p className="text-2xl font-mono text-black mt-1">{stats.totalRevenue.toFixed(2)} €</p>
          </div>
          <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-black" />
            <p className="text-[10px] text-samsung-muted font-medium uppercase tracking-widest font-mono">Verkaufte Artikel</p>
            <p className="text-2xl font-mono text-black mt-1">{stats.totalSalesCount} Stk.</p>
          </div>
          <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-300" />
            <p className="text-[10px] text-samsung-muted font-medium uppercase tracking-widest font-mono">Deine Angebote</p>
            <p className="text-2xl font-mono text-black mt-1">{stats.liveProductsCount} / Active</p>
          </div>
        </div>

        {/* Mittlere Sektion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live-Diagramm */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">📊 Live Sales Volatility (2026)</h3>
              <div className="flex gap-3 text-[9px] font-medium uppercase tracking-widest text-samsung-muted font-mono">
                <span className="text-zinc-300 cursor-not-allowed">Daily</span>
                <span className="text-zinc-300 cursor-not-allowed">Weekly</span>
                <span className="text-black border-b border-black pb-0.5">Database Live</span>
              </div>
            </div>
            <div className="h-48 w-full flex items-end gap-2 pt-6 relative border-b border-zinc-200 bg-zinc-50 px-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 px-2 py-4">
                <div className="w-full border-t border-dashed border-zinc-300 text-[8px] font-mono text-samsung-muted pt-0.5">MAX PROPORTIONAL</div>
                <div className="w-full border-t border-dashed border-zinc-300 text-[8px] font-mono text-samsung-muted pt-0.5">MEDIAN SCALE</div>
              </div>
              {chartData.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10 h-full justify-end">
                  <div style={{ height: `${height}%` }} className="w-full bg-zinc-300 group-hover:bg-black transition-all duration-500 ease-out" />
                  <span className="text-[8px] text-samsung-muted font-mono uppercase mt-1.5">
                    {['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Importer */}
          <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-4">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">■ Artikel Import</h3>
            <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder="JSON hier einfügen..." className="w-full flex-1 min-h-[140px] border border-zinc-200 p-3 text-[11px] font-mono focus:outline-none focus:border-black resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={insertTemplate} className="bg-zinc-50 border border-zinc-200 text-[10px] font-mono py-3 uppercase cursor-pointer hover:bg-zinc-100 transition-colors">📝 Template</button>
              <button onClick={handleBulkImport} className="bg-black text-white text-[10px] font-mono py-3 uppercase cursor-pointer hover:bg-zinc-900 transition-colors">🚀 Import</button>
            </div>
            {importStatus && <div className="text-[10px] font-mono text-center p-2 bg-zinc-50 border border-zinc-200 text-red-600 font-medium">{importStatus}</div>}
          </div>
        </div>

        {/* 🎯 NEUE POSITION: Live-Parsing Vorschau wird jetzt direkt hier über den gelisteten Artikeln gerendert */}
        {livePreview.length > 0 && (
          <div className="border border-zinc-200 p-6 bg-zinc-50/50 flex flex-col gap-4">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-samsung-muted font-mono">[ Live-Parsing Vorschau ]</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {livePreview.map((prod, idx) => {
                const isInvalid = prod.category && !ALLOWED_CATEGORIES.includes(prod.category);
                return (
                  <div key={idx} className={`border p-4 pt-12 relative overflow-hidden group bg-white flex flex-col justify-between ${isInvalid ? 'border-red-400 bg-red-50/20' : 'border-zinc-200'}`}>
                    <div className="absolute top-0 left-0 right-0 text-center">
                      <span onClick={(e) => removeProductFromPreview(e, idx)} className="text-[9px] font-mono text-samsung-muted hover:text-black uppercase tracking-widest transition-colors cursor-pointer inline-block mt-2">[ Vorschau entfernen ]</span>
                    </div>
                    
                    <div className="flex justify-between items-start gap-2 mt-2">
                      <div className="truncate">
                        <div className="flex flex-col">
                          <span className={`text-[8px] font-mono uppercase tracking-widest block ${isInvalid ? 'text-red-600 font-bold' : 'text-samsung-muted'}`}>
                            {prod.category || 'Keine'} {isInvalid && '⚠️'}
                          </span>
                          {prod.brand && <span className="text-[8px] font-mono text-samsung-muted uppercase font-bold mt-0.5">{prod.brand}</span>}
                        </div>
                        <h4 className="text-xs font-mono font-bold uppercase truncate mt-1">{prod.title}</h4>
                      </div>

                      {prod.images && prod.images[0] && (
                        <div className="w-8 h-8 bg-zinc-50 border border-zinc-200 shrink-0 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                          <img 
                            src={prod.images[0]} 
                            alt={prod.title || 'Vorschau'} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>

                    <div className="border-t border-zinc-100 pt-2 mt-4 flex justify-between items-center font-mono text-xs">
                      <span className="text-[8px] text-samsung-muted font-bold">STK: {prod.quantity || 1}</span>
                      <span className="font-bold text-right">{Number(prod.price || 0).toFixed(2)} €</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Echte Produkt-Liste */}
        <div className="bg-white border border-zinc-200 p-6">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">■ Deine gelisteten Hardware-Artikel ({myProducts.length})</h3>
            <span className="text-[8px] font-mono text-samsung-muted uppercase">[ Klick auf Karte öffnet Detailansicht ]</span>
          </div>
          {myProducts.length === 0 ? (
            <p className="text-xs font-mono text-samsung-muted uppercase py-8 text-center bg-zinc-50 border border-dashed border-zinc-200">Keine Artikel gefunden.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {myProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="border border-zinc-200 p-4 pt-12 bg-white flex flex-col justify-between hover:border-black transition-colors cursor-pointer relative group"
                >
                  <div className="absolute top-2 left-0 right-0 text-center z-20">
                    <span 
                      onClick={(e) => handleOpenDeleteModal(e, product.id)}
                      className="text-[8px] font-mono text-samsung-muted hover:text-red-600 uppercase tracking-widest transition-colors cursor-pointer select-none"
                    >
                      [ Artikel löschen ]
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2 mt-2">
                    <div className="truncate">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-samsung-muted uppercase tracking-widest block">{product.category}</span>
                        {product.brand && <span className="text-[8px] font-mono text-samsung-muted font-bold uppercase mt-0.5">{product.brand}</span>}
                      </div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black mt-1 truncate">{product.title}</h4>
                    </div>

                    {product.images && product.images[0] && (
                      <div className="w-8 h-8 bg-zinc-50 border border-zinc-200 shrink-0 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 pt-2 mt-4 flex justify-between items-baseline font-mono text-xs">
                    <span className="text-[8px] text-samsung-muted">PRICE:</span>
                    <span className="font-bold">{product.price.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 🎯 CUSTOM SHOP4YOU PREMIUM-LÖSCHMODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 p-8 max-w-md w-full rounded-none shadow-xl animate-in fade-in zoom-in-95 duration-150">
            
            <div className="border-b border-zinc-100 pb-4 mb-6">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-samsung-muted block mb-1">
                SHOP4YOU // System-Eingriff
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                Artikel unwiderruflich löschen?
              </h3>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed font-light mb-8">
              Möchtest du diesen Artikel wirklich permanent aus dem System löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            <div className="flex gap-4 font-mono text-[11px] tracking-widest">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 py-3 transition-colors uppercase font-medium cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="flex-1 bg-black text-white hover:bg-zinc-900 py-3 transition-colors uppercase font-medium cursor-pointer"
              >
                Ja, Löschen
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}