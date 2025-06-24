export interface IGame {
  id: string;
  opponent: string;
  opponentRating: number;
  result: "win" | "loss" | "draw";
  playerColor: "white" | "black";
  timeControl: string;
  date: string;
  ratingChange: number;
}

export interface IPlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  ratingPeak: number;
}

interface MatchResult {
  id: string;
  player1Id: string;
  player1Name: string;
  player1Rating: number;
  player2Id: string;
  player2Name: string;
  player2Rating: number;
  result: string;
  timeControl: string;
  date: string;
  moves: number;
  gameType: "rated" | "casual";
  notes?: string;
  addedBy: string;
  addedAt: string;
}

interface MatchResultAdvance {
  id: string;
  player1: {
    id: string;
    name: string;
    rating: number;
    ratingAfter: number;
    ratingChange: number;
    color: "white" | "black";
  };
  player2: {
    id: string;
    name: string;
    rating: number;
    ratingAfter: number;
    ratingChange: number;
    color: "white" | "black";
  };
  result: "player1" | "player2" | "draw";
  timeControl: string;
  date: string;
  moves: number;
  gameType: "rated" | "casual";
  notes?: string;
  addedBy: string;
  addedAt: string;
}
export interface IPlayer {
  id: string;
  name: string;
  rating: number;
  department: string;
  rollNumber: string;
  joinDate?: string;
  lastActive: string;
  avatar?: string;
  bio?: string;
  stats: PlayerStats;
  recentGames?: Game[];
}
