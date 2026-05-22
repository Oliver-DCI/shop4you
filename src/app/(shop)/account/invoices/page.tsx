'use client';

import React, { useEffect, useState } from 'react';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  order: {
    id: string;
    totalAmount: number;
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        // 1. User aus dem localStorage holen
        const storedUser = localStorage.getItem('shop4you_user');
        if (!storedUser) {
          setError('BITTE MELDE DICH AN, UM DEINE RECHNUNGEN ZU SEHEN.');
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // 2. Rechnungen via API für diesen User abfragen
        const res = await fetch(`/api/account/invoices?userId=${user.id}`);
        if (!res.ok) throw new Error('Fehler beim Laden der Rechnungen');
        
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error(err);
        setError('FEHLER BEIM LADEN DES RECHNUNGSARCHIVS.');
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  // 🎯 PDF Download-Trigger über die erstellte API-Route
  const handleDownload = async (orderId: string, invoiceNumber: string) => {
    setDownloadingId(orderId);
    try {
      // Nutzt das native Browser-Verhalten für den Stream-Download
      window.location.href = `/api/account/invoices/${orderId}`;
    } catch (err) {
      console.error('Download Fehler:', err);
      alert('Rechnungsdownload fehlgeschlagen.');
    } finally {
      setTimeout(() => setDownloadingId(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 p-4">
        Lade Archivdaten...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs font-mono uppercase tracking-widest text-red-500 border border-red-100 bg-red-50/50 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-black">
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest">Rechnungsarchiv</h2>
        <p className="text-xs text-zinc-400 mt-1">Sämtliche Buchungsbelege im PDF-Format.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest border border-zinc-200 p-8 text-center bg-zinc-50/50">
          Keine Rechnungen im Archiv vorhanden.
        </div>
      ) : (
        <div className="flex flex-col gap-2 border border-zinc-200 divide-y divide-zinc-100">
          {/* Table Header */}
          <div className="p-3 bg-zinc-50 grid grid-cols-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-200">
            <div>Belegnummer</div>
            <div>Datum</div>
            <div className="text-right">Betrag</div>
          </div>

          {/* Table Body */}
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 grid grid-cols-3 text-xs items-center bg-white hover:bg-zinc-50 transition-colors">
              
              {/* Klickbare Rechnungsnummer triggert den Download */}
              <div 
                onClick={() => handleDownload(inv.order.id, inv.invoiceNumber)}
                className={`font-mono text-black font-medium cursor-pointer underline underline-offset-4 hover:text-zinc-600 ${
                  downloadingId === inv.order.id ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                {downloadingId === inv.order.id ? 'LÄDT...' : inv.invoiceNumber}
              </div>

              <div className="text-zinc-500 font-mono">
                {new Date(inv.createdAt).toLocaleDateString('de-DE')}
              </div>

              <div className="text-right font-normal font-mono">
                {inv.order.totalAmount.toFixed(2)} €
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}