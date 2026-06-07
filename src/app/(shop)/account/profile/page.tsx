import React from 'react';
import ProfileWrapper from '@/components/account/ProfileWrapper';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 w-full text-black">
      <div>
        <h2 className="text-xl font-normal uppercase tracking-widest">Persönliches Profil</h2>
        <p className="text-xs text-samsung-muted mt-1">Verwalte deine Identität und deine primäre Versandadresse.</p>
      </div>

      {/* Der Wrapper kümmert sich darum, den eingeloggten User aus dem localStorage zu holen */}
      <ProfileWrapper />
    </div>
  );
}