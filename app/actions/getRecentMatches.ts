"use server";

import { connectToDatabase } from "@/lib/db";
import { MatchResult } from "@/type";

export async function getPlayerMatches(
  playerId: string,
  limit: number = 10,
): Promise<{
  success: boolean;
  data?: MatchResult[];
  message: string;
}> {
  try {
    if (!playerId || typeof playerId !== "string") {
      return {
        success: false,
        message: "Valid player ID is required",
      };
    }

    const matchLimit = Math.max(1, Math.min(limit, 10));

    const db = await connectToDatabase();

    // Query matches where the player participated (either as player1 or player2)
    const matches = await db
      .collection("matches")
      .find({
        $or: [{ player1Id: playerId }, { player2Id: playerId }],
      })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(matchLimit)
      .toArray();

    // Convert MongoDB _id to string and format the response
    const formattedMatches = matches.map((match: any) => ({
      id: match._id,
      player1Id: match.player1Id,
      player1Name: match.player1Name,
      player1Rating: match.player1Rating,
      player2Id: match.player2Id,
      player2Name: match.player2Name,
      player2Rating: match.player2Rating,
      result: match.result,
      timeControl: match.timeControl,
    })) as MatchResult[];

    return {
      success: true,
      data: formattedMatches,
      message: `Found ${matches.length} matches for player`,
    };
  } catch (error) {
    console.error("Error fetching player matches:", error);
    return {
      success: false,
      message: "Failed to fetch player matches. Please try again.",
    };
  }
}
