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
  // 1. Daten aggregieren
  const categories = ['Notebooks', 'Smartphones', 'TV', 'Audio'];
  const dataMap = categories.reduce((acc, cat) => {
    acc[cat] = { count: 0, totalValue: 0 };
    return acc;
  }, {} as Record<string, { count: number; totalValue: number }>);

  let totalValueAll = 0;
  let totalCountAll = 0;

  products.forEach(p => {
    const cat = p.category;
    if (dataMap[cat]) {
      // Nutze stock (oder quantity) als Multiplikator für echten Warenwert im Lager
      const qty = (p as any).stock || (p as any).quantity || 1;
      dataMap[cat].count += 1;
      dataMap[cat].totalValue += p.price * qty;
      totalValueAll += p.price * qty;
      totalCountAll += 1;
    }
  });

  // Farben-Palette im Shop-Stil (Zinc/Black)
  const colors: Record<string, string> = {
    Notebooks: '#000000',   // Tiefschwarz
    Smartphones: '#4b5563', // Zinc-600
    TV: '#9ca3af',          // Zinc-400
    Audio: '#e4e4e7'        // Zinc-200
  };

  // SVG-Werte kalkulieren für das Donut-/Kreisdiagramm
  let accumulatedPercent = 0;

  const chartSlices = categories.map(cat => {
    const value = dataMap[cat].totalValue;
    const percent = totalValueAll > 0 ? value / totalValueAll : 0;
    const startPercent = accumulatedPercent;
    accumulatedPercent += percent;

    // SVG Koordinaten für Kreissegmente berechnen
    const getCoordinatesForPercent = (p: number) => {
      const x = Math.cos(2 * Math.PI * p);
      const y = Math.sin(2 * Math.PI * p);
      return [x, y];
    };

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(accumulatedPercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    // Path Daten erzeugen
    const pathData = percent === 1 
      ? `M 0 -1 A 1 1 0 1 1 -0.0001 -1 Z` // Voller Kreis
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
    <div className="bg-white border border-zinc-200 p-6 flex flex-col h-full justify-between">
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">■ Bestands- & Portfolio-Volumen</h3>
      </div>

      {totalCountAll === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-[10px] font-mono text-zinc-400 uppercase">Keine Daten zur Auswertung vorhanden</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 flex-1">
          {/* SVG Kreisdiagramm */}
          <div className="w-32 h-32 relative shrink-0">
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
            <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full flex items-center justify-center border border-zinc-100">
              <span className="text-[8px] font-mono font-bold">{totalCountAll} Art.</span>
            </div>
          </div>

          {/* Legende mit Details */}
          <div className="flex-1 w-full flex flex-col gap-2 font-mono text-[10px]">
            {chartSlices.map((slice, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-zinc-100 pb-1.5 last:border-none">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-zinc-900 font-medium">{slice.category}</span>
                  <span className="text-zinc-400 text-[9px]">({slice.count}x)</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-black">{slice.totalValue.toFixed(2)} €</div>
                  <div className="text-[8px] text-zinc-400 font-light">{slice.percentage}% Wertanteil</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-zinc-100 pt-3 mt-2 flex justify-between items-center text-[9px] font-mono text-zinc-400">
        <span>GESAMTWERT LAGER:</span>
        <span className="font-bold text-black">{totalValueAll.toFixed(2)} €</span>
      </div>
    </div>
  );
}