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

// ✅ Manually respond to OPTIONS (preflight) requests
app.options("*", (c) => {
  return c.text("OK");
});

// ✅ Auth passthrough
app.all("/api/auth/*", async (c) => {
  return await auth.handler(c.req.raw); // Or `auth.handler(...)`
});

serve({ fetch: app.fetch, port: 5000 });
