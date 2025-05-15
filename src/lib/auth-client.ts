import { createAuthClient } from "better-auth/react";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = createAuthClient();
