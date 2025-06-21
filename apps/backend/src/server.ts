import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "./lib/auth";

const app = new Hono();

// ✅ Auth passthrough
app.on(
  ["POST", "GET"],
  "/api/auth/*",
  cors({
    origin: "https://vanguox.com", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
  (c) => {
    return auth.handler(c.req.raw);
  }
);

serve({ fetch: app.fetch, port: 5000 });
