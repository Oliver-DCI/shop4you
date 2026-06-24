'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string | number;
  title: string;
  price: number;
  category: string;
  brand?: string | null;
  stock: number;
  images: string[];
  sellerName?: string | null;
}

type SortField = 'title' | 'category' | 'price' | 'stock' | 'sellerName';
type SortOrder = 'asc' | 'desc';

export default function ProductsTab() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // States für die Sortierung
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // States für das Lösch-Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string | number; title: string } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Produkt-Katalogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteModal = (id: string | number, title: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setProductToDelete({ id, title });
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/admin/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        closeDeleteModal();
      } else {
        alert('❌ Fehler beim Löschen des Artikels.');
      }
    } catch (error) {
      console.error('Löschfehler:', error);
    }
  };

  // Sortierfunktion beim Spalten-Klick
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 1. Filtern
  const filteredProducts = products.filter(p => {
    const currentSeller = p.sellerName || 'Admin';
    return (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currentSeller.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 2. Sortieren
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;

    let valueA = sortField === 'sellerName' ? (a.sellerName || 'Admin') : a[sortField];
    let valueB = sortField === 'sellerName' ? (b.sellerName || 'Admin') : b[sortField];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if ((valueA ?? '') < (valueB ?? '')) return sortOrder === 'asc' ? -1 : 1;
    if ((valueA ?? '') > (valueB ?? '')) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl uppercase tracking-wider font-light text-black">🛍️ Globaler Produkt-Katalog</h2>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">Klicke auf einen Artikel, um ihn live im Shop anzusehen</p>
        </div>
        
        <input 
          type="text" 
          placeholder="SUCHE NACH TITEL, KATEGORIE ODER ANBIETER..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 border border-zinc-200 bg-zinc-50 px-3 text-xs focus:outline-none focus:border-black font-mono w-full sm:w-72 rounded-none"
        />
      </div>

      {loading ? (
        <div className="p-12 text-center font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          Synchronisiere Produkt-Katalog...
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="border border-dashed border-zinc-200 p-12 text-center text-xs font-mono text-zinc-400 uppercase">
          Keine Artikel im System gefunden.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] uppercase text-zinc-400 tracking-wider select-none">
                <th className="py-3 font-normal w-16">Vorschau</th>
                
                <th 
                  onClick={() => handleSort('title')} 
                  className="py-3 font-normal cursor-pointer hover:text-black transition-colors"
                >
                  Artikel-Titel{renderSortArrow('title')}
                </th>
                <th 
                  onClick={() => handleSort('category')} 
                  className="py-3 font-normal cursor-pointer hover:text-black transition-colors"
                >
                  Kategorie{renderSortArrow('category')}
                </th>
                <th 
                  onClick={() => handleSort('price')} 
                  className="py-3 font-normal text-right cursor-pointer hover:text-black transition-colors"
                >
                  Preis{renderSortArrow('price')}
                </th>
                <th 
                  onClick={() => handleSort('stock')} 
                  className="py-3 font-normal text-right cursor-pointer hover:text-black transition-colors"
                >
                  Bestand{renderSortArrow('stock')}
                </th>
                
                {/* 🎯 KORREKTUR: Anbieter um 2 Spalten nach rechts verschoben */}
                <th 
                  onClick={() => handleSort('sellerName')} 
                  className="py-3 font-normal text-right cursor-pointer hover:text-black transition-colors px-4"
                >
                  Anbieter{renderSortArrow('sellerName')}
                </th>

                <th className="py-3 font-normal text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-zinc-100">
              {sortedProducts.map((product) => {
                const mainImage = product.images && product.images.length > 0 
                  ? product.images[0] 
                  : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';

                return (
                  <tr 
                    key={product.id} 
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="hover:bg-zinc-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 w-16">
                      <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center">
                        <img 
                          src={mainImage} 
                          alt={product.title} 
                          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';
                          }}
                        />
                      </div>
                    </td>
                    
                    <td className="py-3 font-sans font-medium text-black group-hover:underline decoration-zinc-400">
                      {product.title}
                      {product.brand && <span className="block text-[9px] font-mono text-zinc-400 uppercase">Brand: {product.brand}</span>}
                    </td>
                    <td className="py-3 uppercase text-[10px] text-zinc-500">{product.category}</td>
                    <td className="py-3 text-right font-bold">{Number(product.price).toFixed(2)} €</td>
                    <td className="py-3 text-right">{product.stock} Stk.</td>
                    
                    {/* 🎯 KORREKTUR: Die Zelle sitzt nun perfekt rechtsbündig ausgerichtet vor den Aktionen */}
                    <td className="py-3 text-right px-4">
                      {product.sellerName ? (
                        <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-xs">
                          👨‍💼 {product.sellerName}
                        </span>
                      ) : (
                        <span className="bg-black text-white px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-xs">
                          ⚙️ Admin
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-right">
                      <button 
                        onClick={(e) => openDeleteModal(product.id, product.title, e)}
                        className="text-[10px] text-zinc-500 hover:text-black border border-transparent px-3 py-1.5 uppercase tracking-widest transition-colors cursor-pointer font-mono"
                      >
                        🗑 Löschen
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Admin Lösch-Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-zinc-200 p-6 max-w-md w-full flex flex-col gap-4 rounded-none shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[9px] font-mono tracking-widest bg-zinc-100 border border-zinc-200 text-zinc-800 px-2 py-0.5 uppercase font-bold">
                System-Sicherheitsabfrage
              </span>
              <h3 className="text-sm uppercase tracking-wider font-bold font-mono mt-2 text-black">
                Artikel permanent löschen?
              </h3>
            </div>
            
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Möchtest du den Artikel <span className="font-semibold text-black">"{productToDelete?.title}"</span> wirklich unwiderruflich aus der PostgreSQL-Datenbank entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            <div className="flex justify-end gap-2 mt-2 font-mono text-[10px] uppercase tracking-widest">
              <button
                onClick={closeDeleteModal}
                className="border border-zinc-200 hover:border-black text-black px-4 h-9 transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="bg-black hover:bg-zinc-800 text-white px-4 h-9 transition-colors cursor-pointer"
              >
                💥 Ja, permanent löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}