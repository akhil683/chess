"use client";

import { useState, useMemo } from "react";
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
import { ArrowUpDown, Search, Filter } from "lucide-react";
import { IPlayer } from "@/type";
import LeaderboardCard from "./leaderboard-card.component";

export default function ChessLeaderboard({
  leaderboard,
}: {
  leaderboard: IPlayer[];
}) {
  const [players] = useState<IPlayer[]>(leaderboard);
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
          return b.stats.totalGames - a.stats.totalGames;
        case "winRate":
          const aWinRate = a.stats.wins / a.stats.totalGames;
          const bWinRate = b.stats.wins / b.stats.totalGames;
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

  return (
    <div className="min-h-screen bg-background max-w-4xl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold md:mb-2">
                NITH Chess Leaderboard
              </h1>
              <p className="text-muted-foreground text-center max-md:text-sm">
                Ranked best chess players from NITH.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 max-md:text-sm">
              <Filter className="md:w-5 md:h-5 w-4 h-4" />
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
                    className="pl-10 max-md:text-sm"
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
                  className="max-md:text-sm"
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
                  className="max-md:text-sm"
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
            <LeaderboardCard key={index} player={player} index={index} />
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
