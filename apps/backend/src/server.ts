import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const app = new Hono();

// ✅ Auth passthrough
// app.on(
//   ["POST", "GET"],
//   "/api/auth/*",
//   cors({
//     origin: "https://vanguox.com", // replace with your origin
//     allowHeaders: ["Content-Type", "Authorization"],
//     allowMethods: ["POST", "GET", "OPTIONS"],
//     exposeHeaders: ["Content-Length"],
//     maxAge: 600,
//     credentials: true,
//   }),
//   (c) => {
//     return auth.handler(c.req.raw);
//   }
// );

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: false,
  })
);

app.get("/", (c) => {
  return c.json("Welcome Maaz");
});

serve({ fetch: app.fetch, port: 5000 });
