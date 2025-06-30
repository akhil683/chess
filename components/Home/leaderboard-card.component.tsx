import { getRatingBadgeColor } from "@/lib/utils";
import { Crown, Medal, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { IPlayer } from "@/type";

export default function LeaderboardCard({
  player,
  index,
}: {
  player: IPlayer;
  index: number;
}) {
  const router = useRouter();
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Trophy className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
        #{index + 1}
      </span>
    );
  };
  const handlePlayerClick = (playerId: string) => {
    router.push(`/player/${playerId}`);
  };
  return (
    <Card key={player.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              {getRankIcon(index)}
            </div>
            <div>
              <button
                onClick={() => handlePlayerClick(player.id)}
                className="text-lg font-semibold hover:text-blue-600 transition-colors text-left"
              >
                {player.name}
              </button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{player.rollNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <Badge className={getRatingBadgeColor(player.rating)}>
                {player.rating.toFixed(1)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Rating</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold">{player.stats.totalGames}</p>
              <p className="text-xs text-muted-foreground">Games</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">
                {player.stats.winRate}%
              </p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </div>

            <div className="text-center">
              <p className="text-sm">
                <span className="text-green-600 font-medium">
                  {player.stats.wins}W
                </span>
                {" / "}
                <span className="text-red-600 font-medium">
                  {player.stats.losses}L
                </span>
                {" / "}
                <span className="text-gray-600 font-medium">
                  {player.stats.draws}D
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Record</p>
            </div>

            <div className="text-center">
              <p className="text-sm">
                {new Date(player.lastActive).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">Last Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
