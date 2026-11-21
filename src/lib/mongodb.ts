import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.");
}

// Vercel freezes a function between requests. A database connection that stays open while the
// function is frozen is dead when it wakes up, and the next request then fails (for example with
// "Topology is closed"). So idle connections are closed after 5 seconds, and attachDatabasePool
// keeps the function alive just long enough for that to happen before it is frozen.
const IDLE_CONNECTION_MS = 5000;

function createClient(): MongoClient {
  const mongoClient = new MongoClient(uri as string, { maxIdleTimeMS: IDLE_CONNECTION_MS });
  attachDatabasePool(mongoClient);
  return mongoClient;
}

// In development, hot reloads would open a new connection on every change.
// Keeping the client on globalThis reuses a single connection instead.
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const client = globalForMongo.mongoClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

// The database name comes from the connection string.
export const db = client.db();
