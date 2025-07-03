import { TabsContent } from "../ui/tabs";
import { Calendar, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { MatchResult } from "@/type";

interface PropType {
  recentMatches: MatchResult[];
}

export default function RecentMatches({ recentMatches }: PropType) {
  console.log(recentMatches);
  const getResultText = (match: MatchResult) => {
    if (match.result === match.player1Id) return `${match.player1Name} won`;
    if (match.result === match.player2Id) return `${match.player2Name} won`;
    return "Draw";
  };

  const getResultColor = (match: MatchResult, playerId: string) => {
    if (match.result === "draw") return "bg-yellow-800";
    if (match.result === playerId) {
      return "bg-green-700";
    }
    return "bg-red-700";
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
                <div
                  key={match.id}
                  className="p-4 border rounded-lg text-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4 text-black">
                      <span className="font-medium text-black">
                        {getResultText(match)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div
                      className={`flex items-center justify-between p-2 rounded ${getResultColor(match, match.player1Id)}`}
                    >
                      <span>{match.player1Name}</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {match.player1Rating.toFixed(1)}
                        </span>
                        <span className={`ml-2 text-sm font-semibold`}>
                          {match.result === match.player1Id
                            ? "W"
                            : match.result === "draw"
                              ? "D"
                              : "L"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between p-2 rounded ${getResultColor(match, match.player2Id)}`}
                    >
                      <span>{match.player2Name}</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {match.player2Rating.toFixed(1)}
                        </span>
                        <span className={`ml-2 text-sm font-semibold`}>
                          {match.result === match.player2Id
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
