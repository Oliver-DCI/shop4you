'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED_CATEGORIES = ['Notebooks', 'Smartphones', 'TV', 'Audio'];

const INITIAL_TEMPLATE = [
  { title: 'MacBook Pro Studio M5X', description: 'High-End Workstation für Entwickler und Power-User mit maximaler Effizienz.', price: 3499.00, category: 'Notebooks', brand: 'Apple', stock: 10, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', '', '', ''] },
  { title: 'UltraBook Pro 14', description: 'Extrem dünnes Gehäuse, federleicht mit CNC-Aluminium-Finish und brillantem Display.', price: 1499.00, category: 'Notebooks', brand: 'S4Y', stock: 15, images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', '', '', ''] },
  { title: 'S4Y Phone Matrix', description: 'Unser hauseigenes Flaggschiff mit nativer Hardware-Verschlüsselung und Quantum-Kamera.', price: 999.00, category: 'Smartphones', brand: 'S4Y', stock: 30, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', '', '', ''] },
  { title: 'QuantumView OLED 55"', description: 'Perfektes Schwarz, unendlicher Kontrast und Next-Gen Gaming Engine mit 144Hz.', price: 1299.00, category: 'TV', brand: 'LG', stock: 10, images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800', '', '', ''] },
  { title: 'StudioSound ANC ONE', description: 'Over-Ear Studio-Kopfhörer mit adaptiver Geräuschunterdrückung und High-Res Audio.', price: 399.00, category: 'Audio', brand: 'Bose', stock: 25, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', '', '', ''] },
  { title: 'Premium Mechanical Deck', description: 'Präzise mechanische Switches mit Hot-Swap Option und anpassbarer RGB-Beleuchtung.', price: 189.00, category: 'Audio', brand: 'Keychron', stock: 50, images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800', '', '', ''] },
  { title: 'S4Y SoundBar Pro X', description: 'Kompakte Soundbar mit immersivem Raumklang und drahtlosem Subwoofer.', price: 549.00, category: 'Audio', brand: 'S4Y', stock: 12, images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', '', '', ''] },
  { title: 'Cinema Screen OLED 65"', description: 'Kinofeeling für Zuhause mit Dolby Vision und integriertem Soundsystem.', price: 1899.00, category: 'TV', brand: 'Samsung', stock: 8, images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800', '', '', ''] }
];

export default function ImportTab() {
  const router = useRouter();
  const [loadedProducts, setLoadedProducts] = useState<typeof INITIAL_TEMPLATE | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isCardPreviewActive, setIsCardPreviewActive] = useState(false);

  const handleLoadTemplate = () => {
    const preparedTemplate = INITIAL_TEMPLATE.slice(0, 8).map(prod => {
      const imgArray = [...prod.images];
      while (imgArray.length < 4) imgArray.push('');
      return { ...prod, images: imgArray };
    });
    setLoadedProducts(preparedTemplate);
    setIsCardPreviewActive(false);
    setLogMessages(['[SYSTEM] Template im Karten-Modus mit exakt 8 Premium-Artikeln geladen.']);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    if (!loadedProducts) return;
    const updated = [...loadedProducts];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : field === 'stock' ? parseInt(value) || 0 : value
    };
    setLoadedProducts(updated);
  };

  const handleImageUrlChange = (productIndex: number, imageIndex: number, url: string) => {
    if (!loadedProducts) return;
    const updated = [...loadedProducts];
    const updatedImages = [...updated[productIndex].images];
    updatedImages[imageIndex] = url;
    updated[productIndex].images = updatedImages;
    setLoadedProducts(updated);
  };

  const handleRemoveFromPreview = (index: number) => {
    if (!loadedProducts) return;
    const remaining = loadedProducts.filter((_, i) => i !== index);
    setLoadedProducts(remaining.length > 0 ? remaining : null);
    if (remaining.length === 0) {
      setIsCardPreviewActive(false);
    }
  };

  const handleFinalDatabaseInjection = async () => {
    if (!loadedProducts || loadedProducts.length === 0 || isSubmitting) return;

    const hasInvalidCategory = loadedProducts.some(prod => !ALLOWED_CATEGORIES.includes(prod.category));
    if (hasInvalidCategory) {
      setLogMessages(prev => [...prev, '❌ FEHLER: Einige Artikel enthalten ungültige Kategorien. Erlaubt sind nur: Notebooks, Smartphones, TV, Audio.']);
      return;
    }

    setIsSubmitting(true);
    setLogMessages(prev => [...prev, '[SYSTEM] Übertrage Bilddaten an Core-API und starte PostgreSQL-Injektion...']);

    try {
      const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
      const userId = currentUser.id;
      const role = currentUser.role || 'admin';

      if (!userId) throw new Error('Keine aktive Admin-Session gefunden.');

      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: loadedProducts, role, userId }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(responseData.error || 'API-Core verweigerte Speicherung.');

      setLogMessages(prev => [...prev, `[ERFOLG] ${loadedProducts.length} modifizierte Artikel fest in PostgreSQL verankert!`]);
      setLoadedProducts(null);
      setIsCardPreviewActive(false);
    } catch (error: any) {
      setLogMessages(prev => [...prev, `❌ FEHLER: ${error.message}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl uppercase tracking-wider font-light text-black">Massen-Datenimport (Validierter Filter-Schutz)</h2>
        <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">
          Kategorien sind strikt limitiert auf Notebooks, Smartphones, TV und Audio
        </p>
      </div>

      {logMessages.length > 0 && (
        <div className="bg-zinc-900 p-4 font-mono text-[10px] text-zinc-300 flex flex-col gap-1">
          {logMessages.map((msg, idx) => (
            <div key={idx} className={msg.startsWith('❌') ? 'text-rose-400 font-bold' : msg.startsWith('[ERFOLG]') ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
              {msg}
            </div>
          ))}
        </div>
      )}

      {!loadedProducts ? (
        <div className="border border-dashed border-zinc-300 p-12 text-center flex flex-col items-center justify-center bg-zinc-50">
          <span className="text-3xl mb-3">🛡</span>
          <p className="text-xs uppercase tracking-wider font-medium text-black">Karten-Template-Injektor bereit</p>
          <button 
            onClick={handleLoadTemplate}
            className="mt-4 bg-black text-white text-[10px] font-mono tracking-widest px-6 py-3 uppercase hover:bg-zinc-900 cursor-pointer"
          >
            8 VALIDIERTE TEMPLATE-KARTEN LADEN
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          <div className="flex justify-between items-center bg-zinc-100 p-4 border border-zinc-200">
            <span className="text-[10px] font-mono uppercase font-bold text-black">
              {isCardPreviewActive ? '[ Live-Parsing Vorschau ]' : 'Template-Modus'}: {loadedProducts.length} Artikel im Grid
            </span>
            
            {!isCardPreviewActive ? (
              <button
                onClick={() => {
                  if (loadedProducts.length > 0) {
                    setIsCardPreviewActive(true);
                    setLogMessages(prev => [...prev, '[VORSCHAU] Formulare ausgeblendet, visuelle Karten-Vorschau aktiv.']);
                  }
                }}
                className="bg-black text-white text-[10px] font-mono tracking-widest px-5 py-2.5 uppercase hover:bg-zinc-900 cursor-pointer"
              >
                🔍 ARTIKEL VORSCHAU
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsCardPreviewActive(false);
                    setLogMessages(prev => [...prev, '[SYSTEM] Zurück zum Formular-Modus gewechselt.']);
                  }}
                  className="border border-zinc-300 bg-white text-black text-[10px] font-mono tracking-widest px-4 py-2.5 uppercase hover:bg-zinc-100 cursor-pointer"
                >
                  ← Zurück
                </button>
                <button
                  onClick={handleFinalDatabaseInjection}
                  disabled={isSubmitting}
                  className="bg-emerald-600 text-white text-[10px] font-mono tracking-widest px-5 py-2.5 uppercase hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'INJEKTION LÄUFT...' : '✔ JETZT ALLE IN DB SPEICHERN'}
                </button>
              </div>
            )}
          </div>

          {/* Formular-Karten Ansicht */}
          {!isCardPreviewActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadedProducts.map((prod, pIdx) => (
                <div key={pIdx} className="border border-zinc-200 bg-white p-5 flex flex-col gap-4 relative hover:border-zinc-400 transition-colors">
                  
                  {/* 🎯 ZURÜCKGESETZT: "✕ Entfernen" bleibt wie im Originalzustand */}
                  <button 
                    onClick={() => handleRemoveFromPreview(pIdx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-rose-600 text-[10px] font-mono uppercase font-bold tracking-widest cursor-pointer"
                  >
                    ✕ Entfernen
                  </button>

                  <div className="text-[9px] font-mono bg-zinc-100 text-zinc-500 self-start px-2 py-0.5 uppercase tracking-wider">
                    Template-Item #{pIdx + 1}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Artikel-Titel</label>
                      <input type="text" value={prod.title} onChange={(e) => handleInputChange(pIdx, 'title', e.target.value)} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Marke</label>
                      <input type="text" value={prod.brand || ''} onChange={(e) => handleInputChange(pIdx, 'brand', e.target.value)} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Kategorie</label>
                      <select 
                        value={prod.category} 
                        onChange={(e) => handleInputChange(pIdx, 'category', e.target.value)}
                        className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none h-[30px]"
                      >
                        {ALLOWED_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Preis (€)</label>
                      <input type="number" step="0.01" value={prod.price} onChange={(e) => handleInputChange(pIdx, 'price', e.target.value)} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-mono text-right font-bold focus:bg-white focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Bestand</label>
                      <input type="number" value={prod.stock} onChange={(e) => handleInputChange(pIdx, 'stock', e.target.value)} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs text-right focus:bg-white focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-mono text-zinc-400">Artikelbeschreibung</label>
                    <textarea 
                      rows={2}
                      value={prod.description} 
                      onChange={(e) => handleInputChange(pIdx, 'description', e.target.value)}
                      className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none font-sans resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-3">
                    <label className="text-[9px] uppercase font-mono text-black font-bold tracking-wider">Bilder-Galerie (Max. 4 URLs)</label>
                    {prod.images.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-400 w-12 uppercase">Bild {imgIdx + 1}:</span>
                        <input 
                          type="text" 
                          placeholder="http://example.com/image.jpg"
                          value={imgUrl} 
                          onChange={(e) => handleImageUrlChange(pIdx, imgIdx, e.target.value)}
                          className={`flex-1 border px-2 py-1 text-[10px] font-mono focus:bg-white focus:outline-none ${imgIdx === 0 ? 'border-zinc-300 bg-zinc-50 font-bold' : 'border-zinc-200 bg-zinc-50/50'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Realistische Shop-Karten Vorschau */}
          {isCardPreviewActive && (
            /* 🎯 OPTIMIERT: Raster-Spalten-Abstände (gap-4) exakt wie beim Verkäufer-Design */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              {loadedProducts.map((prod, pIdx) => {
                const mainImage = prod.images && prod.images.length > 0 && prod.images[0].trim() !== ''
                  ? prod.images[0] 
                  : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

                return (
                  <div 
                    key={pIdx} 
                    className="border border-zinc-200 bg-white flex flex-col h-full relative group hover:border-black transition-colors"
                  >
                    {/* ✕ Minimalistischer Lösch-Button oben rechts direkt auf der Bildfläche */}
                    <button
                      onClick={() => handleRemoveFromPreview(pIdx)}
                      className="absolute top-2 right-2 z-10 w-5 h-5 flex items-center justify-center bg-white/90 backdrop-blur-xs border border-zinc-200 hover:border-red-600 hover:bg-red-50 hover:text-red-600 text-zinc-500 text-[10px] font-sans cursor-pointer transition-colors shadow-xs"
                      title="Aus Vorschau entfernen"
                    >
                      ✕
                    </button>

                    <div className="w-full aspect-square bg-zinc-50 border-b border-zinc-100 overflow-hidden relative flex items-center justify-center">
                      <img 
                        src={mainImage} 
                        alt={prod.title} 
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300" 
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-1.5">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">{prod.category}</span>
                      <h4 className="text-xs uppercase font-bold tracking-wider text-black line-clamp-1">{prod.title}</h4>
                      <p className="text-[11px] text-zinc-500 font-sans line-clamp-2 leading-tight flex-1">{prod.description}</p>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-100">
                        <span className="text-[10px] font-mono text-zinc-400">Lager: {prod.stock} Stk.</span>
                        <span className="text-xs font-mono font-bold text-black">{prod.price.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}