'use client';

import React, { useEffect, useState } from 'react';
import ProfileForm from './ProfileForm';

export default function ProfileWrapper() {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Holt den frisch registrierten/eingeloggten User direkt aus dem localStorage
    const storedUser = localStorage.getItem('shop4you_user');
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p className="text-xs font-mono uppercase text-zinc-400">Lade Profildaten...</p>;
  }

  if (!activeUser) {
    return (
      <p className="text-xs font-mono uppercase text-red-500 border border-red-200 p-4 bg-red-50">
        Kein aktiver Benutzer gefunden. Bitte melde dich zuerst an.
      </p>
    );
  }

  // Übergibt die ECHTEN Daten deines registrierten Kunden an das Formular
  return <ProfileForm user={activeUser} />;
}