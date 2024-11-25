import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.get("/fetch-from-actix", async (c) => {
  const response = await fetch("http://localhost:8080/db-query");
  const data = await response.text();
  return c.text(data);
});

app.post("/insert-user", async (c) => {
  const { name, email } = await c.req.json();
  const response = await fetch("http://localhost:8080/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  const data = await response.text();
  return c.json(data);
});

export const GET = handle(app);
export const POST = handle(app);
