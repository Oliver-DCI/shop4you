'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecurityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // State für das SHOP4YOU Custom-Löschmodal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [pwData, setPwData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    if (pwData.newPassword !== pwData.confirmPassword) {
      setIsSuccess(false);
      setStatus('FEHLER: DIE PASSWÖRTER STIMMEN NICHT ÜBEREIN');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setIsSuccess(true);
      setStatus('PASSWORT ERFOLGREICH GEÄNDERT // ACCESSTOKEN AKTUALISIERT');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
      const userId = currentUser.id;

      if (!userId) {
        alert('Fehler: Keine Benutzer-ID gefunden.');
        setDeleteLoading(false);
        return;
      }

      const response = await fetch(`/api/account/delete?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        localStorage.removeItem('shop4you_user');
        router.push('/');
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Fehler: ${data.error || 'Konto konnte nicht gelöscht werden.'}`);
        setDeleteLoading(false);
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error('Fehler beim Löschen des Kontos:', err);
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full text-black relative">
      
      {/* Titelbereich */}
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest font-mono">Sicherheit & Autorisierung | Account löschen</h2>
        <p className="text-xs text-samsung-muted mt-1 font-mono">Verwalte deine Passwörter und kryptografischen Identitäten.</p>
      </div>

      {/* Passwort ändern Formular */}
      <form onSubmit={handlePasswordChange} className="flex flex-col gap-5 max-w-md w-full">
        <h3 className="text-[10px] font-medium uppercase text-samsung-muted border-b border-zinc-100 pb-1 tracking-widest font-mono">
          Passwort ändern
        </h3>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest font-mono">Aktuelles Passwort</label>
          <input required type="password" value={pwData.currentPassword} onChange={(e) => setPwData({...pwData, currentPassword: e.target.value})} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors font-mono" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest font-mono">Neues Passwort</label>
          <input required type="password" value={pwData.newPassword} onChange={(e) => setPwData({...pwData, newPassword: e.target.value})} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors font-mono" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest font-mono">Neues Passwort bestätigen</label>
          <input required type="password" value={pwData.confirmPassword} onChange={(e) => setPwData({...pwData, confirmPassword: e.target.value})} className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors font-mono" />
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
          className="bg-black text-white text-[11px] font-medium uppercase tracking-widest py-4 px-8 rounded-none hover:bg-zinc-900 transition-colors disabled:bg-samsung-muted cursor-pointer self-start font-mono"
        >
          {loading ? 'GEÄNDERT...' : 'PASSWORT AKTUALISIEREN'}
        </button>
      </form>

      {/* 🎯 Sektion: Account löschen (Jetzt mit genau einem sauberen Trennstrich oben) */}
      <div className="w-full max-w-4xl border-t border-zinc-200 pt-8 mt-4">
        <div className="w-full flex flex-col gap-4 max-w-md">
          <div>
            <h2 className="text-xl font-normal uppercase tracking-widest font-mono text-black">
              Account löschen
            </h2>
            <p className="text-xs text-zinc-800 mt-2 font-mono leading-relaxed">
              // Das Löschen deines Accounts entfernt all deine Profildaten!
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-black text-white text-[11px] font-medium uppercase tracking-widest py-4 px-8 rounded-none hover:bg-zinc-900 transition-colors disabled:bg-samsung-muted cursor-pointer font-mono self-start"
          >
            Konto permanent löschen
          </button>
        </div>
      </div>

      {/* SHOP4YOU Premium-Löschmodal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 p-8 max-w-md w-full rounded-none shadow-xl animate-in fade-in zoom-in-95 duration-150">
            
            <div className="border-b border-zinc-100 pb-4 mb-6">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-samsung-muted block mb-1">
                SHOP4YOU // Account-Kündigung
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 font-mono">
                Bist du dir absolut sicher?
              </h3>
            </div>

            <p className="text-xs text-zinc-800 leading-relaxed font-mono mb-8">
              Sind Sie sicher, dass Ihr Account gelöscht werden soll? Alle gelisteten Produkte, Statistiken und Verknüpfungen gehen sofort verloren. Diese Aktion ist endgültig.
            </p>

            <div className="flex gap-4 font-mono text-[11px] tracking-widest">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 py-3 transition-colors uppercase font-medium cursor-pointer disabled:opacity-50"
              >
                Abbrechen
              </button>
              
              <button
                onClick={handleConfirmDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 bg-black text-white hover:bg-zinc-900 py-3 transition-colors uppercase font-medium cursor-pointer disabled:bg-zinc-400"
              >
                {deleteLoading ? 'LÖSCHT...' : 'JA, LÖSCHEN'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}