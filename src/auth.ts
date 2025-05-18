import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  advanced: isProd
    ? {
        crossSubDomainCookies: {
          enabled: true,
          domain: ".vanguox.com",
        },
        defaultCookieAttributes: {
          secure: true,
          httpOnly: true,
          sameSite: "none",
          partitioned: true,
        },
        useSecureCookies: true,
      }
    : {
        defaultCookieAttributes: {
          secure: false,
          httpOnly: true,
          sameSite: "lax",
        },
        useSecureCookies: false,
      },

  trustedOrigins: isProd
    ? ["https://vanguox.com", "https://*.vanguox.com"]
    : ["http://localhost:3000"],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});
