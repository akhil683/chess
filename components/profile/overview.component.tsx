import { BarChart3, Target, Trophy, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { IPlayer } from "@/type";
import { formatDate, getResultIcon } from "@/lib/utils";

export default function PlayerOverview({ player }: { player: IPlayer }) {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{player.stats.wins}</p>
            <p className="text-sm text-muted-foreground">Wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{player.stats.winRate}%</p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{player.stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{player.stats.totalGames}</p>
            <p className="text-sm text-muted-foreground">Total Games</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {player.recentGames.slice(0, 5).map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        game.result === "win"
                          ? "bg-green-100 text-green-800"
                          : game.result === "loss"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getResultIcon(game.result)}
                    </div>
                    <div>
                      <p className="font-medium">{game.opponent}</p>
                      <p className="text-sm text-muted-foreground">
                        {game.opening} • {game.timeControl}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${game.ratingChange >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {game.ratingChange >= 0 ? "+" : ""}
                      {game.ratingChange}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(game.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Active</span>
              <span className="font-medium">
                {formatDate(player.lastActive)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak Rating</span>
              <span className="font-medium">{player.stats.ratingPeak}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longest Win Streak</span>
              <span className="font-medium">{player.stats.longestStreak}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
