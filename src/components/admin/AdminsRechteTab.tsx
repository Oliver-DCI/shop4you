'use client';

import React, { useState } from 'react';

export default function AdminsTab() {
  const [showAdminForm, setShowAdminForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl uppercase tracking-wider font-light text-black">Administratoren & Rechteverwaltung</h2>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-mono">Berechtigte Teammitglieder für das Marktplatz-HQ</p>
        </div>
        <button 
          onClick={() => setShowAdminForm(!showAdminForm)}
          className="bg-black text-white text-[10px] tracking-widest px-4 py-2 uppercase hover:bg-zinc-900 transition-colors cursor-pointer font-mono"
        >
          {showAdminForm ? 'Schließen' : '+ NEUEN ADMIN ANLEGEN'}
        </button>
      </div>

      {showAdminForm && (
        <div className="border border-black p-6 bg-zinc-50 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black font-mono">Neuen System-Administrator autorisieren</p>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="VORNAME" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
            <input type="text" placeholder="NACHNAME" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
          </div>
          <input type="email" placeholder="E-MAIL ADRESSE" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
          <input type="password" placeholder="PASSWORT" className="h-10 border border-zinc-200 bg-white px-3 text-xs focus:outline-none focus:border-black rounded-none" />
          <button className="bg-black text-white text-[10px] tracking-widest py-3 uppercase hover:bg-zinc-900 transition-colors self-start px-6 cursor-pointer font-mono">
            ADMIN-RECHTE ERTEILEN
          </button>
        </div>
      )}
    </div>
  );
}