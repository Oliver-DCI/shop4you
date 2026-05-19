// src/app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !lastName || !email || !password || !street || !zipCode || !city) {
      setErrorMsg('Bitte fülle deine vollständige Anschrift und Profildaten aus.');
      return;
    }

    const userData = { firstName, lastName, email, password, role, street, zipCode, city };
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));

    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    /* 🛍️ Äußerer Container komplett transparent-weiß mit blur, um den Shop im Hintergrund durchscheinen zu lassen */
    <div className="min-h-[calc(100vh-5rem)] w-full flex items-center justify-center p-6 shop-overlay-blur relative">
      
      {/* Helle Hintergrund-Glows innerhalb des Overlays */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-200/15 rounded-full filter blur-[90px] pointer-events-none" />

      {/* 🔮 Die eigentliche Registrierungskarte bleibt massiv & deckend geschützt durch light-glass */}
      <div className="max-w-xl w-full light-glass border border-white/80 p-8 rounded-3xl shadow-xl flex flex-col gap-6 text-zinc-800 relative z-10">
        
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 select-none">
            Konto erstellen
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Registrierung als verifizierter Käufer oder Händler</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Helle Rollen-Auswahl */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100/80 rounded-xl border border-zinc-200">
          <button 
            type="button" 
            onClick={() => setRole('customer')} 
            className={`py-2.5 text-[11px] font-black uppercase rounded-lg transition-all cursor-pointer ${role === 'customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Customer (Käufer)
          </button>
          <button 
            type="button" 
            onClick={() => setRole('seller')} 
            className={`py-2.5 text-[11px] font-black uppercase rounded-lg transition-all cursor-pointer ${role === 'seller' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Seller (Verkäufer)
          </button>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          <h3 className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-200 pb-1 tracking-widest">1. Persönliche Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Vorname</label>
              <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Max" className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Nachname</label>
              <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Mustermann" className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">E-Mail-Adresse</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@mustermann.de" className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" />
          </div>
          
          {/* Passwort Feld mit Auge */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Passwort wählen</label>
            <div className="relative">
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full h-11 border border-zinc-200 rounded-xl pl-4 pr-11 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 shadow-sm" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <h3 className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-200 pb-1 tracking-widest mt-2">2. Vollständige Anschrift</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Straße & Hausnummer</label>
            <input required type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Hauptstraße 12a" className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">PLZ</label>
              <input required type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="12345" className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Stadt / Ort</label>
              <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Berlin" className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl mt-4 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Konto erstellen ➔
          </button>
        </form>

        <div className="text-center border-t border-zinc-200/80 pt-4">
          <Link href="/login" className="text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors font-medium">
            Bereits registriert? <span className="text-blue-600 font-black underline underline-offset-4 decoration-2">Hier einloggen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}