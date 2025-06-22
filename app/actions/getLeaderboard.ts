import { connectToDatabase } from "@/lib/db";
import { IPlayer } from "@/type";

export async function getLeaderboard(limit: number = 10): Promise<IPlayer[]> {
  try {
    const db = await connectToDatabase();

    const playerDocs = await db
      .collection("players")
      .find({})
      .sort({ rating: -1 })
      .limit(limit)
      .toArray();

    return playerDocs.map((doc: any) => ({
      id: doc.playerId,
      name: doc.name,
      rating: doc.rating,
      department: doc.department,
      rollNumber: doc.rollNumber,
      joinDate: doc.joinDate,
      lastActive: doc.lastActive,
      avatar: doc.avatar,
      bio: doc.bio,
      stats: doc.stats,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
