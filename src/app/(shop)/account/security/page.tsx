'use client';

import React, { useState } from 'react';

export default function SecurityPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [pwData, setPwData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus('');

    if (pwData.newPassword !== pwData.confirmPassword) {
      setIsSuccess(false);
      setStatus('FEHLER: DIE PASSWÖRTER STIMMEN NICHT ÜBEREIN');
      return;
    }

    setLoading(true);
    // Hier binden wir später die /api/account/change-password ein
    setTimeout(() => {
      setIsSuccess(true);
      setStatus('PASSWORT ERFOLGREICH GEÄNDERT // ACCESSTOKEN AKTUALISIERT');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  const setErrorStatus = (msg: string) => {
    setStatus(msg);
  };

  return (
    <div className="flex flex-col gap-6 w-full text-black">
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest">Sicherheit & Autorisierung</h2>
        <p className="text-xs text-zinc-400 mt-1">Verwalte deine Passwörter und kryptografischen Identitäten.</p>
      </div>

      <form onSubmit={handlePasswordChange} className="flex flex-col gap-5 max-w-md w-full">
        <h3 className="text-[10px] font-medium uppercase text-zinc-400 border-b border-zinc-100 pb-1 tracking-widest">
          Passwort ändern
        </h3>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Aktuelles Passwort</label>
          <input required type="password" value={pwData.currentPassword} onChange={(e) => setPwData({...pwData, currentPassword: e.target.value})} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Neues Passwort</label>
          <input required type="password" value={pwData.newPassword} onChange={(e) => setPwData({...pwData, newPassword: e.target.value})} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Neues Passwort bestätigen</label>
          <input required type="password" value={pwData.confirmPassword} onChange={(e) => setPwData({...pwData, confirmPassword: e.target.value})} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" />
        </div>

        {status && (
          <div className={`text-[10px] font-mono uppercase tracking-widest p-4 border rounded-none ${
            isSuccess 
              ? 'bg-emerald-50/50 border-emerald-500 text-emerald-700' 
              : 'bg-zinc-50 border-zinc-200 text-black'
          }`}>
            {isSuccess ? '● ' : '○ '} {status}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white text-[11px] font-medium uppercase tracking-widest py-4 px-8 rounded-none hover:bg-zinc-900 transition-colors disabled:bg-zinc-400 cursor-pointer self-start"
        >
          {loading ? 'GEÄNDERT...' : 'PASSWORT AKTUALISIEREN'}
        </button>
      </form>
    </div>
  );
}