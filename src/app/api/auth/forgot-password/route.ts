import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword, confirmPassword } = body;

    if (!email) {
      return NextResponse.json({ error: 'E-Mail-Adresse fehlt.' }, { status: 400 });
    }

    // Falls der User im zweiten Schritt ist und das Passwort ändern möchte
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: 'Die Passwörter stimmen nicht überein.' }, { status: 400 });
      }

      // Passwort hashen, um es sicher in PostgreSQL zu speichern
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Passwort in der Datenbank aktualisieren
      await prisma.user.update({
        where: { email: email.toLowerCase().trim() },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true, message: 'Passwort erfolgreich aktualisiert.' });
    }

    // --- Schritt 1: Nur prüfen, ob die E-Mail existiert ---
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Unter dieser E-Mail-Adresse wurde keine shop4you ID gefunden.' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'ID verifiziert.' });

  } catch (error: any) {
    console.error('Fehler bei forgot-password API:', error);
    return NextResponse.json(
      { error: 'Verbindung zur Benutzer-Datenbank fehlgeschlagen.' }, 
      { status: 500 }
    );
  }
}