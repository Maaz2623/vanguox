// File: /app/api/auth/route.ts  (or pages/api/auth/[...betterauth].ts in pages folder)

import { auth } from "@/auth"; // adjust your path here
import { toNextJsHandler } from "better-auth/next-js";

const { GET: rawGET, POST: rawPOST } = toNextJsHandler(auth);

// Utility function to check allowed origins (adjust your domains here)
function isAllowedOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return (
      url.hostname === "vanguox.com" || url.hostname.endsWith(".vanguox.com")
    );
  } catch {
    return false;
  }
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";

  if (!isAllowedOrigin(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function GET(req: Request) {
  const res = await rawGET(req);
  const origin = req.headers.get("origin") || "";

  if (isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
}

export async function POST(req: Request) {
  const res = await rawPOST(req);
  const origin = req.headers.get("origin") || "";

  if (isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
}
