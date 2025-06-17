"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  rating: number;
  department: string;
  year: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Alex Chen",
    rating: 2156,
    department: "Computer Science",
    year: 3,
    gamesPlayed: 45,
    wins: 32,
    losses: 8,
    draws: 5,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    rating: 2089,
    department: "Mathematics",
    year: 4,
    gamesPlayed: 38,
    wins: 28,
    losses: 7,
    draws: 3,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    rating: 1987,
    department: "Physics",
    year: 2,
    gamesPlayed: 52,
    wins: 35,
    losses: 12,
    draws: 5,
  },
  {
    id: "4",
    name: "Emma Thompson",
    rating: 1923,
    department: "Engineering",
    year: 1,
    gamesPlayed: 29,
    wins: 19,
    losses: 8,
    draws: 2,
  },
  {
    id: "5",
    name: "David Kim",
    rating: 1876,
    department: "Computer Science",
    year: 3,
    gamesPlayed: 41,
    wins: 24,
    losses: 13,
    draws: 4,
  },
  {
    id: "6",
    name: "Lisa Wang",
    rating: 1834,
    department: "Mathematics",
    year: 2,
    gamesPlayed: 33,
    wins: 21,
    losses: 9,
    draws: 3,
  },
  {
    id: "7",
    name: "James Wilson",
    rating: 1789,
    department: "Physics",
    year: 4,
    gamesPlayed: 47,
    wins: 26,
    losses: 16,
    draws: 5,
  },
  {
    id: "8",
    name: "Maria Garcia",
    rating: 1756,
    department: "Engineering",
    year: 1,
    gamesPlayed: 25,
    wins: 15,
    losses: 8,
    draws: 2,
  },
];

export default function HomeLeaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  const departments = Array.from(new Set(mockPlayers.map((p) => p.department)));
  const years = Array.from(new Set(mockPlayers.map((p) => p.year))).sort();

  const filteredAndSortedPlayers = useMemo(() => {
    const filtered = mockPlayers.filter((player) => {
      const matchesSearch = player.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || player.department === departmentFilter;
      const matchesYear =
        yearFilter === "all" || player.year.toString() === yearFilter;
      const matchesMinRating =
        !minRating || player.rating >= Number.parseInt(minRating);
      const matchesMaxRating =
        !maxRating || player.rating <= Number.parseInt(maxRating);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesYear &&
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
  }, [searchTerm, sortBy, departmentFilter, yearFilter, minRating, maxRating]);

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

  return (
    <div className="min-h-screen bg-background max-w-5xl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-center font-bold mb-2">
            NIT Hamirpur Chess Leaderboard
          </h1>
          <p className="text-muted-foreground text-center">
            Ranked best chess players from our institute
          </p>
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
                <Label>Year of Study</Label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Year {year}
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
            Showing {filteredAndSortedPlayers.length} of {mockPlayers.length}{" "}
            players
          </p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {filteredAndSortedPlayers.map((player, index) => (
            <Card key={player.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-1">
                <div className="flex flex-wrap space-y-6 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{player.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{player.department}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Year {player.year}</span>
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
