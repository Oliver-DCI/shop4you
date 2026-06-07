'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  street: string;
  zipCode: string;
  city: string;
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [isOrdered, setIsOrdered] = useState(false);
  const [showDifferentShipping, setShowDifferentShipping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    zip: '',
    city: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('invoice');

  useEffect(() => {
    const storedUser = localStorage.getItem('shop4you_user');
    
    if (!storedUser) {
      router.push('/login?callback=/checkout');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUserProfile(parsedUser);
    } catch (e) {
      console.error("Fehler beim Parsen der Session-Daten", e);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const shippingCosts = cartTotal >= 500 || cartTotal === 0 ? 0 : 6.90;
  const taxAmount = cartTotal * 0.19;
  const finalTotal = cartTotal + shippingCosts;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !userProfile || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const orderPayload = {
        userId: userProfile.id,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod.toUpperCase(), // Macht 'CREDIT_CARD', 'INVOICE' etc. daraus
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: showDifferentShipping ? {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          street: shippingData.street,
          zip: shippingData.zip,
          city: shippingData.city
        } : null
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Verarbeiten der Bestellung.');
      }

      setIsOrdered(true);
      clearCart();
    } catch (error) {
      console.error('Checkout Fehler:', error);
      alert(error instanceof Error ? error.message : 'Etwas ist schiefgelaufen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-samsung-muted">
        Prüfe Autorisierung...
      </div>
    );
  }

  if (isOrdered && userProfile) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4 selection:bg-black selection:text-white">
        <div className="max-w-md w-full bg-white border border-zinc-200 p-8 rounded-none text-center flex flex-col items-center gap-6">
          <div className="h-12 w-12 rounded-none bg-black text-white flex items-center justify-center text-lg font-mono">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-widest text-black">Bestellung erfolgreich</h1>
            <p className="text-samsung-muted text-xs leading-relaxed font-normal">
              Deine Order wurde im System verarbeitet. Eine Bestätigung ging an <span className="text-black font-medium">{userProfile.email}</span>.
            </p>
          </div>
          <Link href="/" className="w-full bg-black text-white font-medium text-xs uppercase tracking-widest py-4 rounded-none hover:bg-zinc-900 transition-colors text-center">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen selection:bg-black selection:text-white pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 pb-6">
          <Link href="/" className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted hover:text-black transition-colors flex items-center gap-2 mb-4">
            ◀ ZURÜCK ZUR ÜBERSICHT
          </Link>
          <h1 className="text-3xl font-light tracking-tight text-black uppercase">Kasse // Checkout</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 rounded-none p-16 text-center flex flex-col items-center gap-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-samsung-muted">Dein Warenkorb ist leer</h2>
            <Link href="/" className="bg-black text-white font-medium text-xs uppercase tracking-widest px-8 py-4 rounded-none hover:bg-zinc-900 transition-colors">
              Katalog durchsuchen
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LINKS: Formularbereiche */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              
              {/* BLOCK 1: Rechnungsadresse */}
              {userProfile && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-black flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
                    <span>01 // Rechnungsadresse</span>
                    <span className="text-[9px] font-mono text-samsung-muted uppercase tracking-wider">
                      Verifiziertes Profil
                    </span>
                  </h2>

                  <div className="p-5 rounded-none border border-zinc-200 bg-zinc-50 flex flex-col gap-1 text-xs">
                    <p className="font-bold text-black uppercase tracking-wide">{userProfile.firstName} {userProfile.lastName}</p>
                    <p className="text-zinc-800">{userProfile.street}</p>
                    <p className="text-zinc-800">{userProfile.zipCode} {userProfile.city}</p>
                    <p className="text-samsung-muted font-mono mt-2 text-[10px]">{userProfile.email}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowDifferentShipping(!showDifferentShipping)}
                      className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted hover:text-black transition-colors cursor-pointer"
                    >
                      {showDifferentShipping ? '✕ Standard-Lieferadresse nutzen' : '➔ Abweichende Lieferadresse angeben'}
                    </button>
                  </div>
                </div>
              )}

              {/* BLOCK 1B: Abweichende Lieferadresse */}
              {showDifferentShipping && (
                <div className="p-6 border border-zinc-200 bg-white rounded-none flex flex-col gap-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-black mb-2">
                    Abweichende Lieferanschrift
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-samsung-muted uppercase tracking-widest">Vorname</label>
                      <input required={showDifferentShipping} type="text" name="firstName" value={shippingData.firstName} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs font-normal focus:outline-none focus:border-black bg-white transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-samsung-muted uppercase tracking-widest">Nachname</label>
                      <input required={showDifferentShipping} type="text" name="lastName" value={shippingData.lastName} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs font-normal focus:outline-none focus:border-black bg-white transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-samsung-muted uppercase tracking-widest">Straße und Hausnummer</label>
                    <input required={showDifferentShipping} type="text" name="street" value={shippingData.street} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs font-normal focus:outline-none focus:border-black bg-white transition-colors" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-1">
                      <label className="text-[9px] font-mono text-samsung-muted uppercase tracking-widest">PLZ</label>
                      <input required={showDifferentShipping} type="text" name="zip" value={shippingData.zip} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs font-normal focus:outline-none focus:border-black bg-white transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[9px] font-mono text-samsung-muted uppercase tracking-widest">Stadt</label>
                      <input required={showDifferentShipping} type="text" name="city" value={shippingData.city} onChange={handleShippingChange} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs font-normal focus:outline-none focus:border-black bg-white transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK 2: Zahlungsmethoden */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-black border-b border-zinc-200 pb-3 mb-2">
                  02 // Zahlungsmethode
                </h2>

                <div className="flex flex-col gap-4">
                  {/* OBERE REIHE: Rechnung & Kreditkarte */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`border rounded-none p-5 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'invoice' ? 'border-black bg-zinc-50 font-medium' : 'border-zinc-200 hover:border-zinc-400 bg-white'}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-black">Rechnung</span>
                        <span className="text-[10px] text-samsung-muted font-normal">Zahlung nach Erhalt der Ware</span>
                      </div>
                      <input type="radio" name="paymentMethod" value="invoice" checked={paymentMethod === 'invoice'} onChange={() => setPaymentMethod('invoice')} className="h-3 w-3 accent-black cursor-pointer" />
                    </label>

                    <label className={`border rounded-none p-5 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-black bg-zinc-50 font-medium' : 'border-zinc-200 hover:border-zinc-400 bg-white'}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-black">Kreditkarte</span>
                        <span className="text-[10px] text-samsung-muted font-normal">Sicher bezahlen via Stripe</span>
                      </div>
                      <input type="radio" name="paymentMethod" value="credit_card" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} className="h-3 w-3 accent-black cursor-pointer" />
                    </label>
                  </div>

                  {/* UNTERE REIHE: PayPal & Klarna */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`border rounded-none p-5 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-black bg-zinc-50 font-medium' : 'border-zinc-200 hover:border-zinc-400 bg-white'}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-black">PayPal</span>
                        <span className="text-[10px] text-samsung-muted font-normal">Direkte Schnittstelle</span>
                      </div>
                      <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="h-3 w-3 accent-black cursor-pointer" />
                    </label>

                    <label className={`border rounded-none p-5 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'klarna' ? 'border-black bg-zinc-50 font-medium' : 'border-zinc-200 hover:border-zinc-400 bg-white'}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-black">Klarna</span>
                        <span className="text-[10px] text-samsung-muted font-normal">Sofortüberweisung / Raten</span>
                      </div>
                      <input type="radio" name="paymentMethod" value="klarna" checked={paymentMethod === 'klarna'} onChange={() => setPaymentMethod('klarna')} className="h-3 w-3 accent-black cursor-pointer" />
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* RECHTS: Zusammenfassung */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
              <div className="bg-white border border-zinc-200 rounded-none p-6">
                <h2 className="text-xs font-mono uppercase tracking-widest text-black border-b border-zinc-200 pb-3 mb-6">
                  03 // Bestellübersicht
                </h2>

                <div className="max-h-60 overflow-y-auto flex flex-col gap-4 pr-1 border-b border-zinc-100 pb-6 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 border border-zinc-200 rounded-none overflow-hidden shrink-0 bg-zinc-50">
                            <Image 
                              src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'} 
                              alt={item.title} 
                              fill 
                              className="object-cover grayscale" 
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-black truncate uppercase tracking-tight text-xs">{item.title}</h4>
                            <p className="text-samsung-muted text-[10px] font-mono mt-0.5">QTY: {item.quantity} × {item.price.toFixed(2)} €</p>
                          </div>
                        </div>
                        <span className="font-medium text-black shrink-0 font-mono">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5 border-b border-zinc-200 pb-6 mb-6 text-xs text-samsung-muted uppercase tracking-widest font-normal">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-samsung-muted">Zwischensumme:</span>
                    <span className="text-black font-mono">{cartTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-samsung-muted">Versand:</span>
                    <span className="text-black font-mono">
                      {shippingCosts === 0 ? (
                        <span className="text-black bg-zinc-100 border border-zinc-200 text-[9px] px-2 py-0.5 rounded-none uppercase font-mono">Frei</span>
                      ) : (
                        `${shippingCosts.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-samsung-muted normal-case font-mono lowercase tracking-normal">
                    <span>Inkl. 19% MwSt.:</span>
                    <span>{taxAmount.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-xs font-mono uppercase tracking-widest text-black">Gesamtsumme</span>
                  <span className="text-2xl font-light text-black tracking-tight font-mono">{finalTotal.toFixed(2)} €</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-medium text-xs uppercase tracking-widest py-4 rounded-none hover:bg-zinc-900 transition-colors cursor-pointer text-center disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Verarbeite Bestellung...' : 'Zahlungspflichtig bestellen'}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}