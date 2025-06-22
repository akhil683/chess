"use server";

import { MongoClient, Db } from "mongodb";
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db("chess_tournament");
  cachedDb = db;
  return db;
}
