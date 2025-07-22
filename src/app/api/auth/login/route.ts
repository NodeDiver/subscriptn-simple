import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { authRateLimiter } from '@/lib/rateLimit';
import { validateApiRequest, authValidationSchema, sanitizeString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!authRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate input
    const validation = await validateApiRequest(request, authValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;
    const sanitizedUsername = sanitizeString(username as string);
    const sanitizedPassword = sanitizeString(password as string);

    const user = await authenticateUser(sanitizedUsername, sanitizedPassword);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create a simple session (in production, use proper session management)
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username
      }
    });

    // Set a simple session cookie (in production, use secure session tokens)
    response.cookies.set('user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 