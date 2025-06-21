import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// ✅ Apply CORS middleware globally first
app.use(
  "*",
  cors({
    origin: ["https://vanguox.com", "http:localhost:3000"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ✅ Basic health check
app.get("/", (c) => {
  return c.json("Server is live and healthy!");
});

// ✅ Auth middleware (after CORS)
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// ✅ Auth handler — now CORS headers will be present
app.all("/api/auth/*", (c) => {
  return auth.handler(c.req.raw); // should be a Fetch API Request
});

// ✅ Session route
app.get("/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

// ✅ Start server
serve({
  fetch: app.fetch,
  port: 5000,
});

export type AppType = typeof app;
