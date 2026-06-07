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

    const formattedEmail = email.toLowerCase().trim();

    // Falls das Passwort geändert werden soll (Schritt 2)
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: 'Die Passwörter stimmen nicht überein.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email: formattedEmail },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true, message: 'Passwort erfolgreich aktualisiert.' });
    }

    // Nur prüfen, ob die E-Mail existiert (Schritt 1)
    const user = await prisma.user.findUnique({
      where: { email: formattedEmail },
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