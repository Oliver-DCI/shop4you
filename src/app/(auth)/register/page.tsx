'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  // 🎯 FIX: State direkt auf die exakten Backend-Enum-Werte setzen, um Konvertierungsfehler zu vermeiden
  const [role, setRole] = useState<'USER' | 'SELLER'>('USER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !lastName || !email || !password || !street || !zipCode || !city) {
      setErrorMsg('Bitte fülle deine vollständige Anschrift und Profildaten aus.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role, // 🎯 FIX: Wird jetzt direkt und sauber als 'USER' oder 'SELLER' durchgereicht
          street,
          zipCode,
          city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen.');
      }

      router.push(`/login?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-50 overflow-y-auto">
      <div className="max-w-xl w-full bg-white border border-zinc-200 p-10 rounded-none shadow-sm flex flex-col gap-6 text-black my-auto relative z-10">
        
        <div className="text-left">
          <Link 
            href="/" 
            className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-4 inline-block"
          >
            ◀ ABBRECHEN // ZURÜCK ZUM SHOP
          </Link>
          <h1 className="text-xl font-normal uppercase tracking-widest text-black select-none">
            Konto erstellen
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">Registrierung als verifizierter Käufer oder Händler für shop4you</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-zinc-50 text-black border-l-2 border-black text-xs font-normal rounded-none">
            {errorMsg}
          </div>
        )}

        {/* Rollen-Auswahl: Absolut flach und geometrisch */}
        <div className="grid grid-cols-2 p-0 bg-white rounded-none border border-zinc-200">
          <button 
            type="button" 
            disabled={loading}
            onClick={() => setRole('USER')} 
            className={`py-3 text-[10px] tracking-widest font-medium uppercase rounded-none transition-colors cursor-pointer ${role === 'USER' ? 'bg-black text-white' : 'text-zinc-400 bg-white hover:text-black'}`}
          >
            Customer (Käufer)
          </button>
          <button 
            type="button" 
            disabled={loading}
            onClick={() => setRole('SELLER')} 
            className={`py-3 text-[10px] tracking-widest font-medium uppercase rounded-none transition-colors cursor-pointer ${role === 'SELLER' ? 'bg-black text-white' : 'text-zinc-400 bg-white hover:text-black'}`}
          >
            Seller (Verkäufer)
          </button>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <h3 className="text-[9px] font-medium uppercase text-zinc-400 border-b border-zinc-200 pb-1 tracking-widest">1. Persönliche Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Vorname</label>
              <input required type="text" disabled={loading} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Nachname</label>
              <input required type="text" disabled={loading} value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">E-Mail-Adresse</label>
            <input required type="email" disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Passwort wählen</label>
            <div className="relative">
              <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="w-full h-11 border border-zinc-200 rounded-none pl-4 pr-11 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors p-1 cursor-pointer">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <h3 className="text-[9px] font-medium uppercase text-zinc-400 border-b border-zinc-200 pb-1 tracking-widest mt-2">2. Anschrift</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Straße & Hausnummer</label>
            <input required type="text" disabled={loading} value={street} onChange={(e) => setStreet(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">PLZ</label>
              <input required type="text" disabled={loading} value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Stadt / Ort</label>
              <input required type="text" disabled={loading} value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black hover:bg-zinc-900 text-white font-medium text-xs uppercase tracking-widest py-4 rounded-none mt-4 transition-colors disabled:bg-zinc-400 cursor-pointer">
            {loading ? 'ID WIRD ERSTELLT...' : 'ID REGISTRIEREN →'}
          </button>
        </form>

        <div className="text-left border-t border-zinc-200 pt-4">
          <Link href="/login" className="text-xs text-zinc-400 hover:text-black transition-colors font-normal">
            Bereits registriert? <span className="text-black font-medium underline underline-offset-4">Hier einloggen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}