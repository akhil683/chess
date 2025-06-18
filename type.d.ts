export interface IGame {
  id: string;
  opponent: string;
  opponentRating: number;
  result: "win" | "loss" | "draw";
  playerColor: "white" | "black";
  timeControl: string;
  date: string;
  ratingChange: number;
  moves: number;
  gameType: "rated" | "casual";
  opening: string;
}

export interface IPlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  averageOpponentRating: number;
  ratingPeak: number;
  ratingLow: number;
  favoriteOpening: string;
  averageGameLength: number;
  whiteWinRate: number;
  blackWinRate: number;
}

export interface IPlayer {
  id: string;
  name: string;
  rating: number;
  department: string;
  rollNumber: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
  bio?: string;
  stats: PlayerStats;
  recentGames: Game[];
  ratingHistory: { date: string; rating: number }[];
}
