import PlayerProfile from "@/components/player-profile.component";

interface PlayerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  console.log(id);
  return <PlayerProfile playerId={id} />;
}
