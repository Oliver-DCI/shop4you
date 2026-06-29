import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 🎯 Zentrale Instanz nutzen
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role, street, zipCode, city } = body;

    // 1. Validierung
    if (!email || !password || !firstName || !lastName || !street || !zipCode || !city) {
      return NextResponse.json(
        { error: 'Bitte fülle alle Pflichtfelder (inklusive vollständiger Adresse) aus.' }, 
        { status: 400 }
      );
    }

    const formattedEmail = email.toLowerCase().trim();

    // 2. Eindeutigkeit prüfen
    const existingUser = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse wird bereits im System verwendet.' }, 
        { status: 400 }
      );
    }

    // 3. Passwort-Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🎯 4. Validierung der erlaubten Rollen (Sicherheit)
    // Wenn die mitgegebene Rolle gültig ist, verwenden wir sie, andernfalls Fallback auf 'USER'
    const allowedRoles = ['USER', 'SELLER', 'ADMIN'];
    const finalRole = allowedRoles.includes(role) ? role : 'USER';

    // 5. User-Erstellung
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: formattedEmail,
        password: hashedPassword,
        role: finalRole, // 🎯 FIX: Speichert nun korrekt 'SELLER' oder 'USER' ab!
        street,
        zipCode,
        city,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ 
      success: true, 
      message: 'Konto erfolgreich im shop4you-System registriert.',
      user: userWithoutPassword 
    }, { status: 201 });

  } catch (error: any) {
    console.error('🔒 Register API Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler bei der Registrierung.', details: error.message }, 
      { status: 500 }
    );
  }
}