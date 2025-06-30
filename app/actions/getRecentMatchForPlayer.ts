"use server";

import { connectToDatabase } from "@/lib/db";

export async function getRecentMatchesForPLayer(
  playerId: string,
  limit: number = 10,
) {
  try {
    const db = await connectToDatabase();

    const recentMatches = await db
      .collection("matches")
      .find({ $or: [{ player1Id: playerId }, { player2Id: playerId }] })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    console.log("recent", recentMatches);
    return {
      success: true,
      data: recentMatches,
    };
  } catch (error) {
    console.error("Error getting recent matches for player", error);
    return {
      success: false,
      error: "Failed getting recent matches for player",
    };
  }
}
