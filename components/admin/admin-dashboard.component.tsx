"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Users,
  Trophy,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import PlayerSelector from "./player-selector.component";
import { IPlayer } from "@/type";
import AddMatch from "./add-match.component";
import { MatchResult } from "@/type";
import RecentMatches from "./recent-matches.component";
import Players from "./player.component";
import { calculateRatingChange } from "@/lib/calculage-rating";

const initialPlayers: IPlayer[] = [
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
      ratingPeak: 2189,
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
      },
    ],
  },
];

interface AdminDashboardProps {
  onBack?: () => void;
  onPlayersUpdate?: (players: IPlayer[]) => void;
}

export default function AdminDashboard({
  onBack,
  onPlayersUpdate,
}: AdminDashboardProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<IPlayer[]>(initialPlayers);
  const [recentMatches, setRecentMatches] = useState<MatchResult[]>([]);
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [result, setResult] = useState<"player1" | "player2" | "draw">(
    "player1",
  );
  const [timeControl, setTimeControl] = useState("");
  const [moves, setMoves] = useState("");
  const [gameType, setGameType] = useState<"rated" | "casual">("rated");
  const [notes, setNotes] = useState("");

  const handleAddMatch = () => {
    if (!player1Id || !player2Id || player1Id === player2Id) {
      setAlert({
        type: "error",
        message: "Please select two different players",
      });
      return;
    }

    const player1 = players.find((p) => p.id === player1Id)!;
    const player2 = players.find((p) => p.id === player2Id)!;

    // Calculate rating changes for rated games
    let gameResult = "win";
    if (result === "player1") {
      gameResult = "win";
    } else if (result === "player2") {
      gameResult = "loss";
    } else {
      gameResult = "draw";
    }

    let player1RatingChange = calculateRatingChange(
      player1.rating,
      player2.rating,
      gameResult,
    ).player1rating;
    let player2RatingChange = calculateRatingChange(
      player1.rating,
      player2.rating,
      gameResult,
    ).player2rating;

    // Create match result
    const matchResult: MatchResult = {
      id: Date.now().toString(),
      player1Id,
      player1Name: player1.name,
      player1Rating: player1.rating,
      player2Id,
      player2Name: player2.name,
      player2Rating: player2.rating,
      result,
      timeControl,
      date: new Date().toISOString().split("T")[0],
      moves: Number.parseInt(moves) || 0,
      gameType,
      notes,
      addedBy: "Admin",
      addedAt: new Date().toISOString(),
    };

    // Update players
    const updatedPlayers = players.map((player) => {
      if (player.id === player1Id) {
        return {
          ...player,
          rating:
            gameType === "rated"
              ? player.rating + player1RatingChange
              : player.rating,
          gamesPlayed: player.stats.totalGames + 1,
          wins:
            result === "player1" ? player.stats.wins + 1 : player.stats.wins,
          losses:
            result === "player2"
              ? player.stats.losses + 1
              : player.stats.losses,
          draws:
            result === "draw" ? player.stats.draws + 1 : player.stats.draws,
          lastActive: new Date().toISOString().split("T")[0],
        };
      }
      if (player.id === player2Id) {
        return {
          ...player,
          rating: player.rating + player2RatingChange,
          gamesPlayed: player.stats.totalGames + 1,
          wins:
            result === "player2" ? player.stats.wins + 1 : player.stats.wins,
          losses:
            result === "player1"
              ? player.stats.losses + 1
              : player.stats.losses,
          draws:
            result === "draw" ? player.stats.draws + 1 : player.stats.draws,
          lastActive: new Date().toISOString().split("T")[0],
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    setRecentMatches([matchResult, ...recentMatches]);
    onPlayersUpdate?.(updatedPlayers);

    // Reset form
    setPlayer1Id("");
    setPlayer2Id("");
    setResult("player1");
    setTimeControl("");
    setMoves("");
    setGameType("rated");
    setNotes("");
    setIsAddingMatch(false);

    setAlert({
      type: "success",
      message: `Match result added successfully! ${gameType === "rated" ? "Ratings updated." : ""}`,
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  const handleTournamentsClick = () => {
    router.push("/tournaments");
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const totalGames = recentMatches.length;
  const ratedGames = recentMatches.filter((m) => m.gameType === "rated").length;
  const averageRating = Math.round(
    players.reduce((sum, p) => sum + p.rating, 0) / players.length,
  );
  // const topPlayer = players.reduce(
  //   (top, player) => (player.rating > top.rating ? player : top),
  //   players[0],
  // );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage chess matches and player statistics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleTournamentsClick} variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                Tournaments
              </Button>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leaderboard
              </Button>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            className={`mb-6 ${alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                alert.type === "success" ? "text-green-800" : "text-red-800"
              }
            >
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{players.length}</p>
              <p className="text-sm text-muted-foreground">Active Players</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{totalGames}</p>
              <p className="text-sm text-muted-foreground">Matches Recorded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{averageRating}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{ratedGames}</p>
              <p className="text-sm text-muted-foreground">Rated Games</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="add-match" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-match">Add Match</TabsTrigger>
            <TabsTrigger value="recent-matches">Recent Matches</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>

          {/* Add Match Tab */}
          <AddMatch
            player2Id={player2Id}
            players={players}
            player1Id={player1Id}
            setPlayer2Id={setPlayer2Id}
            setPlayer1Id={setPlayer1Id}
            result={result}
            setResult={setResult}
            handleAddMatch={handleAddMatch}
            timeControl={timeControl}
            setTimeControl={setTimeControl}
          />
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
                            ? players.find((p) => p.id === player1Id)?.name +
                              " Won"
                            : "White Won"}
                        </SelectItem>
                        <SelectItem value="player2">
                          {player2Id
                            ? players.find((p) => p.id === player2Id)?.name +
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

                  <div className="space-y-2">
                    <Label>Game Type</Label>
                    <Select
                      value={gameType}
                      onValueChange={(value: "rated" | "casual") =>
                        setGameType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rated">Rated</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
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

          {/* Recent Matches Tab */}
          <RecentMatches recentMatches={recentMatches} />

          {/* Players Tab */}
          <Players players={players} />
        </Tabs>
      </div>
    </div>
  );
}
