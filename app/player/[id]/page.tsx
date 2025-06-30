import { getLeaderboard } from "@/actions/getLeaderboard";
import { getRecentMatchesForPLayer } from "@/actions/getRecentMatchForPlayer";
import PlayerProfile from "@/components/player-profile.component";

interface PlayerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const leaderboard = await getLeaderboard();
  const player = leaderboard.filter((player) => player.id === id);
  const recentGames = await getRecentMatchesForPLayer(id); //TODO:Fix return type from server action to easily render recent games of a player
  console.log("recent games", recentGames);
  return <PlayerProfile player={player[0]} recentGames={recentGames} />;
}
