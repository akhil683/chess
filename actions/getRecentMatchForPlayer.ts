"use server";

import { connectToDatabase } from "@/lib/db";
import { MatchResult } from "@/type";

//TODO: Fix return type
export async function getRecentMatchesForPLayer(
  playerId: string,
  limit: number = 10,
): Promise<MatchResult[]> {
  try {
    const db = await connectToDatabase();

    const recentMatches = await db
      .collection("matches")
      .find({ $or: [{ player1Id: playerId }, { player2Id: playerId }] })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return recentMatches.map(
      (doc: any): MatchResult => ({
        id: doc.id,
        player1Id: doc.player1Id,
        player1Name: doc.player1Name,
        player1Rating: doc.player1Rating,
        player2Id: doc.player2Id,
        player2Name: doc.player2Name,
        player2Rating: doc.player2Rating,
        result: doc.result,
        timeControl: doc.timeControl,
        date: doc.date,
        moves: doc.moves,
        gameType: doc.gameType,
        addedBy: doc.addedBy,
        addedAt: doc.addedAt,
      }),
    );
  } catch (error) {
    console.error("Error getting recent matches for player", error);
    return [];
  }
}
