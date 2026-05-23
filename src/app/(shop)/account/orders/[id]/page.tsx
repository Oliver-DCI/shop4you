'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Bestellung konnte nicht geladen werden.');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        console.error("FETCH_ORDER_DETAILS_FAILED:", err);
        setError(err.message || 'Fehler beim Laden der Bestelldetails.');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  return (
    <div className="flex flex-col gap-8 w-full text-black">
      
      {/* Header mit Zurück-Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted">
            Bestellung Review // {order?.createdAt || 'LADEN...'}
          </span>
          <h2 className="text-xl font-normal uppercase tracking-widest mt-1 font-mono">
            {orderId}
          </h2>
        </div>
        <Link
          href="/account/orders"
          className="text-xs font-mono uppercase tracking-wider border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors self-start sm:self-auto"
        >
          ← Zurück zur Übersicht
        </Link>
      </div>

      {loading ? (
        <p className="text-xs font-mono uppercase text-samsung-muted animate-pulse">[ ANALYSIERE WARENKORB-HISTORIE... ]</p>
      ) : error ? (
        <p className="text-xs font-mono uppercase text-red-500 border border-red-200 p-4 bg-red-50">
          CORE-SYSTEM-FEHLER: {error}
        </p>
      ) : !order ? (
        <p className="text-xs font-mono uppercase text-samsung-muted">Keine Daten zu dieser Bestellung gefunden.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Linke Spalte: Die gekauften Artikel (Warenkorb-Stil) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-samsung-muted">Gekaufte Artikel</span>
            
            <div className="border border-zinc-200 divide-y divide-zinc-200">
              {order.items?.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between bg-white gap-4">
                  <div className="flex items-center gap-4">
                    {/* Minimalistischer Platzhalter für Produktbild */}
                    <div className="w-12 h-16 bg-zinc-50 border border-zinc-200 flex items-center justify-center text-[10px] text-samsung-muted font-mono">
                      IMG
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium uppercase tracking-wider">{item.title}</span>
                      <span className="text-[10px] font-mono text-samsung-muted mt-0.5">
                        Menge: {item.quantity} × {item.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium">
                    {(item.quantity * item.price).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Spalte: Die finanzielle Zusammenfassung */}
          <div className="border border-black p-6 bg-zinc-50 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-samsung-muted border-b border-zinc-200 pb-2">
              Status & Summe
            </span>

            <div className="flex justify-between items-center text-xs">
              <span className="uppercase tracking-wider">Bestellstatus:</span>
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border ${
                order.status === 'GELIEFERT' 
                  ? 'bg-emerald-50/50 border-emerald-500 text-emerald-700' 
                  : 'bg-zinc-100 border-zinc-300 text-samsung-muted'
              }`}>
                ● {order.status}
              </span>
            </div>

            <div className="border-t border-zinc-200 my-2"></div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider font-medium">Gesamtsumme:</span>
              <span className="text-xl font-mono font-bold">{order.total.toFixed(2)} €</span>
            </div>

            <p className="text-[9px] font-mono text-samsung-muted uppercase tracking-wider mt-4 leading-relaxed">
              Dies ist eine Read-Only-Ansicht deines damaligen Warenkorbs. Für Modifikationen oder Retouren kontaktiere bitte den Support.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}