'use client';

import React, { useEffect, useState } from 'react';

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hier werden wir später die echten Bestellungen des Users aus der DB laden
    // Musterdaten für das Studio-Layout:
    const mockOrders: Order[] = [
      { id: 'ORD-2026-9941', createdAt: '20.05.2026', total: 1299.00, status: 'GELIEFERT' },
      { id: 'ORD-2026-8812', createdAt: '14.04.2026', total: 45.90, status: 'IN ZUSTELLUNG' }
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full text-black">
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest">Meine Bestellungen</h2>
        <p className="text-xs text-zinc-400 mt-1">Übersicht und Status deiner getätigten Einkäufe.</p>
      </div>

      {loading ? (
        <p className="text-xs font-mono uppercase text-zinc-400">Lade Bestellungen...</p>
      ) : orders.length === 0 ? (
        <p className="text-xs font-mono uppercase text-zinc-400 border border-zinc-200 p-4 bg-zinc-50">
          Bisher wurden keine Bestellungen registriert.
        </p>
      ) : (
        <div className="flex flex-col gap-4 border border-zinc-200 divide-y divide-zinc-200">
          {orders.map((order) => (
            <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono text-zinc-400">{order.createdAt}</span>
                <span className="text-xs font-medium tracking-wider font-mono">{order.id}</span>
              </div>
              <div className="flex items-center gap-6 justify-between sm:justify-end">
                <span className="text-xs font-normal">{order.total.toFixed(2)} €</span>
                {/* Grüner Akzent bei gelieferten Artikeln */}
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 border ${
                  order.status === 'GELIEFERT' 
                    ? 'bg-emerald-50/50 border-emerald-500 text-emerald-700' 
                    : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                }`}>
                  ● {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}