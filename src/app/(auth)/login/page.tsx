// src/app/(auth)/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/store/cartStore';

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
  // 🔮 MODAL 1: DIE ADMIN-WEICHE (Drei Optionen)
  // ==========================================
  if (showAdminWeiche) {
    return (
      <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl flex flex-col gap-6">
          <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center text-xl mx-auto text-pink-400 animate-pulse">
            👑
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white tracking-tight">Scope: Administrator</h2>
            <p className="text-xs text-zinc-400 mt-1">Wähle deine Ziel-Umgebung für diese Session:</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/admin')} 
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-pink-900/20"
            >
              🛡️ Zur Admin-Zentrale
            </button>
            <button 
              onClick={() => router.push('/seller/dashboard')} 
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-black uppercase py-3.5 rounded-xl transition-all"
            >
              📊 Händler-Dashboard testen
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs font-black uppercase py-3.5 rounded-xl transition-all"
            >
              🛒 Zum Storefront (Live-Ansicht)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 💼 MODAL 2: DIE SELLER-WEICHE (Zwei Optionen)
  // ==========================================
  if (showSellerWeiche) {
    return (
      <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl flex flex-col gap-6">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-xl mx-auto text-purple-400">
            💼
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white">Rolle erkannt: Verkäufer</h2>
            <p className="text-xs text-zinc-400 mt-1">Wohin möchtest du verzweigen?</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/seller/dashboard')} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black uppercase py-3.5 rounded-xl transition-all"
            >
              📊 Zum Händler-Dashboard
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-black uppercase py-3.5 rounded-xl transition-all"
            >
              🛒 Normal im Shop stöbern
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 📝 DEEP DARK LOGIN FORMULAR (Jetzt perfekt dunkel!)
  // ==========================================
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-[#09090b]">
      <div className="max-w-md w-full bg-[#121214] border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-[#f4f4f5]">
        
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Willkommen zurück
          </h1>
          <p className="text-xs text-zinc-500">Logge dich ein, um deine Bestellungen oder Produkte zu verwalten</p>
        </div>

        {urlEmail && !errorMsg && (
          <div className="p-3 bg-purple-950/50 text-purple-400 border border-purple-900/40 rounded-xl text-center text-xs font-bold uppercase tracking-wider">
            🎉 Registrierung erfolgreich! Bitte bestätige dein Login.
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-950/50 text-red-400 border border-red-900/40 rounded-xl text-center text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">E-Mail-Adresse</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="max@mustermann.de" 
              className="w-full h-11 border border-zinc-800 rounded-xl px-4 text-xs bg-[#09090b] text-white focus:outline-none focus:border-zinc-600 transition-colors" 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Passwort</label>
            <div className="relative">
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full h-11 border border-zinc-800 rounded-xl pl-4 pr-11 text-xs bg-[#09090b] text-white focus:outline-none focus:border-zinc-600 transition-colors" 
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

          <button 
            type="submit" 
            className="w-full font-black text-xs uppercase py-4 rounded-xl mt-4 bg-white text-black hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Einloggen ➔
          </button>
        </form>

        <div className="text-center">
          <Link href="/register" className="text-[11px] text-zinc-500 hover:text-zinc-400 transition-colors">
            Noch kein Konto? <span className="text-white font-bold underline">Hier registrieren</span>
          </Link>
        </div>
      </div>
    </div>
  );
}