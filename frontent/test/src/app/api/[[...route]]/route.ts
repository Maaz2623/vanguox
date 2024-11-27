import { Hono } from "hono";
import { cors } from "hono/cors";
import { StatusCode } from "hono/utils/http-status";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.get("/posts", async (c) => {
  const response = await fetch("http://localhost:8080/posts");
  const data = await response.text();
  return c.json(data);
});

app.post("/insert-user", async (c) => {
  const { name, email } = await c.req.json();
  const response = await fetch("http://localhost:8080/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  // Get the response status code

  // Get the response body, which is typically JSON
  const data = await response.json();

  // Return the same status code and body from the Actix backend to the Hono frontend
  return c.json(data, response.status as StatusCode);
});

export const GET = handle(app);
export const POST = handle(app);
