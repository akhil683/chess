"use server";

import clientPromise from "@/lib/db";

export async function createUser(formData: FormData) {
  const client = await clientPromise;
  const db = client.db("myApp");
  const users = db.collection("users");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const result = await users.insertOne({ name, email });
  return result.insertedId.toString();
}
