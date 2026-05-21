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
  const [loading, setLoading] = useState(false);

  const [showSellerWeiche, setShowSellerWeiche] = useState(false);
  const [showAdminWeiche, setShowAdminWeiche] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);

  useEffect(() => {
    if (urlEmail) setEmail(urlEmail);
  }, [urlEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Bitte alle Felder ausfüllen.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login fehlgeschlagen.');
      }

      // 🎯 KORREKTUR: Schlüssel auf 'shop4you_user' geändert, passend zur Checkout-Sperre!
      localStorage.setItem('shop4you_user', JSON.stringify(data.user));
      setUser({ firstName: data.user.firstName, role: data.user.role });
      setAuthenticatedUser(data.user);

      if (data.user.role === 'ADMIN') { // Matcht das Prisma Enum in Großbuchstaben
        setShowAdminWeiche(true);
      } else if (data.user.role === 'SELLER') {
        setShowSellerWeiche(true);
      } else {
        // Falls eine Callback-URL (z.B. /checkout) existiert, dorthin leiten, sonst zum Storefront
        const callback = searchParams.get('callback');
        router.push(callback || '/');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showAdminWeiche) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
        <div className="bg-white border border-zinc-200 p-8 rounded-none max-w-sm w-full text-left shadow-xl flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-normal text-black uppercase tracking-widest">Scope: Administrator</h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">{authenticatedUser?.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => router.push('/admin')} className="w-full bg-black hover:bg-zinc-900 text-white text-[11px] uppercase py-3.5 tracking-widest font-medium transition-colors rounded-none cursor-pointer">Zur Admin-Zentrale</button>
            <button onClick={() => router.push('/seller/dashboard')} className="w-full bg-zinc-100 hover:bg-zinc-200 text-black text-[11px] uppercase py-3.5 tracking-widest font-medium transition-colors rounded-none cursor-pointer">Händler-Dashboard testen</button>
            <button onClick={() => router.push('/')} className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-[11px] uppercase py-3.5 tracking-widest font-medium transition-colors rounded-none cursor-pointer">Zum Storefront</button>
          </div>
        </div>
      </div>
    );
  }

  if (showSellerWeiche) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
        <div className="bg-white border border-zinc-200 p-8 rounded-none max-w-sm w-full text-left shadow-xl flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-normal text-black uppercase tracking-widest">Rolle: Verkäufer</h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">{authenticatedUser?.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => router.push('/seller/dashboard')} className="w-full bg-black hover:bg-zinc-900 text-white text-[11px] uppercase py-3.5 tracking-widest font-medium transition-colors rounded-none cursor-pointer">Zum Händler-Dashboard</button>
            <button onClick={() => router.push('/')} className="w-full bg-zinc-100 hover:bg-zinc-200 text-black text-[11px] uppercase py-3.5 tracking-widest font-medium transition-colors rounded-none cursor-pointer">Normal im Shop stöbern</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-50">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-10 rounded-none shadow-sm flex flex-col gap-6 text-black relative z-10">
        
        {/* 🎯 NEU: Abbruch-Button über dem Titel */}
        <div className="text-left">
          <Link 
            href="/" 
            className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-4 inline-block"
          >
            ◀ ABBRECHEN // ZURÜCK ZUM SHOP
          </Link>
          <h1 className="text-xl font-normal uppercase tracking-widest text-black">Anmelden</h1>
          <p className="text-xs text-zinc-400 font-normal mt-0.5">Nutze deine shop4you ID, um fortzufahren.</p>
        </div>

        {urlEmail && !errorMsg && (
          <div className="p-3 bg-zinc-50 text-black border-l border-black text-xs font-normal rounded-none">
            Registrierung erfolgreich! Bitte logge dich jetzt ein.
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-zinc-50 text-black border-l border-black text-xs font-normal rounded-none">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">E-Mail-Adresse</label>
            <input required type="email" disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Passwort</label>
              <Link href="/forgot-password" className="text-[10px] font-normal text-zinc-400 hover:text-black underline transition-colors tracking-widest uppercase">Vergessen?</Link>
            </div>
            <div className="relative">
              <input required type={showPassword ? 'text' : 'password'} disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 border border-zinc-200 rounded-none pl-4 pr-11 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors p-1 cursor-pointer">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black hover:bg-zinc-900 text-white font-medium text-xs uppercase tracking-widest py-4 rounded-none mt-2 transition-colors disabled:bg-zinc-400 cursor-pointer">
            {loading ? 'PRÜFE ID...' : 'WEITER →'}
          </button>
        </form>

        <div className="text-left border-t border-zinc-200 pt-4">
          <Link href="/register" className="text-xs text-zinc-400 hover:text-black transition-colors font-normal">
            Noch keine shop4you ID? <span className="text-black font-medium underline underline-offset-4">Hier erstellen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}