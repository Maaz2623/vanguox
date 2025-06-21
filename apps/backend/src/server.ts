import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "./lib/auth";

const app = new Hono();

// ✅ Global CORS middleware
app.use(
  "*",
  cors({
    origin: ["https://vanguox.com", "http://localhost:3000"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);

// ✅ PATCH: Ensure auth handler response includes CORS headers manually
app.all("/api/auth/*", async (c) => {
  const req = c.req.raw;
  const origin = c.req.header("Origin") ?? "";

  const res = await auth.handler(req);

  // Only patch CORS if the Origin is present
  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Vary", "Origin");
  }

  return res;
});

serve({ fetch: app.fetch, port: 5000 });
