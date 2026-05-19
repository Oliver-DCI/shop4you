// src/app/(auth)/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/cartContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useCart();

  const urlEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(urlEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 🔀 States für die Rollen-Weichen
  const [showSellerWeiche, setShowSellerWeiche] = useState(false);
  const [showAdminWeiche, setShowAdminWeiche] = useState(false);

  useEffect(() => {
    if (urlEmail) {
      setEmail(urlEmail);
      const stored = localStorage.getItem(`user_${urlEmail}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPassword(parsed.password || '');
      }
    }
  }, [urlEmail]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Bitte alle Felder ausfüllen.');
      return;
    }

    // 1. 👑 CHECK: Ist es der Admin?
    if (email === 'admin@shop4you.de' && password === 'admin') {
      const adminUser = { firstName: 'Admin', role: 'admin' };
      localStorage.setItem('active_user', JSON.stringify(adminUser));
      setUser({ firstName: 'Admin', role: 'admin' });
      
      // Admin-Weiche zünden!
      setShowAdminWeiche(true);
      return;
    }

    // 2. 👤 CHECK: Normale registrierte User (Kunden & Verkäufer)
    const stored = localStorage.getItem(`user_${email}`);
    if (stored) {
      const parsedUser = JSON.parse(stored);
      if (parsedUser.password === password) {
        localStorage.setItem('active_user', JSON.stringify(parsedUser));
        setUser({ firstName: parsedUser.firstName, role: parsedUser.role });

        // Wenn Rolle Verkäufer ist -> Händler-Weiche
        if (parsedUser.role === 'seller') {
          setShowSellerWeiche(true);
        } else {
          router.push('/'); // Kunden gehen direkt shoppen
        }
        return;
      }
    }

    setErrorMsg('Ungültige E-Mail-Adresse oder falsches Passwort.');
  };

  // ==========================================
  // 🔮 MODAL 1: DIE ADMIN-WEICHE (Heller SaaS-Style)
  // ==========================================
  if (showAdminWeiche) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="light-glass border border-white/80 p-8 rounded-3xl max-w-sm w-full text-center shadow-xl flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-black uppercase text-zinc-900 tracking-tight">Scope: Administrator</h2>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Wähle deine Ziel-Umgebung für diese Session:</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => router.push('/admin')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Zur Admin-Zentrale
            </button>
            <button 
              onClick={() => router.push('/seller/dashboard')} 
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-black uppercase py-3.5 rounded-xl transition-all border border-zinc-200 cursor-pointer"
            >
              Händler-Dashboard testen
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-[11px] font-black uppercase py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Zum Storefront (Live-Ansicht)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 💼 MODAL 2: DIE SELLER-WEICHE (Heller SaaS-Style)
  // ==========================================
  if (showSellerWeiche) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="light-glass border border-white/80 p-8 rounded-3xl max-w-sm w-full text-center shadow-xl flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v14.25M2.25 11.25h3m-.75 3h7.5M21 21v-7.5m0 0H18m3 0h-2.25m0 0h-3m3 0V9M3 3h10.5M3 7h10.5M13.5 3v14.25" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-black uppercase text-zinc-900 tracking-tight">Rolle erkannt: Verkäufer</h2>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Wohin möchtest du verzweigen?</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => router.push('/seller/dashboard')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Zum Händler-Dashboard
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-[11px] font-black uppercase py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Normal im Shop stöbern
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 📝 LIGHT MODE LOGIN FORMULAR (Glass-Edition)
  // ==========================================
  return (
    /* 🛍️ Äußerer Container komplett transparent-weiß mit blur, um den Shop durchscheinen zu lassen */
    <div className="min-h-[calc(100vh-5rem)] w-full flex items-center justify-center p-6 shop-overlay-blur relative">
      
      {/* Sanfte Hintergrund-Lichtquellen innerhalb des Overlays */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-200/20 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-200/15 rounded-full filter blur-[80px] pointer-events-none" />

      {/* Das Login-Formulardiv selbst bleibt massiv & deckend geschützt durch light-glass */}
      <div className="max-w-md w-full light-glass border border-white/80 p-8 rounded-3xl shadow-xl flex flex-col gap-6 text-zinc-800 relative z-10">
        
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 select-none">
            Willkommen zurück
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Logge dich ein, um deine Bestellungen oder Produkte zu verwalten
          </p>
        </div>

        {urlEmail && !errorMsg && (
          <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center text-[11px] font-black uppercase tracking-wider shadow-inner">
            🎉 Registrierung erfolgreich! Bitte bestätige dein Login.
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {/* E-Mail Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">E-Mail-Adresse</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="max@mustermann.de" 
              className="w-full h-11 border border-zinc-200 rounded-xl px-4 text-xs bg-white text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-400 font-medium shadow-sm" 
            />
          </div>
          
          {/* Passwort Input & "Passwort vergessen?" */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Passwort</label>
              
              <Link 
                href="/forgot-password" 
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-blue-600 transition-colors"
              >
                Passwort vergessen?
              </Link>
            </div>
            
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

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl mt-4 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Einloggen ➔
          </button>
        </form>

        {/* Footer-Wechsel */}
        <div className="text-center border-t border-zinc-200/80 pt-4">
          <Link href="/register" className="text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors font-medium">
            Noch kein Konto? <span className="text-blue-600 font-black underline underline-offset-4 decoration-2">Hier registrieren</span>
          </Link>
        </div>
      </div>
    </div>
  );
}