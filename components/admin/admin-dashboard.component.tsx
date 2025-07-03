"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, TrendingUp, BarChart3, ArrowLeft } from "lucide-react";
import { IPlayer } from "@/type";
import AddMatch from "./add-match.component";
import { MatchResult } from "@/type";
import RecentMatches from "./recent-matches.component";
import Players from "./player.component";
import { calculateRatingChange } from "@/lib/calculage-rating";
import AddPlayer from "./add-player.component";
import { addMatchResult } from "@/actions/addMatchResult";

export default function AdminDashboard({
  allPlayers,
  initialMatches = [],
}: {
  allPlayers: IPlayer[];
  initialMatches?: MatchResult[];
}) {
  const router = useRouter();
  const [players, setPlayers] = useState<IPlayer[]>(allPlayers);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [result, setResult] = useState("player1");
  const [timeControl, setTimeControl] = useState("");
  const [moves, setMoves] = useState("");
  const [gameType, setGameType] = useState<"rated" | "casual">("rated");

  // Loading state for server action
  const [isPending, startTransition] = useTransition();

  const handleAddMatch = () => {
    // Clear any existing alerts
    setAlert(null);

    // Basic validation
    if (!player1Id || !player2Id || player1Id === player2Id) {
      setAlert({
        type: "error",
        message: "Please select two different players",
      });
      return;
    }

    // Find players for rating calculation
    const player1 = players.find((p) => p.rollNumber === player1Id);
    const player2 = players.find((p) => p.rollNumber === player2Id);

    if (!player1 || !player2) {
      setAlert({
        type: "error",
        message: "Selected players not found",
      });
      return;
    }

    // Calculate rating changes for rated games
    let gameResult = "win";
    if (result === "player1") {
      gameResult = "win";
    } else if (result === "player2") {
      gameResult = "loss";
    } else {
      gameResult = "draw";
    }

    const ratingChanges = calculateRatingChange(
      player1.rating,
      player2.rating,
      gameResult,
    );

    const matchData = {
      player1Id,
      player2Id,
      result,
      timeControl,
      moves,
      gameType,
      player1RatingChange: ratingChanges.player1rating,
      player2RatingChange: ratingChanges.player2rating,
    };

    // Use server action with loading state
    startTransition(async () => {
      try {
        const response = await addMatchResult(matchData);

        if (response.success) {
          setAlert({
            type: "success",
            message: response.message,
          });

          resetForm();
        } else {
          setAlert({
            type: "error",
            message: response.message || "Failed to add match result",
          });
        }
      } catch (error) {
        console.error("Error adding match:", error);
        setAlert({
          type: "error",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  const resetForm = () => {
    setPlayer1Id("");
    setPlayer2Id("");
    setResult("player1");
    setTimeControl("");
    setMoves("");
    setGameType("rated");
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleTournamentsClick = () => {
    router.push("/tournaments");
  };

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Calculate stats
  const totalGames = initialMatches.length;
  const ratedGames = initialMatches.filter(
    (m) => m.gameType === "rated",
  ).length;
  const averageRating =
    players.length > 0
      ? Math.round(
          players.reduce((sum, p) => sum + p.rating, 0) / players.length,
        )
      : 0;

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

        {/* Alert Display */}
        {alert && (
          <div className="mb-6">
            <div
              className={`p-4 rounded-md ${
                alert.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {alert.message}
            </div>
          </div>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="add-match">Add Match</TabsTrigger>
            <TabsTrigger value="add-player">Add Player</TabsTrigger>
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

          {/* Add New Player Tab */}
          <AddPlayer />

          {/* Recent Matches Tab */}
          <RecentMatches recentMatches={initialMatches} />

          {/* Players Tab */}
          <Players players={players} />
        </Tabs>
      </div>
    </div>
  );
}
