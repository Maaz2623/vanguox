import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/", "/stores"];
const authRoutes = ["/auth/sign-in"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Forward the cookie header manually
  const res = await fetch("https://server.vanguox.com/session", {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") || "", // 🔥 forward user's cookie
    },
  });

  const isAuthenticated = res.ok;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
