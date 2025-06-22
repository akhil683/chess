import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { TabsContent } from "../ui/tabs";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { IPlayer } from "@/type";
import { createPlayer } from "@/app/actions/createPlayer";

export default function AddPlayer() {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerDepartment, setNewPlayerDepartment] = useState("");
  const [newPlayerRollNumber, setNewPlayerRollNumber] = useState("");
  const [newPlayerBio, setNewPlayerBio] = useState("");

  const handleAddPlayer = () => {
    if (!newPlayerName || !newPlayerDepartment || !newPlayerRollNumber) {
      alert("Please fill in all required fields");
      // setAlert({
      //   type: "error",
      //   message: "Please fill in all required fields",
      // });
      // return;
    }

    // Check if roll number already exists
    // if (players.some((p) => p.rollNumber === newPlayerRollNumber)) {
    //   setAlert({
    //     type: "error",
    //     message: "A player with this roll number already exists",
    //   });
    //   return;
    // }

    const newPlayer: IPlayer = {
      id: Date.now().toString(),
      name: newPlayerName,
      rating: 1200,
      department: newPlayerDepartment,
      rollNumber: newPlayerRollNumber,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      avatar: "/placeholder.svg?height=40&width=40",
      bio: newPlayerBio || "",
      stats: {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        currentStreak: 0,
        ratingPeak: 1200,
      },
    };
    console.log(newPlayer);
    createPlayer(newPlayer);
    // Reset form
    setNewPlayerName("");
    setNewPlayerDepartment("");
    setNewPlayerRollNumber("");
    setNewPlayerBio("");

    // setAlert({
    //   type: "success",
    //   message: `Player ${newPlayerName} added successfully!`,
    // });
  };
  return (
    <TabsContent value="add-player">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Add New Player
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="playerName">Player Name *</Label>
              <Input
                id="playerName"
                placeholder="Enter player's full name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="playerDepartment">Department *</Label>
              <Select
                value={newPlayerDepartment}
                onValueChange={setNewPlayerDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Mathematics and Computing">
                    Mathematics and Computing
                  </SelectItem>
                  <SelectItem value="Engineering Physics">
                    Engineering Physics
                  </SelectItem>
                  <SelectItem value="Chemical Engineering">
                    Chemical Engineering
                  </SelectItem>
                  <SelectItem value="Electrical Engineering">
                    Electrical Engineering
                  </SelectItem>
                  <SelectItem value="Electronics and Communication">
                    Electronics and Communication
                  </SelectItem>
                  <SelectItem value="Mechanical Engineering">
                    Mechanical Engineering
                  </SelectItem>
                  <SelectItem value="Material Science Engineering">
                    Material Science Engineering
                  </SelectItem>
                  <SelectItem value="Civil Engineering">
                    Civil Engineering
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerRollNumber">Roll Number *</Label>
              <Input
                id="playerRollNumber"
                placeholder="e.g., CS21B1001"
                value={newPlayerRollNumber}
                onChange={(e) => setNewPlayerRollNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerBio">Bio (Optional)</Label>
            <Textarea
              id="playerBio"
              placeholder="Brief description about the player..."
              value={newPlayerBio}
              onChange={(e) => setNewPlayerBio(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Player Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Initial rating will be set to 1200 if not specified</li>
              <li>• Join date will be automatically set to today</li>
              <li>
                • Game statistics will start at 0 and update with match results
              </li>
              <li>• Roll number must be unique across all players</li>
            </ul>
          </div>

          <Button onClick={handleAddPlayer} className="w-full" size="lg">
            Add Player
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
