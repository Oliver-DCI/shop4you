import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Bitte E-Mail und Passwort angeben.' }, { status: 400 });
    }

    // User aus der Postgres-Datenbank laden
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten.' }, { status: 401 });
    }

    // Passwort-Hash vergleichen
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten.' }, { status: 401 });
    }

    // Erfolgreiche Antwort mit den User-Daten (wichtig für die Weiterleitung)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Serverfehler beim Login' }, { status: 500 });
  }
}