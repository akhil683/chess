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
