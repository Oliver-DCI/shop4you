'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRealOrders() {
      try {
        // 🎯 Echte API-Abfrage an dein PostgreSQL-Backend
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Echte Bestelldaten konnten nicht geladen werden.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        console.error("FETCH_ORDERS_FAILED:", err);
        setError(err.message || 'Verbindungsfehler zum Server.');
      } finally {
        setLoading(false);
      }
    }

    loadRealOrders();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full text-black">
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest">Meine Bestellungen</h2>
        <p className="text-xs text-zinc-400 mt-1">Übersicht und Status deiner getätigten Einkäufe.</p>
      </div>

      {loading ? (
        <p className="text-xs font-mono uppercase text-zinc-400 animate-pulse">[ LADE ECHTE BESTELLDATEN... ]</p>
      ) : error ? (
        <p className="text-xs font-mono uppercase text-red-500 border border-red-200 p-4 bg-red-50">
          CORE-SYSTEM-FEHLER: {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-xs font-mono uppercase text-zinc-400 border border-zinc-200 p-4 bg-zinc-50">
          Bisher wurden keine Bestellungen registriert.
        </p>
      ) : (
        <div className="flex flex-col gap-4 border border-zinc-200 divide-y divide-zinc-200">
          {orders.map((order) => (
            <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-zinc-50 transition-colors">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-zinc-400">{order.createdAt}</span>
                <span className="text-xs font-medium tracking-wider font-mono">{order.id}</span>
              </div>
              <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">
                <span className="text-xs font-mono font-medium">{order.total.toFixed(2)} €</span>
                
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 border ${
                  order.status === 'GELIEFERT' 
                    ? 'bg-emerald-50/50 border-emerald-500 text-emerald-700' 
                    : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                }`}>
                  ● {order.status}
                </span>

                {/* 🎯 Rücksprung zur "Warenkorb-Review" der Bestellung */}
                <Link
                  href={`/account/orders/${order.id}`}
                  className="bg-black text-white text-[10px] font-mono tracking-widest px-3 py-2 uppercase hover:bg-zinc-950 transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}