import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { auth } from "./lib/auth";

const app = new Hono();

// ✅ Manually handle all OPTIONS requests
app.options("*", (c) => {
  const origin = c.req.header("Origin") ?? "";
  const res = new Response(null, { status: 204 });

  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Vary", "Origin");

  return res;
});

// ✅ Auth passthrough with CORS headers
app.all("/api/auth/*", async (c) => {
  const origin = c.req.header("Origin") ?? "";
  const req = c.req.raw;
  const res = await auth.handler(req);

  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Vary", "Origin");

  return res;
});

serve({ fetch: app.fetch, port: 5000 });
