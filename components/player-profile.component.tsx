"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import PlayerOverview from "./profile/overview.component";
import GameHistory from "./profile/game-history.component";
import PlayerStatistics from "./profile/statistics.component";
import { IPlayer } from "@/type";

const mockPlayers: IPlayer[] = [
  {
    id: "1",
    name: "Alex Chen",
    rating: 2156,
    department: "Computer Science",
    rollNumber: "CS21B1001",
    joinDate: "2023-09-15",
    lastActive: "2024-01-15",
    bio: "Passionate chess player and computer science student. Love tactical puzzles and endgame studies.",
    stats: {
      totalGames: 45,
      wins: 32,
      losses: 8,
      draws: 5,
      winRate: 71.1,
      currentStreak: 5,
      longestStreak: 8,
      averageOpponentRating: 1987,
      ratingPeak: 2189,
      ratingLow: 1834,
      favoriteOpening: "Sicilian Defense",
      averageGameLength: 42,
      whiteWinRate: 75.0,
      blackWinRate: 67.4,
    },
    recentGames: [
      {
        id: "g1",
        opponent: "Sarah Johnson",
        opponentRating: 2089,
        result: "win",
        playerColor: "white",
        timeControl: "10+5",
        date: "2024-01-15",
        ratingChange: +12,
        moves: 38,
        gameType: "rated",
      },
      {
        id: "g2",
        opponent: "Michael Rodriguez",
        opponentRating: 1987,
        result: "win",
        playerColor: "black",
        timeControl: "15+10",
        date: "2024-01-14",
        ratingChange: +8,
        moves: 45,
        gameType: "rated",
      },
      {
        id: "g3",
        opponent: "Emma Thompson",
        opponentRating: 1923,
        result: "draw",
        playerColor: "white",
        timeControl: "10+5",
        date: "2024-01-13",
        ratingChange: -2,
        moves: 67,
        gameType: "rated",
      },
      {
        id: "g4",
        opponent: "David Kim",
        opponentRating: 1876,
        result: "win",
        playerColor: "black",
        timeControl: "5+3",
        date: "2024-01-12",
        ratingChange: +6,
        moves: 29,
        gameType: "rated",
      },
      {
        id: "g5",
        opponent: "Lisa Wang",
        opponentRating: 1834,
        result: "win",
        playerColor: "white",
        timeControl: "15+10",
        date: "2024-01-11",
        ratingChange: +5,
        moves: 52,
        gameType: "rated",
      },
    ],
  },
  // Add other mock players here if needed
];

interface PlayerProfileProps {
  playerId?: string;
  onBack?: () => void;
  players?: IPlayer[];
}

export default function PlayerProfile({
  playerId = "1",
  onBack,
  players = mockPlayers,
}: PlayerProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const player = players.find((p) => p.id === playerId) || mockPlayers[0]; // In real app, fetch by playerId

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 2000)
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (rating >= 1800) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 1600) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen justify-center items-center flex bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leaderboard
          </Button>
        </div>

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
                <p className="text-sm text-muted-foreground mt-2">
                  Current Rating
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="games">Game History</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <PlayerOverview player={player} />

          {/* Game History Tab */}
          <GameHistory player={player} />

          {/* Statistics Tab */}
          <PlayerStatistics player={player} />
          {/* Progress Tab */}
        </Tabs>
      </div>
    </div>
  );
}
