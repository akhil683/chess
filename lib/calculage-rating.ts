type GameResult = "win" | "draw" | "loss";

interface PlayerResult {
  oldRating: number;
  newRating: number;
  change: number;
  kFactor: number;
  expectedScore: number;
}

interface RatingCalculationResult {
  player1: PlayerResult;
  player2: PlayerResult;
}

function calculateRatingChangeAdvanced(
  rating1: number,
  rating2: number,
  gameResult: GameResult,
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
    player1: {
      oldRating: rating1,
      newRating: Math.round(rating1 + ratingChange1),
      change: Math.round(ratingChange1 * 10) / 10,
      kFactor: kFactor1,
      expectedScore: Math.round(expectedScore1 * 100) / 100,
    },
    player2: {
      oldRating: rating2,
      newRating: Math.round(rating2 + ratingChange2),
      change: Math.round(ratingChange2 * 10) / 10,
      kFactor: kFactor2,
      expectedScore: Math.round(expectedScore2 * 100) / 100,
    },
  };
}

// Alternative version with optional parameters and more flexible K-factor
function calculateRatingChangeFlexible(
  rating1: number,
  rating2: number,
  gameResult: GameResult,
  options?: {
    customKFactor1?: number;
    customKFactor2?: number;
    includeProvisionalRatings?: boolean;
  },
): RatingCalculationResult {
  function getKFactor(rating: number, customK?: number): number {
    if (customK !== undefined) return customK;

    if (options?.includeProvisionalRatings) {
      // For new players (provisional ratings)
      if (rating < 2100) return 40;
    }

    if (rating >= 2400) return 10;
    return 20;
  }

  const kFactor1: number = getKFactor(rating1, options?.customKFactor1);
  const kFactor2: number = getKFactor(rating2, options?.customKFactor2);

  const expectedScore1: number =
    1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  const expectedScore2: number =
    1 / (1 + Math.pow(10, (rating1 - rating2) / 400));

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
  }

  const ratingChange1: number = kFactor1 * (actualScore1 - expectedScore1);
  const ratingChange2: number = kFactor2 * (actualScore2 - expectedScore2);

  return {
    player1: {
      oldRating: rating1,
      newRating: Math.round(rating1 + ratingChange1),
      change: Math.round(ratingChange1 * 10) / 10,
      kFactor: kFactor1,
      expectedScore: Math.round(expectedScore1 * 100) / 100,
    },
    player2: {
      oldRating: rating2,
      newRating: Math.round(rating2 + ratingChange2),
      change: Math.round(ratingChange2 * 10) / 10,
      kFactor: kFactor2,
      expectedScore: Math.round(expectedScore2 * 100) / 100,
    },
  };
}

// Example usage with type safety:
const result: RatingCalculationResult = calculateRatingChangeAdvanced(
  1500,
  1600,
  "win",
);
console.log(result);

// Example with flexible options:
const flexibleResult: RatingCalculationResult = calculateRatingChangeFlexible(
  1500,
  1600,
  "draw",
  {
    customKFactor1: 25,
    includeProvisionalRatings: true,
  },
);
console.log(flexibleResult);
