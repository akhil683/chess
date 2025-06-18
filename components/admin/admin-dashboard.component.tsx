"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Users,
  Trophy,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

interface MatchResult {
  id: string;
  player1Id: string;
  player1Name: string;
  player1Rating: number;
  player2Id: string;
  player2Name: string;
  player2Rating: number;
  result: "player1" | "player2" | "draw";
  timeControl: string;
  date: string;
  opening: string;
  moves: number;
  gameType: "rated" | "casual";
  notes?: string;
  addedBy: string;
  addedAt: string;
}

interface Player {
  id: string;
  name: string;
  rating: number;
  department: string;
  rollNumber: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  lastActive: string;
}

// Mock data - in real app this would come from a database
const initialPlayers: Player[] = [
  {
    id: "1",
    name: "Alex Chen",
    rating: 2156,
    department: "Computer Science",
    rollNumber: "CS21B1001",
    gamesPlayed: 45,
    wins: 32,
    losses: 8,
    draws: 5,
    lastActive: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    rating: 2089,
    department: "Mathematics",
    rollNumber: "MA20B1045",
    gamesPlayed: 38,
    wins: 28,
    losses: 7,
    draws: 3,
    lastActive: "2024-01-14",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    rating: 1987,
    department: "Physics",
    rollNumber: "PH22B1023",
    gamesPlayed: 52,
    wins: 35,
    losses: 12,
    draws: 5,
    lastActive: "2024-01-16",
  },
  {
    id: "4",
    name: "Emma Thompson",
    rating: 1923,
    department: "Engineering",
    rollNumber: "EN23B1067",
    gamesPlayed: 29,
    wins: 19,
    losses: 8,
    draws: 2,
    lastActive: "2024-01-13",
  },
];

interface AdminDashboardProps {
  onBack?: () => void;
  onPlayersUpdate?: (players: Player[]) => void;
}

export default function AdminDashboard({
  onBack,
  onPlayersUpdate,
}: AdminDashboardProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
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
  const [opening, setOpening] = useState("");
  const [moves, setMoves] = useState("");
  const [gameType, setGameType] = useState<"rated" | "casual">("rated");
  const [notes, setNotes] = useState("");

  // Calculate rating change using simplified ELO system
  const calculateRatingChange = (
    playerRating: number,
    opponentRating: number,
    result: number,
  ) => {
    const K = 32; // K-factor
    const expectedScore =
      1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    return Math.round(K * (result - expectedScore));
  };

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
    let player1RatingChange = 0;
    let player2RatingChange = 0;

    if (gameType === "rated") {
      if (result === "player1") {
        player1RatingChange = calculateRatingChange(
          player1.rating,
          player2.rating,
          1,
        );
        player2RatingChange = calculateRatingChange(
          player2.rating,
          player1.rating,
          0,
        );
      } else if (result === "player2") {
        player1RatingChange = calculateRatingChange(
          player1.rating,
          player2.rating,
          0,
        );
        player2RatingChange = calculateRatingChange(
          player2.rating,
          player1.rating,
          1,
        );
      } else {
        player1RatingChange = calculateRatingChange(
          player1.rating,
          player2.rating,
          0.5,
        );
        player2RatingChange = calculateRatingChange(
          player2.rating,
          player1.rating,
          0.5,
        );
      }
    }

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
      opening,
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
          gamesPlayed: player.gamesPlayed + 1,
          wins: result === "player1" ? player.wins + 1 : player.wins,
          losses: result === "player2" ? player.losses + 1 : player.losses,
          draws: result === "draw" ? player.draws + 1 : player.draws,
          lastActive: new Date().toISOString().split("T")[0],
        };
      }
      if (player.id === player2Id) {
        return {
          ...player,
          rating:
            gameType === "rated"
              ? player.rating + player2RatingChange
              : player.rating,
          gamesPlayed: player.gamesPlayed + 1,
          wins: result === "player2" ? player.wins + 1 : player.wins,
          losses: result === "player1" ? player.losses + 1 : player.losses,
          draws: result === "draw" ? player.draws + 1 : player.draws,
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
    setOpening("");
    setMoves("");
    setGameType("rated");
    setNotes("");
    setIsAddingMatch(false);

    setAlert({
      type: "success",
      message: `Match result added successfully! ${gameType === "rated" ? "Ratings updated." : ""}`,
    });
  };

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
  const topPlayer = players.reduce(
    (top, player) => (player.rating > top.rating ? player : top),
    players[0],
  );

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
                  <div className="space-y-2">
                    <Label>Player 1</Label>
                    <Select value={player1Id} onValueChange={setPlayer1Id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Player 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name} ({player.rating})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Player 2</Label>
                    <Select value={player2Id} onValueChange={setPlayer2Id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Player 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {players
                          .filter((p) => p.id !== player1Id)
                          .map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} ({player.rating})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                            : "Player 1 Won"}
                        </SelectItem>
                        <SelectItem value="player2">
                          {player2Id
                            ? players.find((p) => p.id === player2Id)?.name +
                              " Won"
                            : "Player 2 Won"}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opening">Opening</Label>
                    <Input
                      id="opening"
                      placeholder="e.g., Sicilian Defense"
                      value={opening}
                      onChange={(e) => setOpening(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="moves">Number of Moves</Label>
                    <Input
                      id="moves"
                      type="number"
                      placeholder="e.g., 42"
                      value={moves}
                      onChange={(e) => setMoves(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about the game..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleAddMatch} className="w-full" size="lg">
                  Add Match Result
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Matches Tab */}
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
                                match.gameType === "rated"
                                  ? "default"
                                  : "secondary"
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
                          <span>Opening: {match.opening}</span>
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

          {/* Players Tab */}
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
                            <p className="text-xs text-muted-foreground">
                              Rating
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">{player.gamesPlayed}</p>
                            <p className="text-xs text-muted-foreground">
                              Games
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">
                              {(
                                (player.wins / player.gamesPlayed) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Win Rate
                            </p>
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
        </Tabs>
      </div>
    </div>
  );
}
