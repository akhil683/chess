"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  Crown,
  Medal,
  Trophy,
  Search,
  Filter,
  Settings,
} from "lucide-react";

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

const mockPlayers: Player[] = [
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
  {
    id: "5",
    name: "David Kim",
    rating: 1876,
    department: "Computer Science",
    rollNumber: "CS21B1089",
    gamesPlayed: 41,
    wins: 24,
    losses: 13,
    draws: 4,
    lastActive: "2024-01-12",
  },
  {
    id: "6",
    name: "Lisa Wang",
    rating: 1834,
    department: "Mathematics",
    rollNumber: "MA22B1034",
    gamesPlayed: 33,
    wins: 21,
    losses: 9,
    draws: 3,
    lastActive: "2024-01-15",
  },
  {
    id: "7",
    name: "James Wilson",
    rating: 1789,
    department: "Physics",
    rollNumber: "PH20B1056",
    gamesPlayed: 47,
    wins: 26,
    losses: 16,
    draws: 5,
    lastActive: "2024-01-11",
  },
  {
    id: "8",
    name: "Maria Garcia",
    rating: 1756,
    department: "Engineering",
    rollNumber: "EN23B1012",
    gamesPlayed: 25,
    wins: 15,
    losses: 8,
    draws: 2,
    lastActive: "2024-01-14",
  },
];

export default function ChessLeaderboard() {
  const router = useRouter();
  const [players] = useState<Player[]>(mockPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [rollNumberFilter, setRollNumberFilter] = useState("all");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  const departments = Array.from(new Set(players.map((p) => p.department)));
  const rollNumbers = Array.from(
    new Set(players.map((p) => p.rollNumber)),
  ).sort();

  const filteredAndSortedPlayers = useMemo(() => {
    const filtered = players.filter((player) => {
      const matchesSearch = player.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || player.department === departmentFilter;
      const matchesRollNumber =
        rollNumberFilter === "all" || player.rollNumber === rollNumberFilter;
      const matchesMinRating =
        !minRating || player.rating >= Number.parseInt(minRating);
      const matchesMaxRating =
        !maxRating || player.rating <= Number.parseInt(maxRating);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRollNumber &&
        matchesMinRating &&
        matchesMaxRating
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "gamesPlayed":
          return b.gamesPlayed - a.gamesPlayed;
        case "winRate":
          const aWinRate = a.wins / a.gamesPlayed;
          const bWinRate = b.wins / b.gamesPlayed;
          return bWinRate - aWinRate;
        default:
          return b.rating - a.rating;
      }
    });
  }, [
    players,
    searchTerm,
    sortBy,
    departmentFilter,
    rollNumberFilter,
    minRating,
    maxRating,
  ]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Trophy className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
        #{index + 1}
      </span>
    );
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 2000)
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (rating >= 1800) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 1600) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getWinRate = (player: Player) => {
    return ((player.wins / player.gamesPlayed) * 100).toFixed(1);
  };

  const handlePlayerClick = (playerId: string) => {
    router.push(`/player/${playerId}`);
  };

  const handleAdminClick = () => {
    router.push("/admin");
  };

  const handleTournamentsClick = () => {
    router.push("/tournaments");
  };

  return (
    <div className="min-h-screen bg-background max-w-4xl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                University Chess Leaderboard
              </h1>
              <p className="text-muted-foreground">
                Ranked chess players from our university community
              </p>
            </div>
            {/* <div className="flex items-center space-x-2"> */}
            {/*   <Button onClick={handleTournamentsClick} variant="outline"> */}
            {/*     <Trophy className="w-4 h-4 mr-2" /> */}
            {/*     Tournaments */}
            {/*   </Button> */}
            {/*   <Button onClick={handleAdminClick} variant="outline"> */}
            {/*     <Settings className="w-4 h-4 mr-2" /> */}
            {/*     Admin Dashboard */}
            {/*   </Button> */}
            {/* </div> */}
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Players</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Select
                  value={rollNumberFilter}
                  onValueChange={setRollNumberFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Roll Numbers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roll Numbers</SelectItem>
                    {rollNumbers.map((rollNumber) => (
                      <SelectItem
                        key={rollNumber}
                        value={rollNumber.toString()}
                      >
                        {rollNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {sortBy === "rating" && "Rating"}
                      {sortBy === "name" && "Name"}
                      {sortBy === "gamesPlayed" && "Games Played"}
                      {sortBy === "winRate" && "Win Rate"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      <DropdownMenuRadioItem value="rating">
                        Rating (High to Low)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name">
                        Name (A to Z)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="gamesPlayed">
                        Games Played
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="winRate">
                        Win Rate
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minRating">Minimum Rating</Label>
                <Input
                  id="minRating"
                  type="number"
                  placeholder="e.g., 1500"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxRating">Maximum Rating</Label>
                <Input
                  id="maxRating"
                  type="number"
                  placeholder="e.g., 2200"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedPlayers.length} of {players.length}{" "}
            players
          </p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {filteredAndSortedPlayers.map((player, index) => (
            <Card key={player.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <button
                        onClick={() => handlePlayerClick(player.id)}
                        className="text-lg font-semibold hover:text-blue-600 transition-colors text-left"
                      >
                        {player.name}
                      </button>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{player.department}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Roll: {player.rollNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <Badge className={getRatingBadgeColor(player.rating)}>
                        {player.rating}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rating
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {player.gamesPlayed}
                      </p>
                      <p className="text-xs text-muted-foreground">Games</p>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">
                        {getWinRate(player)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm">
                        <span className="text-green-600 font-medium">
                          {player.wins}W
                        </span>
                        {" / "}
                        <span className="text-red-600 font-medium">
                          {player.losses}L
                        </span>
                        {" / "}
                        <span className="text-gray-600 font-medium">
                          {player.draws}D
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">Record</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm">
                        {new Date(player.lastActive).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last Active
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedPlayers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No players found matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
