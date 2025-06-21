import { TabsContent } from "@radix-ui/react-tabs";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { IPlayer } from "@/type";

export default function Players({ players }: { players: IPlayer[] }) {
  return (
    <TabsContent value="players">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Player Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {players
              .sort((a, b) => b.rating - a.rating)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.department} • Roll: {player.rollNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="font-bold">{player.rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{player.stats.totalGames}</p>
                      <p className="text-xs text-muted-foreground">Games</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">
                        {player.stats.totalGames > 0
                          ? (
                              (player.stats.wins / player.stats.gamesPlayed) *
                              100
                            ).toFixed(1)
                          : "0.0"}
                        %
                      </p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm">{player.lastActive}</p>
                      <p className="text-xs text-muted-foreground">
                        Last Active
                      </p>
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
