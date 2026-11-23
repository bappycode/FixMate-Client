import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { client, db } from "./mongodb";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const SESSION_REFRESH_SECONDS = 60 * 60 * 24;

const normalizeSignUpRole = (value: unknown): "customer" | "technician" =>
  value === "technician" ? "technician" : "customer";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL as string],

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
        before: async (data) => {
          const safeData: Record<string, unknown> = { ...data };
          delete safeData.role;
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
    nextCookies(),
  ],
});
