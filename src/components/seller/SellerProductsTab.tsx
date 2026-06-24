'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
  description?: string;
  stock?: number;
}

type SortField = 'title' | 'category' | 'price' | 'stock';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'table' | 'grid';

interface SellerProductsTabProps {
  products: Product[];
  onRefresh: () => void;
}

export default function SellerProductsTab({ products, onRefresh }: SellerProductsTabProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Sortierungs-States
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Modal-States
  const [productToDelete, setProductToDelete] = useState<{ id: string; title: string } | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Erweitertes Edit-Formular für alle Template-Felder
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    description: '',
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Befüllen des Formulars beim Bearbeitungsstart
  const startEditing = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingProductId(product.id);
    
    const imgs = product.images || [];
    setEditForm({
      title: product.title,
      price: product.price.toString(),
      stock: (product.stock ?? 1).toString(),
      category: product.category,
      brand: product.brand || '',
      description: product.description || '',
      image1: imgs[0] || '',
      image2: imgs[1] || '',
      image3: imgs[2] || '',
      image4: imgs[3] || ''
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || isSaving) return;

    setIsSaving(true);
    
    const imagesArray = [
      editForm.image1.trim(),
      editForm.image2.trim(),
      editForm.image3.trim(),
      editForm.image4.trim()
    ].filter(url => url !== '');

    try {
      const response = await fetch(`/api/products?id=${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          price: parseFloat(editForm.price) || 0,
          stock: parseInt(editForm.stock) || 0,
          category: editForm.category,
          brand: editForm.brand,
          description: editForm.description,
          images: imagesArray
        }),
      });

      if (response.ok) {
        setEditingProductId(null);
        onRefresh();
      } else {
        alert('❌ Fehler beim Aktualisieren des Artikels.');
      }
    } catch (err) {
      console.error('Update-Fehler:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteModal = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setProductToDelete({ id, title });
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/seller/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onRefresh();
      } else {
        alert('❌ Fehler beim Löschen des Artikels.');
      }
    } catch (err) {
      console.error('Lösch-Fehler:', err);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    let valueA = sortField === 'stock' ? (a.stock ?? 1) : a[sortField];
    let valueB = sortField === 'stock' ? (b.stock ?? 1) : b[sortField];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if ((valueA ?? '') < (valueB ?? '')) return sortOrder === 'asc' ? -1 : 1;
    if ((valueA ?? '') > (valueB ?? '')) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 relative w-full">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-100 pb-4">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">■ Live-Bestand ({products.length} Artikel)</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono">
          <input 
            type="text" 
            placeholder="SUCHE NACH TITEL ODER KATEGORIE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 border border-zinc-200 bg-zinc-50 px-3 text-xs focus:outline-none focus:border-black w-full sm:w-64 rounded-none"
          />

          <div className="flex border border-zinc-200 text-[10px] uppercase tracking-widest h-10 items-center bg-zinc-50 select-none">
            <button onClick={() => setViewMode('table')} className={`px-4 h-full transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-black text-white font-bold' : 'text-zinc-400 hover:text-black'}`}>Zeile</button>
            <div className="w-[1px] h-4 bg-zinc-200"></div>
            <button onClick={() => setViewMode('grid')} className={`px-4 h-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-black text-white font-bold' : 'text-zinc-400 hover:text-black'}`}>Karte</button>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="text-xs font-mono text-zinc-400 uppercase py-8 text-center bg-zinc-50 border border-dashed border-zinc-200">Keine Artikel im Bestand gefunden.</p>
      ) : viewMode === 'table' ? (
        
        /* 📜 ANSICHT 1: TABELLE */
        <div className="overflow-x-auto animate-in fade-in duration-150">
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] uppercase text-zinc-400 tracking-wider select-none">
                <th className="py-3 font-normal w-16">Vorschau</th>
                <th onClick={() => handleSort('title')} className="py-3 font-normal cursor-pointer hover:text-black transition-colors">Artikel-Titel{sortField === 'title' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}</th>
                <th onClick={() => handleSort('category')} className="py-3 font-normal cursor-pointer hover:text-black transition-colors">Kategorie{sortField === 'category' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}</th>
                <th onClick={() => handleSort('price')} className="py-3 font-normal text-right cursor-pointer hover:text-black transition-colors">Preis{sortField === 'price' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}</th>
                <th onClick={() => handleSort('stock')} className="py-3 font-normal text-right cursor-pointer hover:text-black transition-colors px-4">Bestand{sortField === 'stock' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}</th>
                <th className="py-3 font-normal text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-zinc-100">
              {sortedProducts.map((product) => {
                const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';
                return (
                  <tr key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="hover:bg-zinc-50 cursor-pointer transition-colors group">
                    <td className="py-3 w-16">
                      <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center">
                        <img src={mainImage} alt="Product" className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300" />
                      </div>
                    </td>
                    <td className="py-3 font-sans font-medium text-black group-hover:underline decoration-zinc-400">
                      {product.title}
                      {product.brand && <span className="block text-[9px] font-mono text-zinc-400 uppercase">Brand: {product.brand}</span>}
                    </td>
                    <td className="py-3 uppercase text-[10px] text-zinc-500">{product.category}</td>
                    <td className="py-3 text-right font-bold">{Number(product.price).toFixed(2)} €</td>
                    <td className="py-3 text-right px-4">{product.stock ?? 1} Stk.</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={(e) => startEditing(e, product)} className="text-[10px] text-zinc-500 hover:text-black border border-transparent px-2 py-1.5 uppercase tracking-widest transition-colors cursor-pointer font-mono">✏ Edit</button>
                        <button onClick={(e) => handleOpenDeleteModal(e, product.id, product.title)} className="text-[10px] text-zinc-400 hover:text-red-600 border border-transparent px-2 py-1.5 uppercase tracking-widest transition-colors cursor-pointer font-mono">🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* 🎴 ANSICHT 2: MICRO-CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-150 w-full">
          {sortedProducts.map((product) => {
            const mainImage = product.images && product.images.length > 0 && product.images[0].trim() !== '' ? product.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';
            return (
              <div key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="border border-zinc-200 bg-white p-3 flex gap-3 h-20 relative group hover:border-black transition-all cursor-pointer shadow-xs">
                <div className="w-14 h-full bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img src={mainImage} alt="Product" className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0 pr-12">
                  <div>
                    <div className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 truncate">{product.category} {product.brand ? `// ${product.brand}` : ''}</div>
                    <h4 className="text-xs font-sans font-bold text-black truncate group-hover:underline mt-0.5">{product.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-zinc-900 font-bold">{Number(product.price).toFixed(2)} €</span>
                    <span className="text-zinc-300 text-[9px]">|</span>
                    <span className="text-zinc-500 text-[9px]">{product.stock ?? 1} Stk.</span>
                  </div>
                </div>
                
                {/* 🎯 KORRIGIERT: Perfekt skalierte, halbgroße Buttons für dezente Eleganz */}
                <div className="absolute top-1 right-1 flex gap-1 z-20">
                  <button 
                    onClick={(e) => startEditing(e, product)} 
                    className="w-4.5 h-4.5 flex items-center justify-center bg-zinc-50 border border-zinc-200 hover:border-black hover:bg-black hover:text-white text-zinc-600 text-[9px] font-mono cursor-pointer transition-all duration-150"
                    title="Artikel bearbeiten"
                  >
                    ✏
                  </button>
                  <button 
                    onClick={(e) => handleOpenDeleteModal(e, product.id, product.title)} 
                    className="w-4.5 h-4.5 flex items-center justify-center bg-zinc-50 border border-zinc-200 hover:border-red-600 hover:bg-red-50 hover:text-red-600 text-zinc-400 text-[10px] font-sans cursor-pointer transition-all duration-150"
                    title="Artikel löschen"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🎯 ULTRA EXTENDED QUICK-EDIT OVERLAY */}
      {editingProductId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveEdit} className="bg-white border border-zinc-300 p-6 max-w-xl w-full rounded-none shadow-xl flex flex-col gap-4 font-mono text-xs animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="border-b border-zinc-100 pb-3">
              <span className="text-[8px] uppercase tracking-widest bg-zinc-100 text-zinc-800 px-2 py-0.5 font-bold">System // Master-Data-Update</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mt-2">Sämtliche Produkt-Details anpassen</h3>
            </div>
            
            {/* Titel */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase text-zinc-400">Produkt-Titel</label>
              <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 focus:bg-white focus:outline-none" required />
            </div>

            {/* Marke & Kategorie */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase text-zinc-400">Marke (Brand)</label>
                <input type="text" value={editForm.brand} onChange={(e) => setEditForm({...editForm, brand: e.target.value})} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 focus:bg-white focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase text-zinc-400">Kategorie</label>
                <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 focus:bg-white focus:outline-none h-[30px]">
                  {['Notebooks', 'Smartphones', 'TV', 'Audio'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Preis & Bestand */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase text-zinc-400">Verkaufspreis (€)</label>
                <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 font-bold text-right focus:bg-white focus:outline-none" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase text-zinc-400">Lagerbestand</label>
                <input type="number" value={editForm.stock} onChange={(e) => setEditForm({...editForm, stock: e.target.value})} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-right focus:bg-white focus:outline-none" required />
              </div>
            </div>

            {/* Beschreibung */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase text-zinc-400">Beschreibung (Ausführlicher Text)</label>
              <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="border border-zinc-200 bg-zinc-50 px-2 py-1.5 font-sans focus:bg-white focus:outline-none resize-none" />
            </div>

            {/* Die 4 Medien-URLs */}
            <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-3">
              <label className="text-[9px] uppercase text-black font-bold tracking-wider">📦 Produkt-Bilder (Media URLs)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[8px] text-zinc-400 font-mono">BILD 1 (Haupt-Cover)</label>
                  <input type="text" value={editForm.image1} onChange={(e) => setEditForm({...editForm, image1: e.target.value})} placeholder="https://..." className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] focus:bg-white focus:outline-none truncate" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[8px] text-zinc-400 font-mono">BILD 2</label>
                  <input type="text" value={editForm.image2} onChange={(e) => setEditForm({...editForm, image2: e.target.value})} placeholder="https://..." className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] focus:bg-white focus:outline-none truncate" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[8px] text-zinc-400 font-mono">BILD 3</label>
                  <input type="text" value={editForm.image3} onChange={(e) => setEditForm({...editForm, image3: e.target.value})} placeholder="https://..." className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] focus:bg-white focus:outline-none truncate" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[8px] text-zinc-400 font-mono">BILD 4</label>
                  <input type="text" value={editForm.image4} onChange={(e) => setEditForm({...editForm, image4: e.target.value})} placeholder="https://..." className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] focus:bg-white focus:outline-none truncate" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-2 text-[10px] uppercase tracking-widest pt-3 border-t border-zinc-100">
              <button type="button" onClick={() => setEditingProductId(null)} className="border border-zinc-200 hover:border-black text-black px-4 h-9 cursor-pointer bg-white">Abbrechen</button>
              <button type="submit" disabled={isSaving} className="bg-black hover:bg-zinc-800 text-white px-4 h-9 cursor-pointer disabled:opacity-50">
                {isSaving ? 'Speichere...' : 'Änderungen Speichern'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LOESCH-MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 p-6 max-w-md w-full rounded-none shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-zinc-100 pb-3 mb-4">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-zinc-100 border border-zinc-200 text-zinc-800 px-2 py-0.5 font-bold">System-Sicherheitsabfrage</span>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black mt-2">Artikel permanent löschen?</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">Möchtest du den Artikel <span className="font-semibold text-black">"{productToDelete.title}"</span> wirklich unwiderruflich aus der PostgreSQL-Datenbank entfernen?</p>
            <div className="flex justify-end gap-2 mt-4 font-mono text-[10px] uppercase tracking-widest">
              <button onClick={() => setProductToDelete(null)} className="border border-zinc-200 hover:border-black text-black px-4 h-9 cursor-pointer bg-white">Abbrechen</button>
              <button onClick={confirmDeleteProduct} className="bg-black hover:bg-zinc-800 text-white px-4 h-9 cursor-pointer">💥 Ja, permanent löschen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}