import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_KEY);

// Check if token is valid
async function isValid(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload?.exp) return false;

    const tokenExpiration = new Date(payload.exp * 1000);
    return tokenExpiration > new Date();
  } catch (error) {
    return false; 
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const publicPages = ['/login', '/register']; 
  const hiddenToConnected = ['/login', '/register'];

  const token = req.cookies.get('authToken')?.value;

  if (!token && !publicPages.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    const valid = await isValid(token);

    if (!valid) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (hiddenToConnected.includes(path)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/',
  ],
};
