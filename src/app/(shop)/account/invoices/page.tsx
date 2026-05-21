'use client';

import React from 'react';

export default function InvoicesPage() {
  // Später Verknüpfung zu PDFs oder Bestellungen
  const invoices = [
    { id: 'INV-2026-0041', date: '20.05.2026', amount: 1299.00 },
    { id: 'INV-2026-0012', date: '14.04.2026', amount: 45.90 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-black">
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest">Rechnungsarchiv</h2>
        <p className="text-xs text-zinc-400 mt-1">Sämtliche Buchungsbelege im PDF-Format.</p>
      </div>

      <div className="flex flex-col gap-2 border border-zinc-200 divide-y divide-zinc-100">
        <div className="p-3 bg-zinc-50 grid grid-cols-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-200">
          <div>Belegnummer</div>
          <div>Datum</div>
          <div className="text-right">Betrag</div>
        </div>
        {invoices.map((inv) => (
          <div key={inv.id} className="p-4 grid grid-cols-3 text-xs items-center bg-white hover:bg-zinc-50 transition-colors">
            <div className="font-mono text-black font-medium cursor-pointer underline underline-offset-4 hover:text-zinc-600">
              {inv.id}
            </div>
            <div className="text-zinc-500 font-mono">{inv.date}</div>
            <div className="text-right font-normal">{inv.amount.toFixed(2)} €</div>
          </div>
        ))}
      </div>
    </div>
  );
}