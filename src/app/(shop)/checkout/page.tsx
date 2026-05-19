// src/app/(shop)/checkout/page.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/cartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);
  const [showDifferentShipping, setShowDifferentShipping] = useState(false);

  // 📝 Fiktive Profildaten (Sobald das Login-Modal fertig ist, kommen diese Daten direkt aus der Session/DB)
  const [savedProfile, setSavedProfile] = useState({
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@tech.de',
    street: 'Hardware-Allee 42',
    zip: '12345',
    city: 'TechCity',
  });

  // Zustände für die ABWEICHENDE Lieferadresse
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    zip: '',
    city: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('invoice');

  const shippingCosts = cartTotal >= 500 || cartTotal === 0 ? 0 : 6.90;
  const taxAmount = cartTotal * 0.19;
  const finalTotal = cartTotal + shippingCosts;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Hier würde die payload an die DB geschickt werden
    console.log('Bestellung abgeschickt an:', {
      billingAddress: savedProfile,
      shippingAddress: showDifferentShipping ? shippingData : savedProfile,
      paymentMethod
    });

    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="max-w-md w-full bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-xl text-center flex flex-col items-center gap-4 animate-scale-up">
          <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-2xl font-bold animate-bounce">
            ✓
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950">Vielen Dank für deine Bestellung!</h1>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">
            Deine Hardware-Bestellung wurde erfolgreich simuliert. Eine Bestätigung wurde an <span className="text-zinc-950 font-bold">{savedProfile.email}</span> gesendet.
          </p>
          <Link href="/" className="mt-4 w-full bg-blue-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-xs">
            Zurück zum Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen selection:bg-blue-600 selection:text-white pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        <div className="mb-10">
          <Link href="/" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 mb-2">
            ➔ Zurück zur Übersicht
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-950">Kasse / Checkout</h1>
          <p className="text-zinc-400 text-xs font-medium mt-0.5">Schließe jetzt deine Bestellung ab.</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
            <span className="text-4xl">🛒</span>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400">Dein Warenkorb ist leer</h2>
            <Link href="/" className="mt-2 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all">
              Jetzt Hardware hinzufügen
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LINKS: Adress-Logik */}
            <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              
              {/* 🏠 BLOCK 1: Automatisch geladene Rechnungs- & Lieferadresse */}
              <div>
                <h2 className="text-base font-black uppercase tracking-tight text-zinc-950 flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-600 rounded-full" />
                    1. Rechnungs- & Lieferadresse
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Aus Profil geladen
                  </span>
                </h2>

                {/* Edle Vorschau-Box der hinterlegten Adresse */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 flex flex-col gap-1 text-xs">
                  <p className="font-black text-zinc-950">{savedProfile.firstName} {savedProfile.lastName}</p>
                  <p className="text-zinc-600 font-medium">{savedProfile.street}</p>
                  <p className="text-zinc-600 font-medium">{savedProfile.zip} {savedProfile.city}</p>
                  <p className="text-zinc-400 font-bold mt-1 text-[11px]">{savedProfile.email}</p>
                </div>

                {/* ✨ Der smarte Trigger-Link für die abweichende Adresse */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowDifferentShipping(!showDifferentShipping)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    {showDifferentShipping ? '✕ Standard-Lieferadresse nutzen' : '➔ Abweichende Lieferadresse angeben'}
                  </button>
                </div>
              </div>

              {/* 🚚 BLOCK 1B: Abweichendes Lieferformular (Klappt dynamisch auf) */}
              {showDifferentShipping && (
                <div className="p-5 border border-blue-100 bg-blue-50/10 rounded-2xl flex flex-col gap-4 animate-fade-in">
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-600">
                    Abweichende Lieferanschrift
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Vorname des Empfängers</label>
                      <input required={showDifferentShipping} type="text" name="firstName" value={shippingData.firstName} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs font-medium focus:outline-hidden focus:border-blue-500/50 bg-white" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nachname des Empfängers</label>
                      <input required={showDifferentShipping} type="text" name="lastName" value={shippingData.lastName} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs font-medium focus:outline-hidden focus:border-blue-500/50 bg-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Straße und Hausnummer</label>
                    <input required={showDifferentShipping} type="text" name="street" value={shippingData.street} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs font-medium focus:outline-hidden focus:border-blue-500/50 bg-white" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PLZ</label>
                      <input required={showDifferentShipping} type="text" name="zip" value={shippingData.zip} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs font-medium focus:outline-hidden focus:border-blue-500/50 bg-white" />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Stadt</label>
                      <input required={showDifferentShipping} type="text" name="city" value={shippingData.city} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs font-medium focus:outline-hidden focus:border-blue-500/50 bg-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* 💳 BLOCK 2: Zahlungsmethoden */}
              <div>
                <h2 className="text-base font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
                  <span className="w-1 h-4 bg-blue-600 rounded-full" />
                  2. Zahlungsmethode
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'invoice' ? 'border-blue-600 bg-blue-50/30' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black uppercase tracking-tight text-zinc-950">Rechnung</span>
                      <span className="text-[10px] font-bold text-zinc-400">Bequem nach Erhalt zahlen</span>
                    </div>
                    <input type="radio" name="paymentMethod" value="invoice" checked={paymentMethod === 'invoice'} onChange={() => setPaymentMethod('invoice')} className="h-4 w-4 text-blue-600 border-zinc-300" />
                  </label>

                  <label className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50/30' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black uppercase tracking-tight text-zinc-950">PayPal</span>
                      <span className="text-[10px] font-bold text-zinc-400">Express Weiterleitung</span>
                    </div>
                    <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="h-4 w-4 text-blue-600 border-zinc-300" />
                  </label>
                </div>
              </div>

            </div>

            {/* RECHTS: Zusammenfassung (Bleibt gewohnt genial) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-36">
              <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs">
                <h2 className="text-base font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
                  <span className="w-1 h-4 bg-blue-600 rounded-full" />
                  3. Bestellübersicht
                </h2>

                <div className="max-h-60 overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-none border-b border-zinc-100 pb-4 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-10 w-10 border border-zinc-200 rounded-lg overflow-hidden shrink-0 bg-zinc-50">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-zinc-950 truncate uppercase tracking-tight">{item.title}</h4>
                          <p className="text-zinc-400 text-[10px] font-bold">Menge: {item.quantity} × {item.price.toFixed(2)} €</p>
                        </div>
                      </div>
                      <span className="font-black text-zinc-950 shrink-0">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 border-b border-zinc-100 pb-4 mb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <div className="flex justify-between">
                    <span>Zwischensumme:</span>
                    <span className="text-zinc-950 font-black">{cartTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Versandkosten:</span>
                    <span className="text-zinc-950 font-black">
                      {shippingCosts === 0 ? (
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 text-[9px] px-1.5 py-0.5 rounded-md">Gratis</span>
                      ) : (
                        `${shippingCosts.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400 lowercase italic normal-case">
                    <span>Darin enthaltene 19% MwSt.:</span>
                    <span>{taxAmount.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-950">Gesamtsumme:</span>
                  <span className="text-xl font-black text-blue-600">{finalTotal.toFixed(2)} €</span>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md text-center">
                  Jetzt zahlungspflichtig bestellen ➔
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}