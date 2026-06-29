'use client';

import React from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  stock?: number;
}

interface SellerCategoryChartProps {
  products: Product[];
}

export default function SellerCategoryChart({ products }: SellerCategoryChartProps) {
  const categories = ['Notebooks', 'Smartphones', 'TV', 'Audio'];
  
  // 🎯 ERWEITERUNG: Wir zählen jetzt auch 'totalStock' pro Kategorie
  const dataMap = categories.reduce((acc, cat) => {
    acc[cat] = { count: 0, totalStock: 0, totalValue: 0 };
    return acc;
  }, {} as Record<string, { count: number; totalStock: number; totalValue: number }>);

  let totalValueAll = 0;
  let totalCountAll = 0;

  products.forEach(p => {
    const cat = p.category;
    if (dataMap[cat]) {
      const qty = (p as any).stock || (p as any).quantity || 1;
      dataMap[cat].count += 1;
      dataMap[cat].totalStock += qty; // 🎯 Stückzahlen aufaddieren
      dataMap[cat].totalValue += p.price * qty;
      totalValueAll += p.price * qty;
      totalCountAll += 1;
    }
  });

  const colors: Record<string, string> = {
    Notebooks: '#000000',
    Smartphones: '#4b5563',
    TV: '#9ca3af',
    Audio: '#e4e4e7'
  };

  let accumulatedPercent = 0;

  const chartSlices = categories.map(cat => {
    const value = dataMap[cat].totalValue;
    const percent = totalValueAll > 0 ? value / totalValueAll : 0;
    const startPercent = accumulatedPercent;
    accumulatedPercent += percent;

    const getCoordinatesForPercent = (p: number) => {
      const x = Math.cos(2 * Math.PI * p);
      const y = Math.sin(2 * Math.PI * p);
      return [x, y];
    };

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(accumulatedPercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = percent === 1 
      ? `M 0 -1 A 1 1 0 1 1 -0.0001 -1 Z`
      : percent > 0 
        ? `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z` 
        : '';

    return {
      category: cat,
      pathData,
      color: colors[cat],
      percentage: (percent * 100).toFixed(1),
      ...dataMap[cat]
    };
  });

  return (
    <div className="bg-white border border-zinc-200 p-6 flex flex-col h-full justify-between w-full xl:w-[calc(100%+8px)] xl:-ml-[16px] min-w-0">
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">■ Bestands- & Portfolio-Volumen</h3>
      </div>

      {totalCountAll === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-[10px] font-mono text-zinc-400 uppercase">Keine Daten zur Auswertung vorhanden</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-4 flex-1 w-full min-w-0 justify-center">
          
          {/* Kompakteres SVG Kreisdiagramm */}
          <div className="w-24 h-24 relative shrink-0">
            <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
              {chartSlices.map((slice, idx) => slice.pathData && (
                <path 
                  key={idx} 
                  d={slice.pathData} 
                  fill={slice.color} 
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </svg>
            <div className="absolute inset-0 m-auto w-11 h-11 bg-white rounded-full flex items-center justify-center border border-zinc-100">
              <span className="text-[8px] font-mono font-bold">{totalCountAll} Art.</span>
            </div>
          </div>

          {/* Perfekt angepasste Legende */}
          <div className="w-full flex flex-col gap-1.5 font-mono text-[10px] min-w-0 mt-2">
            {chartSlices.map((slice, idx) => (
              <div key={idx} className="flex flex-row items-center justify-between border-b border-zinc-100 pb-1.5 last:border-none gap-2 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <div className="w-2 h-2 shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-zinc-900 font-medium truncate">{slice.category}</span>
                  {/* 🎯 FIX: Zeigt jetzt glasklar z.B. (1 Art. / 15 Stk.) anstelle von nur (1) */}
                  <span className="text-zinc-400 text-[8px] shrink-0">
                    ({slice.count} Art. / {slice.totalStock} Stk.)
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-black text-[10px] tabular-nums">{slice.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                  <div className="text-[8px] text-zinc-400 font-light">{slice.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-zinc-100 pt-3 mt-3 flex justify-between items-center text-[9px] font-mono text-zinc-400 w-full min-w-0">
        <span>GESAMTWERT LAGER:</span>
        <span className="font-bold text-black text-[10px] tabular-nums shrink-0">{totalValueAll.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
      </div>
    </div>
  );
}