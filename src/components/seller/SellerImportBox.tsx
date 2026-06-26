'use client';

import React, { useState } from 'react';

const ALLOWED_CATEGORIES = ['Notebooks', 'Smartphones', 'TV', 'Audio'];

const SELLER_TEMPLATES = [
  { title: 'UltraBook Pro 14', price: 999.00, category: 'Notebooks', brand: 'Dell', stock: 15, description: 'High-End Arbeitsgerät mit CNC-Aluminium-Chassis und brillantem Panel.', images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', '', '', ''] },
  { title: 'S4Y Phone Matrix', price: 799.00, category: 'Smartphones', brand: 'Sony', stock: 30, description: 'Next-Gen Display mit ultradünnem Rahmen und nativer Krypto-Verschlüsselung.', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', '', '', ''] },
  { title: 'QuantumView OLED 55"', price: 1499.00, category: 'TV', brand: 'Philips', stock: 10, description: 'Echtes Schwarz und unendlicher Kontrast dank modernster organischer Panel-Schicht.', images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800', '', '', ''] },
  { title: 'StudioSound ANC ONE', price: 299.00, category: 'Audio', brand: 'JBL', stock: 25, description: 'Aktive Geräuschunterdrückung in Studioqualität mit langanhaltendem Akku.', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', '', '', ''] }
];

interface SellerImportBoxProps {
  onImportSuccess: () => void;
  isCardPreviewActive: boolean;
  setIsCardPreviewActive: (active: boolean) => void;
  loadedProducts: any[] | null;
  setLoadedProducts: (products: any[] | null) => void;
}

export default function SellerImportBox({ 
  onImportSuccess, 
  isCardPreviewActive, 
  setIsCardPreviewActive,
  loadedProducts,
  setLoadedProducts
}: SellerImportBoxProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleLoadTemplates = () => {
    const mapped = SELLER_TEMPLATES.map(prod => {
      const imgs = [...prod.images];
      while (imgs.length < 4) imgs.push('');
      return { ...prod, images: imgs };
    });
    setLoadedProducts(mapped);
    setIsCardPreviewActive(false);
    setStatusMessage('');
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

  const handleImageUrlChange = (prodIdx: number, imgIdx: number, url: string) => {
    if (!loadedProducts) return;
    const updated = [...loadedProducts];
    const updatedImages = [...updated[prodIdx].images];
    updatedImages[imgIdx] = url;
    updated[prodIdx].images = updatedImages;
    setLoadedProducts(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (!loadedProducts) return;
    const rem = loadedProducts.filter((_, i) => i !== index);
    setLoadedProducts(rem.length > 0 ? rem : null);
    if (rem.length === 0) setIsCardPreviewActive(false);
  };

  const handleInjectIntoDatabase = async () => {
    if (!loadedProducts || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
      const userId = currentUser.id;

      if (!userId) throw new Error('Keine aktive Händler-Session gefunden.');

      const cleaned = loadedProducts.map(prod => ({
        ...prod,
        images: prod.images.filter((img: string) => img.trim() !== '')
      }));

      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: cleaned, role: 'seller', userId })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen');

      setStatusMessage('✅ Artikel erfolgreich fest in PostgreSQL verankert!');
      setLoadedProducts(null);
      setIsCardPreviewActive(false);
      onImportSuccess();
    } catch (err: any) {
      setStatusMessage(`❌ Fehler: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* 🎯 FIX: pb-16 hinzugefügt, um Abstand nach unten zum Footer zu erzeugen */
    <div className="flex flex-col gap-6 w-full pb-16">
      <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-sm uppercase tracking-wider font-mono text-black">Massen-Datenimport (Händler Sandbox)</h2>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">Erlaubt sind nur: Notebooks, Smartphones, TV, Audio</p>
        </div>
      </div>

      {!loadedProducts ? (
        <div className="border border-dashed border-zinc-300 p-12 text-center flex flex-col items-center justify-center bg-zinc-50 w-full">
          <span className="text-3xl mb-3">🛡️</span>
          <p className="text-xs uppercase tracking-wider font-medium text-black">Händler-Template-Injektor bereit</p>
          <button 
            onClick={handleLoadTemplates}
            className="mt-4 bg-black text-white text-[10px] font-mono tracking-widest px-6 py-3 uppercase hover:bg-zinc-900 cursor-pointer"
          >
            4 VALIDIERTE TEMPLATE-KARTEN LADEN
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-between items-center bg-zinc-100 p-4 border border-zinc-200">
            <span className="text-[10px] font-mono uppercase font-bold text-black">
              {isCardPreviewActive ? '[ Live-Parsing Vorschau ]' : 'Template-Modus'}: {loadedProducts.length} Artikel bereit
            </span>
            
            {!isCardPreviewActive ? (
              <button
                onClick={() => setIsCardPreviewActive(true)}
                className="bg-black text-white text-[10px] font-mono tracking-widest px-5 py-2.5 uppercase hover:bg-zinc-900 cursor-pointer"
              >
                🔍 ARTIKEL VORSCHAU
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCardPreviewActive(false)}
                  className="border border-zinc-300 bg-white text-black text-[10px] font-mono tracking-widest px-4 py-2.5 uppercase hover:bg-zinc-100 cursor-pointer"
                >
                  ← Zurück
                </button>
                <button
                  onClick={handleInjectIntoDatabase}
                  disabled={isSubmitting}
                  className="bg-emerald-600 text-white text-[10px] font-mono tracking-widest px-5 py-2.5 uppercase hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'INJEKTION...' : '✔ JETZT IN DB SPEICHERN'}
                </button>
              </div>
            )}
          </div>

          {/* Große Formular-Karten Ansicht (Identisch zum funktionierenden Admin Import) */}
          {!isCardPreviewActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {loadedProducts.map((prod, pIdx) => (
                <div key={pIdx} className="border border-zinc-200 bg-white p-5 flex flex-col gap-4 relative hover:border-zinc-400 transition-colors">
                  <button 
                    onClick={() => handleRemoveItem(pIdx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-red-600 text-[10px] font-mono uppercase font-bold tracking-widest cursor-pointer"
                  >
                    ✕ Entfernen
                  </button>

                  <div className="text-[9px] font-mono bg-zinc-100 text-zinc-500 self-start px-2 py-0.5 uppercase tracking-wider">
                    Template-Item #{pIdx + 1}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Artikel-Titel</label>
                      <input type="text" value={prod.title} onChange={(e) => handleInputChange(pIdx, 'title', e.target.value)} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Marke</label>
                      <input type="text" value={prod.brand} onChange={(e) => handleInputChange(pIdx, 'brand', e.target.value)} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-zinc-400">Kategorie</label>
                      <select 
                        value={prod.category} 
                        onChange={(e) => handleInputChange(pIdx, 'category', e.target.value)}
                        className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs focus:bg-white focus:outline-none h-[32px]"
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
                    {prod.images.map((imgUrl: string, imgIdx: number) => (
                      <div key={imgIdx} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-400 w-12 uppercase">Bild {imgIdx + 1}:</span>
                        <input 
                          type="text" 
                          placeholder="http://example.com/image.jpg"
                          value={imgUrl} 
                          onChange={(e) => handleImageUrlChange(pIdx, imgIdx, e.target.value)}
                          className="flex-1 border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-mono focus:bg-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {statusMessage && (
        <div className={`text-[10px] font-mono text-center p-3 border ${statusMessage.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}