import { hc } from "hono/client";
import type { AppType } from "../../../backend/src/server";

const client = hc<AppType>("http://localhost:5000/", {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Required for sending cookies cross-origin
    });
  }) satisfies typeof fetch,
});
