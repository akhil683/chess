"use server";
import { IPlayer } from "@/type";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";

export async function createPlayer(formData: FormData) {
  try {
    const db = await connectToDatabase();

    const playerData: Omit<IPlayer, "id" | "stats" | "recentGames"> = {
      name: formData.get("name") as string,
      rating: parseInt(formData.get("rating") as string) || 1200,
      department: formData.get("department") as string,
      rollNumber: formData.get("rollNumber") as string,
      joinDate:
        (formData.get("joinDate") as string) ||
        new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
      avatar: (formData.get("avatar") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
    };

    const playerId = generateId();
    const playerDocument = {
      playerId,
      ...playerData,
      stats: {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        currentStreak: 0,
        ratingPeak: playerData.rating,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
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
