import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { client, db } from "./mongodb";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SESSION_REFRESH_SECONDS = 60 * 60 * 24; // extend once per day of use

// Only these two roles can be chosen at sign-up. Anything else, including
// "admin", falls back to "customer". Admins are created manually (seed script).
const normalizeSignUpRole = (value: unknown): "customer" | "technician" =>
  value === "technician" ? "technician" : "customer";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL as string],

  // Passing `client` enables transactions (needs a replica set, which Atlas is).
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  session: {
    expiresIn: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_REFRESH_SECONDS,
  },

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, role: normalizeSignUpRole((user as { role?: unknown }).role) },
        }),
      },
      update: {
        // The profile form can change name, phone, area, bio and image, but
        // never the role. Role changes go through the protected admin API only.
        before: async (data) => {
          const { role: _ignoredRole, ...safeData } = data as Record<string, unknown>;
          return { data: safeData };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: (user as { role?: string }).role,
        }),
      },
    }),
    nextCookies(), // must stay last in the plugins array
  ],
});
