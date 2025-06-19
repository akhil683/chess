import { formatDate, getResultIcon } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { IGame, IPlayer } from "@/type";

export default function GameHistory({ player }: { player: IPlayer }) {
  return (
    <TabsContent value="games">
      <Card>
        <CardHeader>
          <CardTitle>Complete Game History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {player?.recentGames?.map((game: IGame) => (
              <div
                key={game.id}
                className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
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
                      <p className="font-semibold">{game.opponent}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Rating: {game.opponentRating}</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="capitalize">{game.playerColor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Time Control
                        </p>
                        <p className="font-medium">{game.timeControl}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Moves</p>
                        <p className="font-medium">{game.moves}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Rating Change
                        </p>
                        <p
                          className={`font-medium ${game.ratingChange >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {game.ratingChange >= 0 ? "+" : ""}
                          {game.ratingChange}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(game.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
