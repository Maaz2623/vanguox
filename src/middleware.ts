import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/"];

function getSubdomain(host: string) {
  const domain = "vanguox.com";
  if (!host.endsWith(domain)) return null;

  const subdomain = host.replace(`.${domain}`, "");
  return subdomain === domain ? null : subdomain;
}

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession(req);

  const hostname = req.headers.get("host") || "";
  const subdomain = getSubdomain(hostname);

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Optional: You could block access to unknown subdomains
  if (subdomain && !session?.user && isProtected) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // You can even rewrite or add headers with subdomain data:
  // req.headers.set("x-subdomain", subdomain ?? "");

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
