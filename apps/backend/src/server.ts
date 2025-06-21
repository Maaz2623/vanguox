import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "./lib/auth";

const app = new Hono();

// ✅ Global CORS for all routes
app
  .use(
    "*",
    cors({
      origin: ["https://vanguox.com", "http://localhost:3000"],
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "OPTIONS"],
    })
  )
  .all("/api/auth/*", async (c) => {
    return await auth.handler(c.req.raw); // or auth.handler(req)
  });

serve({ fetch: app.fetch, port: 5000 });
