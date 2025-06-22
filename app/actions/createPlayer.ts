"use server";
import { IPlayer } from "@/type";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

function generateId(): string {
  return new ObjectId().toString();
}

export async function createPlayer(player: IPlayer) {
  console.log(player);
  try {
    const db = await connectToDatabase();

    const playerId = generateId();
    const playerDocument = {
      ...player,
      id: player.id,
    };

    await db.collection("players").insertOne(playerDocument);

    revalidatePath("/leaderboard");
    revalidatePath("/players");

    return { success: true, playerId };
  } catch (error) {
    console.error("Error creating player:", error);
    return { success: false, error: "Failed to create player" };
  }
}
