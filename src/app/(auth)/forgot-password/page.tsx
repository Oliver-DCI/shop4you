'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 1. Das eigentliche Formular als eigene Komponente
function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // States für die Sichtbarkeit der Passwörter (Auge-Symbol)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Schritt 1: Prüfen, ob ID existiert
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Wiederherstellung fehlgeschlagen.');
      }

      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Schritt 2: Neues Passwort speichern
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (newPassword !== confirmPassword) {
      setErrorMsg('Die Passwörter stimmen nicht überein.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Fehler beim Zurücksetzen.');
      }

      setSuccessMsg('PASSWORT ERFOLGREICH AKTUALISIERT');
      
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-50">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-10 rounded-none shadow-sm flex flex-col gap-6 text-black relative z-10">
        
        <div className="text-left">
          <Link 
            href="/login" 
            className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted hover:text-black transition-colors mb-4 inline-block"
          >
            ◀ ZURÜCK ZUM LOGIN
          </Link>
          <h1 className="text-xl font-normal uppercase tracking-widest text-black">ID Wiederherstellen</h1>
          <p className="text-xs text-samsung-muted font-normal mt-0.5">
            {step === 1 ? 'Fordere die Zugangsdaten für deine shop4you ID an.' : 'Vergib ein neues, sicheres Passwort für deine ID.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-zinc-50 text-black border-l border-black text-xs font-normal font-mono uppercase rounded-none">
            ○ FEHLER: {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50/50 border border-emerald-500 text-emerald-700 text-xs font-normal font-mono uppercase rounded-none">
            ● {successMsg} <br />
            <span className="text-[10px] text-zinc-500 lowercase mt-1 block">Leite Weiter zum Login...</span>
          </div>
        )}

        {!successMsg && step === 1 && (
          <form onSubmit={handleCheckEmail} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest">E-Mail-Adresse deiner ID</label>
              <input 
                required 
                type="email" 
                disabled={loading} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full h-12 border border-zinc-200 rounded-none px-4 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors font-mono" 
                placeholder="name@example.com"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-black hover:bg-zinc-900 text-white font-medium text-xs uppercase tracking-widest py-4 rounded-none mt-2 transition-colors disabled:bg-zinc-400 cursor-pointer font-mono"
            >
              {loading ? 'SUCHE ID...' : 'ZUGANGSDATEN ANFORDERN →'}
            </button>
          </form>
        )}

        {!successMsg && step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
            <div className="p-3 bg-zinc-50 border border-zinc-200 font-mono text-[11px] text-zinc-800">
              <span className="text-emerald-600 font-bold">● ID VERIFIZIERT:</span> {email}
            </div>

            {/* Feld 1: Neues Passwort mit Auge */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest">Neues Passwort</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? 'text' : 'password'} 
                  disabled={loading} 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full h-12 border border-zinc-200 rounded-none pl-4 pr-11 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors font-mono" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-samsung-muted hover:text-black transition-colors p-1 cursor-pointer">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Feld 2: Passwort bestätigen mit Auge */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest">Neues Passwort bestätigen</label>
              <div className="relative">
                <input 
                  required 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  disabled={loading} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full h-12 border border-zinc-200 rounded-none pl-4 pr-11 text-xs bg-white text-black focus:outline-none focus:border-black transition-colors font-mono" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-samsung-muted hover:text-black transition-colors p-1 cursor-pointer">
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-black hover:bg-zinc-900 text-white font-medium text-xs uppercase tracking-widest py-4 rounded-none mt-2 transition-colors disabled:bg-zinc-400 cursor-pointer font-mono"
            >
              {loading ? 'SPEICHERE...' : 'PASSWORT AKTUALISIEREN →'}
            </button>
          </form>
        )}

        <div className="text-left border-t border-zinc-200 pt-4">
          <Link href="/register" className="text-xs text-samsung-muted hover:text-black transition-colors font-normal">
            Noch keine shop4you ID? <span className="text-black font-medium underline underline-offset-4">Hier erstellen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 2. Exportierte Hauptseite, die das Formular in Suspense einbettet
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-50 font-mono text-xs uppercase">
        Lade Wiederherstellung...
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}