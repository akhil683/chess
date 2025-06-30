"use server";

import { connectToDatabase } from "@/lib/db";
import { IPlayer } from "@/type";
import { revalidatePath } from "next/cache";

interface MatchResult {
  id: string;
  player1Id: string;
  player1Name: string;
  player1Rating: number;
  player2Id: string;
  player2Name: string;
  player2Rating: number;
  result: string;
  timeControl: string;
  date: string;
  moves: number;
  gameType: "rated" | "casual";
  addedBy: string;
  addedAt: string;
}

interface AddMatchData {
  player1Id: string;
  player2Id: string;
  result: string;
  timeControl: string;
  moves: string;
  gameType: "rated" | "casual";
  player1RatingChange: number;
  player2RatingChange: number;
}

interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function addMatchResult(
  matchData: AddMatchData,
): Promise<ActionResult> {
  try {
    const db = await connectToDatabase();

    const {
      player1Id,
      player2Id,
      result,
      timeControl,
      moves,
      gameType,
      player1RatingChange,
      player2RatingChange,
    } = matchData;

    // Validate input
    if (!player1Id || !player2Id || player1Id === player2Id) {
      return {
        success: false,
        message: "Please select two different players",
        error: "Invalid player selection",
      };
    }

    // Fetch both players
    const [player1, player2] = await Promise.all([
      db.collection("players").findOne({ rollNumber: player1Id }),
      db.collection("players").findOne({ rollNumber: player2Id }),
    ]);

    if (!player1 || !player2) {
      return {
        success: false,
        message: "One or both players not found",
        error: "Players not found in database",
      };
    }

    // Create match result
    const matchResult: MatchResult = {
      id: Date.now().toString(),
      player1Id: player1.id,
      player1Name: player1.name,
      player1Rating: player1.rating,
      player2Id: player2.id,
      player2Name: player2.name,
      player2Rating: player2.rating,
      result:
        result === "player1"
          ? player1.rollNumber
          : result === "player2"
            ? player2.rollNumber
            : "draw",
      timeControl,
      date: new Date().toISOString().split("T")[0],
      moves: Number.parseInt(moves) || 0,
      gameType,
      addedBy: "Admin",
      addedAt: new Date().toISOString(),
    };

    // Calculate new stats for player1
    const player1Updates = {
      $set: {
        rating:
          gameType === "rated"
            ? player1.rating + player1RatingChange
            : player1.rating,
        lastActive: new Date().toISOString().split("T")[0],
        "stats.currentStreak":
          result === "player1" ? player1.stats.currentStreak + 1 : 0,
        "stats.ratingPeak":
          player1.stats.ratingPeak < player1.rating + player1RatingChange
            ? player1.rating + player1RatingChange
            : player1.stats.ratingPeak,
        "stats.winRate":
          result === "player1"
            ? (player1.stats.wins + 1) / (player1.stats.totalGames + 1)
            : player1.stats.wins / player1.stats.totalGames,
      },
      $inc: {
        "stats.totalGames": 1,
        "stats.wins": result === "player1" ? 1 : 0,
        "stats.losses": result === "player2" ? 1 : 0,
        "stats.draws": result === "draw" ? 1 : 0,
      },
    };

    // Calculate new stats for player2
    const player2Updates = {
      $set: {
        rating:
          gameType === "rated"
            ? player2.rating + player2RatingChange
            : player2.rating,
        lastActive: new Date().toISOString().split("T")[0],
        "stats.currentStreak":
          result === "player2" ? player2.stats.currentStreak + 1 : 0,
        "stats.ratingPeak":
          player2.stats.ratingPeak < player2.rating + player2RatingChange
            ? player2.rating + player2RatingChange
            : player2.stats.ratingPeak,
        "stats.winRate":
          result === "player2"
            ? (player2.stats.wins + 1) / (player2.stats.totalGames + 1)
            : player2.stats.wins / player2.stats.totalGames,
      },
      $inc: {
        "stats.totalGames": 1,
        "stats.wins": result === "player2" ? 1 : 0,
        "stats.losses": result === "player1" ? 1 : 0,
        "stats.draws": result === "draw" ? 1 : 0,
      },
    };

    await Promise.all([
      db.collection("matches").insertOne(matchResult),
      db
        .collection("players")
        .updateOne({ rollNumber: player1Id }, player1Updates),
      db
        .collection("players")
        .updateOne({ rollNumber: player2Id }, player2Updates),
    ]);

    // Revalidate relevant pages/paths
    revalidatePath("/matches");
    revalidatePath("/players");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Match result added successfully! ${gameType === "rated" ? "Ratings updated." : ""}`,
    };
  } catch (error) {
    console.error("Error adding match result:", error);
    return {
      success: false,
      message: "Failed to add match result",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
