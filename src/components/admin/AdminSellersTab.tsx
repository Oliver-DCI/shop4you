'use client';

import React, { useState } from 'react';

interface Seller {
  id: string | number; 
  name: string;
  itemsCount: number;
  revenue: number;
  status: string;
}

interface SellersTabProps {
  sellers: Seller[];
  onMahnung: (id: string | number, name: string) => void;
}

type SortKey = 'NAME' | 'ARTIKEL' | 'UMSATZ';

export default function SellersTab({ sellers, onMahnung }: SellersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALLE');
  const [sortBy, setSortBy] = useState<SortKey>('UMSATZ');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  // 1. Filtern der Seller nach Suche und Status
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALLE' || seller.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // 2. Sortieren der gefilterten Ergebnisse
  const sortedSellers = [...filteredSellers].sort((a, b) => {
    let compareA = a.revenue;
    let compareB = b.revenue;

    if (sortBy === 'NAME') {
      return sortDirection === 'ASC' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    
    if (sortBy === 'ARTIKEL') {
      compareA = a.itemsCount;
      compareB = b.itemsCount;
    }

    return sortDirection === 'ASC' ? compareA - compareB : compareB - compareA;
  });

  // Funktion zum Umschalten der Sortierung
  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(key);
      setSortDirection('DESC'); // Standardmäßig höchster Wert zuerst
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="text-xl uppercase tracking-wider font-light text-black">Verkäufer-Netzwerk (Sellers)</h2>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">Überwachung von Artikeln, Umsätzen und Compliance</p>
        </div>
        <div className="text-right font-mono text-[10px] text-zinc-500 uppercase">
          Gefunden: <span className="text-black font-bold">{sortedSellers.length}</span> / {sellers.length} Händler
        </div>
      </div>

      {/* Filter & Such-Leiste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 p-4 border border-zinc-200">
        {/* Suche */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono uppercase text-zinc-400">Händlersuche</label>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="NAME EINGEBEN..."
            className="border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-black uppercase placeholder:text-zinc-300"
          />
        </div>

        {/* Status-Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono uppercase text-zinc-400">Status-Filter</label>
          <div className="flex bg-zinc-200 p-0.5 border border-zinc-300 h-full items-center">
            {['ALLE', 'AKTIV', 'GEMAHNT'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 py-1 text-[9px] font-mono tracking-widest uppercase transition-colors cursor-pointer text-center ${
                  statusFilter === status ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sortierung Shortcuts */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono uppercase text-zinc-400">Sortier-Fokus</label>
          <div className="grid grid-cols-3 gap-1 h-full">
            {(['NAME', 'ARTIKEL', 'UMSATZ'] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`py-1 text-[9px] font-mono tracking-wider border transition-colors cursor-pointer text-center uppercase ${
                  sortBy === key 
                    ? 'bg-zinc-900 text-white border-black' 
                    : 'bg-white border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-black'
                }`}
              >
                {key} {sortBy === key ? (sortDirection === 'DESC' ? '↓' : '↑') : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daten-Tabelle */}
      <div className="overflow-x-auto">
        {sortedSellers.length === 0 ? (
          <p className="text-zinc-500 font-mono text-xs py-8 text-center bg-zinc-50 border border-dashed border-zinc-200">
            Keine Händler entsprechen den gewählten Filterkriterien.
          </p>
        ) : (
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] uppercase text-zinc-400 tracking-wider">
                <th className="py-3 font-normal cursor-pointer hover:text-black" onClick={() => handleSort('NAME')}>
                  Händler Name {sortBy === 'NAME' ? (sortDirection === 'DESC' ? '▼' : '▲') : ''}
                </th>
                <th className="py-3 font-normal text-right cursor-pointer hover:text-black" onClick={() => handleSort('ARTIKEL')}>
                  Gelistete Artikel {sortBy === 'ARTIKEL' ? (sortDirection === 'DESC' ? '▼' : '▲') : ''}
                </th>
                <th className="py-3 font-normal text-right cursor-pointer hover:text-black" onClick={() => handleSort('UMSATZ')}>
                  Gesamtumsatz {sortBy === 'UMSATZ' ? (sortDirection === 'DESC' ? '▼' : '▲') : ''}
                </th>
                <th className="py-3 font-normal text-center">Status</th>
                <th className="py-3 font-normal text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-zinc-100">
              {sortedSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-4 font-sans font-medium text-black">{seller.name}</td>
                  <td className="py-4 text-right">{seller.itemsCount} Stk.</td>
                  <td className="py-4 text-right font-bold">{seller.revenue.toLocaleString('de-DE')} €</td>
                  <td className="py-4 text-center">
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold ${
                      seller.status === 'Aktiv' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : seller.status === 'Gemahnt' || seller.status === 'Mahnung offen'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => onMahnung(seller.id, seller.name)}
                      disabled={seller.status === 'Gemahnt' || seller.status === 'Inaktiv'}
                      className="text-[10px] border border-zinc-200 hover:border-black text-black px-3 py-1.5 uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
                    >
                      🚨 Mahnen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}