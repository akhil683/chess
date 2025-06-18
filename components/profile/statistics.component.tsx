import { IPlayer } from "@/type";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { TabsContent } from "../ui/tabs";

export default function PlayerStatistics({ player }: { player: IPlayer }) {
  return (
    <TabsContent value="statistics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Win Rate</span>
                <span className="font-medium">{player.stats.winRate}%</span>
              </div>
              <Progress value={player.stats.winRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>White Win Rate</span>
                <span className="font-medium">
                  {player.stats.whiteWinRate}%
                </span>
              </div>
              <Progress value={player.stats.whiteWinRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Black Win Rate</span>
                <span className="font-medium">
                  {player.stats.blackWinRate}%
                </span>
              </div>
              <Progress value={player.stats.blackWinRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Wins</span>
                </div>
                <span className="font-medium">{player.stats.wins}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Losses</span>
                </div>
                <span className="font-medium">{player.stats.losses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Draws</span>
                </div>
                <span className="font-medium">{player.stats.draws}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Rating</span>
              <span className="font-medium">{player.rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak Rating</span>
              <span className="font-medium text-green-600">
                {player.stats.ratingPeak}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lowest Rating</span>
              <span className="font-medium text-red-600">
                {player.stats.ratingLow}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating Gain</span>
              <span className="font-medium text-blue-600">
                +{player.rating - player.stats.ratingLow}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Game Length</span>
              <span className="font-medium">
                {player.stats.averageGameLength} moves
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Favorite Opening</span>
              <span className="font-medium">
                {player.stats.favoriteOpening}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-medium">
                {player.stats.currentStreak} wins
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Best Streak</span>
              <span className="font-medium">
                {player.stats.longestStreak} wins
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
