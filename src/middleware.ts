import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Define routes clearly
const protectedRoutes = ["/", "/stores"];
const authRoutes = ["/auth/sign-in"];


export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession(req);

  const pathname = req.nextUrl.pathname;

  // Check if pathname matches any protected route
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if pathname matches any auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users trying to access protected routes
  if (isProtected && !session?.user) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users trying to access auth-only routes
  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Match both exact and dynamic routes
export const config = {
  matcher: "/:path*",
};
