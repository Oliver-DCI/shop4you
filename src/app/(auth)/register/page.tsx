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
  
  // Anschrift
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  
  // 👁️ Passwort-Sichtbarkeit State
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !lastName || !email || !password || !street || !zipCode || !city) {
      setErrorMsg('Bitte fülle deine vollständige Anschrift und Profildaten aus.');
      return;
    }

    // In lokaler DB / LocalStorage sichern
    const userData = { firstName, lastName, email, password, role, street, zipCode, city };
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));

    // 🎯 2026 UX-Standard: Weiterleitung zum Login mit E-Mail im Gepäck, kein Auto-Login!
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-zinc-950">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-zinc-100">
        
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Konto erstellen
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Registrierung als verifizierter Käufer oder Händler</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 text-red-400 border border-red-900/50 rounded-xl text-center text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Rollen-Auswahl */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          <button type="button" onClick={() => setRole('customer')} className={`py-2.5 text-[11px] font-black uppercase rounded-lg transition-all ${role === 'customer' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}>🛒 Customer (Käufer)</button>
          <button type="button" onClick={() => setRole('seller')} className={`py-2.5 text-[11px] font-black uppercase rounded-lg transition-all ${role === 'seller' ? 'bg-cyan-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}>💼 Seller (Verkäufer)</button>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          <h3 className="text-xs font-black uppercase text-zinc-400 border-b border-zinc-800 pb-1 tracking-wider">1. Persönliche Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Vorname</label>
              <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Max" className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Nachname</label>
              <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Mustermann" className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">E-Mail-Adresse</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@mustermann.de" className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" />
          </div>
          
          {/* Passwort Feld mit Auge */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Passwort wählen</label>
            <div className="relative">
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full h-11 border border-zinc-800 rounded-xl pl-4 pr-11 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs select-none"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <h3 className="text-xs font-black uppercase text-zinc-400 border-b border-zinc-800 pb-1 tracking-wider mt-2">2. Vollständige Anschrift</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Straße & Hausnummer</label>
            <input required type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Hauptstraße 12a" className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">PLZ</label>
              <input required type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="12345" className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Stadt / Ort</label>
              <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Berlin" className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-zinc-950 text-zinc-100 focus:outline-none focus:border-zinc-700" />
            </div>
          </div>

          <button type="submit" className={`w-full font-black text-xs uppercase py-4 rounded-xl mt-4 transition-all ${role === 'seller' ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.15)]' : 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.15)]'}`}>
            Konto erstellen ➔
          </button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-[11px] text-zinc-400 hover:text-zinc-200">
            Bereits Kunde? <span className="text-blue-400 font-bold underline">Hier einloggen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}