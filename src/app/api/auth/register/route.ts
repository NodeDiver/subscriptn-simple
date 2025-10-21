import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth-prisma';
import { authRateLimiter } from '@/lib/rateLimit';
import { validateApiRequest, registerValidationSchema, sanitizeString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!authRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate input
    const validation = await validateApiRequest(request, registerValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;
    const sanitizedUsername = sanitizeString(username as string);
    // Don't sanitize password - it can contain special characters
    const rawPassword = password as string;

    // Create user using Prisma
    const user = await createUser(sanitizedUsername, rawPassword);

    if (!user) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 