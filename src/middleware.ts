import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/"];

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession(req);

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !session?.user) {
    const signInUrl = new URL("/auth/sign-in", req.url);

    return NextResponse.redirect(signInUrl);
  }

  const url = new URL(req.url);

  console.log(url.pathname);

  if (pathname.startsWith(`/stores/`)) {
    const slug = pathname.split(`/`)[2];

    return NextResponse.redirect(`https://${slug}.vanguox.com`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/stores/:slug*"],
};
