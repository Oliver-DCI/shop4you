'use client';

import React, { useEffect, useState } from 'react';
import ProfileForm from './AccountProfileForm';

export default function ProfileWrapper() {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('shop4you_user');
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleProfileSync = (updatedUser: any) => {
    setActiveUser(updatedUser);
    localStorage.setItem('shop4you_user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <p className="text-xs font-mono uppercase text-samsung-muted">Lade Profildaten...</p>;
  }

  if (!activeUser) {
    return (
      <p className="text-xs font-mono uppercase text-red-500 border border-red-200 p-4 bg-red-50">
        Kein aktiver Benutzer gefunden. Bitte melde dich zuerst an.
      </p>
    );
  }

  return <ProfileForm user={activeUser} onProfileUpdate={handleProfileSync} />;
}