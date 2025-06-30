"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerOverview from "./profile/overview.component";
import GameHistory from "./profile/game-history.component";
import { IPlayer, MatchResult } from "@/type";

interface PlayerProfileProps {
  player: IPlayer;
  recentGames: MatchResult[];
}

export default function PlayerProfile({
  player,
  recentGames,
}: PlayerProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 2000)
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (rating >= 1800) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 1600) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen justify-center items-center flex bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Player Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{player.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                    <span>{player.department}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Roll: {player.rollNumber}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {player.bio}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  className={`text-lg px-3 py-1 ${getRatingBadgeColor(player.rating)}`}
                >
                  {player.rating}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="games">Game History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <PlayerOverview player={player} recentGames={recentGames} />

          {/* Game History Tab */}
          <GameHistory player={player} recentGames={recentGames} />
        </Tabs>
      </div>
    </div>
  );
}
