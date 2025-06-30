import { TabsContent } from "../ui/tabs";
import { Calendar, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { MatchResult } from "@/type";

interface PropType {
  recentMatches: MatchResult[];
}

export default function RecentMatches({ recentMatches }: PropType) {
  const getResultText = (match: MatchResult) => {
    if (match.result === "player1") return `${match.player1Name} won`;
    if (match.result === "player2") return `${match.player2Name} won`;
    return "Draw";
  };

  const getResultColor = (match: MatchResult, playerId: string) => {
    if (match.result === "draw") return "text-yellow-600";
    if (
      (match.result === "player1" && playerId === match.player1Id) ||
      (match.result === "player2" && playerId === match.player2Id)
    ) {
      return "text-green-600";
    }
    return "text-red-600";
  };
  return (
    <TabsContent value="recent-matches">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Matches ({recentMatches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No matches recorded yet.</p>
              <p className="text-sm">
                Add your first match result to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          match.gameType === "rated" ? "default" : "secondary"
                        }
                      >
                        {match.gameType}
                      </Badge>
                      <span className="font-medium">
                        {getResultText(match)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {match.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span>{match.player1Name}</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {match.player1Rating}
                        </span>
                        <span
                          className={`ml-2 text-sm ${getResultColor(match, match.player1Id)}`}
                        >
                          {match.result === "player1"
                            ? "W"
                            : match.result === "draw"
                              ? "D"
                              : "L"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span>{match.player2Name}</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {match.player2Rating}
                        </span>
                        <span
                          className={`ml-2 text-sm ${getResultColor(match, match.player2Id)}`}
                        >
                          {match.result === "player2"
                            ? "W"
                            : match.result === "draw"
                              ? "D"
                              : "L"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Time: {match.timeControl}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Moves: {match.moves}</span>
                  </div>

                  {match.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      {match.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
