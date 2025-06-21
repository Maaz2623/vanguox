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

const routes = app
  .use(
    "/api/auth/*", // or replace with "*" to enable cors for all routes
    cors({
      origin: "http://localhost:3000", // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .all("/api/auth/*", (c) => {
    return auth.handler(c.req.raw); // assuming auth.handler expects Fetch API Request
  })
  .get("/session", (c) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!user) return c.body(null, 401);

    return c.json({
      session,
      user,
    });
  });

serve({
  fetch: app.fetch,
  port: 5000,
});

export type AppType = typeof routes;
