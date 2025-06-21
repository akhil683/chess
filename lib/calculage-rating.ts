// type GameResult = "win" | "draw" | "loss";

interface RatingCalculationResult {
  player1rating: number;
  player2rating: number;
}

export function calculateRatingChange(
  rating1: number,
  rating2: number,
  gameResult: string,
): RatingCalculationResult {
  // Determine K-factors based on FIDE rules
  function getKFactor(rating: number): number {
    if (rating >= 2400) return 10;
    if (rating < 2400) return 20;
    // For new players, K=40, but we can't determine that from rating alone
    return 20; // Default for most players
  }

  const kFactor1: number = getKFactor(rating1);
  const kFactor2: number = getKFactor(rating2);

  // Calculate expected scores
  const expectedScore1: number =
    1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  const expectedScore2: number =
    1 / (1 + Math.pow(10, (rating1 - rating2) / 400));

  // Determine actual scores
  let actualScore1: number;
  let actualScore2: number;

  switch (gameResult) {
    case "win":
      actualScore1 = 1;
      actualScore2 = 0;
      break;
    case "draw":
      actualScore1 = 0.5;
      actualScore2 = 0.5;
      break;
    case "loss":
      actualScore1 = 0;
      actualScore2 = 1;
      break;
    default:
      // TypeScript will catch this at compile time due to exhaustive checking
      throw new Error('Invalid game result. Use "win", "draw", or "loss"');
  }

  // Calculate rating changes
  const ratingChange1: number = kFactor1 * (actualScore1 - expectedScore1);
  const ratingChange2: number = kFactor2 * (actualScore2 - expectedScore2);

  return {
    player1rating: ratingChange1,
    player2rating: ratingChange2,
  };
}

// const result: RatingCalculationResult = calculateRatingChange(
//   1500,
//   1600,
//   "win",
// );
