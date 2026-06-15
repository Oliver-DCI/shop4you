'use client';

import React from 'react';

// id auf string | number angepasst, da DB-IDs (UUIDs) meist Strings sind
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

export default function SellersTab({ sellers, onMahnung }: SellersTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl uppercase tracking-wider font-light text-black">Verkäufer-Netzwerk (Sellers)</h2>
        <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">Überwachung von Artikeln, Umsätzen und Compliance</p>
      </div>
      <div className="overflow-x-auto">
        {sellers.length === 0 ? (
          <p className="text-zinc-500 font-mono text-xs py-4">Keine registrierten Händler gefunden.</p>
        ) : (
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] uppercase text-zinc-400 tracking-wider">
                <th className="py-3 font-normal">Händler Name</th>
                <th className="py-3 font-normal text-right">Gelistete Artikel</th>
                <th className="py-3 font-normal text-right">Gesamtumsatz</th>
                <th className="py-3 font-normal text-center">Status</th>
                <th className="py-3 font-normal text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-zinc-100">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-zinc-50">
                  <td className="py-4 font-sans font-medium text-black">{seller.name}</td>
                  <td className="py-4 text-right">{seller.itemsCount} Stk.</td>
                  <td className="py-4 text-right font-bold">{seller.revenue.toLocaleString('de-DE')} €</td>
                  <td className="py-4 text-center">
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold ${
                      seller.status === 'Aktiv' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : seller.status === 'Mahnung offen' 
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
                      className="text-[10px] border border-zinc-200 hover:border-black text-black px-3 py-1.5 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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