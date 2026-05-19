'use client';

import React, { useState } from 'react';

interface ProfileFormProps {
  user: {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    street?: string | null;
    zipCode?: string | null;
    city?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    street: user.street || '',
    zipCode: user.zipCode || '',
    city: user.city || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/account/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('✅ PROFIL ERFOLGREICH AKTUALISIERT');
      } else {
        const data = await res.json();
        setStatus(`❌ FEHLER: ${data.message || 'SPEICHERN FEHLGESCHLAGEN'}`);
      }
    } catch (err) {
      setStatus('❌ NETZWERKFEHLER');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-8 max-w-2xl w-full">
      {/* Sektion 1: Name */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-medium uppercase text-zinc-400 border-b border-zinc-100 pb-1 tracking-widest">
          Basis-Informationen
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Vorname</label>
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" 
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Nachname</label>
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" 
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">E-Mail (Nicht änderbar)</label>
          <input disabled type="text" value={user.email} className="w-full h-11 border border-zinc-100 rounded-none px-4 text-xs bg-zinc-100 text-zinc-400 cursor-not-allowed uppercase" />
        </div>
      </div>

      {/* Sektion 2: Adresse */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-medium uppercase text-zinc-400 border-b border-zinc-100 pb-1 tracking-widest">
          Anschrift & Versand
        </h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Straße & Hausnummer</label>
          <input 
            type="text" 
            value={formData.street} 
            onChange={(e) => setFormData({...formData, street: e.target.value})}
            className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" 
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">PLZ</label>
            <input 
              type="text" 
              value={formData.zipCode} 
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" 
          />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Stadt</label>
            <input 
              type="text" 
              value={formData.city} 
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full h-11 border border-zinc-200 rounded-none px-4 text-xs bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors" 
            />
          </div>
        </div>
      </div>

      {status && (
        <div className="text-[10px] font-medium uppercase tracking-widest p-3 bg-zinc-50 border border-zinc-200 text-black">
          {status}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="bg-black text-white text-[11px] font-medium uppercase tracking-widest py-4 px-8 rounded-none hover:bg-zinc-900 transition-colors disabled:bg-zinc-400 cursor-pointer self-start"
      >
        {loading ? 'SPEICHERE...' : 'ÄNDERUNGEN SPEICHERN'}
      </button>
    </form>
  );
}