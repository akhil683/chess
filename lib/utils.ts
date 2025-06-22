import { IPlayer } from "@/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getResultColor = (result: string) => {
  switch (result) {
    case "win":
      return "text-green-600";
    case "loss":
      return "text-red-600";
    case "draw":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

export const getResultIcon = (result: string) => {
  switch (result) {
    case "win":
      return "W";
    case "loss":
      return "L";
    case "draw":
      return "D";
    default:
      return "?";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getRatingBadgeColor = (rating: number) => {
  if (rating >= 2000) return "bg-purple-100 text-purple-800 border-purple-200";
  if (rating >= 1800) return "bg-blue-100 text-blue-800 border-blue-200";
  if (rating >= 1600) return "bg-green-100 text-green-800 border-green-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

export const getWinRate = (player: IPlayer) => {
  return ((player.stats.wins / player.stats.totalGames) * 100).toFixed(1);
};
