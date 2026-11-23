import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.");
}

const IDLE_CONNECTION_MS = 30_000;

function createClient(): MongoClient {
  const mongoClient = new MongoClient(uri as string, { maxIdleTimeMS: IDLE_CONNECTION_MS });
  attachDatabasePool(mongoClient);
  return mongoClient;
}

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const client = globalForMongo.mongoClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

export const db = client.db();
