// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/signup"];
  
  // Protected routes that require authentication
  const protectedRoutes = ["/", "/products", "/profile"]; // Add all your protected routes here

  // If accessing root path, redirect to login if not authenticated
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If accessing any protected route without token, redirect to login
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If accessing public routes with token, redirect to home
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Match all routes except static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
