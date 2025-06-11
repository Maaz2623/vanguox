import { createAuthClient } from "better-auth/react";
import { emailOTPClient, phoneNumberClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://vanguox.com"
      : "http://localhost:3000",
});

export const { signOut } = authClient;
