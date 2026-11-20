import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.");
}

// In development, hot reloads would open a new connection on every change.
// Keeping the client on globalThis reuses a single connection instead.
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const client = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

// The database name comes from the connection string.
export const db = client.db();
