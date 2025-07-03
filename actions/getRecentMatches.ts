"use server";

import { connectToDatabase } from "@/lib/db";
import { MatchResult } from "@/type";
export async function getRecentMatches(limit: number = 10): Promise<{
  success: boolean;
  data?: MatchResult[];
  message: string;
}> {
  try {
    const matchLimit = Math.max(1, Math.min(limit, 10));

    const db = await connectToDatabase();

    const matches = await db
      .collection("matches")
      .find({})
      .sort({ createdAt: -1 })
      .limit(matchLimit)
      .toArray();

    const formattedMatches = matches.map((match: any) => ({
      id: match.id,
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
