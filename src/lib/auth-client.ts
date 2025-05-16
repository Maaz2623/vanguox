import { createAuthClient } from "better-auth/react";
import dotenv from "dotenv";

// Only needed if you're running outside of Next.js runtime
dotenv.config({ path: ".env.local" });

const isDev = process.env.NODE_ENV === "development";

export const authClient = createAuthClient({
  baseURL: isDev ? "http://localhost:3000" : "https://vanguox.com",
});

export const { signIn, signUp, signOut, useSession } = authClient;
