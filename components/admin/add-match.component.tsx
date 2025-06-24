import { Label } from "@radix-ui/react-dropdown-menu";
import { TabsContent } from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import PlayerSelector from "./player-selector.component";
import { IPlayer } from "@/type";

interface PropType {
  players: IPlayer[];
  player1Id: string;
  setPlayer1Id: (id: string) => void;
  player2Id: string;
  setPlayer2Id: (id: string) => void;
  result: string;
  setResult: (result: string) => void;
  handleAddMatch: () => void;
  timeControl: string;
  setTimeControl: (time: string) => void;
}

export default function AddMatch({
  players,
  player1Id,
  setPlayer1Id,
  player2Id,
  setPlayer2Id,
  result,
  setResult,
  handleAddMatch,
  timeControl,
  setTimeControl,
}: PropType) {
  return (
    <TabsContent value="add-match">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Match Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlayerSelector
              players={players}
              selectedPlayerId={player1Id}
              onPlayerSelect={setPlayer1Id}
              placeholder="Search player with white pieces"
              excludePlayerId={player2Id}
              label="White"
            />

            <PlayerSelector
              players={players}
              selectedPlayerId={player2Id}
              onPlayerSelect={setPlayer2Id}
              placeholder="Search player with black pieces"
              excludePlayerId={player1Id}
              label="Black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Result</Label>
              <Select
                value={result}
                onValueChange={(value: "player1" | "player2" | "draw") =>
                  setResult(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player1">
                    {player1Id
                      ? players.find((p) => p.rollNumber === player1Id)?.name +
                        " Won"
                      : "White Won"}
                  </SelectItem>
                  <SelectItem value="player2">
                    {player2Id
                      ? players.find((p) => p.rollNumber === player2Id)?.name +
                        " Won"
                      : "Black Won"}
                  </SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Control</Label>
              <Select value={timeControl} onValueChange={setTimeControl}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time control" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5+3">5+3 (Blitz)</SelectItem>
                  <SelectItem value="10+5">10+5 (Rapid)</SelectItem>
                  <SelectItem value="15+10">15+10 (Rapid)</SelectItem>
                  <SelectItem value="30+0">30+0 (Classical)</SelectItem>
                  <SelectItem value="60+0">60+0 (Classical)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAddMatch} className="w-full" size="lg">
            Add Match Result
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
