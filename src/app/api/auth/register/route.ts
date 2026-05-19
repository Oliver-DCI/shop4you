import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role, street, zipCode, city } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 });
    }

    // Prüfen, ob der User bereits in Supabase existiert
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Diese E-Mail-Adresse wird bereits verwendet.' }, { status: 400 });
    }

    // Passwort mit bcrypt hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // User in der PostgreSQL-Datenbank anlegen
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'customer',
        street,
        zipCode,
        city,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json({ error: 'Serverfehler bei der Registrierung' }, { status: 500 });
  }
}