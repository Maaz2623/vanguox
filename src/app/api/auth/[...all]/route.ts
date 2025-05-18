import { auth } from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { GET: rawGET, POST: rawPOST } = toNextJsHandler(auth);

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

export const GET = async (req: Request) => {
  if (process.env.NODE_ENV !== "production") {
    return rawGET(req);
  }

  const res = await rawGET(req);
  const origin = req.headers.get("origin") || "";

  if (isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
};

export const POST = async (req: Request) => {
  if (process.env.NODE_ENV !== "production") {
    return rawPOST(req);
  }

  const res = await rawPOST(req);
  const origin = req.headers.get("origin") || "";

  if (isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
};

export const OPTIONS = async (req: Request) => {
  if (process.env.NODE_ENV !== "production") {
    return new Response(null, { status: 204 });
  }

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
};
