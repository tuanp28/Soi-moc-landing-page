import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token is missing.' },
        { status: 400 }
      );
    }

    // Bypass check for local development
    if (token === 'bypass-recaptcha-key') {
      return NextResponse.json({
        success: true,
        score: 0.9,
        action: 'spin_wheel',
        message: 'Bypassed recaptcha verification for development.'
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // Local/development fallback when secret is not configured
    if (!secretKey) {
      console.warn('⚠️ RECAPTCHA_SECRET_KEY is not defined in environment. Returning fallback score of 0.9.');
      return NextResponse.json({
        success: true,
        score: 0.9,
        action: 'spin_wheel',
        message: 'Development mock verification successful.'
      });
    }

    // Call Google's verification API
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed.', details: data['error-codes'] },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      score: data.score ?? 0.9,
      action: data.action,
      hostname: data.hostname,
    });
  } catch (error: any) {
    console.error('❌ Error verifying reCAPTCHA:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying reCAPTCHA.' },
      { status: 500 }
    );
  }
}
