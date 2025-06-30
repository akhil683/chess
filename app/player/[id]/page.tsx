import { getRecentMatchesForPLayer } from "@/app/actions/getRecentMatchForPlayer";
import PlayerProfile from "@/components/player-profile.component";

interface PlayerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  // const { player } = await getPlayer(id); //TODO:create the server action
  const { data } = await getRecentMatchesForPLayer(id);
  return <PlayerProfile player={player} recentGames={data} />; //TODO:fix type
}
